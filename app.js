/* =========================================================
   VERDULERÍA TERÁN
   APP COMPLETA - VERSIÓN LIMPIA
========================================================= */

const client = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

const BUSINESS_WHATSAPP = "51983130700";

const products = [];
let cart = [];
let currentCategory = "";
let currentPayment = "";

/* =========================================================
   ESTILOS
========================================================= */

const style = document.createElement("style");

style.textContent = `
*{
  box-sizing:border-box;
}

html{
  scroll-behavior:smooth;
}

body{
  margin:0;
  background:#fffaf5;
  color:#222;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
}

button,
input,
textarea,
select{
  font-family:inherit;
}

button{
  cursor:pointer;
}

.app-shell{
  min-height:100vh;
  padding-bottom:100px;
}

/* =========================================================
   BARRA SUPERIOR
========================================================= */

.topbar{
  position:sticky;
  top:0;
  z-index:1000;
  background:#fff;
  height:82px;
  padding:9px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow:0 3px 15px rgba(0,0,0,.12);
}

.brand-mini{
  display:flex;
  align-items:center;
  gap:9px;
}

.logo-mini{
  width:50px;
  height:50px;
  border-radius:15px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#43a047,#8bc34a);
  box-shadow:0 4px 12px rgba(67,160,71,.25);
}

.logo-mini svg{
  width:34px;
  height:34px;
}

.brand-mini-text strong{
  display:block;
  font-size:15px;
  color:#222;
}

.brand-mini-text span{
  display:block;
  font-size:11px;
  color:#888;
}

.cart-top{
  display:flex;
  align-items:center;
  gap:9px;
}

.cart-picture-wrap{
  position:relative;
}

.cart-picture{
  width:55px;
  height:55px;
  border-radius:16px;
  object-fit:cover;
  display:block;
}

.cart-zero{
  position:absolute;
  top:-5px;
  right:-6px;
  min-width:23px;
  height:23px;
  padding:0 6px;
  border-radius:50px;
  background:#f52255;
  color:#fff;
  font-size:12px;
  font-weight:800;
  display:flex;
  align-items:center;
  justify-content:center;
  border:2px solid #fff;
}

.cart-top-info strong{
  display:block;
  font-size:14px;
}

.cart-top-info span{
  display:block;
  font-size:11px;
  color:#888;
}

.cart-top-total{
  margin-left:3px;
  padding:10px 13px;
  border-radius:20px;
  background:#e83269;
  color:#fff;
  font-size:15px;
  font-weight:800;
  white-space:nowrap;
}

/* =========================================================
   CONTENIDO
========================================================= */

.content{
  max-width:1200px;
  margin:auto;
  padding:15px;
}

/* =========================================================
   HERO
========================================================= */

.hero{
  min-height:245px;
  border-radius:25px;
  overflow:hidden;
  position:relative;
  background-image:
    linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.12)),
    url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200");
  background-size:cover;
  background-position:center;
  display:flex;
  align-items:center;
  padding:30px 25px;
  color:#fff;
  box-shadow:0 8px 25px rgba(0,0,0,.12);
}

.hero-content{
  max-width:650px;
}

.hero-logo{
  width:60px;
  height:60px;
  margin-bottom:7px;
}

.hero h1{
  margin:0;
  font-size:38px;
  line-height:1;
  font-weight:900;
  letter-spacing:-1px;
}

.hero h1 span{
  color:#ff9f1c;
}

.hero p{
  margin:13px 0 5px;
  font-size:17px;
  font-weight:500;
}

.hero-delivery{
  font-size:13px !important;
  opacity:.95;
}

/* =========================================================
   BUSCADOR
========================================================= */

.search-box{
  margin:18px 0 14px;
  position:relative;
}

.search-box input{
  width:100%;
  height:53px;
  padding:0 18px 0 49px;
  border:2px solid #eeeeee;
  border-radius:17px;
  background:#fff;
  font-size:16px;
  outline:none;
  box-shadow:0 4px 14px rgba(0,0,0,.06);
}

.search-box input:focus{
  border-color:#ff8a00;
}

.search-icon{
  position:absolute;
  left:17px;
  top:14px;
  font-size:22px;
}

/* =========================================================
   CATEGORÍAS
========================================================= */

.category-row{
  display:flex;
  gap:9px;
  overflow-x:auto;
  padding:3px 1px 17px;
  scrollbar-width:none;
}

.category-row::-webkit-scrollbar{
  display:none;
}

.category-button{
  flex:0 0 auto;
  border:2px solid #eee;
  background:#fff;
  color:#333;
  padding:10px 16px;
  border-radius:24px;
  font-size:14px;
  font-weight:800;
  box-shadow:0 3px 10px rgba(0,0,0,.06);
}

.category-button.active{
  color:#fff;
  border-color:#43a047;
  background:#43a047;
}

.category-button:nth-child(2).active{
  background:#43a047;
  border-color:#43a047;
}

.category-button:nth-child(3).active{
  background:#ff7043;
  border-color:#ff7043;
}

.category-button:nth-child(4).active{
  background:#8e44ad;
  border-color:#8e44ad;
}

.category-button:nth-child(5).active{
  background:#0097a7;
  border-color:#0097a7;
}

/* =========================================================
   TITULO PRODUCTOS
========================================================= */

.section-heading{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin:5px 0 15px;
}

.section-heading h2{
  margin:0;
  font-size:24px;
  font-weight:900;
}

.fresh-label{
  background:#ffca28;
  color:#4d3b00;
  padding:7px 10px;
  border-radius:15px;
  font-size:11px;
  font-weight:900;
}

/* =========================================================
   PRODUCTOS
========================================================= */

.products-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:13px;
}

.product-card{
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  border:1px solid #eeeeee;
  box-shadow:0 5px 16px rgba(0,0,0,.08);
}

.product-image-wrap{
  position:relative;
  background:#f4f4f4;
}

.product-image{
  display:block;
  width:100%;
  height:145px;
  object-fit:cover;
}

.product-emoji{
  position:absolute;
  top:8px;
  left:8px;
  width:35px;
  height:35px;
  border-radius:12px;
  background:rgba(255,255,255,.92);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
}

.product-info{
  padding:12px;
}

.product-name{
  font-size:15px;
  font-weight:900;
  line-height:1.15;
  min-height:35px;
}

.product-unit{
  margin-top:4px;
  color:#888;
  font-size:11px;
}

.product-price{
  margin-top:8px;
  font-size:18px;
  font-weight:900;
}

.add-button{
  width:100%;
  border:0;
  margin-top:9px;
  padding:11px 7px;
  border-radius:12px;
  color:#fff;
  background:#43a047;
  font-weight:900;
  font-size:14px;
}

.product-card:nth-child(4n+2) .add-button{
  background:#e91e63;
}

.product-card:nth-child(4n+3) .add-button{
  background:#8e44ad;
}

.product-card:nth-child(4n+4) .add-button{
  background:#ff7a00;
}

.quantity-control{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-top:9px;
  gap:5px;
}

.quantity-control button{
  width:34px;
  height:34px;
  border:0;
  border-radius:10px;
  background:#eeeeee;
  font-size:20px;
  font-weight:900;
}

.quantity-control .quantity{
  font-size:16px;
  font-weight:900;
}

/* =========================================================
   CARGA / ERROR
========================================================= */

.status-box{
  grid-column:1/-1;
  background:#fff;
  border-radius:18px;
  padding:30px 18px;
  text-align:center;
  color:#666;
  box-shadow:0 4px 15px rgba(0,0,0,.06);
}

.status-box.error{
  color:#b3261e;
}

/* =========================================================
   BANNER FRUTAS
========================================================= */

.fruits-banner{
  margin:26px 0;
  min-height:165px;
  border-radius:24px;
  overflow:hidden;
  position:relative;
  color:#fff;
  display:flex;
  align-items:center;
  padding:25px;
  background-image:
    linear-gradient(90deg,rgba(0,0,0,.60),rgba(0,0,0,.08)),
    url("https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1000");
  background-size:cover;
  background-position:center;
}

.fruits-banner h2{
  margin:0 0 7px;
  font-size:27px;
  line-height:1.1;
}

.fruits-banner p{
  margin:0;
  font-size:15px;
}

/* =========================================================
   CARRITO
========================================================= */

.cart-panel{
  position:fixed;
  left:12px;
  right:12px;
  bottom:88px;
  z-index:900;
  background:#fff;
  border-radius:22px;
  padding:17px;
  box-shadow:0 8px 30px rgba(0,0,0,.22);
  max-height:70vh;
  overflow:auto;
}

.cart-panel.hidden{
  display:none;
}

.cart-panel-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:10px;
}

.cart-panel-header h2{
  margin:0;
  font-size:21px;
}

.close-cart{
  width:34px;
  height:34px;
  border:0;
  border-radius:50%;
  background:#eee;
  font-size:20px;
}

.cart-empty{
  text-align:center;
  padding:20px;
  color:#777;
}

.cart-line{
  display:flex;
  align-items:center;
  gap:9px;
  padding:9px 0;
  border-bottom:1px solid #eee;
}

.cart-line-image{
  width:48px;
  height:48px;
  border-radius:12px;
  object-fit:cover;
}

.cart-line-main{
  flex:1;
}

.cart-line-name{
  font-weight:800;
  font-size:14px;
}

.cart-line-price{
  font-size:12px;
  color:#777;
}

.cart-line-controls{
  display:flex;
  align-items:center;
  gap:5px;
}

.cart-line-controls button{
  width:29px;
  height:29px;
  border:0;
  border-radius:8px;
  background:#eee;
  font-weight:900;
}

.cart-total-row{
  display:flex;
  justify-content:space-between;
  margin-top:14px;
  font-size:19px;
  font-weight:900;
}

.cart-order-button{
  width:100%;
  margin-top:12px;
  padding:14px;
  border:0;
  border-radius:14px;
  background:#e83269;
  color:#fff;
  font-size:16px;
  font-weight:900;
}

/* =========================================================
   FORMULARIO
========================================================= */

.checkout{
  margin:25px 0;
  background:#fff;
  border-radius:24px;
  padding:22px;
  box-shadow:0 5px 20px rgba(0,0,0,.08);
}

.checkout h2{
  margin:0 0 18px;
  font-size:25px;
}

.form-input,
.form-textarea{
  width:100%;
  border:2px solid #e4e4e4;
  border-radius:15px;
  padding:14px;
  font-size:16px;
  outline:none;
  margin-bottom:10px;
  background:#fff;
}

.form-input:focus,
.form-textarea:focus{
  border-color:#43a047;
}

.form-textarea{
  min-height:85px;
  resize:vertical;
}

.primary-button{
  width:100%;
  border:0;
  border-radius:15px;
  padding:14px;
  background:#43a047;
  color:#fff;
  font-size:16px;
  font-weight:900;
}

/* =========================================================
   PAGOS
========================================================= */

.payment-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin:10px 0 15px;
}

.payment-button{
  min-height:70px;
  border:2px solid #eee;
  border-radius:15px;
  background:#fff;
  font-size:14px;
  font-weight:900;
}

.payment-button.selected{
  border-color:#43a047;
  background:#e8f5e9;
}

.payment-summary{
  background:#fff8e1;
  border-radius:15px;
  padding:14px;
  margin:12px 0;
}

.whatsapp-button{
  width:100%;
  margin-top:10px;
  border:0;
  border-radius:15px;
  padding:14px;
  background:#25d366;
  color:#fff;
  font-size:16px;
  font-weight:900;
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

.bottom-nav{
  position:fixed;
  left:0;
  right:0;
  bottom:0;
  height:75px;
  z-index:1000;
  background:#fff;
  display:flex;
  justify-content:space-around;
  align-items:flex-end;
  padding:7px 5px 8px;
  box-shadow:0 -4px 18px rgba(0,0,0,.12);
}

.nav-button{
  border:0;
  background:transparent;
  color:#777;
  min-width:62px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:2px;
  font-size:10px;
  font-weight:700;
}

.nav-icon{
  font-size:21px;
}

.nav-cart{
  width:57px;
  height:57px;
  margin-top:-30px;
  border-radius:50%;
  border:0;
  background:#43a047;
  color:#fff;
  box-shadow:0 6px 18px rgba(67,160,71,.42);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  font-size:10px;
  font-weight:900;
}

.nav-cart .nav-icon{
  font-size:21px;
}

/* =========================================================
   MODALES INFORMATIVOS
========================================================= */

.info-message{
  background:#fff;
  border-radius:20px;
  padding:22px;
  box-shadow:0 5px 20px rgba(0,0,0,.08);
  margin:20px 0;
  text-align:center;
}

.info-message button{
  margin-top:12px;
  border:0;
  border-radius:13px;
  padding:12px 20px;
  background:#43a047;
  color:#fff;
  font-weight:800;
}

/* =========================================================
   DESKTOP
========================================================= */

@media(min-width:700px){

  .products-grid{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }

  .product-image{
    height:180px;
  }

  .content{
    padding:22px;
  }

  .hero{
    min-height:300px;
  }
}
`;

