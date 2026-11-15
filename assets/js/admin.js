/* Admin shell + sign-in guard. Django: @staff_member_required on every admin view. */
(function () {
  var M = window.Mumu;
  M.ADMIN = { email: "admin@mumu.in", password: "mumu123" };
  M.admin = function () { try { return JSON.parse(M.ls.get("mumu_admin") || "null"); } catch (e) { return null; } };

  M.requireAdmin = function () {
    if (!M.admin()) { location.replace("login.html"); throw new Error("not signed in"); }
  };

  M.alertCount = function (db) { return db.products.filter(function (p) { return p.active && p.stock <= p.low; }).length; };

  M.adminShell = function (active, title) {
    M.requireAdmin();
    var db = M.db(), a = M.admin();
    var newOrders = db.orders.filter(function (o) { return o.status === "new"; }).length, alerts = M.alertCount(db);
    var nav = [
      ["index.html", "Dashboard", "bi-grid-1x2", "dash", ""],
      ["orders.html", "Orders", "bi-bag-check", "orders", newOrders ? newOrders + " new" : ""],
      ["products.html", "Products", "bi-box2-heart", "products", ""],
      ["stock.html", "Stock alerts", "bi-exclamation-triangle", "stock", alerts || ""],
      ["customers.html", "Customers", "bi-people", "customers", ""]
    ];
    document.getElementById("side").outerHTML = '<aside class="admin-side"><a class="brand" href="index.html"><img src="../assets/img/logo.png" alt=""><span><b>Mumu</b><small>Store admin</small></span></a>' +
      '<nav class="nav flex-column gap-1">' + nav.map(function (n) {
        return '<a class="nav-link' + (active === n[3] ? " active" : "") + '" href="' + n[0] + '"' + (active === n[3] ? ' aria-current="page"' : "") + '><i class="bi ' + n[2] + '"></i>' + n[1] + (n[4] ? '<span class="count">' + n[4] + "</span>" : "") + "</a>";
      }).join("") + '</nav><div class="mt-auto d-grid gap-1"><a class="nav-link" href="../index.html"><i class="bi bi-shop"></i>View shop</a><a class="nav-link" href="#" data-logout><i class="bi bi-box-arrow-left"></i>Sign out</a></div></aside>';
    document.getElementById("top").outerHTML = '<header class="admin-top"><a href="index.html" class="m-only"><img src="../assets/img/logo.png" alt="Mumu admin"></a>' +
      '<h1 class="h5 mb-0 flex-grow-1 text-truncate">' + title + "</h1>" +
      '<a class="icon-btn m-only" href="stock.html" aria-label="Stock alerts"><i class="bi bi-bell"></i>' + (alerts ? '<span class="dot">' + alerts + "</span>" : "") + "</a>" +
      '<a class="btn btn-soft btn-sm d-none d-lg-inline-flex" href="../index.html"><i class="bi bi-shop me-1"></i> View shop</a>' +
      '<span class="d-none d-lg-flex align-items-center gap-2 small fw-bold"><span class="icon-btn" style="width:36px;height:36px"><i class="bi bi-person"></i></span>' + M.esc(a.email) + "</span>" +
      '<a class="icon-btn m-only" href="#" data-logout aria-label="Sign out"><i class="bi bi-box-arrow-right"></i></a></header>';
    var tabs = [["index.html", "Home", "bi-grid-1x2", "dash"], ["orders.html", "Orders", "bi-bag-check", "orders", newOrders], ["products.html", "Products", "bi-box2-heart", "products"], ["stock.html", "Alerts", "bi-exclamation-triangle", "stock", alerts], ["customers.html", "Customers", "bi-people", "customers"]];
    document.body.insertAdjacentHTML("beforeend", '<nav class="tabbar" aria-label="Admin">' + tabs.map(function (t) {
      return '<a href="' + t[0] + '"' + (active === t[3] ? ' class="active" aria-current="page"' : "") + '><i class="bi ' + t[2] + (active === t[3] ? "-fill" : "") + '"></i>' + t[1] + (t[4] ? '<span class="dot">' + t[4] + "</span>" : "") + "</a>";
    }).join("") + "</nav>");
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-logout]")) { e.preventDefault(); M.ls.del("mumu_admin"); location.href = "login.html"; }
    });
    M.showFlash();
    return db;
  };

  // Render rows as a table on md+ and as cards on phones from the same data.
  M.responsiveList = function (el, opts) {
    var rows = opts.rows;
    if (!rows.length) { el.innerHTML = '<div class="card-cute"><div class="empty py-4"><p class="fw-bold text-ink-soft mb-0">' + (opts.empty || "Nothing here.") + "</p></div></div>"; return; }
    el.innerHTML =
      '<div class="card-cute d-none d-md-block"><div class="table-responsive"><table class="table table-cute"><thead><tr>' +
      opts.cols.map(function (c) { return '<th class="' + (c.cls || "") + '">' + c.label + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) { return '<tr class="row-link" data-href="' + opts.href(r) + '">' + opts.cols.map(function (c) { return '<td class="' + (c.cls || "") + '">' + c.cell(r) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></div>" +
      '<div class="d-md-none">' + rows.map(function (r) { return '<a class="m-card" href="' + opts.href(r) + '">' + opts.card(r) + "</a>"; }).join("") + "</div>";
    el.querySelectorAll("tr[data-href]").forEach(function (tr) {
      tr.addEventListener("click", function (e) { if (!e.target.closest("a,button,input,select")) M.go(tr.dataset.href); });
    });
  };
})();
