/**
 * Controller & Application Event Initializer (AURA Gold IMS)
 */

const App = {
  currentTab: "dashboard",

  init() {
    this.bindNavigation();
    this.bindGlobalControls();
    this.bindModals();
    this.bindForms();
    this.bindSearchAndFilters();
    this.bindExportCSV();

    // Render Initial View
    this.switchTab("dashboard");
    UI.showToast("Selamat Datang di AURA Gold IMS - Sistem Operasional Toko Emas");
  },

  // -------------------------------------------------------------------------
  // 1. NAVIGATION & TAB SWITCHING
  // -------------------------------------------------------------------------
  bindNavigation() {
    const navButtons = document.querySelectorAll(".nav-item-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update Nav Buttons
    document.querySelectorAll(".nav-item-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
    });

    // Update Views
    document.querySelectorAll(".tab-view").forEach(v => {
      v.classList.remove("active");
    });
    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) targetView.classList.add("active");

    // Update Top Title & Tag
    const titles = {
      "dashboard": { title: "Dashboard Operasional", tag: "Ikhtisar & Ringkasan Laporan" },
      "master-barang": { title: "Master Data Barang", tag: "Katalog Perhiasan & Logam Mulia" },
      "kartu-stok": { title: "Kartu Stok Toko", tag: "Buku Besar Mutasi Persediaan" },
      "stock-opname": { title: "Stock Opname & Audit", tag: "Pemeriksaan Fisik vs Sistem" },
      "barang-masuk": { title: "Transaksi Barang Masuk", tag: "Inbound & Restock Pengrajin" },
      "barang-keluar": { title: "Transaksi Barang Keluar", tag: "Outbound & Penjualan Faktur" },
      "checklist-harian": { title: "Checklist Operasional Harian", tag: "Standar Operasional Prosedur Toko" }
    };

    if (titles[tabId]) {
      document.getElementById("current-page-title").textContent = titles[tabId].title;
      document.getElementById("current-page-tag").textContent = titles[tabId].tag;
    }

    // Trigger View Render
    this.renderCurrentView();
  },

  renderCurrentView() {
    switch (this.currentTab) {
      case "dashboard":
        UI.renderDashboard();
        break;
      case "master-barang":
        UI.renderMasterBarang();
        break;
      case "kartu-stok":
        UI.renderKartuStok();
        break;
      case "stock-opname":
        UI.renderStockOpname();
        break;
      case "barang-masuk":
        UI.renderBarangMasuk();
        break;
      case "barang-keluar":
        UI.renderBarangKeluar();
        break;
      case "checklist-harian":
        UI.renderChecklist();
        break;
    }
  },

  // -------------------------------------------------------------------------
  // 2. GLOBAL CONTROLS & DATE SELECTOR
  // -------------------------------------------------------------------------
  bindGlobalControls() {
    const dateInput = document.getElementById("global-date-input");
    if (dateInput) {
      dateInput.value = window.store.selectedDate;
      dateInput.addEventListener("change", (e) => {
        window.store.setSelectedDate(e.target.value);
        UI.showToast(`Tanggal laporan disetel ke: ${UI.formatDate(e.target.value)}`);
        this.renderCurrentView();
      });
    }

    // Global Quick Action button
    const quickBtn = document.getElementById("btn-global-quick-action");
    if (quickBtn) {
      quickBtn.addEventListener("click", () => {
        // Jika sedang di tab tertentu, buka modal yang relevan, atau buka modal barang masuk secara default
        if (this.currentTab === "master-barang") {
          this.openAddProductModal();
        } else if (this.currentTab === "barang-keluar") {
          this.openAddOutboundModal();
        } else if (this.currentTab === "stock-opname") {
          this.openAddOpnameModal();
        } else if (this.currentTab === "checklist-harian") {
          this.openAddChecklistModal();
        } else {
          this.openAddInboundModal();
        }
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById("btn-reset-demo");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin mengatur ulang data kembali ke data contoh toko emas?")) {
          window.store.resetAllData();
          dateInput.value = "2026-09-20";
          UI.showToast("Data contoh berhasil di-reset!");
          this.renderCurrentView();
        }
      });
    }
  },

  // -------------------------------------------------------------------------
  // 3. SEARCH & FILTERS
  // -------------------------------------------------------------------------
  bindSearchAndFilters() {
    // Master Barang
    const searchProd = document.getElementById("search-product");
    const filterCat = document.getElementById("filter-product-category");
    const filterStat = document.getElementById("filter-product-status");
    if (searchProd) searchProd.addEventListener("input", () => UI.renderMasterBarang());
    if (filterCat) filterCat.addEventListener("change", () => UI.renderMasterBarang());
    if (filterStat) filterStat.addEventListener("change", () => UI.renderMasterBarang());

    // Kartu Stok
    const filterScProd = document.getElementById("filter-stock-card-product");
    const filterScDate = document.getElementById("filter-stock-card-date");
    if (filterScProd) filterScProd.addEventListener("change", () => UI.renderKartuStok());
    if (filterScDate) filterScDate.addEventListener("change", () => UI.renderKartuStok());

    // Stock Opname
    const searchOpn = document.getElementById("search-opname");
    const filterOpnStat = document.getElementById("filter-opname-status");
    if (searchOpn) searchOpn.addEventListener("input", () => UI.renderStockOpname());
    if (filterOpnStat) filterOpnStat.addEventListener("change", () => UI.renderStockOpname());

    // Inbound & Outbound search
    const searchInb = document.getElementById("search-inbound");
    if (searchInb) searchInb.addEventListener("input", () => UI.renderBarangMasuk());

    const searchOut = document.getElementById("search-outbound");
    if (searchOut) searchOut.addEventListener("input", () => UI.renderBarangKeluar());
  },

  // -------------------------------------------------------------------------
  // 4. MODALS BINDINGS
  // -------------------------------------------------------------------------
  bindModals() {
    // Close button modal
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close-modal");
        UI.closeModal(modalId);
      });
    });

    // Close on click outside modal
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("open");
        }
      });
    });

    // Open buttons
    const btnAddProd = document.getElementById("btn-add-product");
    if (btnAddProd) btnAddProd.addEventListener("click", () => this.openAddProductModal());

    const btnAddInb = document.getElementById("btn-add-inbound");
    if (btnAddInb) btnAddInb.addEventListener("click", () => this.openAddInboundModal());

    const btnAddOut = document.getElementById("btn-add-outbound");
    if (btnAddOut) btnAddOut.addEventListener("click", () => this.openAddOutboundModal());

    const btnAddOpn = document.getElementById("btn-add-opname");
    if (btnAddOpn) btnAddOpn.addEventListener("click", () => this.openAddOpnameModal());

    const btnAddChk = document.getElementById("btn-add-checklist");
    if (btnAddChk) btnAddChk.addEventListener("click", () => this.openAddChecklistModal());
  },

  // -------------------------------------------------------------------------
  // 5. MODAL FORM OPENERS & HELPERS
  // -------------------------------------------------------------------------
  openAddProductModal() {
    document.getElementById("form-product").reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("modal-product-title").innerHTML = "<span>✦</span> Tambah Barang Perhiasan Baru";
    document.getElementById("prod-code").removeAttribute("readonly");

    // Otomatis Generate Barcode Baru Berdasarkan Kategori Default
    const defaultCat = "Cincin";
    document.getElementById("prod-category").value = defaultCat;
    const autoBarcode = window.BarcodeEngine ? window.BarcodeEngine.generateUniqueBarcode(defaultCat) : "CCN-750-001";
    document.getElementById("prod-code").value = autoBarcode;

    this.updateProductBarcodePreview(autoBarcode);

    const defaultImg = "assets/images/diamond_ring.jpg";
    document.getElementById("prod-img-preview").src = defaultImg;
    document.getElementById("prod-img-preset").value = defaultImg;
    document.getElementById("prod-img-custom").value = "";

    this.bindProductFormListeners();
    UI.openModal("modal-product");
  },

  openEditProductModal(id) {
    const prod = window.store.getProductById(id);
    if (!prod) return;

    document.getElementById("prod-id").value = prod.id;
    document.getElementById("prod-code").value = prod.code;
    document.getElementById("prod-code").setAttribute("readonly", "true");
    document.getElementById("prod-name").value = prod.name;
    document.getElementById("prod-category").value = prod.category;
    document.getElementById("prod-stone").value = prod.stoneWeight || "";
    document.getElementById("prod-weight").value = prod.goldWeight;
    document.getElementById("prod-qty").value = prod.qty;
    document.getElementById("prod-status").value = prod.status;

    this.updateProductBarcodePreview(prod.barcode || prod.code);

    const currentImg = prod.image || window.store.getDefaultImageForCategory(prod.category);
    document.getElementById("prod-img-preview").src = currentImg;
    document.getElementById("prod-img-custom").value = currentImg;

    this.bindProductFormListeners();
    document.getElementById("modal-product-title").innerHTML = "<span>✦</span> Edit Barang: " + prod.name;
    UI.openModal("modal-product");
  },

  updateProductBarcodePreview(barcodeText) {
    const previewBox = document.getElementById("prod-barcode-preview");
    if (!previewBox || !window.BarcodeEngine) return;
    if (!barcodeText) {
      previewBox.innerHTML = `<span style="color: #9ca3af; font-size: 11px;">Ketik kode barcode untuk melihat pratinjau</span>`;
      return;
    }
    previewBox.innerHTML = window.BarcodeEngine.generateSVG(barcodeText, {
      height: 40,
      showText: true,
      bgColor: "#ffffff"
    });
  },

  bindProductFormListeners() {
    const categorySelect = document.getElementById("prod-category");
    const presetSelect = document.getElementById("prod-img-preset");
    const customInput = document.getElementById("prod-img-custom");
    const fileInput = document.getElementById("prod-img-file");
    const previewImg = document.getElementById("prod-img-preview");
    const codeInput = document.getElementById("prod-code");
    const regenBarcodeBtn = document.getElementById("btn-regen-barcode");
    const isEditMode = Boolean(document.getElementById("prod-id").value);

    // Auto-generate barcode baru saat tombol dadu/generate diklik
    if (regenBarcodeBtn) {
      regenBarcodeBtn.onclick = () => {
        if (isEditMode) {
          if (!confirm("Ubah barcode barang ini?")) return;
        }
        const newBarcode = window.BarcodeEngine.generateUniqueBarcode(categorySelect.value);
        codeInput.value = newBarcode;
        this.updateProductBarcodePreview(newBarcode);
        UI.showToast(`Barcode baru [${newBarcode}] berhasil dibuat.`);
      };
    }

    // Live update barcode preview saat kode diketik manual
    if (codeInput) {
      codeInput.oninput = () => {
        this.updateProductBarcodePreview(codeInput.value.trim());
      };
    }

    // Auto-generate barcode & gambar saat kategori diganti (hanya saat mode tambah baru)
    if (categorySelect) {
      categorySelect.onchange = () => {
        if (!isEditMode) {
          const autoBarcode = window.BarcodeEngine.generateUniqueBarcode(categorySelect.value);
          codeInput.value = autoBarcode;
          this.updateProductBarcodePreview(autoBarcode);
        }

        if (!customInput.value || customInput.value.startsWith("assets/images/")) {
          const autoImg = window.store.getDefaultImageForCategory(categorySelect.value);
          previewImg.src = autoImg;
          presetSelect.value = autoImg;
          customInput.value = autoImg;
        }
      };
    }

    if (presetSelect) {
      presetSelect.onchange = () => {
        previewImg.src = presetSelect.value;
        customInput.value = presetSelect.value;
      };
    }

    if (customInput) {
      customInput.oninput = () => {
        if (customInput.value.trim()) {
          previewImg.src = customInput.value.trim();
        }
      };
    }

    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            previewImg.src = dataUrl;
            customInput.value = dataUrl;
            UI.showToast("Foto perhiasan berhasil dimuat.");
          };
          reader.readAsDataURL(file);
        }
      };
    }
  },

  deleteProduct(id) {
    const prod = window.store.getProductById(id);
    if (!prod) return;
    if (confirm(`Hapus perhiasan [${prod.code}] ${prod.name} dari master barang?`)) {
      window.store.deleteProduct(id);
      UI.showToast(`Barang ${prod.code} berhasil dihapus.`);
      UI.renderMasterBarang();
      UI.renderDashboard();
    }
  },

  openAddInboundModal() {
    document.getElementById("form-inbound").reset();
    document.getElementById("inb-date").value = window.store.selectedDate;
    document.getElementById("inb-doc").value = `SJ-IN-${Date.now().toString().slice(-4)}`;

    // Populate dropdown barang
    const select = document.getElementById("inb-product-select");
    select.innerHTML = "";
    window.store.products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `[${p.code}] ${p.name} (Stok Saat Ini: ${p.qty} pcs)`;
      select.appendChild(opt);
    });

    UI.openModal("modal-inbound");
  },

  openAddOutboundModal() {
    document.getElementById("form-outbound").reset();
    document.getElementById("out-date").value = window.store.selectedDate;
    document.getElementById("out-invoice").value = `INV/${window.store.selectedDate.replace(/-/g, "")}/AUR/${Math.floor(100 + Math.random() * 900)}`;

    const select = document.getElementById("out-product-select");
    select.innerHTML = "";
    window.store.products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `[${p.code}] ${p.name} - Tersedia: ${p.qty} pcs (${p.goldWeight}g)`;
      select.appendChild(opt);
    });

    const updateOutboundHelper = () => {
      const selectedProd = window.store.getProductByCode(select.value);
      const helper = document.getElementById("out-stock-helper");
      const weightInput = document.getElementById("out-weight");
      if (selectedProd) {
        helper.textContent = `Stok tersedia: ${selectedProd.qty} pcs | Berat satuan: ${selectedProd.goldWeight}g`;
        weightInput.value = selectedProd.goldWeight;
      }
    };

    select.onchange = updateOutboundHelper;
    updateOutboundHelper();

    UI.openModal("modal-outbound");
  },

  openAddOpnameModal() {
    document.getElementById("form-opname").reset();
    document.getElementById("opn-date").value = window.store.selectedDate;

    const select = document.getElementById("opn-product-select");
    select.innerHTML = "";
    window.store.products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `[${p.code}] ${p.name}`;
      select.appendChild(opt);
    });

    const updateOpnameFields = () => {
      const selectedProd = window.store.getProductByCode(select.value);
      const sysStock = selectedProd ? selectedProd.qty : 0;
      document.getElementById("opn-sys-stock").value = sysStock;
      calculateOpnameDiff();
    };

    const calculateOpnameDiff = () => {
      const sysStock = parseInt(document.getElementById("opn-sys-stock").value, 10) || 0;
      const physInput = document.getElementById("opn-phys-stock").value;
      const diffField = document.getElementById("opn-diff");
      const statusField = document.getElementById("opn-status");

      if (physInput === "") {
        diffField.value = "-";
        statusField.value = "-";
        return;
      }

      const physStock = parseInt(physInput, 10);
      const diff = physStock - sysStock;

      diffField.value = (diff > 0 ? "+" : "") + diff + " pcs";
      if (diff === 0) {
        statusField.value = "Sesuai";
        statusField.style.color = "var(--emerald-500)";
      } else {
        statusField.value = "Tidak Sesuai";
        statusField.style.color = "var(--ruby-500)";
      }
    };

    select.onchange = updateOpnameFields;
    document.getElementById("opn-phys-stock").oninput = calculateOpnameDiff;
    updateOpnameFields();

    UI.openModal("modal-opname");
  },

  reconcileOpname(opnameId) {
    try {
      const op = window.store.reconcileStockOpname(opnameId);
      UI.showToast(`Stok untuk [${op.productCode}] berhasil diselaraskan ke ${op.physicalStock} pcs!`);
      UI.renderStockOpname();
      UI.renderMasterBarang();
      UI.renderKartuStok();
      UI.renderDashboard();
    } catch (err) {
      UI.showToast(err.message, "error");
    }
  },

  openAddChecklistModal() {
    document.getElementById("form-checklist").reset();
    document.getElementById("chk-date").value = window.store.selectedDate;

    // Reset checklist items
    document.querySelectorAll(".checklist-item").forEach(item => {
      item.classList.remove("checked");
    });

    UI.openModal("modal-checklist");
  },

  toggleChecklistTask(id, taskKey) {
    window.store.toggleChecklistTask(id, taskKey);
    UI.renderChecklist();
    UI.renderDashboard();
    UI.showToast("Status checklist SOP berhasil diperbarui.");
  },

  // -------------------------------------------------------------------------
  // 6. FORM SUBMISSIONS
  // -------------------------------------------------------------------------
  bindForms() {
    // Form Master Barang
    const formProduct = document.getElementById("form-product");
    if (formProduct) {
      formProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("prod-id").value;
        const code = document.getElementById("prod-code").value;
        const name = document.getElementById("prod-name").value;
        const category = document.getElementById("prod-category").value;
        const stoneWeight = document.getElementById("prod-stone").value;
        const goldWeight = document.getElementById("prod-weight").value;
        const qty = document.getElementById("prod-qty").value;
        const status = document.getElementById("prod-status").value;

        // Ambil foto perhiasan dari custom URL/upload, atau pilihan preset, atau default kategori
        const customImg = document.getElementById("prod-img-custom").value.trim();
        const presetImg = document.getElementById("prod-img-preset").value;
        const image = customImg || presetImg || window.store.getDefaultImageForCategory(category);

        const barcode = code;

        try {
          if (id) {
            window.store.updateProduct(id, { name, category, stoneWeight, goldWeight, qty, status, image, barcode });
            UI.showToast(`Barang [${code}] berhasil diperbarui.`);
          } else {
            window.store.addProduct({ code, name, category, stoneWeight, goldWeight, qty, status, image, barcode });
            UI.showToast(`Perhiasan baru [${code}] dengan barcode berhasil ditambahkan.`);
          }
          UI.closeModal("modal-product");
          this.renderCurrentView();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
      });
    }

    // Form Barang Masuk
    const formInbound = document.getElementById("form-inbound");
    if (formInbound) {
      formInbound.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("inb-date").value;
        const docNo = document.getElementById("inb-doc").value;
        const productCode = document.getElementById("inb-product-select").value;
        const supplier = document.getElementById("inb-supplier").value;
        const qty = document.getElementById("inb-qty").value;
        const totalWeight = document.getElementById("inb-weight").value;
        const receiver = document.getElementById("inb-receiver").value;
        const condition = document.getElementById("inb-condition").value;
        const notes = document.getElementById("inb-notes").value;

        try {
          window.store.addInbound({ date, docNo, productCode, supplier, qty, totalWeight, receiver, condition, notes });
          UI.showToast(`Barang masuk #${docNo} berhasil disimpan! Stok bertambah +${qty} pcs.`);
          UI.closeModal("modal-inbound");
          this.renderCurrentView();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
      });
    }

    // Form Barang Keluar
    const formOutbound = document.getElementById("form-outbound");
    if (formOutbound) {
      formOutbound.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("out-date").value;
        const invoiceNo = document.getElementById("out-invoice").value;
        const productCode = document.getElementById("out-product-select").value;
        const qty = document.getElementById("out-qty").value;
        const totalWeight = document.getElementById("out-weight").value;
        const sellPrice = document.getElementById("out-price").value;
        const handedBy = document.getElementById("out-handed").value;
        const receivedBy = document.getElementById("out-received").value;
        const notes = document.getElementById("out-notes").value;

        try {
          window.store.addOutbound({ date, invoiceNo, productCode, qty, totalWeight, sellPrice, handedBy, receivedBy, notes });
          UI.showToast(`Penjualan Faktur #${invoiceNo} sukses! Stok terpotong -${qty} pcs.`);
          UI.closeModal("modal-outbound");
          this.renderCurrentView();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
      });
    }

    // Form Stock Opname
    const formOpname = document.getElementById("form-opname");
    if (formOpname) {
      formOpname.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("opn-date").value;
        const productCode = document.getElementById("opn-product-select").value;
        const systemStock = document.getElementById("opn-sys-stock").value;
        const physicalStock = document.getElementById("opn-phys-stock").value;
        const notes = document.getElementById("opn-notes").value;

        try {
          const op = window.store.addStockOpname({ date, productCode, systemStock, physicalStock, notes });
          if (op.status === "Sesuai") {
            UI.showToast(`Audit [${productCode}] tercatat: Stok fisik SESUAI sistem.`);
          } else {
            UI.showToast(`Audit [${productCode}] tercatat: Ditemukan SELISIH ${op.difference} pcs!`, "error");
          }
          UI.closeModal("modal-opname");
          this.renderCurrentView();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
      });
    }

    // Form Checklist Harian & Interactive Items
    const checklistItems = document.querySelectorAll(".checklist-item");
    checklistItems.forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("checked");
      });
    });

    const formChecklist = document.getElementById("form-checklist");
    if (formChecklist) {
      formChecklist.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = document.getElementById("chk-date").value;
        const employeeName = document.getElementById("chk-employee").value;
        const notes = document.getElementById("chk-notes").value;

        const checkInitialStock = document.querySelector('[data-field="chk-initial-stock"]').classList.contains("checked");
        const checkInbound = document.querySelector('[data-field="chk-inbound"]').classList.contains("checked");
        const checkOutbound = document.querySelector('[data-field="chk-outbound"]').classList.contains("checked");
        const checkPhysicalSystem = document.querySelector('[data-field="chk-phys-sys"]').classList.contains("checked");
        const tidyStorage = document.querySelector('[data-field="chk-storage"]').classList.contains("checked");
        const dailyReport = document.querySelector('[data-field="chk-daily-report"]').classList.contains("checked");

        try {
          window.store.addChecklist({
            date,
            employeeName,
            checkInitialStock,
            checkInbound,
            checkOutbound,
            checkPhysicalSystem,
            tidyStorage,
            dailyReport,
            notes
          });
          UI.showToast(`Lembar checklist harian petugas [${employeeName}] berhasil disimpan.`);
          UI.closeModal("modal-checklist");
          this.renderCurrentView();
        } catch (err) {
          UI.showToast(err.message, "error");
        }
      });
    }
  },

  // -------------------------------------------------------------------------
  // 7. EXPORT DATA TO CSV
  // -------------------------------------------------------------------------
  bindExportCSV() {
    const btn = document.getElementById("btn-export-master-csv");
    if (btn) {
      btn.addEventListener("click", () => {
        const products = window.store.products;
        if (!products.length) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Kode Barang,Nama Barang,Kategori,Total Stone (ct),Berat Emas (g),Quantity (pcs),Status\n";

        products.forEach(p => {
          const row = [
            `"${p.code}"`,
            `"${p.name.replace(/"/g, '""')}"`,
            `"${p.category}"`,
            p.stoneWeight,
            p.goldWeight,
            p.qty,
            `"${p.status}"`
          ].join(",");
          csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Master_Barang_Toko_Emas_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        UI.showToast("Master barang berhasil diekspor ke format CSV!");
      });
    }
  }
};

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
