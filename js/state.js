/**
 * State Management & Sinkronisasi Logika Toko Emas (AURA Gold IMS)
 */

const STORAGE_KEYS = {
  PRODUCTS: "aura_gold_products_v1",
  INBOUND: "aura_gold_inbound_v1",
  OUTBOUND: "aura_gold_outbound_v1",
  STOCK_CARDS: "aura_gold_stock_cards_v1",
  STOCK_OPNAME: "aura_gold_stock_opname_v1",
  CHECKLISTS: "aura_gold_checklists_v1",
  SELECTED_DATE: "aura_gold_selected_date_v1"
};

class StoreManager {
  constructor() {
    this.products = this.load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.inbound = this.load(STORAGE_KEYS.INBOUND, INITIAL_INBOUND);
    this.outbound = this.load(STORAGE_KEYS.OUTBOUND, INITIAL_OUTBOUND);
    this.stockCards = this.load(STORAGE_KEYS.STOCK_CARDS, INITIAL_STOCK_CARDS);
    this.stockOpname = this.load(STORAGE_KEYS.STOCK_OPNAME, INITIAL_STOCK_OPNAME);
    this.checklists = this.load(STORAGE_KEYS.CHECKLISTS, INITIAL_CHECKLISTS);
    this.selectedDate = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || "2026-09-20";

    // Auto-migrate: Pastikan setiap produk memiliki foto perhiasan & barcode
    this.ensureProductImagesAndBarcodes();
  }

  ensureProductImagesAndBarcodes() {
    let updated = false;
    this.products.forEach(p => {
      if (!p.image) {
        p.image = this.getDefaultImageForCategory(p.category);
        updated = true;
      }
      if (!p.barcode) {
        p.barcode = p.code;
        updated = true;
      }
    });
    if (updated) {
      this.save(STORAGE_KEYS.PRODUCTS, this.products);
    }
  }