document.head.appendChild(style);

/* =========================================================
   LOGO SVG
========================================================= */

const LOGO_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#66bb6a"/>
      <stop offset="1" stop-color="#2e7d32"/>
    </linearGradient>
  </defs>
  <path
    d="M48 87C47 66 47 43 56 23"
    stroke="#fff"
    stroke-width="7"
    stroke-linecap="round"
    fill="none"
  />
  <path
    d="M51 51C29 50 15 38 13 18C34 17 49 28 51 51Z"
    fill="url(#lg)"
  />
  <path
    d="M52 42C57 20 73 10 91 12C91 32 77 45 52 42Z"
    fill="#8bc34a"
  />
  <path
    d="M50 65C29 67 15 57 10 40C31 37 46 47 50 65Z"
    fill="#43a047"
  />
</svg>
`;

/* =========================================================
   LIMPIAR ESTRUCTURA ANTIGUA
========================================================= */

function clearOldLayout(){

  const oldHeader = document.querySelector("body > header");

  const oldMain = document.querySelector("body > main");

  if(oldHeader){
    oldHeader.remove();
  }

  if(oldMain){
    oldMain.remove();
  }

  document
    .querySelectorAll(".app-shell")
    .forEach(el => el.remove());

  document
    .querySelectorAll(".bottom-nav")
    .forEach(el => el.remove());

  document
    .querySelectorAll(".topbar")
    .forEach(el => el.remove());
}

/* =========================================================
   CREAR ESTRUCTURA
========================================================= */

function createApp(){

  clearOldLayout();

  const shell = document.createElement("div");

  shell.className = "app-shell";

  shell.innerHTML = `

    <div class="topbar">

      <div class="brand-mini">

        <div class="logo-mini">
          ${LOGO_SVG}
        </div>

        <div class="brand-mini-text">
          <strong>Verdulería Terán</strong>
          <span>Productos frescos</span>
        </div>

      </div>

      <div class="cart-top">

        <div class="cart-picture-wrap">

          <img
            class="cart-picture"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"
            alt="Carrito con verduras"
          >

          <span
            class="cart-zero"
            id="cart-badge"
          >0</span>

        </div>

        <div class="cart-top-info">
          <strong>Mi carrito</strong>
          <span id="cart-count-text">0 productos</span>
        </div>

        <div
          class="cart-top-total"
          id="cart-total-top"
        >
          S/ 0.00
        </div>

      </div>

    </div>

    <main class="content">

      <section class="hero">

        <div class="hero-content">

          <div class="hero-logo">
            ${LOGO_SVG}
          </div>

          <h1>
            Verdulería <span>Terán</span>
          </h1>

          <p>
            Productos frescos directo a tu hogar
          </p>

          <p class="hero-delivery">
            🚚 San Borja · San Luis · San Isidro · La Victoria
          </p>

        </div>

      </section>

      <div class="search-box">

        <span class="search-icon">🔎</span>

        <input
          id="new-search"
          type="search"
          placeholder="Buscar producto..."
          autocomplete="off"
        >

      </div>

      <div
        id="categories"
        class="category-row"
      ></div>

      <div class="section-heading">

        <h2>Nuestros productos</h2>

        <span class="fresh-label">
          FRESCOS
        </span>

      </div>

      <section
        id="new-products"
        class="products-grid"
      >
        <div class="status-box">
          Cargando productos...
        </div>
      </section>

      <section class="fruits-banner">

        <div>
          <h2>🍎 Frutas frescas y de temporada</h2>
          <p>
            Seleccionamos productos frescos para tu hogar.
          </p>
        </div>

      </section>

      <section
        id="checkout-area"
      ></section>

    </main>

    <div
      id="cart-panel"
      class="cart-panel hidden"
    ></div>

    <nav class="bottom-nav">

      <button
        class="nav-button"
        onclick="goHome()"
      >
        <span class="nav-icon">🏠</span>
        <span>Inicio</span>
      </button>

      <button
        class="nav-button"
        onclick="goCategories()"
      >
        <span class="nav-icon">🗂️</span>
        <span>Categorías</span>
      </button>

      <button
        class="nav-cart"
        onclick="toggleCart()"
      >
        <span class="nav-icon">🛒</span>
        <span>Carrito</span>
      </button>

      <button
        class="nav-button"
        onclick="showOrders()"
      >
        <span class="nav-icon">📦</span>
        <span>Mis pedidos</span>
      </button>

      <button
        class="nav-button"
        onclick="showAccount()"
      >
        <span class="nav-icon">👤</span>
        <span>Mi cuenta</span>
      </button>

    </nav>
  `;

  document.body.appendChild(shell);

  createCategories();

  setupSearch();

  updateCartUI();

  loadProducts();
}

/* =========================================================
   CATEGORÍAS
========================================================= */

function createCategories(){

  const container =
    document.getElementById("categories");

  if(!container) return;

  const categories = [
    ["Todos",""],
    ["Verduras","Verduras"],
    ["Frutas","Frutas"],
    ["Tubérculos","Tubérculos"],
    ["Hierbas","Hierbas"]
  ];

  container.innerHTML = "";

  categories.forEach(([label,value]) => {

    const button =
      document.createElement("button");

    button.className =
      "category-button";

    button.textContent = label;

    if(value === currentCategory){
      button.classList.add("active");
    }

    button.addEventListener(
      "click",
      () => {

        currentCategory = value;

        document
          .querySelectorAll(".category-button")
          .forEach(b =>
            b.classList.remove("active")
          );

        button.classList.add("active");

        renderProducts();

      }
    );

    container.appendChild(button);
  });
}

/* =========================================================
   IMÁGENES
========================================================= */

const PRODUCT_IMAGES = {

  papa:[
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600"
  ],

  tomate:[
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600"
  ],

  cebolla:[
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600"
  ],

  zanahoria:[
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600"
  ],

  limon:[
    "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600"
  ],

  lechuga:[
    "https://images.unsplash.com/photo-1622205313162-be1d5712a43b?w=600"
  ],

  brocoli:[
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600"
  ],

  platano:[
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600"
  ],

  manzana:[
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600"
  ],

  naranja:[
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=600"
  ],

  uva:[
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600"
  ],

  fresa:[
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600"
  ],

  pepino:[
    "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600"
  ],

  pimiento:[
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600"
  ],

  aji:[
    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600"
  ],

  palta:[
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600"
  ],

  espinaca:[
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600"
  ],

  coliflor:[
    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600"
  ],

  zapallo:[
    "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600"
  ],

  beterraga:[
    "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=600"
  ]

};

const GENERAL_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
];

function getProductImage(name){

  const n =
    cleanName(name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"");

  for(const key in PRODUCT_IMAGES){

    if(n.includes(key)){
      return PRODUCT_IMAGES[key][0];
    }
  }

  let hash = 0;

  for(let i=0;i<n.length;i++){
    hash += n.charCodeAt(i);
  }

  return GENERAL_IMAGES[
    Math.abs(hash) % GENERAL_IMAGES.length
  ];
}

/* =========================================================
   EMOJIS
========================================================= */

function getProductEmoji(name){

  const n =
    cleanName(name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"");

  if(n.includes("papa")) return "🥔";
  if(n.includes("tomate")) return "🍅";
  if(n.includes("cebolla")) return "🧅";
  if(n.includes("zanahoria")) return "🥕";
  if(n.includes("limon")) return "🍋";
  if(n.includes("lechuga")) return "🥬";
  if(n.includes("brocoli")) return "🥦";
  if(n.includes("platano")) return "🍌";
  if(n.includes("manzana")) return "🍎";
  if(n.includes("naranja")) return "🍊";
  if(n.includes("uva")) return "🍇";
  if(n.includes("fresa")) return "🍓";
  if(n.includes("pepino")) return "🥒";
  if(n.includes("pimiento")) return "🫑";
  if(n.includes("aji")) return "🌶️";
  if(n.includes("palta")) return "🥑";
  if(n.includes("espinaca")) return "🥬";
  if(n.includes("coliflor")) return "🥦";
  if(n.includes("zapallo")) return "🎃";
  if(n.includes("beterraga")) return "🫜";

  return "🥕";
}

function cleanName(name){

  return String(name || "")
    .replace(/^[🌱🥬🍅🥕🍋🍎🍌🌿🧅🥦🍊🍉🍇🍓🥔🫑🌶️🥒🥑🎃🫜]+/g,"")
    .trim();
}

/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function loadProducts(){

  const section =
    document.getElementById("new-products");

  if(!section) return;

  section.innerHTML = `
    <div class="status-box">
      Cargando productos...
    </div>
  `;

  try{

    const result = await Promise.race([

      client
        .from("productos")
        .select("*")
        .eq("activo",true)
        .order("id"),

      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              data:null,
              error:new Error(
                "Tiempo de espera agotado."
              )
            }),
          12000
        )
      )

    ]);

    const { data,error } = result;

    if(error){
      throw error;
    }

    if(!Array.isArray(data)){
      throw new Error(
        "Supabase no devolvió productos."
      );
    }

    products.length = 0;

    data.forEach(p => {

      products.push({

        id:p.id,

        name:p.nombre,

        category:p.categoria,

        unit:p.unidad,

        price:Number(p.precio) || 0,

        active:p.activo

      });

    });

    renderProducts();

  }catch(error){

    console.error(
      "Error cargando productos:",
      error
    );

    section.innerHTML = `
      <div class="status-box error">

        <strong>
          No se pudieron cargar los productos.
        </strong>

        <br><br>

        Revisa la conexión con Supabase.

        <br><br>

        <button
          class="primary-button"
          onclick="loadProducts()"
        >
          Intentar nuevamente
        </button>

      </div>
    `;
  }
}

/* =========================================================
   MOSTRAR PRODUCTOS
========================================================= */

function renderProducts(){

  const section =
    document.getElementById("new-products");

  if(!section) return;

  const search =
    (
      document.getElementById("new-search")?.value || ""
    )
      .toLowerCase()
      .trim();

  const filtered =
    products.filter(product => {

      const name =
        cleanName(product.name)
          .toLowerCase();

      const category =
        String(product.category || "");

      const matchesSearch =
        !search ||
        name.includes(search);

      const matchesCategory =
        !currentCategory ||
        category === currentCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  section.innerHTML = "";

  if(filtered.length === 0){

    section.innerHTML = `
      <div class="status-box">
        No encontramos productos.
      </div>
    `;

    return;
  }

  filtered.forEach(product => {

    const item =
      cart.find(
        p => p.id === product.id
      );

    const card =
      document.createElement("article");

    card.className =
      "product-card";

    card.innerHTML = `

      <div class="product-image-wrap">

        <img
          class="product-image"
          src="${getProductImage(product.name)}"
          alt="${cleanName(product.name)}"
          loading="lazy"
          onerror="this.src='${GENERAL_IMAGES[0]}'"
        >

        <div class="product-emoji">
          ${getProductEmoji(product.name)}
        </div>

      </div>

      <div class="product-info">

        <div class="product-name">
          ${cleanName(product.name)}
        </div>

        <div class="product-unit">
          ${product.unit || "Unidad"}
        </div>

        <div class="product-price">
          S/ ${product.price.toFixed(2)}
        </div>

        ${
          item
          ? `
            <div class="quantity-control">

              <button
                onclick="decreaseProduct(${product.id})"
              >
                −
              </button>

              <span class="quantity">
                ${item.quantity}
              </span>

              <button
                onclick="increaseProduct(${product.id})"
              >
                +
              </button>

            </div>
          `
          : `
            <button
              class="add-button"
              onclick="addProduct(${product.id})"
            >
              🛒 Agregar
            </button>
          `
        }

      </div>
    `;

    section.appendChild(card);
  });
}

/* =========================================================
   BUSCADOR
========================================================= */

function setupSearch(){

  const input =
    document.getElementById("new-search");

  if(!input) return;

  input.addEventListener(
    "input",
    renderProducts
  );
}

/* =========================================================
   CARRITO - AGREGAR
========================================================= */

function addProduct(id){

  const product =
    products.find(
      p => p.id === id
    );

  if(!product) return;

  const existing =
    cart.find(
      p => p.id === id
    );

  if(existing){

    existing.quantity++;

  }else{

    cart.push({

      ...product,

      quantity:1

    });
  }

  renderProducts();

  updateCartUI();
}

function increaseProduct(id){

  const item =
    cart.find(
      p => p.id === id
    );

  if(item){
    item.quantity++;
  }

  renderProducts();

  updateCartUI();
}

function decreaseProduct(id){

  const item =
    cart.find(
      p => p.id === id
    );

  if(!item) return;

  item.quantity--;

  if(item.quantity <= 0){

    cart =
      cart.filter(
        p => p.id !== id
      );
  }

  renderProducts();

  updateCartUI();
}

function removeProduct(id){

  cart =
    cart.filter(
      p => p.id !== id
    );

  renderProducts();

  updateCartUI();
}

function cartCount(){

  return cart.reduce(
    (sum,item) =>
      sum + item.quantity,
    0
  );
}

function cartTotal(){

  return cart.reduce(
    (sum,item) =>
      sum +
      (
        item.price *
        item.quantity
      ),
    0
  );
}

/* =========================================================
   ACTUALIZAR CARRITO SUPERIOR
========================================================= */

function updateCartUI(){

  const count =
    cartCount();

  const total =
    cartTotal();

  const badge =
    document.getElementById(
      "cart-badge"
    );

  const countText =
    document.getElementById(
      "cart-count-text"
    );

  const totalText =
    document.getElementById(
      "cart-total-top"
    );

  if(badge){
    badge.textContent =
      count;
  }

  if(countText){

    countText.textContent =
      count === 1
        ? "1 producto"
        : `${count} productos`;
  }

  if(totalText){

    totalText.textContent =
      `S/ ${total.toFixed(2)}`;
  }

  renderCartPanel();
}

/* =========================================================
   PANEL DEL CARRITO
========================================================= */

function toggleCart(){

  const panel =
    document.getElementById(
      "cart-panel"
    );

  if(!panel) return;

  panel.classList.toggle(
    "hidden"
  );

  renderCartPanel();
}

function renderCartPanel(){

  const panel =
    document.getElementById(
      "cart-panel"
    );

  if(!panel) return;

  if(panel.classList.contains("hidden")){
    return;
  }

  if(cart.length === 0){

    panel.innerHTML = `

      <div class="cart-panel-header">

        <h2>🛒 Mi carrito</h2>

        <button
          class="close-cart"
          onclick="toggleCart()"
        >
          ×
        </button>

      </div>

      <div class="cart-empty">
        Tu carrito está vacío.
      </div>
    `;

    return;
  }

  let html = `

    <div class="cart-panel-header">

      <h2>🛒 Mi carrito</h2>

      <button
        class="close-cart"
        onclick="toggleCart()"
      >
        ×
      </button>

    </div>
  `;

  cart.forEach(item => {

    html += `

      <div class="cart-line">

        <img
          class="cart-line-image"
          src="${getProductImage(item.name)}"
          alt=""
        >

        <div class="cart-line-main">

          <div class="cart-line-name">
            ${getProductEmoji(item.name)}
            ${cleanName(item.name)}
          </div>

          <div class="cart-line-price">
            S/ ${item.price.toFixed(2)}
          </div>

        </div>

        <div class="cart-line-controls">

          <button
            onclick="decreaseProduct(${item.id})"
          >
            −
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button
            onclick="increaseProduct(${item.id})"
          >
            +
          </button>

          <button
            onclick="removeProduct(${item.id})"
          >
            🗑️
          </button>

        </div>

      </div>
    `;
  });

  html += `

    <div class="cart-total-row">

      <span>Total</span>

      <span>
        S/ ${cartTotal().toFixed(2)}
      </span>

    </div>

    <button
      class="cart-order-button"
      onclick="startCheckout()"
    >
      Continuar pedido
    </button>
  `;

  panel.innerHTML = html;
}

/* =========================================================
   CHECKOUT
========================================================= */

function startCheckout(){

  if(cart.length === 0){

    alert(
      "Agrega productos al carrito."
    );

    return;
  }

  const panel =
    document.getElementById(
      "cart-panel"
    );

  if(panel){
    panel.classList.add("hidden");
  }

  const area =
    document.getElementById(
      "checkout-area"
    );

  if(!area) return;

  area.innerHTML = `

    <section class="checkout">

      <h2>📋 Datos de entrega</h2>

      <input
        id="customer-name"
        class="form-input"
        type="text"
        placeholder="Nombre completo"
        autocomplete="name"
      >

      <input
        id="customer-phone"
        class="form-input"
        type="tel"
        placeholder="Teléfono / WhatsApp"
        autocomplete="tel"
      >

      <input
        id="customer-address"
        class="form-input"
        type="text"
        placeholder="Dirección de entrega"
        autocomplete="street-address"
      >

      <textarea
        id="customer-reference"
        class="form-textarea"
        placeholder="Referencia (opcional)"
      ></textarea>

      <button
        class="primary-button"
        onclick="continueToPayment()"
      >
        Continuar
      </button>

    </section>
  `;

  area.scrollIntoView({
    behavior:"smooth",
    block:"start"
  });
}

/* =========================================================
   DATOS CLIENTE
========================================================= */

function continueToPayment(){

  const name =
    document.getElementById(
      "customer-name"
    )?.value.trim();

  const phone =
    document.getElementById(
      "customer-phone"
    )?.value.trim();

  const address =
    document.getElementById(
      "customer-address"
    )?.value.trim();

  const reference =
    document.getElementById(
      "customer-reference"
    )?.value.trim();

  if(!name){

    alert(
      "Escribe tu nombre completo."
    );

    return;
  }

  if(!phone){

    alert(
      "Escribe tu teléfono o WhatsApp."
    );

    return;
  }

  if(!address){

    alert(
      "Escribe tu dirección de entrega."
    );

    return;
  }

  showPayment(
    name,
    phone,
    address,
    reference
  );
}

/* =========================================================
   PAGO
========================================================= */

function showPayment(
  name,
  phone,
  address,
  reference
){

  currentPayment = "";

  const area =
    document.getElementById(
      "checkout-area"
    );

  area.innerHTML = `

    <section class="checkout">

      <h2>💳 Forma de pago</h2>

      <div class="payment-grid">

        <button
          class="payment-button"
          data-payment="Yape"
          onclick="choosePayment(this)"
        >
          📱<br>
          Yape
        </button>

        <button
          class="payment-button"
          data-payment="Plin"
          onclick="choosePayment(this)"
        >
          📱<br>
          Plin
        </button>

        <button
          class="payment-button"
          data-payment="Transferencia bancaria"
          onclick="choosePayment(this)"
        >
          🏦<br>
          Transferencia
        </button>

        <button
          class="payment-button"
          data-payment="Pago contra entrega"
          onclick="choosePayment(this)"
        >
          💵<br>
          Contra entrega
        </button>

      </div>

      <div
        id="payment-status"
        class="payment-summary"
      >
        Selecciona una forma de pago.
      </div>

      <div class="payment-summary">

        <strong>Resumen del pedido</strong>

        <br><br>

        ${cart.map(item => `
          ${getProductEmoji(item.name)}
          ${cleanName(item.name)}
          × ${item.quantity}
          — S/ ${(item.price * item.quantity).toFixed(2)}
          <br>
        `).join("")}

        <br>

        <strong>
          TOTAL: S/ ${cartTotal().toFixed(2)}
        </strong>

      </div>

      <button
        class="primary-button"
        onclick="confirmOrder(
          ${JSON.stringify(name)},
          ${JSON.stringify(phone)},
          ${JSON.stringify(address)},
          ${JSON.stringify(reference || "")}
        )"
      >
        Confirmar pedido
      </button>

    </section>
  `;

  area.scrollIntoView({
    behavior:"smooth",
    block:"start"
  });
}

function choosePayment(button){

  currentPayment =
    button.dataset.payment;

  document
    .querySelectorAll(".payment-button")
    .forEach(b =>
      b.classList.remove("selected")
    );

  button.classList.add(
    "selected"
  );

  const status =
    document.getElementById(
      "payment-status"
    );

  if(status){

    status.innerHTML =
      `<strong>Forma de pago:</strong> ${currentPayment}`;
  }
}

/* =========================================================
   GUARDAR PEDIDO
========================================================= */

async function saveOrder(
  name,
  phone,
  address,
  reference,
  payment
){

  const orderProducts =
    cart.map(item => ({

      id:item.id,

      nombre:cleanName(
        item.name
      ),

      unidad:item.unit,

      precio:item.price,

      cantidad:item.quantity

    }));

  const { error } =
    await client
      .from("pedidos")
      .insert({

        nombre_cliente:name,

        telefono:phone,

        direccion:address,

        referencia:
          reference || null,

        forma_pago:payment,

        productos:orderProducts,

        total:Number(
          cartTotal().toFixed(2)
        ),

        estado:"Pendiente"

      });

  if(error){
    throw error;
  }
}

/* =========================================================
   CONFIRMAR PEDIDO
========================================================= */

async function confirmOrder(
  name,
  phone,
  address,
  reference
){

  if(!currentPayment){

    alert(
      "Selecciona una forma de pago."
    );

    return;
  }

  const button =
    document.querySelector(
      ".checkout .primary-button"
    );

  if(button){

    button.disabled = true;

    button.textContent =
      "Guardando pedido...";
  }

  try{

    await saveOrder(
      name,
      phone,
      address,
      reference,
      currentPayment
    );

    sendWhatsApp(
      name,
      phone,
      address,
      reference,
      currentPayment
    );

  }catch(error){

    console.error(
      "Error guardando pedido:",
      error
    );

    alert(
      "No se pudo registrar el pedido. Revisa tu conexión e inténtalo nuevamente."
    );

    if(button){

      button.disabled = false;

      button.textContent =
        "Confirmar pedido";
    }
  }
}

/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsApp(
  name,
  phone,
  address,
  reference,
  payment
){

  let message =
    "*NUEVO PEDIDO - VERDULERÍA TERÁN*\\n\\n";

  message +=
    `*Cliente:* ${name}\\n`;

  message +=
    `*Teléfono:* ${phone}\\n`;

  message +=
    `*Dirección:* ${address}\\n`;

  if(reference){

    message +=
      `*Referencia:* ${reference}\\n`;
  }

  message +=
    `*Forma de pago:* ${payment}\\n\\n`;

  message +=
    "*PRODUCTOS:*\\n";

  cart.forEach(item => {

    message +=
      `• ${cleanName(item.name)} x${item.quantity} — S/ ` +
      `${(
        item.price *
        item.quantity
      ).toFixed(2)}\\n`;
  });

  message +=
    `\\n*TOTAL: S/ ${cartTotal().toFixed(2)}*`;

  const url =
    "https://wa.me/" +
    BUSINESS_WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  /*
    En iPhone usamos la navegación directa para
    evitar que Safari bloquee la apertura.
  */

  window.location.href = url;
}

/* =========================================================
   INICIO
========================================================= */

function goHome(){

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}

function goCategories(){

  const categories =
    document.getElementById(
      "categories"
    );

  if(categories){

    categories.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });
  }
}

/* =========================================================
   MIS PEDIDOS
========================================================= */

function showOrders(){

  const area =
    document.getElementById(
      "checkout-area"
    );

  if(!area) return;

  area.innerHTML = `

    <section class="info-message">

      <h2>📦 Mis pedidos</h2>

      <p>
        Tus pedidos se registran en
        Verdulería Terán.
      </p>

      <p>
        Para consultar el estado de un pedido,
        comunícate con nosotros por WhatsApp.
      </p>

      <button
        onclick="goHome()"
      >
        Volver al inicio
      </button>

    </section>
  `;

  area.scrollIntoView({
    behavior:"smooth"
  });
}

/* =========================================================
   MI CUENTA
========================================================= */

function showAccount(){

  const area =
    document.getElementById(
      "checkout-area"
    );

  if(!area) return;

  area.innerHTML = `

    <section class="info-message">

      <h2>👤 Mi cuenta</h2>

      <p>
        <strong>Verdulería Terán</strong>
      </p>

      <p>
        Delivery en:
      </p>

      <p>
        San Borja · San Luis ·
        San Isidro · La Victoria
      </p>

      <button
        onclick="goHome()"
      >
        Volver al inicio
      </button>

    </section>
  `;

  area.scrollIntoView({
    behavior:"smooth"
  });
}

/* =========================================================
   INICIAR APP
========================================================= */

function initializeTeran(){

  createApp();
}

if(
  document.readyState === "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    initializeTeran
  );

}else{

  initializeTeran();
}

/* =========================================================
   SERVICE WORKER
========================================================= */

if(
  "serviceWorker" in navigator
){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(error => {

          console.error(
            "Service Worker:",
            error
          );

        });

    }
  );
}