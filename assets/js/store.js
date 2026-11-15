/* Mumu demo store — everything lives in the browser's localStorage so the
   demo works with no server. In the Django build each function here maps to
   a view / model method (noted in comments). */
(function () {
  var KEY = "mumu_db", mem = {};
  var ls = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return mem[k] == null ? null : mem[k]; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };
  var ss = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return mem["s_" + k] || null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { mem["s_" + k] = v; } },
    del: function (k) { try { window.sessionStorage.removeItem(k); } catch (e) { delete mem["s_" + k]; } }
  };
  function read(k, d) { try { var v = ls.get(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function write(k, v) { ls.set(k, JSON.stringify(v)); }

  var M = window.Mumu = {};
  M.ls = ls; M.ss = ss;
  M.base = (document.currentScript && document.currentScript.dataset.base) || "";

  /* ---------- database ---------- */
  M.db = function () {
    var db = read(KEY, null);
    if (!db || db.version !== MUMU_SEED.version) { db = JSON.parse(JSON.stringify(MUMU_SEED)); write(KEY, db); }
    return db;
  };
  M.save = function (db) { write(KEY, db); };
  M.resetDemo = function () { ls.del(KEY); ls.del("mumu_cart"); ls.del("mumu_wish"); ls.del("mumu_user"); ls.del("mumu_admin"); };
  M.product = function (id, db) { db = db || M.db(); id = +id; return db.products.filter(function (p) { return p.id === id; })[0]; };
  M.category = function (id, db) { db = db || M.db(); return db.categories.filter(function (c) { return c.id === id; })[0] || { name: id }; };
  M.stockState = function (p) { return p.stock <= 0 ? "out" : (p.stock <= p.low ? "low" : "ok"); };

  /* ---------- helpers ---------- */
  M.money = function (n) { return "₹" + Number(n || 0).toLocaleString("en-IN"); };
  M.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  M.date = function (t, withTime) {
    var d = new Date(t), o = { day: "numeric", month: "short" };
    if (withTime) { o.hour = "numeric"; o.minute = "2-digit"; }
    return d.toLocaleString("en-IN", o);
  };
  M.ago = function (t) {
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return "just now"; if (m < 60) return m + " min ago";
    var h = Math.round(m / 60); if (h < 24) return h + " h ago";
    var d = Math.round(h / 24); return d + (d === 1 ? " day ago" : " days ago");
  };
  // Query params. Saved to sessionStorage on click too, in case a host strips the query string.
  M.param = function (name) {
    var q = new URLSearchParams(location.search);
    if (q.has(name)) return q.get(name);
    var saved = ss.get("mumu_q:" + location.pathname.split("/").pop());
    return saved ? new URLSearchParams(saved).get(name) : null;
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href"), i = href.indexOf("?");
    if (i > -1 && !/^(https?:|mailto:|tel:)/.test(href)) {
      var page = href.slice(0, i).split("/").pop();
      ss.set("mumu_q:" + page, href.slice(i + 1).split("#")[0]);
    }
  }, true);
  M.go = function (href) {
    var i = href.indexOf("?");
    if (i > -1) ss.set("mumu_q:" + href.slice(0, i).split("/").pop(), href.slice(i + 1));
    location.href = href;
  };
  M.toast = function (msg) {
    var t = document.getElementById("mumuToast");
    if (!t) { t = document.createElement("div"); t.id = "mumuToast"; t.className = "mumu-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2200);
  };
  M.flash = function (msg) { ss.set("mumu_flash", msg); };
  M.showFlash = function () { var f = ss.get("mumu_flash"); if (f) { ss.del("mumu_flash"); setTimeout(function () { M.toast(f); }, 150); } };

  M.STATUS = {
    new: { label: "New", icon: "bi-stars" }, contacted: { label: "Contacted", icon: "bi-whatsapp" },
    confirmed: { label: "Confirmed", icon: "bi-check2-circle" }, packed: { label: "Packed", icon: "bi-box-seam" },
    shipped: { label: "Shipped", icon: "bi-truck" }, delivered: { label: "Delivered", icon: "bi-house-heart" },
    cancelled: { label: "Cancelled", icon: "bi-x-circle" }
  };
  M.statusPill = function (s) { var x = M.STATUS[s] || { label: s, icon: "bi-dot" }; return '<span class="pill pill-' + s + '"><i class="bi ' + x.icon + '"></i>' + x.label + "</span>"; };
  M.payPill = function (s) { return s === "paid" ? '<span class="pill pill-paid"><i class="bi bi-check-circle"></i>Paid</span>' : '<span class="pill pill-unpaid"><i class="bi bi-hourglass-split"></i>Unpaid</span>'; };
  M.stockPill = function (p) {
    var s = M.stockState(p);
    if (s === "out") return '<span class="pill pill-out"><i class="bi bi-x-octagon"></i>Out of stock</span>';
    if (s === "low") return '<span class="pill pill-low"><i class="bi bi-exclamation-triangle"></i>Low · ' + p.stock + "</span>";
    return '<span class="pill pill-ok"><i class="bi bi-check2"></i>' + p.stock + " in stock</span>";
  };
  M.waLink = function (phone, text) { return "https://wa.me/91" + String(phone).replace(/\D/g, "").slice(-10) + "?text=" + encodeURIComponent(text || ""); };
  M.STORE_WA = "9876500000";

  /* ---------- customer session (Google sign-in in the real build) ---------- */
  M.user = function () { return read("mumu_user", null); };
  M.signIn = function (u) { write("mumu_user", u); };
  M.signOut = function () { ls.del("mumu_user"); };

  /* ---------- cart ---------- */
  M.cart = function () { return read("mumu_cart", []); };
  M.setCart = function (c) { write("mumu_cart", c); M.refreshBadges(); };
  M.cartCount = function () { return M.cart().reduce(function (s, i) { return s + i.qty; }, 0); };
  M.addToCart = function (id, qty) {
    var p = M.product(id); qty = qty || 1;
    if (!p || p.stock <= 0) { M.toast("Sorry, this one is sold out 🥺"); return false; }
    var c = M.cart(), line = c.filter(function (l) { return l.id === p.id; })[0];
    var want = (line ? line.qty : 0) + qty;
    if (want > p.stock) { want = p.stock; M.toast("Only " + p.stock + " left — added what we have!"); }
    else M.toast("Added to cart 🛍️");
    if (line) line.qty = want; else c.push({ id: p.id, qty: want });
    M.setCart(c); return true;
  };
  M.cartLines = function () {
    var db = M.db();
    return M.cart().map(function (l) { var p = M.product(l.id, db); return p ? { p: p, qty: l.qty } : null; }).filter(Boolean);
  };
  M.totals = function (lines) {
    var sub = lines.reduce(function (s, l) { return s + l.p.price * l.qty; }, 0);
    var ship = sub === 0 || sub >= 499 ? 0 : 49;
    return { sub: sub, ship: ship, total: sub + ship, freeGap: Math.max(0, 499 - sub) };
  };

  /* ---------- wishlist (needs an account) ---------- */
  M.wish = function () { var u = M.user(); return u ? read("mumu_wish_" + u.email, []) : []; };
  M.isWished = function (id) { return M.wish().indexOf(+id) > -1; };
  M.toggleWish = function (id) {
    var u = M.user(); id = +id;
    if (!u) { M.go(M.base + "login.html?reason=wishlist&add=" + id + "&next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search)); return null; }
    var w = M.wish(), i = w.indexOf(id);
    if (i > -1) w.splice(i, 1); else w.push(id);
    write("mumu_wish_" + u.email, w); M.refreshBadges();
    M.toast(i > -1 ? "Removed from wishlist" : "Saved to your wishlist 💖");
    return i === -1;
  };

  /* ---------- orders ---------- */
  // Django: OrderCreateView — inside transaction.atomic(), select_for_update() each product,
  // check stock, decrement with F('stock') - qty, create Order + OrderItems.
  M.placeOrder = function (info) {
    var db = M.db(), lines = M.cart(), problems = [];
    lines.forEach(function (l) {
      var p = M.product(l.id, db);
      if (!p || !p.active) problems.push("An item is no longer available.");
      else if (p.stock < l.qty) problems.push(p.stock === 0 ? p.name + " just sold out." : "Only " + p.stock + " of " + p.name + " left.");
    });
    if (problems.length) return { ok: false, problems: problems };
    var items = lines.map(function (l) { var p = M.product(l.id, db); p.stock -= l.qty; return { id: p.id, name: p.name, price: p.price, qty: l.qty }; });
    var sub = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0), ship = sub >= 499 ? 0 : 49;
    var id = "MUMU-" + db.nextOrder++;
    var u = M.user();
    db.orders.unshift({
      id: id, at: Date.now(), status: "new", payment: "unpaid",
      customer: { name: info.name, phone: info.phone, email: info.email || (u && u.email) || "", guest: !u },
      address: info.address, items: items, subtotal: sub, shipping: ship, total: sub + ship, note: info.note || "",
      courier: "", adminNote: "", stockReturned: false, history: [{ at: Date.now(), text: "Order placed on website" + (u ? "" : " (guest)") }]
    });
    M.save(db); M.setCart([]);
    var mine = read("mumu_myorders", []); mine.unshift(id); write("mumu_myorders", mine);
    return { ok: true, id: id };
  };
  M.myOrders = function () {
    var db = M.db(), u = M.user(), ids = read("mumu_myorders", []);
    return db.orders.filter(function (o) { return ids.indexOf(o.id) > -1 || (u && o.customer.email === u.email); });
  };

  /* ---------- shop UI pieces ---------- */
  M.productCard = function (p) {
    var out = p.stock <= 0, wished = M.isWished(p.id), off = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    var badge = out ? "" : (off ? '<span class="badge-cute sale">−' + off + "%</span>" : (p.tags.indexOf("new") > -1 ? '<span class="badge-cute">New ✨</span>' : (p.tags.indexOf("bestseller") > -1 ? '<span class="badge-cute">Loved 💗</span>' : "")));
    var note = out ? '<span class="stock-note out">Sold out</span>' : (p.stock <= p.low ? '<span class="stock-note low">Only ' + p.stock + " left!</span>" : "");
    var href = M.base + "product.html?id=" + p.id;
    return '<div class="p-card' + (out ? " soldout" : "") + '">' + badge +
      '<button class="wish' + (wished ? " on" : "") + '" data-wish="' + p.id + '" aria-label="Save to wishlist" aria-pressed="' + wished + '"><i class="bi bi-heart"></i></button>' +
      '<a class="thumb" href="' + href + '">' + MumuArt.svg(p) + (out ? '<div class="soldout-tag"><span>Sold out</span></div>' : "") + "</a>" +
      '<div class="body"><span class="cat">' + M.esc(M.category(p.cat).name) + '</span><a class="name" href="' + href + '">' + M.esc(p.name) + "</a>" +
      '<div class="d-flex align-items-center justify-content-between mt-auto pt-2"><div><span class="price">' + M.money(p.price) + "</span>" + (p.mrp > p.price ? '<span class="mrp">' + M.money(p.mrp) + "</span>" : "") + "<div>" + note + "</div></div>" +
      (out ? '<button class="btn btn-soft btn-icon" disabled aria-label="Sold out"><i class="bi bi-bag-x"></i></button>' : '<button class="btn btn-pink btn-icon" data-add="' + p.id + '" aria-label="Add ' + M.esc(p.name) + ' to cart"><i class="bi bi-bag-plus"></i></button>') +
      "</div></div></div>";
  };
  // One delegated handler for every add / wish button on the shop pages.
  document.addEventListener("click", function (e) {
    var add = e.target.closest && e.target.closest("[data-add]");
    if (add) { e.preventDefault(); M.addToCart(+add.dataset.add, 1); return; }
    var w = e.target.closest && e.target.closest("[data-wish]");
    if (w) {
      e.preventDefault(); var on = M.toggleWish(+w.dataset.wish);
      if (on !== null) { w.classList.toggle("on", on); w.setAttribute("aria-pressed", on); document.dispatchEvent(new CustomEvent("mumu:wish")); }
    }
  });

  M.refreshBadges = function () {
    var c = M.cartCount(), w = M.wish().length;
    document.querySelectorAll("[data-badge=cart]").forEach(function (el) { el.textContent = c; el.hidden = !c; });
    document.querySelectorAll("[data-badge=wish]").forEach(function (el) { el.textContent = w; el.hidden = !w; });
  };

  var DRIP = '<svg class="drip" viewBox="0 0 1200 38" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 H1200 V14 C1150 30 1120 10 1080 20 C1040 32 1020 38 1000 22 C960 6 920 30 880 24 C840 18 820 6 780 18 C740 30 700 34 660 20 C620 6 590 26 560 24 C520 22 500 8 460 16 C420 26 400 36 360 24 C320 12 300 4 260 18 C220 32 190 30 160 18 C120 4 90 24 60 22 C30 20 15 10 0 14Z" fill="#f48cb6"/></svg>';
  M.DRIP = DRIP;

  M.shell = function (active) {
    var b = M.base, u = M.user();
    var links = [["index.html", "Home", "bi-house-heart", "home"], ["shop.html", "Shop", "bi-grid", "shop"], ["wishlist.html", "Wishlist", "bi-heart", "wishlist"], ["cart.html", "Cart", "bi-bag", "cart"], ["account.html", u ? "Me" : "Account", "bi-person", "account"]];
    var head = '<div class="announce">🌸 Free shipping on orders above ₹499 · We confirm every order on WhatsApp 💬</div>' +
      '<header class="mumu-topbar"><div class="container py-2 d-flex align-items-center gap-2">' +
      '<a class="brand me-auto me-lg-4" href="' + b + 'index.html"><img src="' + b + 'assets/img/logo.png" alt=""><span><b>Mumu</b><small>The Creative Store</small></span></a>' +
      '<nav class="d-none d-lg-flex gap-1 me-auto"><a class="nav-link' + (active === "home" ? " active" : "") + '" href="' + b + 'index.html">Home</a><a class="nav-link' + (active === "shop" ? " active" : "") + '" href="' + b + 'shop.html">Shop all</a><a class="nav-link" href="' + b + 'shop.html?tag=new">New in</a><a class="nav-link" href="' + b + 'shop.html?cat=gifts">Gift sets</a></nav>' +
      '<a class="icon-btn" href="' + b + 'shop.html#search" aria-label="Search"><i class="bi bi-search"></i></a>' +
      '<a class="icon-btn d-none d-lg-inline-grid" href="' + b + 'wishlist.html" aria-label="Wishlist"><i class="bi bi-heart"></i><span class="dot" data-badge="wish" hidden></span></a>' +
      '<a class="icon-btn d-none d-lg-inline-grid" href="' + b + 'cart.html" aria-label="Cart"><i class="bi bi-bag"></i><span class="dot" data-badge="cart" hidden></span></a>' +
      '<a class="icon-btn d-none d-lg-inline-grid" href="' + b + 'account.html" aria-label="Account"><i class="bi ' + (u ? "bi-person-check" : "bi-person") + '"></i></a>' +
      "</div></header>";
    var tab = '<nav class="tabbar" aria-label="Main">' + links.map(function (l) {
      var badge = l[3] === "cart" ? '<span class="dot" data-badge="cart" hidden></span>' : (l[3] === "wishlist" ? '<span class="dot" data-badge="wish" hidden></span>' : "");
      return '<a href="' + b + l[0] + '"' + (active === l[3] ? ' class="active" aria-current="page"' : "") + '><i class="bi ' + l[2] + (active === l[3] && l[3] !== "shop" ? "-fill" : "") + '"></i>' + l[1] + badge + "</a>";
    }).join("") + "</nav>";
    var foot = '<footer class="mumu-footer">' + '<svg class="drip-top" viewBox="0 0 1200 34" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34 V18 C60 4 90 30 140 22 C200 12 220 0 280 12 C340 24 360 34 420 20 C480 6 520 14 560 24 C620 36 660 10 720 14 C780 18 800 32 860 26 C920 20 940 4 1000 10 C1060 16 1100 30 1160 20 L1200 16 V34Z" fill="#f48cb6"/></svg>' +
      '<div class="container py-4"><div class="row g-4"><div class="col-12 col-md-5"><div class="d-flex align-items-center gap-2 mb-2"><img src="' + b + 'assets/img/logo.png" width="52" alt=""><span class="font-cute fs-4 text-white">Mumu</span></div><p class="mb-2 small fw-bold">Cute, cheerful, creative stationery — packed with love and a little sticker in every order. 🐰</p></div>' +
      '<div class="col-6 col-md-3"><div class="fw-bold mb-2">Shop</div><div class="d-grid gap-1 small"><a href="' + b + 'shop.html?cat=pens">Pens</a><a href="' + b + 'shop.html?cat=notebooks">Notebooks</a><a href="' + b + 'shop.html?cat=stickers">Stickers</a><a href="' + b + 'shop.html?cat=washi">Washi tapes</a></div></div>' +
      '<div class="col-6 col-md-4"><div class="fw-bold mb-2">Help</div><div class="d-grid gap-1 small"><a href="' + b + 'account.html#track">Track my order</a><a href="' + M.waLink(M.STORE_WA, "Hi Mumu! ") + '"><i class="bi bi-whatsapp"></i> WhatsApp +91 ' + M.STORE_WA + '</a><a href="' + b + 'admin/login.html">Store admin</a></div></div></div>' +
      '<div class="small mt-4 opacity-75">© 2026 Mumu — The Creative Store · Demo build</div></div></footer>';
    document.getElementById("shellTop").outerHTML = head;
    var f = document.getElementById("shellFoot"); if (f) f.outerHTML = foot + tab; else document.body.insertAdjacentHTML("beforeend", tab);
    M.refreshBadges(); M.showFlash();
  };

  M.googleIcon = '<svg class="google-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
})();