  getDefaultImageForCategory(category) {
    switch (category) {
      case "Cincin": return "assets/images/diamond_ring.jpg";
      case "Kalung": return "assets/images/gold_necklace.jpg";
      case "Gelang": return "assets/images/gold_bracelet.jpg";
      case "Anting": return "assets/images/diamond_earrings.jpg";
      case "Logam Mulia": return "assets/images/gold_bar.jpg";
      case "Liontin": return "assets/images/gold_necklace.jpg";
      default: return "assets/images/diamond_ring.jpg";
    }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
    } catch (e) {
      console.error("Error loading localStorage key:", key, e);
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving localStorage key:", key, e);
    }
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.INBOUND);
    localStorage.removeItem(STORAGE_KEYS.OUTBOUND);
    localStorage.removeItem(STORAGE_KEYS.STOCK_CARDS);
    localStorage.removeItem(STORAGE_KEYS.STOCK_OPNAME);
    localStorage.removeItem(STORAGE_KEYS.CHECKLISTS);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_DATE);

    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.inbound = JSON.parse(JSON.stringify(INITIAL_INBOUND));
    this.outbound = JSON.parse(JSON.stringify(INITIAL_OUTBOUND));
    this.stockCards = JSON.parse(JSON.stringify(INITIAL_STOCK_CARDS));
    this.stockOpname = JSON.parse(JSON.stringify(INITIAL_STOCK_OPNAME));
    this.checklists = JSON.parse(JSON.stringify(INITIAL_CHECKLISTS));
    this.selectedDate = "2026-09-20";

    this.saveAll();
  }

  saveAll() {
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.save(STORAGE_KEYS.INBOUND, this.inbound);
    this.save(STORAGE_KEYS.OUTBOUND, this.outbound);
    this.save(STORAGE_KEYS.STOCK_CARDS, this.stockCards);
    this.save(STORAGE_KEYS.STOCK_OPNAME, this.stockOpname);
    this.save(STORAGE_KEYS.CHECKLISTS, this.checklists);
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, this.selectedDate);
  }

  setSelectedDate(dateStr) {
    this.selectedDate = dateStr;
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, dateStr);
  }

  // --- MASTER BARANG CRUD ---
  getProductByCode(code) {
    return this.products.find(p => p.code.toLowerCase() === code.toLowerCase());
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const existing = this.getProductByCode(productData.code);
    if (existing) {
      throw new Error(`Kode barang '${productData.code}' sudah terdaftar.`);
    }

    const newProd = {
      id: "PROD-" + Date.now().toString().slice(-6),
      code: productData.code.trim().toUpperCase(),
      barcode: (productData.barcode || productData.code).trim().toUpperCase(),
      name: productData.name.trim(),
      category: productData.category,
      stoneWeight: parseFloat(productData.stoneWeight) || 0,
      goldWeight: parseFloat(productData.goldWeight) || 0,
      qty: parseInt(productData.qty, 10) || 0,
      status: productData.status || (productData.qty > 3 ? "Tersedia" : (productData.qty > 0 ? "Menipis" : "Habis")),
      image: productData.image || this.getDefaultImageForCategory(productData.category)
    };

    this.products.unshift(newProd);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);

    // Otomatis buat baris saldo awal di kartu stok jika ada qty awal
    if (newProd.qty > 0) {
      this.recordStockCard({
        date: new Date().toISOString().split("T")[0],
        productCode: newProd.code,
        productName: newProd.name,
        txType: "Saldo Awal",
        inQty: newProd.qty,
        outQty: 0,
        balance: newProd.qty,
        notes: "Input Master Barang Baru"
      });
    }

    return newProd;
  }

  updateProduct(id, updateData) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Barang tidak ditemukan.");

    // Cek duplikasi kode bila diubah
    if (updateData.code && updateData.code.toLowerCase() !== this.products[idx].code.toLowerCase()) {
      if (this.getProductByCode(updateData.code)) {
        throw new Error(`Kode barang '${updateData.code}' sudah digunakan.`);
      }
    }

    const updated = {
      ...this.products[idx],
      ...updateData,
      barcode: (updateData.barcode || updateData.code || this.products[idx].barcode || this.products[idx].code).trim().toUpperCase(),
      stoneWeight: parseFloat(updateData.stoneWeight) || 0,
      goldWeight: parseFloat(updateData.goldWeight) || 0,
      qty: parseInt(updateData.qty, 10) >= 0 ? parseInt(updateData.qty, 10) : this.products[idx].qty,
      image: updateData.image || this.products[idx].image || this.getDefaultImageForCategory(updateData.category || this.products[idx].category)
    };

    if (updated.qty === 0) updated.status = "Habis";
    else if (updated.qty <= 3 && updated.status !== "Konsinyasi") updated.status = "Menipis";

    this.products[idx] = updated;
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    return updated;
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
  }

  // --- KARTU STOK LOGIC ---
  recordStockCard(entry) {
    const newEntry = {
      id: "SC-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100),
      date: entry.date,
      productCode: entry.productCode,
      productName: entry.productName,
      txType: entry.txType,
      inQty: parseInt(entry.inQty, 10) || 0,
      outQty: parseInt(entry.outQty, 10) || 0,
      balance: parseInt(entry.balance, 10) || 0,
      notes: entry.notes || "-"
    };
    this.stockCards.unshift(newEntry);
    this.save(STORAGE_KEYS.STOCK_CARDS, this.stockCards);
    return newEntry;
  }

  getStockCardHistory(productCode = null) {
    if (!productCode) return this.stockCards;
    return this.stockCards.filter(sc => sc.productCode.toLowerCase() === productCode.toLowerCase());
  }

  // --- BARANG MASUK TRANSAKSI ---
  addInbound(data) {
    const prod = this.getProductByCode(data.productCode);
    const qty = parseInt(data.qty, 10);
    if (!qty || qty <= 0) throw new Error("Jumlah barang masuk harus lebih dari 0.");

    let newBalance = qty;
    let prodName = data.productName;

    if (prod) {
      prod.qty += qty;
      prodName = prod.name;
      if (prod.qty > 3 && prod.status === "Menipis") prod.status = "Tersedia";
      if (prod.qty > 0 && prod.status === "Habis") prod.status = "Tersedia";
      newBalance = prod.qty;
      this.save(STORAGE_KEYS.PRODUCTS, this.products);
    }

    const newInbound = {
      id: "INB-" + Date.now().toString().slice(-6),
      date: data.date,
      docNo: data.docNo.trim(),
      productCode: data.productCode.trim().toUpperCase(),
      productName: prodName,
      supplier: data.supplier.trim(),
      qty: qty,
      totalWeight: parseFloat(data.totalWeight) || 0,
      receiver: data.receiver.trim(),
      condition: data.condition || "Sangat Baik",
      notes: data.notes || "-"
    };

    this.inbound.unshift(newInbound);
    this.save(STORAGE_KEYS.INBOUND, this.inbound);

    // Sinkronisasi otomatis ke Kartu Stok
    this.recordStockCard({
      date: data.date,
      productCode: newInbound.productCode,
      productName: newInbound.productName,
      txType: "Barang Masuk",
      inQty: qty,
      outQty: 0,
      balance: newBalance,
      notes: `Penerimaan Dokumen #${newInbound.docNo} dari ${newInbound.supplier}`
    });

    return newInbound;
  }

  // --- BARANG KELUAR TRANSAKSI ---
  addOutbound(data) {
    const prod = this.getProductByCode(data.productCode);
    const qty = parseInt(data.qty, 10);
    if (!qty || qty <= 0) throw new Error("Jumlah barang keluar harus lebih dari 0.");

    if (prod) {
      if (prod.qty < qty) {
        throw new Error(`Stok tidak mencukupi! Stok saat ini untuk [${prod.code}] adalah ${prod.qty} pcs, Anda meminta ${qty} pcs.`);
      }
      prod.qty -= qty;
      if (prod.qty === 0) prod.status = "Habis";
      else if (prod.qty <= 3 && prod.status !== "Konsinyasi") prod.status = "Menipis";
      this.save(STORAGE_KEYS.PRODUCTS, this.products);
    }

    const newBalance = prod ? prod.qty : 0;
    const prodName = prod ? prod.name : data.productName;

    const newOutbound = {
      id: "OUT-" + Date.now().toString().slice(-6),
      date: data.date,
      invoiceNo: data.invoiceNo.trim(),
      productCode: data.productCode.trim().toUpperCase(),
      productName: prodName,
      qty: qty,
      totalWeight: parseFloat(data.totalWeight) || 0,
      sellPrice: parseFloat(data.sellPrice) || 0,
      handedBy: data.handedBy.trim(),
      receivedBy: data.receivedBy.trim(),
      notes: data.notes || "-"
    };

    this.outbound.unshift(newOutbound);
    this.save(STORAGE_KEYS.OUTBOUND, this.outbound);

    // Sinkronisasi otomatis ke Kartu Stok
    this.recordStockCard({
      date: data.date,
      productCode: newOutbound.productCode,
      productName: newOutbound.productName,
      txType: "Barang Keluar",
      inQty: 0,
      outQty: qty,
      balance: newBalance,
      notes: `Penjualan Faktur #${newOutbound.invoiceNo} (${newOutbound.receivedBy})`
    });

    return newOutbound;
  }

  // --- STOCK OPNAME LOGIC ---
  addStockOpname(data) {
    const prod = this.getProductByCode(data.productCode);
    const sysStock = prod ? prod.qty : parseInt(data.systemStock, 10) || 0;
    const physStock = parseInt(data.physicalStock, 10);
    const diff = physStock - sysStock;
    const status = diff === 0 ? "Sesuai" : "Tidak Sesuai";

    const newOpname = {
      id: "OPN-" + Date.now().toString().slice(-6),
      date: data.date,
      productCode: data.productCode.trim().toUpperCase(),
      productName: prod ? prod.name : data.productName,
      systemStock: sysStock,
      physicalStock: physStock,
      difference: diff,
      notes: data.notes || "-",
      status: status
    };

    this.stockOpname.unshift(newOpname);
    this.save(STORAGE_KEYS.STOCK_OPNAME, this.stockOpname);
    return newOpname;
  }

  reconcileStockOpname(opnameId) {
    const op = this.stockOpname.find(o => o.id === opnameId);
    if (!op) throw new Error("Data opname tidak ditemukan.");
    if (op.difference === 0) throw new Error("Stok fisik sudah sesuai dengan sistem.");

    const prod = this.getProductByCode(op.productCode);
    if (!prod) throw new Error("Barang tidak ditemukan dalam master data.");

    // Update master stock ke stok fisik
    const prevQty = prod.qty;
    prod.qty = op.physicalStock;
    if (prod.qty === 0) prod.status = "Habis";
    else if (prod.qty <= 3) prod.status = "Menipis";
    else prod.status = "Tersedia";

    this.save(STORAGE_KEYS.PRODUCTS, this.products);

    // Catat di kartu stok
    const isIncrease = op.difference > 0;
    this.recordStockCard({
      date: new Date().toISOString().split("T")[0],
      productCode: prod.code,
      productName: prod.name,
      txType: "Penyesuaian Opname",
      inQty: isIncrease ? Math.abs(op.difference) : 0,
      outQty: !isIncrease ? Math.abs(op.difference) : 0,
      balance: prod.qty,
      notes: `Koreksi Audit Opname #${op.id} (Fisik: ${op.physicalStock} pcs, Sebelumnya: ${prevQty} pcs)`
    });

    // Tandai opname sebagai telah direkonsiliasi
    op.status = "Sesuai (Telah Direkonsiliasi)";
    op.difference = 0;
    op.systemStock = op.physicalStock;
    op.notes += " [Sudah diselaraskan dengan sistem]";
    this.save(STORAGE_KEYS.STOCK_OPNAME, this.stockOpname);

    return op;
  }

  // --- CHECKLIST OPERASIONAL HARIAN ---
  addChecklist(data) {
    const checks = [
      data.checkInitialStock,
      data.checkInbound,
      data.checkOutbound,
      data.checkPhysicalSystem,
      data.tidyStorage,
      data.dailyReport
    ];
    const completedCount = checks.filter(Boolean).length;
    const isComplete = completedCount === 6;

    const newChecklist = {
      id: "CHK-" + Date.now().toString().slice(-6),
      date: data.date,
      employeeName: data.employeeName.trim(),
      checkInitialStock: Boolean(data.checkInitialStock),
      checkInbound: Boolean(data.checkInbound),
      checkOutbound: Boolean(data.checkOutbound),
      checkPhysicalSystem: Boolean(data.checkPhysicalSystem),
      tidyStorage: Boolean(data.tidyStorage),
      dailyReport: Boolean(data.dailyReport),
      notes: data.notes || "-",
      status: isComplete ? "Lengkap" : "Belum Lengkap"
    };

    this.checklists.unshift(newChecklist);
    this.save(STORAGE_KEYS.CHECKLISTS, this.checklists);
    return newChecklist;
  }

  toggleChecklistTask(id, taskKey) {
    const item = this.checklists.find(c => c.id === id);
    if (!item) return;

    item[taskKey] = !item[taskKey];
    const checks = [
      item.checkInitialStock,
      item.checkInbound,
      item.checkOutbound,
      item.checkPhysicalSystem,
      item.tidyStorage,
      item.dailyReport
    ];
    item.status = checks.filter(Boolean).length === 6 ? "Lengkap" : "Belum Lengkap";
    this.save(STORAGE_KEYS.CHECKLISTS, this.checklists);
    return item;
  }

  // --- STATISTIK & METRIK DASHBOARD ---
  getDashboardMetrics(filterDate = null) {
    const totalSKU = this.products.length;
    const totalStockPcs = this.products.reduce((acc, p) => acc + (p.qty || 0), 0);
    const totalGoldWeight = this.products.reduce((acc, p) => acc + ((p.goldWeight || 0) * (p.qty || 0)), 0);
    const totalStoneCarat = this.products.reduce((acc, p) => acc + ((p.stoneWeight || 0) * (p.qty || 0)), 0);

    // Transaksi berdasarkan tanggal filter (atau seluruhnya jika filterDate null)
    const inbounds = filterDate ? this.inbound.filter(i => i.date === filterDate) : this.inbound;
    const outbounds = filterDate ? this.outbound.filter(o => o.date === filterDate) : this.outbound;
    const totalTransactions = inbounds.length + outbounds.length;

    // Opname selisih
    const opnames = filterDate ? this.stockOpname.filter(op => op.date === filterDate) : this.stockOpname;
    const discrepancyOpnames = opnames.filter(op => op.difference !== 0);
    const totalDiscrepancyCount = discrepancyOpnames.length;
    const netDiscrepancyPcs = discrepancyOpnames.reduce((acc, op) => acc + Math.abs(op.difference), 0);

    // Kategori Breakdown
    const categoryBreakdown = {};
    this.products.forEach(p => {
      categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + p.qty;
    });

    return {
      totalSKU,
      totalStockPcs,
      totalGoldWeight: totalGoldWeight.toFixed(2),
      totalStoneCarat: totalStoneCarat.toFixed(2),
      totalTransactions,
      inboundTxCount: inbounds.length,
      outboundTxCount: outbounds.length,
      totalDiscrepancyCount,
      netDiscrepancyPcs,
      categoryBreakdown,
      recentInbound: inbounds.slice(0, 5),
      recentOutbound: outbounds.slice(0, 5),
      recentOpname: opnames.slice(0, 5)
    };
  }
}

// Global Store Instance
window.store = new StoreManager();
