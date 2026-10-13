/**
 * Barcode Engine (Code 39 Alphanumeric Generator) - Pure Vanilla JS
 * Menghasilkan barcode SVG standar yang 100% dapat dipindai (scannable) oleh barcode scanner fisik atau HP.
 */

const BarcodeEngine = {
  // Peta Kode Karakter Code 39 (1 = Wide element/3px, 0 = Narrow element/1px)
  CODE39_PATTERNS: {
    '0': "000110100", '1': "100100001", '2': "001100001", '3': "101100000", '4': "000110001",
    '5': "100110000", '6': "001110000", '7': "000100101", '8': "100100100", '9': "001100100",
    'A': "100001001", 'B': "001001001", 'C': "101001000", 'D': "000011001", 'E': "100011000",
    'F': "001011000", 'G': "000001101", 'H': "100001100", 'I': "001001100", 'J': "000011100",
    'K': "100000011", 'L': "001000011", 'M': "101000010", 'N': "000010011", 'O': "100010010",
    'P': "001010010", 'Q': "000000111", 'R': "100000110", 'S': "001000110", 'T': "000010110",
    'U': "110000001", 'V': "011000001", 'W': "111000000", 'X': "010010001", 'Y': "110010000",
    'Z': "011010000", '-': "010000101", '.': "110000100", ' ': "011000100", '$': "010101000",
    '/': "010100010", '+': "010001010", '%': "000101010", '*': "010010100"
  },

  // Auto-generate barcode & SKU unik berdasarkan kategori perhiasan
  generateUniqueBarcode(category = "Cincin") {
    const prefixMap = {
      "Cincin": "CCN",
      "Kalung": "KLG",
      "Gelang": "GLG",
      "Anting": "ATG",
      "Liontin": "LTN",
      "Logam Mulia": "LTM"
    };

    const prefix = prefixMap[category] || "GLD";
    // Format nomor acak 4 digit dan 3 digit unik
    const randKadar = ["750", "700", "375", "999"][Math.floor(Math.random() * 4)];
    const randSeq = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${randKadar}-${randSeq}`;
  },

  // Membuat string SVG barcode Code 39
  generateSVG(rawText, options = {}) {
    if (!rawText) return "";
    const text = String(rawText).toUpperCase().trim();
    const height = options.height || 45;
    const narrowWidth = options.narrowWidth || 1.8;
    const wideWidth = narrowWidth * 2.8;
    const gapWidth = narrowWidth;
    const showText = options.showText !== false;
    const color = options.color || "#111827";
    const bgColor = options.bgColor || "transparent";

    // Format dengan start/stop delimiter asterisk (*)
    const fullPattern = `*${text}*`;

    let currentX = 10;
    let rects = [];

    for (let i = 0; i < fullPattern.length; i++) {
      const char = fullPattern[i];
      const pattern = this.CODE39_PATTERNS[char] || this.CODE39_PATTERNS['-'];

      for (let j = 0; j < 9; j++) {
        const isBar = (j % 2 === 0);
        const isWide = pattern[j] === '1';
        const elementWidth = isWide ? wideWidth : narrowWidth;

        if (isBar) {
          rects.push(`<rect x="${currentX.toFixed(1)}" y="5" width="${elementWidth.toFixed(1)}" height="${height}" fill="${color}" />`);
        }

        currentX += elementWidth;
      }

      // Inter-character space
      currentX += gapWidth;
    }

    const totalWidth = Math.ceil(currentX + 10);
    const totalHeight = showText ? height + 24 : height + 10;

    let textElement = "";
    if (showText) {
      textElement = `<text x="${(totalWidth / 2).toFixed(1)}" y="${height + 19}" font-family="monospace" font-size="11" font-weight="600" fill="${color}" text-anchor="middle" letter-spacing="2">${text}</text>`;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="100%" height="${totalHeight}" style="background-color: ${bgColor}; display: block; max-width: ${totalWidth}px; margin: 0 auto;">
        ${rects.join("\n")}
        ${textElement}
      </svg>
    `;
  }
};

window.BarcodeEngine = BarcodeEngine;
