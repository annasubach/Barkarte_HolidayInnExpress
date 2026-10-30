/* =========================================================================
   QR-CODE-GENERATOR (eigenständig, ohne externe Bibliothek)
   -------------------------------------------------------------------------
   Erzeugt einen QR-Code nach ISO/IEC 18004 im Byte-Modus,
   Fehlerkorrektur-Level M (~15% wiederherstellbar), Versionen 1–10.

   Warum selbst gebaut und nicht als fertige Bibliothek eingebunden?
     1. Die Seite bleibt EINE Datei ohne Internet-Abhängigkeit. Lädt ein
        externes Skript nicht (Hotel-WLAN, Captive Portal), bliebe sonst
        die ganze Seite leer.
     2. Kein Aufruf an einen fremden Server = keine Übermittlung der
        Gäste-IP an Dritte = einfachere Datenschutzerklärung.
   ========================================================================= */
var QR = (function () {

  /* ---- Rechnen im Galois-Feld GF(256), Basis der Fehlerkorrektur ---- */
  var EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;           /* Primitivpolynom der QR-Norm */
    }
    for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
  })();

  function gmul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  /* Generatorpolynom für n Fehlerkorrektur-Codewörter */
  function genPoly(n) {
    var poly = [1];
    for (var i = 0; i < n; i++) {
      var next = new Array(poly.length + 1).fill(0);
      for (var j = 0; j < poly.length; j++) {
        next[j]     ^= poly[j];
        next[j + 1] ^= gmul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  /* Reed-Solomon: berechnet die Fehlerkorrektur-Codewörter zu einem Block */
  function ecc(data, ecLen) {
    var gen = genPoly(ecLen);
    var res = new Array(data.length + ecLen).fill(0);
    for (var i = 0; i < data.length; i++) res[i] = data[i];
    for (i = 0; i < data.length; i++) {
      var c = res[i];
      if (c !== 0) for (var j = 0; j < gen.length; j++) res[i + j] ^= gmul(gen[j], c);
    }
    return res.slice(data.length);
  }

  /* ---- Tabellen der QR-Norm für Fehlerkorrektur-Level M, Version 1–10 ----
     [ Datencodewörter gesamt, EC-Codewörter je Block,
       Blöcke Gruppe 1, Datenwörter je Block G1,
       Blöcke Gruppe 2, Datenwörter je Block G2 ]                          */
  var SPEC = {
    1:  [16,  10, 1, 16, 0,  0],
    2:  [28,  16, 1, 28, 0,  0],
    3:  [44,  26, 1, 44, 0,  0],
    4:  [64,  18, 2, 32, 0,  0],
    5:  [86,  24, 2, 43, 0,  0],
    6:  [108, 16, 4, 27, 0,  0],
    7:  [124, 18, 4, 31, 0,  0],
    8:  [154, 22, 2, 38, 2, 39],
    9:  [182, 22, 3, 36, 2, 37],
    10: [216, 26, 4, 43, 1, 44]
  };

  /* Mittelpunkte der Ausrichtungsmuster je Version */
  var ALIGN = {
    1: [], 2: [6,18], 3: [6,22], 4: [6,26], 5: [6,30],
    6: [6,34], 7: [6,22,38], 8: [6,24,42], 9: [6,26,46], 10: [6,28,50]
  };

  /* Versionsinformation (erst ab Version 7 im Code enthalten) */
  var VERINFO = { 7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3 };

  var PAD = [0xEC, 0x11];                  /* Füllbytes laut Norm */

  /* ------------------------- Text -> Bitfolge ------------------------- */
  function toBytes(str) {
    var out = [], enc = unescape(encodeURIComponent(str)); /* UTF-8 */
    for (var i = 0; i < enc.length; i++) out.push(enc.charCodeAt(i) & 0xFF);
    return out;
  }

  function buildData(bytes, version) {
    var spec = SPEC[version], totalData = spec[0];
    var bits = [];
    function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); }

    push(0b0100, 4);                               /* Modus: Byte */
    push(bytes.length, version < 10 ? 8 : 16);     /* Zeichenanzahl */
    for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

    var cap = totalData * 8;
    for (i = 0; i < 4 && bits.length < cap; i++) bits.push(0);   /* Abschluss */
    while (bits.length % 8 !== 0) bits.push(0);                  /* auf Byte auffüllen */

    var cw = [];
    for (i = 0; i < bits.length; i += 8) {
      var b = 0;
      for (var j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      cw.push(b);
    }
    for (i = 0; cw.length < totalData; i++) cw.push(PAD[i % 2]);
    return cw;
  }

  /* Blöcke bilden, Fehlerkorrektur rechnen, verschachteln (Norm-Reihenfolge) */
  function interleave(cw, version) {
    var s = SPEC[version], ecLen = s[1];
    var blocks = [], ecBlocks = [], pos = 0, i, j;

    for (i = 0; i < s[2]; i++) { blocks.push(cw.slice(pos, pos + s[3])); pos += s[3]; }
    for (i = 0; i < s[4]; i++) { blocks.push(cw.slice(pos, pos + s[5])); pos += s[5]; }
    for (i = 0; i < blocks.length; i++) ecBlocks.push(ecc(blocks[i], ecLen));

    var out = [], maxLen = Math.max(s[3], s[5]);
    for (i = 0; i < maxLen; i++)
      for (j = 0; j < blocks.length; j++)
        if (i < blocks[j].length) out.push(blocks[j][i]);
    for (i = 0; i < ecLen; i++)
      for (j = 0; j < ecBlocks.length; j++) out.push(ecBlocks[j][i]);

    return out;
  }

  /* ------------------------- Matrix aufbauen -------------------------- */
  function newMatrix(size) {
    var m = [], r;
    for (r = 0; r < size; r++) m.push(new Array(size).fill(null));
    return m;
  }

  function placeFunctions(m, version) {
    var size = m.length, i, j;

    function finder(r, c) {
      for (i = -1; i <= 7; i++) for (j = -1; j <= 7; j++) {
        var rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        var on = (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
                 (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
                 (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        m[rr][cc] = on ? 1 : 0;
      }
    }
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

    for (i = 8; i < size - 8; i++) {            /* Taktmuster */
      var v = (i % 2 === 0) ? 1 : 0;
      m[6][i] = v; m[i][6] = v;
    }

    var ac = ALIGN[version];                     /* Ausrichtungsmuster */
    for (var a = 0; a < ac.length; a++) for (var b = 0; b < ac.length; b++) {
      var r = ac[a], c = ac[b];
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
      for (i = -2; i <= 2; i++) for (j = -2; j <= 2; j++)
        m[r + i][c + j] = (Math.max(Math.abs(i), Math.abs(j)) !== 1) ? 1 : 0;
    }

    m[size - 8][8] = 1;                          /* immer dunkles Modul */

    for (i = 0; i <= 8; i++) {                   /* Formatbereich reservieren */
      if (m[8][i] === null) m[8][i] = 0;
      if (m[i][8] === null) m[i][8] = 0;
    }
    for (i = 0; i < 8; i++) {
      if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = 0;
      if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = 0;
    }

    if (version >= 7) {                          /* Versionsblöcke reservieren */
      for (i = 0; i < 6; i++) for (j = 0; j < 3; j++) {
        m[size - 11 + j][i] = 0; m[i][size - 11 + j] = 0;
      }
    }
  }

  /* Merkt sich, welche Felder Funktionsmuster sind (dort keine Daten) */
  function reservedMap(version, size) {
    var m = newMatrix(size);
    placeFunctions(m, version);
    var res = [];
    for (var r = 0; r < size; r++) {
      res.push([]);
      for (var c = 0; c < size; c++) res[r].push(m[r][c] !== null);
    }
    return res;
  }

  /* Datenbits im Zickzack von rechts unten nach oben einsetzen */
  function placeData(m, reserved, bits) {
    var size = m.length, idx = 0, up = true;
    for (var col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;                      /* Spalte 6 ist Taktmuster */
      for (var k = 0; k < size; k++) {
        var row = up ? size - 1 - k : k;
        for (var t = 0; t < 2; t++) {
          var c = col - t;
          if (reserved[row][c]) continue;
          m[row][c] = idx < bits.length ? bits[idx++] : 0;
        }
      }
      up = !up;
    }
  }

  /* Die 8 Maskenformeln der Norm */
  function maskFn(n, r, c) {
    switch (n) {
      case 0: return (r + c) % 2 === 0;
      case 1: return r % 2 === 0;
      case 2: return c % 3 === 0;
      case 3: return (r + c) % 3 === 0;
      case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
      case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
      case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
      case 7: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
    }
  }

  /* Bewertung laut Norm – die Maske mit der niedrigsten Strafe gewinnt */
  function penalty(m) {
    var size = m.length, score = 0, r, c, i;

    for (r = 0; r < size; r++) {                 /* Regel 1: Reihen/Spalten */
      var run = 1;
      for (c = 1; c < size; c++) {
        if (m[r][c] === m[r][c - 1]) { run++; }
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
    for (c = 0; c < size; c++) {
      run = 1;
      for (r = 1; r < size; r++) {
        if (m[r][c] === m[r - 1][c]) { run++; }
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }

    for (r = 0; r < size - 1; r++)                /* Regel 2: 2x2-Flächen */
      for (c = 0; c < size - 1; c++) {
        var v = m[r][c];
        if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
      }

    var p1 = [1,0,1,1,1,0,1,0,0,0,0], p2 = [0,0,0,0,1,0,1,1,1,0,1];
    function match(get, len, pat) {
      var hits = 0;
      for (var s = 0; s + pat.length <= len; s++) {
        var ok = true;
        for (var q = 0; q < pat.length; q++) if (get(s + q) !== pat[q]) { ok = false; break; }
        if (ok) hits++;
      }
      return hits;
    }
    for (r = 0; r < size; r++) {                  /* Regel 3: Störmuster */
      (function (rr) {
        score += 40 * (match(function (x) { return m[rr][x]; }, size, p1) +
                       match(function (x) { return m[rr][x]; }, size, p2));
      })(r);
    }
    for (c = 0; c < size; c++) {
      (function (cc) {
        score += 40 * (match(function (x) { return m[x][cc]; }, size, p1) +
                       match(function (x) { return m[x][cc]; }, size, p2));
      })(c);
    }

    var dark = 0;                                 /* Regel 4: Hell/Dunkel-Balance */
    for (r = 0; r < size; r++) for (c = 0; c < size; c++) if (m[r][c]) dark++;
    var pct = dark * 100 / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  /* Formatinformation: EC-Level M (Bits 00) + Maske, BCH-gesichert */
  function formatBits(mask) {
    var data = (0b00 << 3) | mask;
    var rem = data << 10;
    for (var i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= 0b10100110111 << (i - 10);
    return ((data << 10) | rem) ^ 0b101010000010010;
  }

  function placeFormat(m, mask) {
    var size = m.length, bits = formatBits(mask), i;
    /* bit(14) ist das höchstwertige Bit der 15 Formatbits */
    function bit(n) { return (bits >> n) & 1; }

    /* Erste Kopie rund um das linke obere Suchmuster */
    for (i = 0; i <= 5; i++) m[8][i] = bit(14 - i);   /* (8,0)=Bit14 … (8,5)=Bit9 */
    m[8][7] = bit(8);
    m[8][8] = bit(7);
    m[7][8] = bit(6);
    for (i = 0; i <= 5; i++) m[i][8] = bit(i);        /* (0,8)=Bit0 … (5,8)=Bit5 */

    /* Zweite Kopie, verteilt auf die beiden anderen Suchmuster */
    for (i = 0; i <= 6; i++) m[size - 1 - i][8] = bit(14 - i);
    for (i = 0; i <= 7; i++) m[8][size - 8 + i] = bit(7 - i);
  }

  function placeVersion(m, version) {
    if (version < 7) return;
    var size = m.length, bits = VERINFO[version];
    for (var i = 0; i < 18; i++) {
      var b = (bits >> i) & 1, r = Math.floor(i / 3), c = i % 3;
      m[size - 11 + c][r] = b;
      m[r][size - 11 + c] = b;
    }
  }

  /* --------------------------- Hauptfunktion --------------------------- */
  function make(text) {
    var minVersion = null, forceMask = null;
    var bytes = toBytes(text), version = 0;
    for (var v = minVersion || 1; v <= 10; v++) {
      var head = 4 + (v < 10 ? 8 : 16);
      if (bytes.length * 8 + head <= SPEC[v][0] * 8) { version = v; break; }
    }
    if (!version) throw new Error("Text zu lang für Version 10");

    var size = 17 + 4 * version;
    var cw = interleave(buildData(bytes, version), version);

    var bits = [];
    for (var i = 0; i < cw.length; i++)
      for (var j = 7; j >= 0; j--) bits.push((cw[i] >> j) & 1);

    var reserved = reservedMap(version, size);
    var best = null, bestScore = Infinity;

    for (var mask = 0; mask < 8; mask++) {
      if (forceMask != null && mask !== forceMask) continue;
      var m = newMatrix(size);
      placeFunctions(m, version);
      placeData(m, reserved, bits);
      for (var r = 0; r < size; r++) for (var c = 0; c < size; c++)
        if (!reserved[r][c] && maskFn(mask, r, c)) m[r][c] ^= 1;
      placeFormat(m, mask);
      placeVersion(m, version);
      var sc = penalty(m);
      if (sc < bestScore) { bestScore = sc; best = m; }
    }
    return best;
  }

  /* Erzeugt ein fertiges SVG (scharf auf jedem Display, auch im Druck) */
  function svg(text, opts) {
    opts = opts || {};
    var m = make(text), n = m.length, q = opts.quiet == null ? 4 : opts.quiet;
    var total = n + q * 2, path = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++)
      if (m[r][c]) path += "M" + (c + q) + " " + (r + q) + "h1v1h-1z";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total +
           '" shape-rendering="crispEdges" role="img" aria-label="QR-Code">' +
           '<rect width="' + total + '" height="' + total + '" fill="' + (opts.light || "#fff") + '"/>' +
           '<path d="' + path + '" fill="' + (opts.dark || "#000") + '"/></svg>';
  }

  return { make: make, svg: svg };
})();