/**
 * Data Awal & Default untuk Sistem Inventaris & Operasional Toko Emas (AURA Gold IMS)
 * Dilengkapi dengan Foto Perhiasan Nyata untuk Memudahkan Tracking Visual
 */

const INITIAL_PRODUCTS = [
  {
    id: "PROD-001",
    code: "CCN-750-001",
    barcode: "CCN-750-001",
    name: "Cincin Solitaire Berlian Rose Gold 750",
    category: "Cincin",
    stoneWeight: 0.35, // ct
    goldWeight: 3.25,   // gram
    qty: 8,
    status: "Tersedia",
    image: "assets/images/diamond_ring.jpg"
  },
  {
    id: "PROD-002",
    code: "CCN-700-002",
    barcode: "CCN-700-002",
    name: "Cincin Listring Emas Kuning 16K (700)",
    category: "Cincin",
    stoneWeight: 0.15,
    goldWeight: 2.10,
    qty: 12,
    status: "Tersedia",
    image: "assets/images/diamond_ring.jpg"
  },
  {
    id: "PROD-003",
    code: "KLG-750-001",
    barcode: "KLG-750-001",
    name: "Kalung Rantai Nori Italy White Gold 750",
    category: "Kalung",
    stoneWeight: 0.00,
    goldWeight: 6.40,
    qty: 5,
    status: "Tersedia",
    image: "assets/images/gold_necklace.jpg"
  },
  {
    id: "PROD-004",
    code: "KLG-700-002",
    barcode: "KLG-700-002",
    name: "Kalung Choker Liontin Permata Zircon 700",
    category: "Kalung",
    stoneWeight: 0.20,
    goldWeight: 4.80,
    qty: 2,
    status: "Menipis",
    image: "assets/images/gold_necklace.jpg"
  },
  {
    id: "PROD-005",
    code: "GLG-750-001",
    barcode: "GLG-750-001",
    name: "Gelang Serut Tennis Diamond 750",
    category: "Gelang",
    stoneWeight: 1.20,
    goldWeight: 8.50,
    qty: 4,
    status: "Tersedia",
    image: "assets/images/gold_bracelet.jpg"
  },
  {
    id: "PROD-006",
    code: "GLG-375-002",
    barcode: "GLG-375-002",
    name: "Gelang Rantai Hollow Emas Muda 375",
    category: "Gelang",
    stoneWeight: 0.00,
    goldWeight: 5.10,
    qty: 15,
    status: "Tersedia",
    image: "assets/images/gold_bracelet.jpg"
  },
  {
    id: "PROD-007",
    code: "ATG-750-001",
    barcode: "ATG-750-001",
    name: "Anting Giwang Berlian Solitaire 750",
    category: "Anting",
    stoneWeight: 0.50,
    goldWeight: 2.30,
    qty: 6,
    status: "Tersedia",
    image: "assets/images/diamond_earrings.jpg"
  },
  {
    id: "PROD-008",
    code: "ATG-700-002",
    barcode: "ATG-700-002",
    name: "Anting Kenip Bulat Klasik 700",
    category: "Anting",
    stoneWeight: 0.00,
    goldWeight: 1.85,
    qty: 10,
    status: "Tersedia",
    image: "assets/images/diamond_earrings.jpg"
  },
  {
    id: "PROD-009",
    code: "LTM-999-001",
    barcode: "LTM-999-001",
    name: "Logam Mulia Antam CertiCard 10 Gram",
    category: "Logam Mulia",
    stoneWeight: 0.00,
    goldWeight: 10.00,
    qty: 18,
    status: "Tersedia",
    image: "assets/images/gold_bar.jpg"
  },
  {
    id: "PROD-010",
    code: "LTM-999-002",
    barcode: "LTM-999-002",
    name: "Logam Mulia Antam CertiCard 5 Gram",
    category: "Logam Mulia",
    stoneWeight: 0.00,
    goldWeight: 5.00,
    qty: 1,
    status: "Menipis",
    image: "assets/images/gold_bar.jpg"
  },
  {
    id: "PROD-011",
    code: "LTN-750-001",
    barcode: "LTN-750-001",
    name: "Liontin Salib Diamond Cut Rose Gold 750",
    category: "Liontin",
    stoneWeight: 0.18,
    goldWeight: 2.15,
    qty: 0,
    status: "Habis",
    image: "assets/images/gold_necklace.jpg"
  }
];

