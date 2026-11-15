/* Mumu product art — small kawaii SVG illustrations drawn in code,
   so the demo needs no photos. Replace with real product photos later:
   every place that calls MumuArt.svg(p) can become an <img src="...">. */
(function () {
  var INK = "#4b2b2e";
  var S = 'stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"';

  function face(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<circle cx="-9" cy="0" r="3" fill="' + INK + '"/><circle cx="9" cy="0" r="3" fill="' + INK + '"/>' +
      '<path d="M-4 5 q2 3 4 0 q2 3 4 0" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="-15" cy="6" rx="4" ry="2.6" fill="#f59ab9" opacity=".75"/><ellipse cx="15" cy="6" rx="4" ry="2.6" fill="#f59ab9" opacity=".75"/></g>';
  }
  function star(x, y, r, c) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r;
      p.push((x + Math.cos(a) * rr).toFixed(1) + "," + (y + Math.sin(a) * rr).toFixed(1));
    }
    return '<polygon points="' + p.join(" ") + '" fill="' + c + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>';
  }
  function heart(x, y, s, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 6 C-10 -2 -8 -10 -3 -10 C0 -10 0 -7 0 -6 C0 -7 0 -10 3 -10 C8 -10 10 -2 0 6Z" fill="' + c + '" stroke="' + INK + '" stroke-width="1.5"/>';
  }
  function ears(x, y, c) {
    return '<ellipse cx="' + (x - 14) + '" cy="' + y + '" rx="8" ry="18" fill="#fff" ' + S + '/><ellipse cx="' + (x - 14) + '" cy="' + (y + 2) + '" rx="3.5" ry="11" fill="' + c + '"/>' +
      '<ellipse cx="' + (x + 14) + '" cy="' + y + '" rx="8" ry="18" fill="#fff" ' + S + '/><ellipse cx="' + (x + 14) + '" cy="' + (y + 2) + '" rx="3.5" ry="11" fill="' + c + '"/>';
  }

  var D = {
    pen: function (c, a) {
      return '<g transform="rotate(-28 100 100)">' +
        '<rect x="84" y="40" width="32" height="112" rx="12" fill="' + c + '" ' + S + '/>' +
        '<rect x="84" y="40" width="32" height="34" rx="12" fill="' + a + '" ' + S + '/>' +
        '<rect x="113" y="46" width="7" height="40" rx="3.5" fill="#fff" ' + S + '/>' +
        '<path d="M88 152 L100 176 L112 152Z" fill="#fff" ' + S + '/><path d="M96 168 L100 176 L104 168Z" fill="' + INK + '"/>' +
        ears(100, 30, c) + face(100, 104, .9) + '</g>';
    },
    pencil: function (c, a) {
      return '<g transform="rotate(32 100 100)">' +
        '<rect x="86" y="36" width="28" height="104" rx="4" fill="' + c + '" ' + S + '/>' +
        '<line x1="95" y1="40" x2="95" y2="138" stroke="#fff" stroke-width="3" opacity=".7"/>' +
        '<rect x="84" y="24" width="32" height="16" rx="4" fill="#d9d2d4" ' + S + '/>' +
        '<rect x="84" y="10" width="32" height="16" rx="7" fill="' + a + '" ' + S + '/>' +
        '<path d="M86 140 L100 176 L114 140Z" fill="#f6dcbc" ' + S + '/><path d="M95 163 L100 176 L105 163Z" fill="' + INK + '"/>' +
        face(100, 92, .8) + '</g>';
    },
    notebook: function (c, a) {
      var rings = "";
      for (var i = 0; i < 6; i++) rings += '<rect x="50" y="' + (54 + i * 17) + '" width="16" height="6" rx="3" fill="#fff" ' + S + '/>';
      return '<rect x="56" y="40" width="96" height="124" rx="12" fill="' + c + '" ' + S + '/>' +
        '<rect x="70" y="40" width="82" height="124" rx="10" fill="' + c + '" stroke="none"/>' +
        '<rect x="80" y="64" width="58" height="26" rx="8" fill="#fff" ' + S + '/>' +
        '<line x1="88" y1="73" x2="130" y2="73" stroke="' + a + '" stroke-width="3" stroke-linecap="round"/><line x1="88" y1="81" x2="120" y2="81" stroke="' + a + '" stroke-width="3" stroke-linecap="round"/>' +
        rings + face(110, 124, 1) + heart(140, 150, .9, a) + star(132, 48, 7, "#f7cf62");
    },
    sticker: function (c, a) {
      return '<rect x="40" y="42" width="120" height="120" rx="16" fill="#fff" ' + S + ' transform="rotate(-6 100 100)"/>' +
        '<circle cx="80" cy="82" r="22" fill="' + c + '" ' + S + '/>' + face(80, 84, .7) +
        star(128, 74, 15, "#f7cf62") + heart(124, 130, 1.5, a) +
        '<circle cx="78" cy="132" r="15" fill="#fff" ' + S + '/><circle cx="72" cy="128" r="2.2" fill="' + INK + '"/><circle cx="84" cy="128" r="2.2" fill="' + INK + '"/>' +
        '<path d="M144 150 l12 -12 v12z" fill="#f3e6ea" ' + S + '/>';
    },
    washi: function (c, a) {
      var dots = "";
      for (var i = 0; i < 8; i++) { var an = i / 8 * Math.PI * 2; dots += '<circle cx="' + (100 + Math.cos(an) * 46).toFixed(1) + '" cy="' + (96 + Math.sin(an) * 46).toFixed(1) + '" r="4.5" fill="' + a + '"/>'; }
      return '<path d="M118 142 L176 152 L174 172 L114 160Z" fill="' + c + '" ' + S + '/>' +
        '<circle cx="100" cy="96" r="58" fill="' + c + '" ' + S + '/>' + dots +
        '<circle cx="100" cy="96" r="30" fill="#fff" ' + S + '/>' + face(100, 96, .8);
    },
    pouch: function (c, a) {
      return '<path d="M30 86 Q30 62 54 62 H146 Q170 62 170 86 V138 Q170 160 146 160 H54 Q30 160 30 138Z" fill="' + c + '" ' + S + '/>' +
        '<path d="M34 82 H166" stroke="' + INK + '" stroke-width="3" stroke-dasharray="6 5"/>' +
        '<rect x="136" y="72" width="12" height="24" rx="6" fill="' + a + '" ' + S + '/>' +
        ears(100, 54, a) + face(100, 116, 1.1) + star(56, 136, 7, "#f7cf62");
    },
    eraser: function (c, a) {
      return '<rect x="44" y="70" width="112" height="76" rx="18" fill="#fff" ' + S + '/>' +
        '<path d="M44 108 H156 V128 Q156 146 138 146 H62 Q44 146 44 128Z" fill="' + c + '" ' + S + '/>' +
        '<rect x="70" y="76" width="60" height="28" rx="8" fill="' + a + '" ' + S + '/>' +
        face(100, 126, 1) + star(150, 62, 9, "#f7cf62");
    },
    clips: function (c, a) {
      return '<g transform="rotate(-12 100 100)"><path d="M70 150 V62 Q70 44 86 44 Q102 44 102 62 V138 Q102 148 92 148 Q82 148 82 138 V70" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M70 150 V62 Q70 44 86 44 Q102 44 102 62 V138 Q102 148 92 148 Q82 148 82 138 V70" fill="none" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/></g>' +
        '<circle cx="132" cy="88" r="28" fill="' + a + '" ' + S + '/>' + face(132, 90, .8) +
        '<path d="M120 116 v42" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' + heart(150, 140, 1.2, c);
    },
    highlighter: function (c, a) {
      return '<g transform="rotate(-35 100 100)"><rect x="80" y="46" width="40" height="100" rx="10" fill="' + c + '" ' + S + '/>' +
        '<rect x="80" y="30" width="40" height="30" rx="10" fill="' + a + '" ' + S + '/>' +
        '<path d="M86 146 H114 L110 170 H92Z" fill="' + a + '" ' + S + '/>' + face(100, 104, .9) + '</g>' +
        '<path d="M120 170 q20 -6 44 -2" stroke="' + c + '" stroke-width="10" stroke-linecap="round" opacity=".6"/>';
    },
    giftset: function (c, a) {
      return '<rect x="46" y="86" width="108" height="78" rx="10" fill="' + c + '" ' + S + '/>' +
        '<rect x="40" y="70" width="120" height="24" rx="8" fill="' + a + '" ' + S + '/>' +
        '<rect x="92" y="70" width="16" height="94" fill="#fff" ' + S + '/>' +
        '<path d="M100 70 Q78 40 70 58 Q66 70 100 70 Q134 70 130 58 Q122 40 100 70Z" fill="#fff" ' + S + '/>' +
        face(70, 124, .8) + star(134, 124, 9, "#f7cf62");
    },
    bookmark: function (c, a) {
      return '<path d="M74 30 H126 V170 L100 150 L74 170Z" fill="' + c + '" ' + S + '/>' +
        '<circle cx="100" cy="74" r="18" fill="#fff" ' + S + '/>' + face(100, 76, .6) +
        heart(100, 116, 1.5, a) + '<path d="M100 30 q-6 -14 6 -18" fill="none" stroke="' + a + '" stroke-width="3"/>';
    }
  };

  function bg(c) {
    return '<rect width="200" height="200" fill="' + c + '"/>' +
      '<circle cx="28" cy="30" r="3" fill="#fff"/><circle cx="176" cy="40" r="2.5" fill="#fff"/><circle cx="170" cy="176" r="3" fill="#fff"/>' +
      '<path d="M30 168 l3 -8 l3 8 l-3 -2z" fill="#fff"/>';
  }

  window.MumuArt = {
    types: Object.keys(D),
    svg: function (p, label) {
      var art = p.art || { type: "notebook", c1: "#f48cb6", c2: "#f7cf62", bg: "#fdeef3" };
      var fn = D[art.type] || D.notebook;
      return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (label || p.name || "") + '">' +
        bg(art.bg || "#fdeef3") + fn(art.c1, art.c2) + '</svg>';
    }
  };
})();
