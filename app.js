/*
====================================================
 VERDULERÍA TERÁN
 DISEÑO PRINCIPAL
====================================================
*/

const client = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

const BUSINESS_WHATSAPP = "51983130700";

const products = [];
let cart = [];
let currentCategory = "Todos";
let selectedPayment = "";

/* =================================================
   ESTILOS
================================================= */

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
  background:#fffaf4;
  color:#202020;
  font-family:Arial,Helvetica,sans-serif;
}

button,
input{
  font-family:inherit;
}

button{
  cursor:pointer;
}

/* ================= HEADER ================= */

.teran-header{
  background:#ffffff;
  padding:12px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  border-bottom:1px solid #eee;
  position:relative;
  z-index:10;
}

.brand-mini{
  display:flex;
  align-items:center;
  gap:9px;
  min-width:0;
}

.brand-logo{
  width:46px;
  height:46px;
  border-radius:14px;
  background:linear-gradient(135deg,#18a558,#62c900);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-size:25px;
  flex:none;
}

.brand-text{
  min-width:0;
}

.brand-text strong{
  display:block;
  font-size:16px;
  line-height:1.1;
  color:#168c45;
}

.brand-text span{
  display:block;
  font-size:11px;
  color:#777;
  margin-top:3px;
}

.header-cart{
  border:0;
  background:#fff;
  display:flex;
  align-items:center;
  gap:9px;
  padding:4px 0;
  min-width:0;
}

.cart-picture{
  width:54px;
  height:54px;
  border-radius:15px;
  overflow:hidden;
  position:relative;
  background:#eaf7df;
  flex:none;
}

.cart-picture img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.cart-badge{
  position:absolute;
  top:-3px;
  right:-3px;
  min-width:21px;
  height:21px;
  padding:0 5px;
  border-radius:20px;
  background:#ed2f45;
  color:white;
  font-weight:800;
  font-size:11px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:2px solid white;
}

.cart-info{
  text-align:left;
}

.cart-info strong{
  display:block;
  font-size:12px;
}

.cart-info span{
  display:block;
  color:#777;
  font-size:10px;
  margin-top:3px;
}

.cart-total{
  background:#e91e63;
  color:#fff;
  border-radius:20px;
  padding:8px 10px;
  font-weight:800;
  font-size:12px;
  white-space:nowrap;
}

/* ================= MAIN ================= */

main{
  width:100%;
  max-width:1200px;
  margin:auto;
  padding-bottom:105px;
}

/* ================= HERO ================= */

.hero{
  margin:12px;
  min-height:220px;
  border-radius:25px;
  overflow:hidden;
  position:relative;
  background:
    linear-gradient(90deg,rgba(0,90,42,.88),rgba(0,120,45,.36)),
    url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85")
    center/cover;
  display:flex;
  align-items:center;
}

.hero-content{
  padding:28px 24px;
  color:white;
  max-width:650px;
}

.hero-icon{
  font-size:32px;
  margin-bottom:5px;
}

.hero h1{
  margin:0;
  font-size:34px;
  line-height:1;
  font-weight:900;
}

.hero h1 span{
  color:#ff9f1c;
}

.hero p{
  margin:12px 0;
  font-size:15px;
  font-weight:600;
}

.delivery{
  display:inline-block;
  background:rgba(255,255,255,.17);
  border:1px solid rgba(255,255,255,.35);
  padding:8px 12px;
  border-radius:18px;
  font-size:11px;
  font-weight:700;
}

/* ================= SEARCH ================= */

.search-wrap{
  padding:4px 12px 10px;
}

.search{
  width:100%;
  border:1px solid #e4e4e4;
  background:#fff;
  border-radius:17px;
  padding:14px 17px;
  font-size:14px;
  outline:none;
  box-shadow:0 3px 12px rgba(0,0,0,.05);
}

.search:focus{
  border-color:#39a852;
}

/* ================= CATEGORIES ================= */

.category-scroll{
  display:flex;
  gap:8px;
  overflow-x:auto;
  padding:5px 12px 13px;
  scrollbar-width:none;
}

.category-scroll::-webkit-scrollbar{
  display:none;
}

.category{
  border:0;
  padding:10px 15px;
  border-radius:22px;
  background:#fff;
  color:#555;
  white-space:nowrap;
  font-weight:700;
  font-size:12px;
  box-shadow:0 2px 8px rgba(0,0,0,.07);
}

.category.active{
  background:#22a447;
  color:white;
}

/* ================= SECTION TITLE ================= */

.section-title{
  padding:4px 12px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}

.section-title h2{
  margin:0;
  font-size:21px;
  font-weight:900;
}

.section-badge{
  background:#fff0b5;
  color:#996600;
  padding:7px 10px;
  border-radius:15px;
  font-size:10px;
  font-weight:800;
}

/* ================= PRODUCTS ================= */

.products-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:11px;
  padding:0 12px;
}