const INITIAL_INBOUND = [
  {
    id: "INB-2026-001",
    date: "2026-09-18",
    docNo: "SJ-HWT-8942",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    supplier: "PT Hartadinata Abadi Tbk",
    qty: 10,
    totalWeight: 100.00,
    receiver: "Budi Santoso (Head Stock)",
    condition: "Baik & Tersegel",
    notes: "Pengiriman batch 3, sertifikat barcode terverifikasi"
  },
  {
    id: "INB-2026-002",
    date: "2026-09-19",
    docNo: "PO-UBS-5521",
    productCode: "CCN-750-001",
    productName: "Cincin Solitaire Berlian Rose Gold 750",
    supplier: "UBS Gold Jewelry Studio",
    qty: 5,
    totalWeight: 16.25,
    receiver: "Siti Rahma (Quality Control)",
    condition: "Sangat Baik",
    notes: "Finishing high polish rose gold, micro setting rapi"
  },
  {
    id: "INB-2026-003",
    date: "2026-09-20",
    docNo: "SJ-GLD-1029",
    productCode: "GLG-750-001",
    productName: "Gelang Serut Tennis Diamond 750",
    supplier: "Atelier Diamond Surabaya",
    qty: 3,
    totalWeight: 25.50,
    receiver: "Budi Santoso (Head Stock)",
    condition: "Baik",
    notes: "Pengrajin spesialis gelang serut rantai padat"
  }
];

const INITIAL_OUTBOUND = [
  {
    id: "OUT-2026-001",
    date: "2026-09-19",
    invoiceNo: "INV/20260919/AUR/0088",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    qty: 2,
    totalWeight: 20.00,
    sellPrice: 28400000,
    handedBy: "Dewi Lestari (Kasir 1)",
    receivedBy: "Ibu Amanda Putri (Pelanggan)",
    notes: "Pembayaran QRIS & Transfer EDC BCA"
  },
  {
    id: "OUT-2026-002",
    date: "2026-09-20",
    invoiceNo: "INV/20260920/AUR/0091",
    productCode: "CCN-700-002",
    productName: "Cincin Listring Emas Kuning 16K (700)",
    qty: 1,
    totalWeight: 2.10,
    sellPrice: 2750000,
    handedBy: "Rian Pratama (Sales)",
    receivedBy: "Bpk. Hendra Kurniawan",
    notes: "Termasuk kotak beludru & garansi poles berkala"
  },
  {
    id: "OUT-2026-003",
    date: "2026-09-20",
    invoiceNo: "INV/20260920/AUR/0094",
    productCode: "ATG-750-001",
    productName: "Anting Giwang Berlian Solitaire 750",
    qty: 1,
    totalWeight: 2.30,
    sellPrice: 6850000,
    handedBy: "Dewi Lestari (Kasir 1)",
    receivedBy: "Ny. Melina Wijaya",
    notes: "Gift anniversary pernikahan, nota invoice fisik terlampir"
  }
];

