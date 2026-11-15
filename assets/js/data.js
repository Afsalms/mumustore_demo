/* Demo seed data. In the real build this comes from the database. */
window.MUMU_SEED = (function () {
  var C = { pink: "#f7a8c8", peach: "#ffc6a8", mint: "#bfe8d6", sky: "#bfe0f7", lilac: "#dccbf5", butter: "#fde59a", berry: "#f78b9b", white: "#ffffff" };
  var BG = { pink: "#fdeef3", mint: "#eaf8f1", sky: "#eaf4fc", lilac: "#f3edfc", butter: "#fff8e1", peach: "#fff1e8" };

  var categories = [
    { id: "pens", name: "Pens & Gel Pens", art: "pen", c1: C.pink, c2: C.butter },
    { id: "pencils", name: "Pencils", art: "pencil", c1: C.mint, c2: C.pink },
    { id: "notebooks", name: "Notebooks & Journals", art: "notebook", c1: C.lilac, c2: C.pink },
    { id: "stickers", name: "Stickers", art: "sticker", c1: C.peach, c2: C.berry },
    { id: "washi", name: "Washi Tapes", art: "washi", c1: C.sky, c2: C.pink },
    { id: "pouches", name: "Pencil Pouches", art: "pouch", c1: C.pink, c2: C.lilac },
    { id: "erasers", name: "Erasers", art: "eraser", c1: C.mint, c2: C.butter },
    { id: "highlighters", name: "Highlighters", art: "highlighter", c1: C.butter, c2: C.pink },
    { id: "desk", name: "Desk Accessories", art: "clips", c1: C.sky, c2: C.pink },
    { id: "gifts", name: "Gift Sets", art: "giftset", c1: C.pink, c2: C.lilac }
  ];

  var themes = ["Bunny", "Strawberry", "Cloud", "Bear", "Sakura", "Kitten"];

  function P(id, name, cat, theme, price, mrp, stock, art, c1, c2, bg, tags, desc) {
    return { id: id, sku: "MU-" + String(id).padStart(4, "0"), name: name, cat: cat, theme: theme, price: price, mrp: mrp, stock: stock, low: 5, active: true,
      tags: tags || [], art: { type: art, c1: C[c1], c2: C[c2], bg: BG[bg] }, desc: desc, created: Date.now() - (60 - id) * 86400000 };
  }

  var products = [
    P(1, "Bunny Hug Gel Pen", "pens", "Bunny", 49, 69, 42, "pen", "pink", "butter", "pink", ["bestseller"], "Smooth 0.5mm black gel ink in a squishy bunny-eared barrel. Writes like a dream, looks like a cuddle."),
    P(2, "Strawberry Milk Gel Pen Set (6)", "pens", "Strawberry", 249, 299, 18, "pen", "berry", "pink", "pink", ["new"], "Six pastel ink colours with tiny strawberry clips. Perfect for colour-coded notes."),
    P(3, "Cloud Puff Ballpoint", "pens", "Cloud", 39, 0, 3, "pen", "sky", "white", "sky", [], "A light, fluffy-blue ballpoint with a cloud cap. Blue ink, 0.7mm."),
    P(4, "Kitten Click Pen", "pens", "Kitten", 59, 79, 0, "pen", "lilac", "pink", "lilac", [], "Retractable click pen with a sleepy kitten face. Lilac barrel, black ink."),
    P(5, "Sakura HB Pencil Pack (5)", "pencils", "Sakura", 99, 129, 30, "pencil", "pink", "mint", "pink", ["bestseller"], "Five HB pencils printed with falling cherry blossoms, with pink erasers on top."),
    P(6, "Mint Bear Mechanical Pencil", "pencils", "Bear", 129, 0, 4, "pencil", "mint", "peach", "mint", ["new"], "0.5mm mechanical pencil with a non-slip grip and a little bear charm."),
    P(7, "Bunny Dot Grid Journal A5", "notebooks", "Bunny", 299, 349, 15, "notebook", "pink", "berry", "pink", ["bestseller"], "120 pages of 100gsm dot-grid paper. Lay-flat binding, bunny embossed cover."),
    P(8, "Cloud Dream Spiral Notebook", "notebooks", "Cloud", 179, 0, 22, "notebook", "sky", "pink", "sky", [], "A5 ruled spiral notebook with a dreamy cloud cover. 80 sheets."),
    P(9, "Lilac Kitten Mini Diary", "notebooks", "Kitten", 149, 199, 2, "notebook", "lilac", "pink", "lilac", [], "Pocket-sized undated diary with a ribbon marker and kitten doodles inside."),
    P(10, "Strawberry Planner 2027", "notebooks", "Strawberry", 449, 549, 0, "notebook", "berry", "butter", "pink", ["new"], "Weekly planner for 2027 with monthly spreads, habit trackers and sticker pages."),
    P(11, "Kawaii Sticker Sheet Mix (10)", "stickers", "Bunny", 99, 0, 60, "sticker", "pink", "berry", "peach", ["bestseller"], "Ten sheets of glossy kawaii stickers — bunnies, clouds, hearts and stars."),
    P(12, "Bear Café Sticker Flakes", "stickers", "Bear", 79, 99, 25, "sticker", "peach", "pink", "peach", [], "45 die-cut sticker flakes of bears running a tiny café."),
    P(13, "Holo Star Sticker Pack", "stickers", "Cloud", 89, 0, 5, "sticker", "lilac", "butter", "lilac", ["new"], "Holographic star and sparkle stickers that shimmer in the light."),
    P(14, "Pastel Washi Tape Set (5)", "washi", "Sakura", 199, 249, 20, "washi", "pink", "white", "pink", ["bestseller"], "Five rolls of pastel washi tape, 15mm × 5m each. Tearable and repositionable."),
    P(15, "Cloud Washi Tape", "washi", "Cloud", 59, 0, 1, "washi", "sky", "white", "sky", [], "One roll of sky-blue tape with puffy cloud prints."),
    P(16, "Strawberry Field Washi", "washi", "Strawberry", 69, 0, 14, "washi", "berry", "mint", "pink", [], "Little strawberries and leaves on a cream base. 15mm × 5m."),
    P(17, "Bunny Plush Pencil Pouch", "pouches", "Bunny", 349, 449, 9, "pouch", "pink", "pink", "pink", ["bestseller"], "Soft plush pouch with bunny ears and a zip that fits 20+ pens."),
    P(18, "Lilac Kitten Pencil Case", "pouches", "Kitten", 279, 0, 0, "pouch", "lilac", "pink", "lilac", [], "Canvas pencil case with a kitten patch and inner pocket."),
    P(19, "Mint Bear Pencil Pouch", "pouches", "Bear", 299, 0, 7, "pouch", "mint", "peach", "mint", ["new"], "Water-resistant pouch with a bear face and two compartments."),
    P(20, "Mochi Eraser Trio", "erasers", "Bunny", 69, 0, 35, "eraser", "pink", "butter", "pink", [], "Three squishy mochi-shaped erasers that erase cleanly without smudging."),
    P(21, "Strawberry Scented Eraser", "erasers", "Strawberry", 35, 0, 4, "eraser", "berry", "mint", "pink", [], "Smells like strawberry milk. Dust-free formula."),
    P(22, "Pastel Highlighter Set (6)", "highlighters", "Sakura", 229, 279, 16, "highlighter", "butter", "pink", "butter", ["bestseller"], "Six soft pastel highlighters with chisel tips. No bleed-through."),
    P(23, "Bunny Mild Liner Duo", "highlighters", "Bunny", 89, 0, 3, "highlighter", "pink", "lilac", "pink", [], "Dual-tip highlighter: chisel and fine. Bunny pink."),
    P(24, "Heart Paper Clips (20)", "desk", "Sakura", 79, 0, 40, "clips", "pink", "berry", "pink", [], "Twenty heart-topped paper clips in pink and red."),
    P(25, "Cloud Sticky Note Pad", "desk", "Cloud", 69, 89, 12, "clips", "sky", "white", "sky", [], "Cloud-shaped sticky notes, 100 sheets."),
    P(26, "Bunny Bookmark Set (4)", "desk", "Bunny", 99, 0, 0, "bookmark", "pink", "berry", "pink", [], "Four laminated bookmarks with tassels and bunny illustrations."),
    P(27, "Mumu Starter Gift Box", "gifts", "Bunny", 799, 999, 6, "giftset", "pink", "lilac", "pink", ["bestseller"], "Gel pens, washi tapes, a journal and stickers in a gift box with a handwritten note."),
    P(28, "Strawberry Study Kit", "gifts", "Strawberry", 599, 699, 2, "giftset", "berry", "butter", "pink", ["new"], "Planner, pens, highlighters and an eraser — all strawberry themed.")
  ];

  // Seed orders spread over the last 10 days.
  var names = [["Ananya Iyer", "9876543210", "Kochi", "Kerala", "682016"], ["Riya Menon", "9847012345", "Thrissur", "Kerala", "680001"],
    ["Fatima Shaikh", "9820098200", "Mumbai", "Maharashtra", "400050"], ["Sneha Reddy", "9900112233", "Bengaluru", "Karnataka", "560034"],
    ["Aisha Rahman", "9746123456", "Kozhikode", "Kerala", "673001"], ["Meera Nair", "9895567890", "Thiruvananthapuram", "Kerala", "695001"],
    ["Diya Kapoor", "9811122233", "New Delhi", "Delhi", "110017"], ["Nila Thomas", "9745001122", "Kottayam", "Kerala", "686001"]];
  var plan = [
    [0, "new", "unpaid", [[1, 2], [11, 1], [14, 1]]],
    [0, "new", "unpaid", [[27, 1]]],
    [0, "contacted", "unpaid", [[7, 1], [5, 1]]],
    [1, "confirmed", "paid", [[17, 1], [20, 2]]],
    [1, "packed", "paid", [[22, 1], [24, 2], [12, 1]]],
    [2, "shipped", "paid", [[2, 1], [8, 2]]],
    [3, "shipped", "paid", [[28, 1]]],
    [3, "delivered", "paid", [[14, 2], [16, 1], [11, 2]]],
    [4, "cancelled", "unpaid", [[10, 1]]],
    [5, "delivered", "paid", [[19, 1], [6, 1]]],
    [6, "delivered", "paid", [[27, 1], [3, 2]]],
    [7, "delivered", "paid", [[13, 3], [21, 2], [9, 1]]],
    [8, "delivered", "paid", [[7, 2]]],
    [9, "delivered", "paid", [[22, 1], [1, 3], [25, 1]]]
  ];
  var byId = {}; products.forEach(function (p) { byId[p.id] = p; });
  var orders = plan.map(function (o, i) {
    var cu = names[i % names.length];
    var at = Date.now() - o[0] * 86400000 - (i * 37 % 300) * 60000 - 3600000;
    var items = o[3].map(function (it) { var p = byId[it[0]]; return { id: p.id, name: p.name, price: p.price, qty: it[1] }; });
    var sub = items.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
    var ship = sub >= 499 ? 0 : 49;
    var hist = [{ at: at, text: "Order placed on website" }];
    var flow = ["contacted", "confirmed", "packed", "shipped", "delivered"];
    var stop = flow.indexOf(o[1]);
    for (var k = 0; k <= stop; k++) hist.push({ at: at + (k + 1) * 4 * 3600000, text: "Status → " + flow[k][0].toUpperCase() + flow[k].slice(1) });
    if (o[1] === "cancelled") hist.push({ at: at + 2 * 3600000, text: "Cancelled — customer changed mind. Stock returned." });
    return {
      id: "MUMU-" + (1001 + plan.length - 1 - i), at: at, status: o[1], payment: o[2],
      customer: { name: cu[0], phone: cu[1], email: cu[0].split(" ")[0].toLowerCase() + "@example.com", guest: i % 3 === 0 },
      address: { line1: (12 + i) + ", Rose Garden Apartments", line2: "MG Road", landmark: "Near City Library", city: cu[2], state: cu[3], pin: cu[4] },
      items: items, subtotal: sub, shipping: ship, total: sub + ship, note: i === 1 ? "Please gift wrap 🎀" : "",
      courier: o[1] === "shipped" || o[1] === "delivered" ? "India Post · EK" + (552100 + i) + "IN" : "", adminNote: "", stockReturned: o[1] === "cancelled", history: hist
    };
  });

  return { version: 3, categories: categories, themes: themes, products: products, orders: orders, nextOrder: 1001 + plan.length };
})();