.product-card{
  background:white;
  border-radius:19px;
  padding:9px;
  box-shadow:0 4px 15px rgba(0,0,0,.07);
  overflow:hidden;
  border:1px solid #f0eee9;
}

.product-image{
  width:100%;
  aspect-ratio:1/1;
  border-radius:15px;
  overflow:hidden;
  background:#f3f3f3;
  position:relative;
}

.product-image img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.product-info{
  padding:8px 2px 2px;
}

.product-name{
  font-size:13px;
  font-weight:800;
  min-height:30px;
  line-height:1.15;
}

.product-unit{
  color:#8a8a8a;
  font-size:10px;
  margin-top:4px;
}

.product-bottom{
  margin-top:7px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:5px;
}

.product-price{
  font-weight:900;
  font-size:14px;
  color:#159447;
}

.add-btn{
  border:0;
  color:white;
  border-radius:12px;
  min-width:34px;
  height:32px;
  padding:0 9px;
  font-weight:900;
  font-size:12px;
  background:#19a957;
}

.add-btn:nth-child(odd){
  background:#e84a5f;
}

.product-card:nth-child(3n) .add-btn{
  background:#8754d9;
}

.product-card:nth-child(4n) .add-btn{
  background:#f18a21;
}

.product-card:nth-child(5n) .add-btn{
  background:#208fd1;
}

/* ================= FRUIT BANNER ================= */

.fruit-banner{
  margin:18px 12px;
  min-height:145px;
  border-radius:22px;
  overflow:hidden;
  position:relative;
  background:
    linear-gradient(90deg,rgba(145,43,8,.88),rgba(190,74,17,.28)),
    url("https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=85")
    center/cover;
  display:flex;
  align-items:center;
}

.fruit-banner div{
  color:#fff;
  padding:22px;
}

.fruit-banner h2{
  margin:0;
  font-size:22px;
  font-weight:900;
}

.fruit-banner p{
  margin:7px 0 0;
  font-size:12px;
  font-weight:700;
}

/* ================= BOTTOM NAV ================= */

.bottom-nav{
  position:fixed;
  left:0;
  right:0;
  bottom:0;
  z-index:50;
  background:#fff;
  border-top:1px solid #e9e9e9;
  box-shadow:0 -4px 15px rgba(0,0,0,.08);
  display:flex;
  justify-content:space-around;
  padding:7px 4px calc(7px + env(safe-area-inset-bottom));
}

.nav-btn{
  border:0;
  background:none;
  color:#777;
  font-size:10px;
  font-weight:700;
  min-width:55px;
}

.nav-btn span{
  display:block;
  font-size:20px;
  margin-bottom:3px;
}

.nav-btn.active{
  color:#159447;
}

.nav-cart{
  width:50px;
  height:50px;
  border-radius:50%;
  background:#20a653;
  color:#fff;
  margin-top:-21px;
  border:5px solid #fff;
  box-shadow:0 3px 12px rgba(0,0,0,.15);
}

/* ================= MODAL / CART ================= */

.modal-backdrop{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.42);
  z-index:100;
  display:none;
  align-items:flex-end;
}

.modal-backdrop.show{
  display:flex;
}

.modal{
  background:#fff;
  width:100%;
  max-height:88vh;
  overflow:auto;
  border-radius:25px 25px 0 0;
  padding:20px 16px calc(30px + env(safe-area-inset-bottom));
}

.modal-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

.modal-header h2{
  margin:0;
  font-size:21px;
}

.close-btn{
  border:0;
  background:#f2f2f2;
  width:36px;
  height:36px;
  border-radius:50%;
  font-size:18px;
}