const INITIAL_STOCK_CARDS = [
  {
    id: "SC-001",
    date: "2026-09-17",
    productCode: "CCN-750-001",
    productName: "Cincin Solitaire Berlian Rose Gold 750",
    txType: "Saldo Awal",
    inQty: 5,
    outQty: 0,
    balance: 5,
    notes: "Saldo awal pembukuan bulanan"
  },
  {
    id: "SC-002",
    date: "2026-09-19",
    productCode: "CCN-750-001",
    productName: "Cincin Solitaire Berlian Rose Gold 750",
    txType: "Barang Masuk",
    inQty: 5,
    outQty: 0,
    balance: 10,
    notes: "Dokumen PO-UBS-5521"
  },
  {
    id: "SC-003",
    date: "2026-09-19",
    productCode: "CCN-750-001",
    productName: "Cincin Solitaire Berlian Rose Gold 750",
    txType: "Barang Keluar",
    inQty: 0,
    outQty: 2,
    balance: 8,
    notes: "Penjualan INV/20260919/AUR/0082"
  },
  {
    id: "SC-004",
    date: "2026-09-17",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    txType: "Saldo Awal",
    inQty: 10,
    outQty: 0,
    balance: 10,
    notes: "Stok awal brankas utama"
  },
  {
    id: "SC-005",
    date: "2026-09-18",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    txType: "Barang Masuk",
    inQty: 10,
    outQty: 0,
    balance: 20,
    notes: "Dokumen SJ-HWT-8942"
  },
  {
    id: "SC-006",
    date: "2026-09-19",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    txType: "Barang Keluar",
    inQty: 0,
    outQty: 2,
    balance: 18,
    notes: "Penjualan INV/20260919/AUR/0088"
  },
  {
    id: "SC-007",
    date: "2026-09-18",
    productCode: "CCN-700-002",
    productName: "Cincin Listring Emas Kuning 16K (700)",
    txType: "Saldo Awal",
    inQty: 13,
    outQty: 0,
    balance: 13,
    notes: "Stok etalase depan A1"
  },
  {
    id: "SC-008",
    date: "2026-09-20",
    productCode: "CCN-700-002",
    productName: "Cincin Listring Emas Kuning 16K (700)",
    txType: "Barang Keluar",
    inQty: 0,
    outQty: 1,
    balance: 12,
    notes: "Penjualan INV/20260920/AUR/0091"
  }
];

const INITIAL_STOCK_OPNAME = [
  {
    id: "OPN-2026-001",
    date: "2026-09-19",
    productCode: "CCN-750-001",
    productName: "Cincin Solitaire Berlian Rose Gold 750",
    systemStock: 8,
    physicalStock: 8,
    difference: 0,
    notes: "Hitung fisik di tray etalase 1A, lengkap",
    status: "Sesuai"
  },
  {
    id: "OPN-2026-002",
    date: "2026-09-19",
    productCode: "KLG-700-002",
    productName: "Kalung Choker Liontin Permata Zircon 700",
    systemStock: 2,
    physicalStock: 1,
    difference: -1,
    notes: "Kurang 1 pcs, sedang ditelusuri di meja display pameran",
    status: "Tidak Sesuai"
  },
  {
    id: "OPN-2026-003",
    date: "2026-09-20",
    productCode: "LTM-999-001",
    productName: "Logam Mulia Antam CertiCard 10 Gram",
    systemStock: 18,
    physicalStock: 18,
    difference: 0,
    notes: "Cek fisik brankas grade A, segel utuh",
    status: "Sesuai"
  },
  {
    id: "OPN-2026-004",
    date: "2026-09-20",
    productCode: "GLG-375-002",
    productName: "Gelang Rantai Hollow Emas Muda 375",
    systemStock: 15,
    physicalStock: 16,
    difference: 1,
    notes: "Lebih 1 pcs dari titipan etalase display promo",
    status: "Tidak Sesuai"
  }
];

const INITIAL_CHECKLISTS = [
  {
    id: "CHK-2026-001",
    date: "2026-09-19",
    employeeName: "Budi Santoso",
    checkInitialStock: true,
    checkInbound: true,
    checkOutbound: true,
    checkPhysicalSystem: true,
    tidyStorage: true,
    dailyReport: true,
    notes: "Operasional lancar, brankas terkunci ganda jam 21:00 WIB",
    status: "Lengkap"
  },
  {
    id: "CHK-2026-002",
    date: "2026-09-20",
    employeeName: "Siti Rahma",
    checkInitialStock: true,
    checkInbound: true,
    checkOutbound: true,
    checkPhysicalSystem: false,
    tidyStorage: true,
    dailyReport: false,
    notes: "Shift pagi selesai, timbangan gramatur kalibrasi ulang jam 12:00",
    status: "Belum Lengkap"
  }
];
