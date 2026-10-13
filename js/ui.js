/**
 * UI Renderer & Komponen Interaktif (AURA Gold IMS)
 * Dilengkapi dengan Visual Tracking Foto Perhiasan & Lightbox Preview
 */

const UI = {
  // Format mata uang Rupiah
  formatRupiah(amount) {
    if (!amount && amount !== 0) return "-";
    return "Rp " + Math.round(amount).toLocaleString("id-ID");
  },

  // Format tanggal Indonesia
  formatDate(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  },

  // Toast Notification
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✓" : "⚠";
    toast.innerHTML = `<span style="font-weight: bold; font-size: 16px;">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  },

  // Modal Controllers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("open");
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  },

  // =========================================================================
  // LIGHTBOX MODAL: DETAIL FOTO PERHIASAN
  // =========================================================================
  openImageLightbox(productOrId) {
    let prod = null;
    if (typeof productOrId === "string") {
      prod = window.store.getProductById(productOrId) || window.store.getProductByCode(productOrId);
    } else {
      prod = productOrId;
    }

    if (!prod) return;

    const imgEl = document.getElementById("lightbox-img");
    const nameEl = document.getElementById("lightbox-product-name");
    const codeEl = document.getElementById("lightbox-product-code");
    const chipsEl = document.getElementById("lightbox-chips");

    if (imgEl) imgEl.src = prod.image || "assets/images/diamond_ring.jpg";
    if (nameEl) nameEl.textContent = prod.name;
    if (codeEl) codeEl.textContent = prod.code;

    if (chipsEl) {
      chipsEl.innerHTML = `
        <span class="lightbox-chip">Kategori: <strong>${prod.category}</strong></span>
        <span class="lightbox-chip">Berat Emas: <strong>${prod.goldWeight.toFixed(2)} g</strong></span>
        <span class="lightbox-chip">Batu Permata: <strong>${prod.stoneWeight ? prod.stoneWeight.toFixed(2) + ' ct' : 'Tanpa Permata'}</strong></span>
        <span class="lightbox-chip">Stok Toko: <strong>${prod.qty} pcs</strong></span>
        <span class="lightbox-chip">Status: <strong>${prod.status}</strong></span>
      `;
    }

    // Render Scannable Barcode SVG in Lightbox
    const barcodeSvgContainer = document.getElementById("lightbox-barcode-svg");
    if (barcodeSvgContainer && window.BarcodeEngine) {
      const barcodeText = prod.barcode || prod.code;
      barcodeSvgContainer.innerHTML = window.BarcodeEngine.generateSVG(barcodeText, {
        height: 40,
        showText: true,
        bgColor: "#ffffff"
      });
    }

    const printTagBtn = document.getElementById("btn-lightbox-print-tag");
    if (printTagBtn) {
      printTagBtn.onclick = () => {
        this.closeModal("modal-lightbox");
        this.openBarcodeTagModal(prod);
      };
    }

    this.openModal("modal-lightbox");
  },

  // =========================================================================
  // MODAL HANG TAG BARCODE CETAK
  // =========================================================================
  openBarcodeTagModal(productOrId) {
    let prod = null;
    if (typeof productOrId === "string") {
      prod = window.store.getProductById(productOrId) || window.store.getProductByCode(productOrId);
    } else {
      prod = productOrId;
    }

    if (!prod) return;

    const tagImg = document.getElementById("tag-prod-img");
    const tagName = document.getElementById("tag-prod-name");
    const tagCat = document.getElementById("tag-prod-category");
    const tagWeight = document.getElementById("tag-prod-weight");
    const tagStone = document.getElementById("tag-prod-stone");
    const tagBarcodeArea = document.getElementById("tag-barcode-svg");

    if (tagImg) tagImg.src = prod.image || "assets/images/diamond_ring.jpg";
    if (tagName) tagName.textContent = prod.name;
    if (tagCat) tagCat.textContent = prod.category;
    if (tagWeight) tagWeight.textContent = `${prod.goldWeight.toFixed(2)} gr`;
    if (tagStone) tagStone.textContent = prod.stoneWeight ? `${prod.stoneWeight.toFixed(2)} ct` : "-";

    if (tagBarcodeArea && window.BarcodeEngine) {
      const barcodeText = prod.barcode || prod.code;
      tagBarcodeArea.innerHTML = window.BarcodeEngine.generateSVG(barcodeText, {
        height: 42,
        showText: true,
        bgColor: "#ffffff"
      });
    }

    this.openModal("modal-barcode-tag");
  },

  // =========================================================================
  // 1. RENDER DASHBOARD
  // =========================================================================
  renderDashboard() {
    const filterDate = window.store.selectedDate;
    const metrics = window.store.getDashboardMetrics(filterDate);

    // Update Banner Date Badge
    const dateBadge = document.getElementById("dash-report-date-badge");
    if (dateBadge) {
      dateBadge.textContent = "Tanggal: " + this.formatDate(filterDate);
    }

    // Metric Cards
    document.getElementById("dash-total-sku").textContent = metrics.totalSKU;
    document.getElementById("dash-total-stock").innerHTML = `${metrics.totalStockPcs} <span style="font-size: 15px; font-weight: normal; color: var(--text-muted);">pcs</span>`;
    document.getElementById("dash-total-weight").innerHTML = `${metrics.totalGoldWeight} <span style="font-size: 15px; font-weight: normal; color: var(--gold-400);">g</span>`;
    document.getElementById("dash-total-stone").textContent = `${metrics.totalStoneCarat} ct`;
    document.getElementById("dash-total-tx").textContent = metrics.totalTransactions;
    document.getElementById("dash-tx-in-count").textContent = `${metrics.inboundTxCount} Masuk`;
    document.getElementById("dash-tx-out-count").textContent = `${metrics.outboundTxCount} Keluar`;

    // Opname Alert Card
    const opnameCard = document.getElementById("card-opname-alert");
    const opnameDiffVal = document.getElementById("dash-opname-discrepancy");
    const opnameSubtext = document.getElementById("dash-opname-subtext");

    if (metrics.totalDiscrepancyCount > 0) {
      opnameCard.classList.add("discrepancy-alert");
      opnameDiffVal.innerHTML = `${metrics.totalDiscrepancyCount} <span style="font-size: 14px; font-weight: 600;">SKU Selisih (${metrics.netDiscrepancyPcs} pcs)</span>`;
      opnameDiffVal.style.color = "var(--ruby-500)";
      opnameSubtext.innerHTML = `<span style="color: var(--ruby-500); font-weight: 600;">Ada ${metrics.totalDiscrepancyCount} perhiasan selisih audit!</span>`;
    } else {
      opnameCard.classList.remove("discrepancy-alert");
      opnameDiffVal.innerHTML = `0 <span style="font-size: 14px; font-weight: 600;">SKU</span>`;
      opnameDiffVal.style.color = "var(--emerald-500)";
      opnameSubtext.innerHTML = `<span style="color: var(--emerald-500); font-weight: 600;">✓ Seluruh stok fisik sinkron</span>`;
    }

    // Category Composition Progress Bars
    const catContainer = document.getElementById("dash-category-container");
    if (catContainer) {
      catContainer.innerHTML = "";
      const categories = Object.entries(metrics.categoryBreakdown);
      const totalPcs = metrics.totalStockPcs || 1;

      categories.forEach(([catName, qty]) => {
        const percentage = Math.round((qty / totalPcs) * 100);
        const itemEl = document.createElement("div");
        itemEl.className = "cat-bar-item";
        itemEl.innerHTML = `
          <div class="cat-bar-label">
            <span>${catName}</span>
            <span style="font-weight: 600; color: var(--navy-900);">${qty} pcs (${percentage}%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width: ${percentage}%"></div>
          </div>
        `;
        catContainer.appendChild(itemEl);
      });
    }

    // Today's Checklist Status
    const todayChecklist = window.store.checklists.find(c => c.date === filterDate);
    const checklistBadge = document.getElementById("dash-today-checklist-status");
    if (checklistBadge) {
      if (todayChecklist && todayChecklist.status === "Lengkap") {
        checklistBadge.className = "badge badge-available";
        checklistBadge.textContent = "✓ Lengkap (6/6 SOP)";
      } else if (todayChecklist) {
        checklistBadge.className = "badge badge-low";
        checklistBadge.textContent = "⚠ Belum Lengkap";
      } else {
        checklistBadge.className = "badge badge-empty";
        checklistBadge.textContent = "Belum Diisi Hari Ini";
      }
    }

    // Recent Stock Card Activity with Photo Thumbnail
    const recentBody = document.getElementById("dash-recent-stock-body");
    if (recentBody) {
      recentBody.innerHTML = "";
      const recent = window.store.stockCards.slice(0, 6);
      if (recent.length === 0) {
        recentBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">Belum ada aktivitas kartu stok.</td></tr>`;
      } else {
        recent.forEach(sc => {
          const prod = window.store.getProductByCode(sc.productCode);
          const imgSrc = prod && prod.image ? prod.image : "assets/images/diamond_ring.jpg";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td class="font-mono">${this.formatDate(sc.date)}</td>
            <td><span class="badge badge-gold font-mono">${sc.productCode}</span></td>
            <td>
              <div class="jewelry-cell">
                <div class="jewelry-thumb-sm" onclick="UI.openImageLightbox('${prod ? prod.id : ''}')" style="cursor: pointer;" title="Klik untuk lihat foto">
                  <img src="${imgSrc}" alt="${sc.productName}">
                </div>
                <span style="font-weight: 600;">${sc.productName}</span>
              </div>
            </td>
            <td>${this.renderTxTypeBadge(sc.txType)}</td>
            <td style="color: var(--emerald-500); font-weight: 600;">${sc.inQty > 0 ? "+" + sc.inQty : "-"}</td>
            <td style="color: var(--ruby-500); font-weight: 600;">${sc.outQty > 0 ? "-" + sc.outQty : "-"}</td>
            <td style="font-weight: 700; color: var(--navy-900);">${sc.balance} pcs</td>
            <td style="color: var(--text-muted); font-size: 12.5px;">${sc.notes}</td>
          `;
          recentBody.appendChild(tr);
        });
      }
    }
  },

  renderTxTypeBadge(type) {
    if (type === "Barang Masuk") return `<span class="badge badge-available">Masuk</span>`;
    if (type === "Barang Keluar") return `<span class="badge badge-empty">Keluar</span>`;
    if (type === "Penyesuaian Opname") return `<span class="badge badge-consignment">Opname</span>`;
    return `<span class="badge badge-gold">${type}</span>`;
  },

  // =========================================================================
  // 2. RENDER MASTER BARANG (DENGAN FOTO TRACKING)
  // =========================================================================
  renderMasterBarang() {
    const tbody = document.getElementById("master-barang-body");
    if (!tbody) return;

    const searchTerm = (document.getElementById("search-product")?.value || "").toLowerCase();
    const filterCat = document.getElementById("filter-product-category")?.value || "";
    const filterStatus = document.getElementById("filter-product-status")?.value || "";

    const filtered = window.store.products.filter(p => {
      const matchSearch = p.code.toLowerCase().includes(searchTerm) || p.name.toLowerCase().includes(searchTerm);
      const matchCat = !filterCat || p.category === filterCat;
      const matchStatus = !filterStatus || p.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 30px;">Tidak ada perhiasan yang sesuai filter.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement("tr");

      let badgeClass = "badge-available";
      if (p.status === "Menipis") badgeClass = "badge-low";
      else if (p.status === "Habis") badgeClass = "badge-empty";
      else if (p.status === "Konsinyasi") badgeClass = "badge-consignment";

      const imgSrc = p.image || "assets/images/diamond_ring.jpg";

      tr.innerHTML = `
        <td style="text-align: center;">
          <div class="jewelry-thumb-wrap" onclick="UI.openImageLightbox('${p.id}')" title="Klik untuk lihat foto & spesifikasi perhiasan">
            <img src="${imgSrc}" alt="${p.name}" class="jewelry-thumb">
          </div>
        </td>
        <td><span class="badge badge-gold font-mono">${p.code}</span></td>
        <td>
          <button class="barcode-badge-btn" onclick="UI.openBarcodeTagModal('${p.id}')" title="Klik untuk cetak label barcode tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="4" y1="5" x2="4" y2="19"></line>
              <line x1="8" y1="5" x2="8" y2="19"></line>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="17" y1="5" x2="17" y2="19"></line>
              <line x1="20" y1="5" x2="20" y2="19"></line>
            </svg>
            ${p.barcode || p.code}
          </button>
        </td>
        <td style="font-weight: 600; color: var(--text-primary);">
          <div style="display: flex; flex-direction: column;">
            <span style="color: var(--navy-900); font-weight: 600;">${p.name}</span>
            <span style="font-size: 11px; color: var(--navy-600); cursor: pointer; font-weight: 500;" onclick="UI.openImageLightbox('${p.id}')">🔍 Detail & Barcode</span>
          </div>
        </td>
        <td><span style="color: var(--text-secondary);">${p.category}</span></td>
        <td class="font-mono">${p.stoneWeight ? p.stoneWeight.toFixed(2) + " ct" : "-"}</td>
        <td class="font-mono" style="color: var(--navy-800); font-weight: 600;">${p.goldWeight.toFixed(2)} g</td>
        <td class="font-mono" style="font-weight: 700; font-size: 15px; color: ${p.qty === 0 ? 'var(--ruby-500)' : 'var(--navy-900)'};">${p.qty} pcs</td>
        <td><span class="badge ${badgeClass}">${p.status}</span></td>
        <td style="text-align: center; white-space: nowrap;">
          <button class="btn btn-outline-gold btn-sm" onclick="UI.openBarcodeTagModal('${p.id}')" title="Cetak Label Barcode Tag">
            🏷️ Tag
          </button>
          <button class="btn btn-ghost btn-sm" onclick="App.openEditProductModal('${p.id}')" title="Edit Barang" style="margin-left: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="App.deleteProduct('${p.id}')" title="Hapus Barang" style="margin-left: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 3. RENDER KARTU STOK (DENGAN THUMBNAIL FOTO)
  // =========================================================================
  renderKartuStok() {
    const tbody = document.getElementById("kartu-stok-body");
    const productSelect = document.getElementById("filter-stock-card-product");
    const dateInput = document.getElementById("filter-stock-card-date");
    if (!tbody) return;

    // Populate dropdown perhiasan jika belum ada
    const currentVal = productSelect.value;
    productSelect.innerHTML = `<option value="">-- Tampilkan Seluruh Barang --</option>`;
    window.store.products.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `[${p.code}] ${p.name} (Stok: ${p.qty} pcs)`;
      if (opt.value === currentVal) opt.selected = true;
      productSelect.appendChild(opt);
    });

    const selectedCode = productSelect.value;
    const selectedDate = dateInput.value;

    let records = window.store.stockCards;
    if (selectedCode) {
      records = records.filter(r => r.productCode.toLowerCase() === selectedCode.toLowerCase());
    }
    if (selectedDate) {
      records = records.filter(r => r.date === selectedDate);
    }

    // Update Summary Header Bar
    const totalMasuk = records.reduce((sum, r) => sum + (r.inQty || 0), 0);
    const totalKeluar = records.reduce((sum, r) => sum + (r.outQty || 0), 0);
    const saldoKumulatif = selectedCode && records.length > 0 
      ? records[0].balance 
      : (totalMasuk - totalKeluar);

    document.getElementById("sc-total-masuk").textContent = `${totalMasuk} pcs`;
    document.getElementById("sc-total-keluar").textContent = `${totalKeluar} pcs`;
    document.getElementById("sc-saldo-kumulatif").textContent = `${saldoKumulatif} pcs`;
    document.getElementById("sc-filter-label").textContent = selectedCode ? selectedCode : "Semua Barang";

    tbody.innerHTML = "";
    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Tidak ada pergerakan stok pada filter yang dipilih.</td></tr>`;
      return;
    }

    records.forEach(r => {
      const prod = window.store.getProductByCode(r.productCode);
      const imgSrc = prod && prod.image ? prod.image : "assets/images/diamond_ring.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-mono">${this.formatDate(r.date)}</td>
        <td>
          <div class="jewelry-cell">
            <div class="jewelry-thumb-sm" onclick="UI.openImageLightbox('${prod ? prod.id : ''}')" style="cursor: pointer;" title="Klik untuk lihat foto">
              <img src="${imgSrc}" alt="${r.productName}">
            </div>
            <div class="jewelry-meta-text">
              <span class="jewelry-meta-code font-mono">${r.productCode}</span>
              <span class="jewelry-meta-name">${r.productName}</span>
            </div>
          </div>
        </td>
        <td>${this.renderTxTypeBadge(r.txType)}</td>
        <td class="font-mono" style="color: var(--emerald-500); font-weight: 700;">${r.inQty > 0 ? "+" + r.inQty : "-"}</td>
        <td class="font-mono" style="color: var(--ruby-500); font-weight: 700;">${r.outQty > 0 ? "-" + r.outQty : "-"}</td>
        <td class="font-mono" style="color: var(--gold-300); font-weight: 800; font-size: 14.5px;">${r.balance} pcs</td>
        <td style="color: var(--text-secondary); font-size: 12.5px;">${r.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 4. RENDER STOCK OPNAME (DENGAN VISUAL FOTO UNTUK AUDITOR)
  // =========================================================================
  renderStockOpname() {
    const tbody = document.getElementById("stock-opname-body");
    if (!tbody) return;

    const searchTerm = (document.getElementById("search-opname")?.value || "").toLowerCase();
    const statusFilter = document.getElementById("filter-opname-status")?.value || "";

    const filtered = window.store.stockOpname.filter(op => {
      const matchSearch = op.productCode.toLowerCase().includes(searchTerm) || op.productName.toLowerCase().includes(searchTerm);
      const matchStatus = !statusFilter || (statusFilter === "Sesuai" ? op.difference === 0 : op.difference !== 0);
      return matchSearch && matchStatus;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 30px;">Tidak ada rekaman stock opname.</td></tr>`;
      return;
    }

    filtered.forEach(op => {
      const prod = window.store.getProductByCode(op.productCode);
      const imgSrc = prod && prod.image ? prod.image : "assets/images/diamond_ring.jpg";

      const tr = document.createElement("tr");
      const isMatch = op.difference === 0;
      if (!isMatch) tr.className = "table-row-highlight-danger";

      const diffDisplay = op.difference > 0 ? `+${op.difference}` : `${op.difference}`;
      const diffColor = op.difference === 0 ? "var(--emerald-500)" : (op.difference < 0 ? "var(--ruby-500)" : "var(--amber-500)");

      let actionBtn = `<span style="color: var(--text-muted); font-size: 12px;">Sesuai</span>`;
      if (!isMatch) {
        actionBtn = `
          <button class="btn btn-emerald btn-sm" onclick="App.reconcileOpname('${op.id}')" title="Sesuaikan saldo sistem dengan fisik">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Sesuaikan Sistem
          </button>
        `;
      }

      tr.innerHTML = `
        <td class="font-mono">${this.formatDate(op.date)}</td>
        <td><span class="badge badge-gold font-mono">${op.productCode}</span></td>
        <td>
          <div class="jewelry-cell">
            <div class="jewelry-thumb-sm" onclick="UI.openImageLightbox('${prod ? prod.id : ''}')" style="cursor: pointer;" title="Klik untuk lihat foto">
              <img src="${imgSrc}" alt="${op.productName}">
            </div>
            <span style="font-weight: 600;">${op.productName}</span>
          </div>
        </td>
        <td class="font-mono">${op.systemStock} pcs</td>
        <td class="font-mono" style="font-weight: 700; color: var(--navy-900);">${op.physicalStock} pcs</td>
        <td class="font-mono" style="font-weight: 800; font-size: 14.5px; color: ${diffColor};">${diffDisplay} pcs</td>
        <td style="color: var(--text-secondary); font-size: 12.5px;">${op.notes}</td>
        <td><span class="badge ${isMatch ? 'badge-match' : 'badge-mismatch'}">${op.status}</span></td>
        <td style="text-align: center; white-space: nowrap;">${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 5. RENDER BARANG MASUK (DENGAN FOTO TRACKING)
  // =========================================================================
  renderBarangMasuk() {
    const tbody = document.getElementById("barang-masuk-body");
    if (!tbody) return;

    const searchTerm = (document.getElementById("search-inbound")?.value || "").toLowerCase();

    const filtered = window.store.inbound.filter(i => {
      return i.docNo.toLowerCase().includes(searchTerm) ||
             i.supplier.toLowerCase().includes(searchTerm) ||
             i.productCode.toLowerCase().includes(searchTerm) ||
             i.productName.toLowerCase().includes(searchTerm);
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 30px;">Belum ada riwayat transaksi barang masuk.</td></tr>`;
      return;
    }

    filtered.forEach(item => {
      const prod = window.store.getProductByCode(item.productCode);
      const imgSrc = prod && prod.image ? prod.image : "assets/images/diamond_ring.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-mono">${this.formatDate(item.date)}</td>
        <td><span class="badge badge-gold font-mono">${item.docNo}</span></td>
        <td class="font-mono">${item.productCode}</td>
        <td>
          <div class="jewelry-cell">
            <div class="jewelry-thumb-sm" onclick="UI.openImageLightbox('${prod ? prod.id : ''}')" style="cursor: pointer;" title="Klik untuk lihat foto">
              <img src="${imgSrc}" alt="${item.productName}">
            </div>
            <span style="font-weight: 600; color: var(--navy-900);">${item.productName}</span>
          </div>
        </td>
        <td><span style="color: var(--text-secondary); font-weight: 500;">${item.supplier}</span></td>
        <td class="font-mono" style="color: var(--emerald-500); font-weight: 700;">+${item.qty} pcs</td>
        <td class="font-mono" style="color: var(--navy-800); font-weight: 600;">${item.totalWeight ? item.totalWeight.toFixed(2) + " g" : "-"}</td>
        <td style="font-size: 12.5px; color: var(--text-secondary);">${item.receiver}</td>
        <td><span class="badge badge-available">${item.condition}</span></td>
        <td style="color: var(--text-muted); font-size: 12px;">${item.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 6. RENDER BARANG KELUAR (DENGAN FOTO TRACKING)
  // =========================================================================
  renderBarangKeluar() {
    const tbody = document.getElementById("barang-keluar-body");
    if (!tbody) return;

    const searchTerm = (document.getElementById("search-outbound")?.value || "").toLowerCase();

    const filtered = window.store.outbound.filter(o => {
      return o.invoiceNo.toLowerCase().includes(searchTerm) ||
             o.productCode.toLowerCase().includes(searchTerm) ||
             o.productName.toLowerCase().includes(searchTerm) ||
             o.receivedBy.toLowerCase().includes(searchTerm);
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 30px;">Belum ada riwayat transaksi barang keluar.</td></tr>`;
      return;
    }

    filtered.forEach(item => {
      const prod = window.store.getProductByCode(item.productCode);
      const imgSrc = prod && prod.image ? prod.image : "assets/images/diamond_ring.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="font-mono">${this.formatDate(item.date)}</td>
        <td><span class="badge badge-gold font-mono">${item.invoiceNo}</span></td>
        <td class="font-mono">${item.productCode}</td>
        <td>
          <div class="jewelry-cell">
            <div class="jewelry-thumb-sm" onclick="UI.openImageLightbox('${prod ? prod.id : ''}')" style="cursor: pointer;" title="Klik untuk lihat foto">
              <img src="${imgSrc}" alt="${item.productName}">
            </div>
            <span style="font-weight: 600; color: var(--navy-900);">${item.productName}</span>
          </div>
        </td>
        <td class="font-mono" style="color: var(--ruby-500); font-weight: 700;">-${item.qty} pcs</td>
        <td class="font-mono" style="color: var(--navy-800); font-weight: 600;">${item.totalWeight ? item.totalWeight.toFixed(2) + " g" : "-"}</td>
        <td class="font-mono" style="color: var(--emerald-500); font-weight: 700;">${this.formatRupiah(item.sellPrice)}</td>
        <td style="font-size: 12.5px; color: var(--text-secondary);">${item.handedBy}</td>
        <td style="font-size: 12.5px; font-weight: 600; color: var(--navy-900);">${item.receivedBy}</td>
        <td style="color: var(--text-muted); font-size: 12px;">${item.notes}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // =========================================================================
  // 7. RENDER CHECKLIST OPERASIONAL HARIAN
  // =========================================================================
  renderChecklist() {
    const tbody = document.getElementById("checklist-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (window.store.checklists.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 30px;">Belum ada lembar checklist operasional harian.</td></tr>`;
      return;
    }

    window.store.checklists.forEach(chk => {
      const tr = document.createElement("tr");

      const makeCheckIcon = (isChecked, taskKey) => {
        return `
          <div style="display: flex; justify-content: center; cursor: pointer;" onclick="App.toggleChecklistTask('${chk.id}', '${taskKey}')" title="Klik untuk ubah status">
            <div class="custom-checkbox" style="width: 18px; height: 18px; ${isChecked ? 'background: var(--emerald-500); border-color: var(--emerald-500);' : 'background: #ffffff; border: 2px solid var(--border-navy);'}">
              ${isChecked ? '<span style="color: #fff; font-size: 12px; font-weight: bold;">✓</span>' : ''}
            </div>
          </div>
        `;
      };

      const isComplete = chk.status === "Lengkap";
      const statusBadge = isComplete 
        ? `<span class="badge badge-available">✓ Lengkap</span>`
        : `<span class="badge badge-low">Belum Lengkap</span>`;

      tr.innerHTML = `
        <td class="font-mono">${this.formatDate(chk.date)}</td>
        <td style="font-weight: 600; color: var(--navy-900);">${chk.employeeName}</td>
        <td>${makeCheckIcon(chk.checkInitialStock, 'checkInitialStock')}</td>
        <td>${makeCheckIcon(chk.checkInbound, 'checkInbound')}</td>
        <td>${makeCheckIcon(chk.checkOutbound, 'checkOutbound')}</td>
        <td>${makeCheckIcon(chk.checkPhysicalSystem, 'checkPhysicalSystem')}</td>
        <td>${makeCheckIcon(chk.tidyStorage, 'tidyStorage')}</td>
        <td>${makeCheckIcon(chk.dailyReport, 'dailyReport')}</td>
        <td style="color: var(--text-secondary); font-size: 12px;">${chk.notes}</td>
        <td>${statusBadge}</td>
      `;
      tbody.appendChild(tr);
    });
  }
};

window.UI = UI;