.empty{
  text-align:center;
  color:#777;
  padding:35px 10px;
}

.cart-row{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 0;
  border-bottom:1px solid #eee;
}

.cart-row img{
  width:58px;
  height:58px;
  border-radius:12px;
  object-fit:cover;
}

.cart-row-info{
  flex:1;
}

.cart-row-info strong{
  display:block;
  font-size:13px;
}

.cart-row-info span{
  display:block;
  color:#777;
  font-size:11px;
  margin-top:4px;
}

.qty{
  display:flex;
  align-items:center;
  gap:7px;
}

.qty button{
  width:28px;
  height:28px;
  border:0;
  border-radius:9px;
  background:#eaf5e8;
  font-weight:900;
}

.delete{
  border:0;
  background:#fff0f0;
  color:#d52e43;
  border-radius:9px;
  width:30px;
  height:30px;
}

/* ================= CHECKOUT ================= */

.checkout{
  padding:12px;
  padding-bottom:145px;
}

.checkout-card{
  background:#fff;
  border-radius:23px;
  padding:18px;
  box-shadow:0 4px 18px rgba(0,0,0,.07);
  margin-bottom:14px;
}

.checkout-title{
  margin:0 0 14px;
  font-size:20px;
  font-weight:900;
}

.form-group{
  margin-bottom:11px;
}

.form-group label{
  display:block;
  font-size:11px;
  font-weight:800;
  margin-bottom:5px;
}

.form-group input{
  width:100%;
  padding:12px;
  border:1px solid #ddd;
  border-radius:12px;
  outline:none;
}

.payment-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}

.payment-option{
  border:2px solid #e8e8e8;
  background:#fff;
  border-radius:16px;
  padding:12px 8px;
  min-height:92px;
  text-align:center;
  transition:.15s;
}

.payment-option.selected{
  border-color:#19a653;
  background:#f1fff5;
  box-shadow:0 0 0 2px rgba(25,166,83,.08);
}

.payment-logo{
  width:45px;
  height:45px;
  margin:auto auto 7px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
  font-size:17px;
}

.logo-yape{
  background:#7424c7;
  color:#fff;
}

.logo-plin{
  background:#0b8fce;
  color:#fff;
}

.logo-bank{
  background:#e9b325;
  color:#fff;
}

.logo-cash{
  background:#25a653;
  color:#fff;
}

.payment-name{
  font-size:11px;
  font-weight:900;
}

.summary-row{
  display:flex;
  justify-content:space-between;
  gap:10px;
  padding:7px 0;
  font-size:13px;
}

.total-row{
  border-top:1px solid #eee;
  margin-top:7px;
  padding-top:12px;
  display:flex;
  justify-content:space-between;
  font-size:19px;
  font-weight:900;
}

.confirm-btn{
  width:100%;
  border:0;
  background:#19a653;
  color:#fff;
  border-radius:15px;
  padding:15px;
  font-size:15px;
  font-weight:900;
  margin-top:15px;
}

.confirm-btn:disabled{
  opacity:.45;
}

/* ================= SUCCESS ================= */

.success{
  text-align:center;
  padding:35px 15px;
}

.success-icon{
  font-size:58px;
}

.success h2{
  font-size:25px;
  margin:10px 0;
}

.whatsapp-btn{
  width:100%;
  border:0;
  background:#25d366;
  color:#fff;
  border-radius:15px;
  padding:15px;
  font-weight:900;
  margin-top:12px;
}

/* ================= RESPONSIVE ================= */

@media(max-width:500px){
  .products-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }

  .hero{
    min-height:230px;
  }

  .hero h1{
    font-size:29px;
  }
}

