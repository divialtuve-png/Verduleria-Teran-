<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#16823b">
  <meta name="description" content="Verdulería Terán - verduras y productos frescos">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="icon" href="icon.svg">
  <title>Verdulería Terán</title>
  <style>
    :root{--green:#16823b;--dark:#12351f;--bg:#f5f8f4;--card:#fff;--muted:#66756b}
    *{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:#17231b}
    header{background:linear-gradient(135deg,#16823b,#25a653);color:white;padding:22px 18px 28px;border-radius:0 0 24px 24px}
    header h1{margin:0 0 5px;font-size:28px}header p{margin:0;opacity:.9}
    main{max-width:900px;margin:auto;padding:18px}.bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
    input,select,button{font:inherit}input,select{border:1px solid #d7dfd9;border-radius:12px;padding:12px;background:#fff}
    #search{flex:1;min-width:220px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
    .card{background:var(--card);border-radius:18px;padding:15px;box-shadow:0 3px 14px #17351b12}
    .emoji{font-size:42px}.name{font-weight:700;font-size:18px;margin:8px 0 4px}.unit{color:var(--muted);font-size:13px}
    .price{font-weight:800;color:var(--green);font-size:19px;margin:10px 0}.add{width:100%;border:0;border-radius:12px;padding:11px;background:var(--green);color:white;font-weight:700}
    .empty{text-align:center;color:var(--muted);padding:35px}.cart{position:sticky;bottom:12px;margin-top:20px;background:var(--dark);color:#fff;border-radius:18px;padding:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
    .cart button{background:#fff;color:var(--dark);border:0;border-radius:12px;padding:10px 14px;font-weight:700}
    .cart-panel{margin-top:12px;background:#fff;border-radius:16px;padding:12px;box-shadow:0 3px 12px rgba(0,0,0,.06)}
    .cart-item{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #eef2ef}
    .remove-btn{background:#f3f7f4;border:0;color:#333;padding:5px 8px;border-radius:8px}
    footer{text-align:center;color:var(--muted);font-size:12px;padding:24px}
  </style>
</head>
<body>
  <header>
    <h1>🥬 Verdulería Terán</h1>
    <p>Verduras frescas para tu hogar</p>
  </header>
  <main>
    <div class="bar">
      <input id="search" placeholder="Buscar verdura...">
      <select id="category">
        <option value="">Todas</option>
        <option>Verduras</option>
        <option>Frutas</option>
        <option>Hierbas</option>
        <option>Otros</option>
      </select>
    </div>

    <section id="products" class="grid"></section>

    <div id="cart" class="cart" hidden>
      <div>
        <strong>🛒 <span id="count">0</span> productos</strong><br>
        <span id="total">S/ 0.00</span>
      </div>
      <button onclick="showOrder()">Ver pedido</button>
    </div>

    <div class="cart-panel" id="cart-panel" hidden>
      <div id="cart-items"></div>
      <div class="cart-item" style="font-weight:700; border-bottom:none; margin-top:8px;">
        <span>Total</span>
        <span id="cart-total">S/ 0.00</span>
      </div>
    </div>
  </main>
  <footer>San Borja · San Luis · San Isidro · La Victoria<br>Yape · Plin · Transferencia · Contra entrega</footer>
  <script src="config.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="app.js"></script>
</body>
</html>