@media(min-width:900px){
  .products-grid{
    grid-template-columns:repeat(4,minmax(0,1fr));
  }
}
`;

document.head.appendChild(style);

/* =================================================
   IMÁGENES POR PRODUCTO
================================================= */

const imageMap = {
  papa: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
  tomate: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85",
  cebolla: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85",
  zanahoria: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=85",
  limon: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=700&q=85",
  lechuga: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=700&q=85",
  platano: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85",
  manzana: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85",
  culantro: "https://images.unsplash.com/photo-1610557892470-a6f0c4a6d4f6?auto=format&fit=crop&w=700&q=85",
  perejil: "https://images.unsplash.com/photo-1591187101782-3f0c1e39f4f5?auto=format&fit=crop&w=700&q=85",
  brocoli: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=85",
  pepino: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=700&q=85",
  palta: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=85",
  naranja: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=85",
  fresa: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=85"
};

const fallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85";

function normalizeName(name){
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]/g,"");
}

function getProductImage(name){
  const n = normalizeName(name);

  for(const key of Object.keys(imageMap)){
    if(n.includes(key)){
      return imageMap[key];
    }
  }

  return fallbackImage;
}

/* =================================================
   ESTRUCTURA
================================================= */

document.body.innerHTML = `
<header class="teran-header">
  <div class="brand-mini">
    <div class="brand-logo">🌱</div>
    <div class="brand-text">
      <strong>Verdulería Terán</strong>
      <span>Productos frescos</span>
    </div>
  </div>

  <button class="header-cart" id="headerCart">
    <div class="cart-picture">
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=85"
        alt="Mi carrito"
      >
      <span class="cart-badge" id="cartBadge">0</span>
    </div>

    <div class="cart-info">
      <strong>Mi carrito</strong>
      <span id="cartCount">0 productos</span>
    </div>

    <div class="cart-total" id="headerTotal">S/ 0.00</div>
  </button>
</header>

<main id="appMain">

  <section class="hero">
    <div class="hero-content">
      <div class="hero-icon">🌱</div>
      <h1>Verdulería <span>Terán</span></h1>
      <p>Productos frescos directo a tu hogar</p>
      <div class="delivery">
        San Borja · San Luis · San Isidro · La Victoria
      </div>
    </div>
  </section>

  <section class="search-wrap">
    <input
      id="searchInput"
      class="search"
      type="search"
      placeholder="🔎 Buscar productos..."
    >
  </section>

  <section class="category-scroll" id="categories">
    <button class="category active" data-category="Todos">Todos</button>
    <button class="category" data-category="Verduras">Verduras</button>
    <button class="category" data-category="Frutas">Frutas</button>
    <button class="category" data-category="Tubérculos">Tubérculos</button>
    <button class="category" data-category="Hierbas">Hierbas</button>
  </section>

  <section class="section-title">
    <h2>Nuestros productos</h2>
    <span class="section-badge">Frescos del día</span>
  </section>

  <section id="products" class="products-grid">
    Cargando productos...
  </section>

  <section class="fruit-banner">
    <div>
      <h2>Frutas frescas y de temporada</h2>
      <p>Seleccionadas para llevarlas directamente a tu hogar.</p>
    </div>
  </section>

</main>

<nav class="bottom-nav">
  <button class="nav-btn active" id="navHome">
    <span>⌂</span>
    Inicio
  </button>

  <button class="nav-btn" id="navCategories">
    <span>☷</span>
    Categorías
  </button>

  <button class="nav-btn nav-cart" id="navCart">
    <span>🛒</span>
    Carrito
  </button>

  <button class="nav-btn" id="navOrders">
    <span>▣</span>
    Mis pedidos
  </button>

  <button class="nav-btn" id="navAccount">
    <span>♙</span>
    Mi cuenta
  </button>
</nav>

<div class="modal-backdrop" id="cartModal">
  <div class="modal">
    <div class="modal-header">
      <h2>Mi carrito</h2>
      <button class="close-btn" id="closeCart">×</button>
    </div>

    <div id="cartContent"></div>
  </div>
</div>
`;

/* =================================================
   CARGAR PRODUCTOS
================================================= */

async function loadProducts(){

  const section = document.getElementById("products");

  section.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:30px">
      Cargando productos...
    </div>
  `;

  try{

    const {data,error} = await client
      .from("productos")
      .select("*")
      .eq("activo",true)
      .order("id");

    if(error) throw error;

    products.length = 0;

    data.forEach(p=>{
      products.push({
        id:p.id,
        name:p.nombre,
        category:p.categoria,
        unit:p.unidad,
        price:Number(p.precio)||0,
        active:p.activo,
        image:getProductImage(p.nombre)
      });
    });

    renderProducts();

  }catch(error){

    console.error(error);

    section.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:30px">
        No se pudieron cargar los productos.
      </div>
    `;
  }
}

/* =================================================
   PRODUCTOS
================================================= */

function renderProducts(){

  const section = document.getElementById("products");
  const search = document.getElementById("searchInput").value
    .toLowerCase()
    .trim();

  let filtered = products.filter(p=>{

    const categoryMatch =
      currentCategory === "Todos" ||
      p.category === currentCategory;

    const searchMatch =
      !search ||
      p.name.toLowerCase().includes(search);

    return categoryMatch && searchMatch;
  });

  if(!filtered.length){

    section.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:35px;color:#777">
        No encontramos productos con esa búsqueda.
      </div>
    `;

    return;
  }

  section.innerHTML = filtered.map(p=>`

    <article class="product-card">

      <div class="product-image">
        <img
          src="${p.image}"
          alt="${escapeHtml(p.name)}"
          loading="lazy"
          onerror="this.src='${fallbackImage}'"
        >
      </div>

      <div class="product-info">

        <div class="product-name">
          ${escapeHtml(p.name)}
        </div>

        <div class="product-unit">
          ${escapeHtml(p.unit)}
        </div>

        <div class="product-bottom">

          <div class="product-price">
            S/ ${p.price.toFixed(2)}
          </div>

          <button
            class="add-btn"
            onclick="addToCart(${p.id})"
          >
            + Agregar
          </button>

        </div>

      </div>

    </article>

  `).join("");
}

/* =================================================
   CARRITO
================================================= */

function addToCart(id){

  const product = products.find(p=>p.id===id);

  if(!product) return;

  const existing = cart.find(x=>x.id===id);

  if(existing){
    existing.quantity++;
  }else{
    cart.push({
      ...product,
      quantity:1
    });
  }

  updateCartUI();
}

function changeQuantity(id,delta){

  const item = cart.find(x=>x.id===id);

  if(!item) return;

  item.quantity += delta;

  if(item.quantity<=0){
    cart = cart.filter(x=>x.id!==id);
  }

  updateCartUI();
}

function removeFromCart(id){

  cart = cart.filter(x=>x.id!==id);

  updateCartUI();
}

function cartTotal(){

  return cart.reduce(
    (sum,item)=>sum + item.price * item.quantity,
    0
  );
}

function cartQuantity(){

  return cart.reduce(
    (sum,item)=>sum + item.quantity,
    0
  );
}

function updateCartUI(){

  const quantity = cartQuantity();
  const total = cartTotal();

  document.getElementById("cartBadge").textContent = quantity;
  document.getElementById("cartCount").textContent =
    `${quantity} ${quantity===1?"producto":"productos"}`;

  document.getElementById("headerTotal").textContent =
    `S/ ${total.toFixed(2)}`;

  renderCart();

}

function renderCart(){

  const box = document.getElementById("cartContent");

  if(!cart.length){

    box.innerHTML = `
      <div class="empty">
        <div style="font-size:50px">🛒</div>
        <strong>Tu carrito está vacío.</strong>
        <p>Agrega productos para continuar.</p>
      </div>
    `;

    return;
  }

  box.innerHTML = `

    ${cart.map(item=>`

      <div class="cart-row">

        <img
          src="${item.image}"
          alt="${escapeHtml(item.name)}"
        >

        <div class="cart-row-info">
          <strong>${escapeHtml(item.name)}</strong>
          <span>
            S/ ${item.price.toFixed(2)} · ${item.unit}
          </span>
        </div>

        <div class="qty">
          <button onclick="changeQuantity(${item.id},-1)">−</button>
          <strong>${item.quantity}</strong>
          <button onclick="changeQuantity(${item.id},1)">+</button>
        </div>

        <button
          class="delete"
          onclick="removeFromCart(${item.id})"
        >
          🗑️
        </button>

      </div>

    `).join("")}

    <div class="total-row">
      <span>Total</span>
      <strong>S/ ${cartTotal().toFixed(2)}</strong>
    </div>

    <button
      class="confirm-btn"
      onclick="openCheckout()"
    >
      Continuar con el pedido
    </button>

  `;
}

/* =================================================
   MODAL CARRITO
================================================= */

function openCart(){

  renderCart();

  document
    .getElementById("cartModal")
    .classList.add("show");
}

function closeCart(){

  document
    .getElementById("cartModal")
    .classList.remove("show");
}

/* =================================================
   CHECKOUT
================================================= */

function openCheckout(){

  if(!cart.length){
    alert("Agrega productos al carrito.");
    return;
  }

  closeCart();

  const main = document.getElementById("appMain");

  main.innerHTML = `

    <section class="checkout">

      <div class="checkout-card">

        <h2 class="checkout-title">
          Datos de entrega
        </h2>

        <div class="form-group">
          <label>Nombre completo</label>
          <input id="customerName" placeholder="Tu nombre completo">
        </div>

        <div class="form-group">
          <label>Teléfono / WhatsApp</label>
          <input id="customerPhone" type="tel" placeholder="Tu número">
        </div>

        <div class="form-group">
          <label>Dirección de entrega</label>
          <input id="customerAddress" placeholder="Dirección">
        </div>

        <div class="form-group">
          <label>Referencia (opcional)</label>
          <input id="customerReference" placeholder="Ej. departamento, edificio...">
        </div>

      </div>

      <div class="checkout-card">

        <h2 class="checkout-title">
          Forma de pago
        </h2>

        <div class="payment-grid">

          <button
            class="payment-option"
            data-payment="Yape"
          >
            <div class="payment-logo logo-yape">
              Y
            </div>
            <div class="payment-name">
              Yape
            </div>
          </button>

          <button
            class="payment-option"
            data-payment="Plin"
          >
            <div class="payment-logo logo-plin">
              P
            </div>
            <div class="payment-name">
              Plin
            </div>
          </button>

          <button
            class="payment-option"
            data-payment="Transferencia bancaria"
          >
            <div class="payment-logo logo-bank">
              🏦
            </div>
            <div class="payment-name">
              Transferencia bancaria
            </div>
          </button>

          <button
            class="payment-option"
            data-payment="Efectivo / Pago contra entrega"
          >
            <div class="payment-logo logo-cash">
              S/
            </div>
            <div class="payment-name">
              Pago contra entrega
            </div>
          </button>

        </div>

        <p style="font-size:11px;color:#777;margin-top:12px">
          Selecciona una forma de pago.
        </p>

      </div>

      <div class="checkout-card">

        <h2 class="checkout-title">
          Resumen del pedido
        </h2>

        ${cart.map(item=>`

          <div class="summary-row">
            <span>
              ${escapeHtml(item.name)} × ${item.quantity}
            </span>

            <strong>
              S/ ${(item.price*item.quantity).toFixed(2)}
            </strong>
          </div>

        `).join("")}

        <div class="total-row">
          <span>TOTAL</span>
          <strong>S/ ${cartTotal().toFixed(2)}</strong>
        </div>

        <button
          id="confirmOrderBtn"
          class="confirm-btn"
        >
          Confirmar pedido
        </button>

      </div>

    </section>
  `;

  document.querySelectorAll(".payment-option").forEach(btn=>{

    btn.addEventListener("click",()=>{

      document
        .querySelectorAll(".payment-option")
        .forEach(x=>x.classList.remove("selected"));

      btn.classList.add("selected");

      selectedPayment = btn.dataset.payment;

    });

  });

  document
    .getElementById("confirmOrderBtn")
    .addEventListener("click",saveOrder);

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}

/* =================================================
   GUARDAR PEDIDO
================================================= */

async function saveOrder(){

  const name =
    document.getElementById("customerName").value.trim();

  const phone =
    document.getElementById("customerPhone").value.trim();

  const address =
    document.getElementById("customerAddress").value.trim();

  const reference =
    document.getElementById("customerReference").value.trim();

  if(!name || !phone || !address){

    alert("Completa nombre, teléfono y dirección.");
    return;
  }

  if(!selectedPayment){

    alert("Selecciona una forma de pago.");
    return;
  }

  if(!cart.length){

    alert("El carrito está vacío.");
    return;
  }

  const orderProducts = cart.map(item=>({
    id:item.id,
    nombre:item.name,
    cantidad:item.quantity,
    unidad:item.unit,
    precio:item.price,
    subtotal:Number(
      (item.price*item.quantity).toFixed(2)
    )
  }));

  const total = Number(cartTotal().toFixed(2));

  const button =
    document.getElementById("confirmOrderBtn");

  button.disabled = true;
  button.textContent = "Registrando pedido...";

  try{

    const {error} = await client
      .from("pedidos")
      .insert({
        nombre_cliente:name,
        telefono:phone,
        direccion:address,
        referencia:reference,
        forma_pago:selectedPayment,
        productos:orderProducts,
        total:total,
        estado:"Pendiente"
      });

    if(error) throw error;

    const message = createWhatsAppMessage({
      name,
      phone,
      address,
      reference,
      payment:selectedPayment,
      total,
      products:orderProducts
    });

    showSuccess(message);

  }catch(error){

    console.error(error);

    button.disabled = false;
    button.textContent = "Confirmar pedido";

    alert(
      "No se pudo registrar el pedido. Revisa tu conexión e inténtalo nuevamente."
    );
  }
}

/* =================================================
   WHATSAPP
================================================= */

function createWhatsAppMessage(order){

  let message =
`*NUEVO PEDIDO - VERDULERÍA TERÁN*%0A%0A`;

  message +=
`*Cliente:* ${encodeURIComponent(order.name)}%0A`;

  message +=
`*Teléfono:* ${encodeURIComponent(order.phone)}%0A`;

  message +=
`*Dirección:* ${encodeURIComponent(order.address)}%0A`;

  if(order.reference){

    message +=
    `*Referencia:* ${encodeURIComponent(order.reference)}%0A`;
  }

  message +=
`*Pago:* ${encodeURIComponent(order.payment)}%0A%0A`;

  message += `*PRODUCTOS*%0A`;

  order.products.forEach(item=>{

    message +=
`${encodeURIComponent(item.nombre)} x ${item.cantidad} = S/ ${item.subtotal.toFixed(2)}%0A`;

  });

  message +=
`%0A*TOTAL: S/ ${order.total.toFixed(2)}*`;

  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${message}`;
}

/* =================================================
   ÉXITO
================================================= */

function showSuccess(whatsappUrl){

  document.getElementById("appMain").innerHTML = `

    <section class="checkout">

      <div class="checkout-card success">

        <div class="success-icon">
          ✅
        </div>

        <h2>¡Pedido registrado!</h2>

        <p>
          Tu pedido fue registrado correctamente.
        </p>

        <p style="font-size:12px;color:#777">
          Ahora puedes enviarlo por WhatsApp a Verdulería Terán.
        </p>

        <button
          class="whatsapp-btn"
          onclick="window.open('${whatsappUrl}','_blank')"
        >
          💬 Enviar pedido por WhatsApp
        </button>

        <button
          class="confirm-btn"
          onclick="location.reload()"
        >
          Volver a comprar
        </button>

      </div>

    </section>
  `;

  cart = [];
  selectedPayment = "";
}

/* =================================================
   UTILIDAD
================================================= */

function escapeHtml(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

/* =================================================
   EVENTOS
================================================= */

document
  .getElementById("headerCart")
  .addEventListener("click",openCart);

document
  .getElementById("navCart")
  .addEventListener("click",openCart);

document
  .getElementById("closeCart")
  .addEventListener("click",closeCart);

document
  .getElementById("cartModal")
  .addEventListener("click",e=>{

    if(e.target.id==="cartModal"){
      closeCart();
    }

  });

document
  .getElementById("searchInput")
  .addEventListener("input",renderProducts);

document
  .querySelectorAll(".category")
  .forEach(button=>{

    button.addEventListener("click",()=>{

      currentCategory = button.dataset.category;

      document
        .querySelectorAll(".category")
        .forEach(x=>x.classList.remove("active"));

      button.classList.add("active");

      renderProducts();

      window.scrollTo({
        top:300,
        behavior:"smooth"
      });

    });

  });

document
  .getElementById("navHome")
  .addEventListener("click",()=>location.reload());

document
  .getElementById("navCategories")
  .addEventListener("click",()=>{

    document
      .getElementById("categories")
      .scrollIntoView({
        behavior:"smooth"
      });

  });

/* =================================================
   INICIO
================================================= */

updateCartUI();
loadProducts();