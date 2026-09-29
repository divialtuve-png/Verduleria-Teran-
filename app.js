
/*
====================================================
 VERDULERÍA TERÁN — VERSIÓN CORREGIDA DEL CATÁLOGO
 Diseño: referencia aprobada
 Funciones: Supabase + carrito + checkout + pagos
           + pedidos + WhatsApp
====================================================
*/

const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {};
const SUPABASE_READY = Boolean(
  window.supabase &&
  /^https:\/\/.+/.test(String(SUPABASE_CONFIG.url || "")) &&
  String(SUPABASE_CONFIG.publishableKey || "").length > 20
);
const client = SUPABASE_READY
  ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.publishableKey)
  : null;

const BUSINESS_WHATSAPP = "51983130700";

const products = [];
let cart = [];
let currentCategory = "Todos";
let selectedPayment = "";
let currentView = "home";

/* =================================================
   ESTILOS
================================================= */

const style = document.createElement("style");

style.textContent = `
:root{
  --green:#149447;
  --green-dark:#087b38;
  --green-light:#eaf8ed;
  --orange:#ff7a00;
  --pink:#ec1b55;
  --purple:#7629c9;
  --blue:#11a8dc;
  --text:#171717;
  --muted:#737373;
  --line:#e7e7e7;
  --cream:#fffaf4;
}

*{box-sizing:border-box}

html{scroll-behavior:smooth}

body{
  margin:0;
  background:var(--cream);
  color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;
}

button,input{font:inherit}
button{cursor:pointer}
img{display:block;max-width:100%}

#app{
  min-height:100vh;
}

.topbar{
  position:sticky;
  top:0;
  z-index:40;
  height:76px;
  background:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 14px;
  border-bottom:1px solid #eee;
}

.brand{
  display:flex;
  align-items:center;
  gap:9px;
  min-width:0;
}

.brand-mark{
  width:47px;
  height:47px;
  border-radius:15px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:29px;
  background:linear-gradient(145deg,#ecf8df,#ccefc8);
  flex:none;
}

.brand-name{
  font-weight:900;
  line-height:.96;
  font-size:18px;
  color:#087b38;
}

.brand-name span{
  color:#f16b13;
  display:block;
  font-size:18px;
}

.brand-sub{
  color:#777;
  font-size:9px;
  margin-top:4px;
}

.top-cart{
  border:0;
  background:#fff;
  display:flex;
  align-items:center;
  gap:7px;
  padding:2px;
}

.top-cart-icon{
  position:relative;
  width:43px;
  height:43px;
  border-radius:50%;
  background:#fff5f0;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:24px;
}

.badge{
  position:absolute;
  right:-3px;
  top:-4px;
  min-width:19px;
  height:19px;
  padding:0 5px;
  border-radius:20px;
  background:#f02845;
  color:#fff;
  font-size:10px;
  font-weight:900;
  display:flex;
  align-items:center;
  justify-content:center;
  border:2px solid #fff;
}

.top-cart-total{
  background:var(--pink);
  color:#fff;
  border-radius:17px;
  padding:9px 11px;
  font-size:12px;
  font-weight:900;
  white-space:nowrap;
}

.page{
  width:min(100%,1100px);
  margin:0 auto;
  padding-bottom:104px;
}

.hero{
  margin:10px 10px 0;
  min-height:205px;
  border-radius:19px;
  overflow:hidden;
  position:relative;
  background:
    linear-gradient(90deg,rgba(3,77,34,.9),rgba(4,103,49,.32)),
    url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=90")
    center/cover;
}

.hero-content{
  padding:27px 22px;
  color:#fff;
}

.hero h1{
  margin:0;
  font-size:31px;
  line-height:.98;
  font-weight:950;
  letter-spacing:-.8px;
}

.hero h1 span{color:#ff8b00}

.hero p{
  margin:12px 0 9px;
  font-size:14px;
  font-weight:800;
}

.delivery{
  display:inline-block;
  font-size:10px;
  line-height:1.35;
  font-weight:800;
  background:rgba(0,0,0,.18);
  padding:7px 10px;
  border-radius:12px;
}

.search-wrap{
  margin:10px 10px 7px;
}

.search{
  width:100%;
  height:43px;
  border:1px solid #ddd;
  border-radius:22px;
  background:#fff;
  padding:0 16px;
  outline:none;
  font-size:13px;
}

.search:focus{border-color:var(--green)}

.categories{
  display:flex;
  gap:7px;
  overflow-x:auto;
  padding:4px 10px 10px;
  scrollbar-width:none;
}

.categories::-webkit-scrollbar{display:none}

.category{
  flex:none;
  border:1px solid #e0e0e0;
  background:#fff;
  color:#333;
  border-radius:20px;
  padding:9px 13px;
  font-size:11px;
  font-weight:800;
}

.category.active{
  background:var(--green);
  color:#fff;
  border-color:var(--green);
}

.section-head{
  margin:2px 10px 9px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}

.section-head h2{
  margin:0;
  font-size:20px;
  letter-spacing:-.4px;
}

.section-chip{
  background:#ffe27a;
  color:#6b5200;
  border-radius:15px;
  padding:7px 9px;
  font-size:9px;
  font-weight:900;
}

.products{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:9px;
  padding:0 10px;
}

.card{
  background:#fff;
  border:1px solid #eee;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 3px 10px rgba(0,0,0,.055);
}

.card-image{
  width:100%;
  aspect-ratio:1/1;
  background:#eef3ea;
  overflow:hidden;
}

.card-image img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.card-body{padding:7px}

.card-name{
  min-height:29px;
  font-size:12px;
  font-weight:900;
  line-height:1.12;
}

.card-unit{
  font-size:9px;
  color:#777;
  margin-top:3px;
}

.card-bottom{
  margin-top:7px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:4px;
}

.price{
  font-size:13px;
  font-weight:950;
  white-space:nowrap;
}

.add{
  border:0;
  color:#fff;
  border-radius:9px;
  min-width:31px;
  height:30px;
  padding:0 8px;
  font-size:11px;
  font-weight:900;
  background:var(--green);
}

.card:nth-child(3n) .add{background:var(--purple)}
.card:nth-child(4n) .add{background:var(--orange)}
.card:nth-child(5n) .add{background:#207ce0}
.card:nth-child(6n) .add{background:#ef2042}

.fruit-banner{
  margin:15px 10px 0;
  min-height:125px;
  border-radius:18px;
  overflow:hidden;
  background:
    linear-gradient(90deg,rgba(118,37,10,.88),rgba(118,37,10,.25)),
    url("https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=90")
    center/cover;
  display:flex;
  align-items:center;
}

.fruit-banner div{padding:20px;color:#fff}

.fruit-banner h2{
  margin:0;
  font-size:21px;
  font-weight:950;
}

.fruit-banner p{
  margin:6px 0 0;
  font-size:11px;
  font-weight:700;
}

.bottom-nav{
  position:fixed;
  left:0;
  right:0;
  bottom:0;
  z-index:80;
  height:70px;
  background:#fff;
  border-top:1px solid #e6e6e6;
  box-shadow:0 -4px 18px rgba(0,0,0,.08);
  display:grid;
  grid-template-columns:repeat(5,1fr);
  padding-bottom:env(safe-area-inset-bottom);
}

.nav{
  border:0;
  background:#fff;
  color:#6d6d6d;
  font-size:9px;
  font-weight:800;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:3px;
}

.nav-icon{font-size:21px;line-height:1}

.nav.active{color:var(--green)}

.nav.cart{
  width:52px;
  height:52px;
  border-radius:50%;
  margin:-19px auto 0;
  background:var(--green);
  color:#fff;
  border:5px solid #fff;
  box-shadow:0 3px 14px rgba(0,0,0,.18);
  position:relative;
}

.nav.cart .badge{
  top:-4px;
  right:-2px;
}

.back{
  border:0;
  background:transparent;
  font-size:24px;
  padding:0 2px;
}

.screen-head{
  display:flex;
  align-items:center;
  gap:8px;
  padding:11px 12px;
  background:#fff;
  border-bottom:1px solid #eee;
}

.screen-title{
  font-size:21px;
  font-weight:950;
  margin:0;
}

.cart-list{
  padding:10px;
}

.cart-item{
  background:#fff;
  border-radius:14px;
  border:1px solid #eee;
  padding:8px;
  display:grid;
  grid-template-columns:62px 1fr auto;
  gap:9px;
  align-items:center;
  margin-bottom:8px;
}

.cart-item img{
  width:62px;
  height:62px;
  border-radius:11px;
  object-fit:cover;
}

.cart-item-name{
  font-size:13px;
  font-weight:900;
}

.cart-item-meta{
  color:#777;
  font-size:10px;
  margin-top:3px;
}

.qty{
  display:flex;
  align-items:center;
  gap:6px;
  margin-top:7px;
}

.qty button{
  border:0;
  background:#e8f8eb;
  color:var(--green-dark);
  width:27px;
  height:27px;
  border-radius:8px;
  font-weight:950;
}

.qty strong{min-width:15px;text-align:center;font-size:12px}

.cart-item-right{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:9px;
}

.remove{
  border:0;
  background:#ffe9eb;
  color:#ed2344;
  width:29px;
  height:29px;
  border-radius:9px;
}

.cart-subtotal{
  padding:12px;
  background:#fff;
  border-radius:15px;
  margin:4px 10px 10px;
  border:1px solid #eee;
  display:flex;
  justify-content:space-between;
  font-size:15px;
  font-weight:950;
}

.primary{
  width:calc(100% - 20px);
  margin:0 10px;
  border:0;
  border-radius:13px;
  background:var(--green);
  color:#fff;
  padding:14px;
  font-size:14px;
  font-weight:950;
}

.checkout{
  padding:10px 10px 95px;
}

.checkout-card{
  background:#fff;
  border-radius:18px;
  padding:15px;
  margin-bottom:11px;
  border:1px solid #eee;
}

.checkout-heading{
  display:flex;
  align-items:center;
  gap:9px;
  margin:0 0 12px;
  font-size:19px;
  font-weight:950;
}

.heading-icon{
  width:32px;
  height:32px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#edf8ef;
  font-size:17px;
}

.form-row{
  display:grid;
  grid-template-columns:34px 1fr;
  gap:8px;
  align-items:start;
  margin-bottom:10px;
}

.form-icon{
  width:32px;
  height:32px;
  border-radius:50%;
  background:#f3f3f3;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:14px;
}

.field label{
  display:block;
  font-size:10px;
  font-weight:900;
  margin-bottom:4px;
}

.field input{
  width:100%;
  height:37px;
  border:1px solid #ddd;
  border-radius:10px;
  padding:0 11px;
  outline:none;
  font-size:11px;
}

.field input:focus{border-color:var(--green)}

.payment-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}

.payment{
  min-height:105px;
  border:1.5px solid #ddd;
  border-radius:14px;
  background:#fff;
  padding:9px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
}

.payment.selected{
  border-color:var(--green);
  background:#f1fff4;
  box-shadow:0 0 0 2px rgba(20,148,71,.12);
}

.payment-logo{
  width:47px;
  height:47px;
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  font-weight:950;
  font-size:16px;
}

.yape-logo{
  background:#7427c8;
  color:#fff;
  font-size:15px;
  font-style:italic;
}

.plin-logo{
  background:#08a8d9;
  color:#fff;
  font-size:15px;
  font-weight:950;
}

.bank-logo{
  background:#ffd66b;
  color:#31506d;
  font-size:23px;
}

.cash-logo{
  background:#4bb36a;
  color:#fff;
  font-size:20px;
}

.payment-name{
  text-align:center;
  font-size:11px;
  font-weight:950;
  line-height:1.15;
  color:#171717;
  display:block;
  visibility:visible;
}

.payment-note{
  color:#777;
  font-size:10px;
  margin:9px 0 0;
}

.summary{
  background:#fff;
  border-radius:18px;
  border:1px solid #eee;
  padding:15px;
}

.summary-line{
  display:grid;
  grid-template-columns:45px 1fr auto;
  gap:8px;
  align-items:center;
  padding:7px 0;
  border-bottom:1px solid #f0f0f0;
}

.summary-line img{
  width:45px;
  height:45px;
  border-radius:9px;
  object-fit:cover;
}

.summary-name{
  font-size:11px;
  font-weight:900;
}

.summary-meta{
  color:#777;
  font-size:9px;
  margin-top:2px;
}

.summary-price{
  font-size:11px;
  font-weight:950;
}

.totals{
  padding-top:8px;
}

.total-line{
  display:flex;
  justify-content:space-between;
  padding:4px 0;
  font-size:11px;
}

.total-final{
  border-top:1px solid #ddd;
  margin-top:5px;
  padding-top:9px;
  display:flex;
  justify-content:space-between;
  font-size:18px;
  font-weight:950;
}

.confirm{
  width:100%;
  margin-top:11px;
  border:0;
  background:var(--green);
  color:#fff;
  border-radius:13px;
  padding:14px;
  font-size:14px;
  font-weight:950;
}

.confirm:disabled{opacity:.5}

.success-wrap{
  min-height:calc(100vh - 76px);
  padding:40px 16px 100px;
  display:flex;
  justify-content:center;
}

.success-card{
  width:100%;
  max-width:470px;
  text-align:center;
  background:#fff;
  border-radius:20px;
  padding:30px 18px;
  border:1px solid #eee;
}

.success-check{
  width:80px;
  height:80px;
  margin:0 auto 14px;
  border-radius:50%;
  background:var(--green);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:43px;
}

.success-card h2{
  margin:0;
  font-size:24px;
}

.success-card p{
  color:#666;
  font-size:12px;
  line-height:1.45;
}

.order-box{
  background:#effbf2;
  border-radius:14px;
  padding:12px;
  text-align:left;
  margin:15px 0;
}

.whatsapp{
  width:100%;
  border:0;
  background:#20c866;
  color:#fff;
  border-radius:13px;
  padding:14px;
  font-weight:950;
}

.secondary{
  width:100%;
  margin-top:9px;
  border:1px solid var(--green);
  background:#fff;
  color:var(--green-dark);
  border-radius:13px;
  padding:13px;
  font-weight:950;
}

.info-card{
  margin:12px 10px;
  background:#fff;
  border-radius:18px;
  border:1px solid #eee;
  padding:18px;
}

.info-card h2{
  margin:0 0 8px;
  font-size:20px;
}

.info-card p{
  margin:7px 0;
  color:#666;
  font-size:12px;
  line-height:1.45;
}

.empty{
  text-align:center;
  background:#fff;
  margin:10px;
  padding:45px 20px;
  border-radius:18px;
  color:#777;
}

@media(max-width:700px){
  .products{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hero{min-height:215px}
}

@media(min-width:900px){
  .products{grid-template-columns:repeat(4,minmax(0,1fr))}
}

@media(max-width:360px){
  .brand-name,.brand-name span{font-size:15px}
  .top-cart-total{font-size:10px}
  .products{gap:7px}
  .card-body{padding:6px}
  .card-name{font-size:11px}
}
`;

document.head.appendChild(style);

/* =================================================
   HELPERS
================================================= */

function esc(value){
  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function normalize(value){
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]/g,"");
}

/*
  Imagen de respaldo por producto/categoría.
  Primero se utiliza image_url de public.products si existe.
  Esto permite aprovechar las imágenes que ya estén asociadas
  a los 93 productos en Supabase.
*/
const imageLibrary = {
  papa:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=90",
  tomate:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=90",
  cebolla:"https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=90",
  zanahoria:"https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=90",
  limon:"https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=700&q=90",
  lechuga:"https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=700&q=90",
  brocoli:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=700&q=90",
  pepino:"https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=700&q=90",
  palta:"https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=90",
  platano:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=90",
  manzana:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=90",
  naranja:"https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=90",
  fresa:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=90",
  uva:"https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=90",
  sandia:"https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=700&q=90",
  melon:"https://images.unsplash.com/photo-1498842812179-c81beecf902c?auto=format&fit=crop&w=700&q=90",
  mango:"https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=90",
  piña:"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=90",
  ajo:"https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=700&q=90",
  pimiento:"https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=90",
  aji:"https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=700&q=90",
  espinaca:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=90",
  apio:"https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=700&q=90",
  coliflor:"https://images.unsplash.com/photo-1568584711271-7b0f0a2b1f17?auto=format&fit=crop&w=700&q=90",
  repollo:"https://images.unsplash.com/photo-1598030343246-eec71cb4427d?auto=format&fit=crop&w=700&q=90",
  beterraga:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=90"
};

const fallbackByCategory = {
  verduras:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=90",
  frutas:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=90",
  tuberculos:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=90",
  hierbas:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=90",
  otros:"https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=90"
};

function fallbackImage(name,category){
  const n=normalize(name);
  for(const key of Object.keys(imageLibrary)){
    if(n.includes(normalize(key))) return imageLibrary[key];
  }
  const c=normalize(category);
  return fallbackByCategory[c] || fallbackByCategory.otros;
}

/* =================================================
   SHELL
================================================= */

function renderShell(){
  document.body.innerHTML = `
    <div id="app"></div>

    <nav class="bottom-nav" id="bottomNav">
      <button class="nav active" data-nav="home">
        <span class="nav-icon">⌂</span>
        Inicio
      </button>

      <button class="nav" data-nav="categories">
        <span class="nav-icon">☷</span>
        Categorías
      </button>

      <button class="nav cart" data-nav="cart">
        <span class="nav-icon">🛒</span>
        <span class="badge" id="navBadge">0</span>
        Carrito
      </button>

      <button class="nav" data-nav="orders">
        <span class="nav-icon">▣</span>
        Mis pedidos
      </button>

      <button class="nav" data-nav="account">
        <span class="nav-icon">♙</span>
        Mi cuenta
      </button>
    </nav>
  `;

  document.querySelectorAll("[data-nav]").forEach(btn=>{
    btn.addEventListener("click",()=>navigate(btn.dataset.nav));
  });
}

function header(){
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">🌿</div>
        <div>
          <div class="brand-name">Verdulería <span>Terán</span></div>
          <div class="brand-sub">Productos frescos</div>
        </div>
      </div>

      <button class="top-cart" id="topCart">
        <div class="top-cart-icon">
          🛒
          <span class="badge" id="topBadge">${cartQuantity()}</span>
        </div>
        <div class="top-cart-total">S/ ${cartTotal().toFixed(2)} ›</div>
      </button>
    </header>
  `;
}

function updateBadges(){
  const q=cartQuantity();
  const a=document.getElementById("topBadge");
  const b=document.getElementById("navBadge");
  if(a) a.textContent=q;
  if(b) b.textContent=q;
  const total=document.querySelector(".top-cart-total");
  if(total) total.textContent=`S/ ${cartTotal().toFixed(2)} ›`;
}

/* =================================================
   HOME
================================================= */

function renderHome(){
  currentView="home";

  const app=document.getElementById("app");

  app.innerHTML=`
    ${header()}

    <main class="page">

      <section class="hero">
        <div class="hero-content">
          <h1>Productos <span>frescos</span><br>directo a tu hogar</h1>
          <p>Verdulería Terán</p>
          <div class="delivery">
            🚚 San Borja · San Luis<br>
            San Isidro · La Victoria
          </div>
        </div>
      </section>

      <div class="search-wrap">
        <input id="search" class="search" placeholder="⌕  Buscar productos...">
      </div>

      <div class="categories" id="categories">
        ${["Todos","Verduras","Frutas","Tubérculos","Hierbas"].map(c=>`
          <button class="category ${currentCategory===c?"active":""}" data-category="${esc(c)}">
            ${esc(c)}
          </button>
        `).join("")}
      </div>

      <div class="section-head">
        <h2>Nuestros productos</h2>
        <span class="section-chip">Frescos del día</span>
      </div>

      <section id="products" class="products"></section>

      <section class="fruit-banner">
        <div>
          <h2>Frutas frescas y de temporada</h2>
          <p>Calidad y frescura directo a tu hogar.</p>
        </div>
      </section>

    </main>
  `;

  const topCart=document.getElementById("topCart");
  if(topCart) topCart.addEventListener("click",()=>navigate("cart"));

  document.querySelectorAll("[data-category]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      currentCategory=btn.dataset.category;
      renderHome();
      setTimeout(()=>{
        document.getElementById("products")?.scrollIntoView({behavior:"smooth",block:"start"});
      },30);
    });
  });

  document.getElementById("search").addEventListener("input",renderProductGrid);

  renderProductGrid();
  updateBadges();
}

function renderProductGrid(){
  const box=document.getElementById("products");
  if(!box) return;

  const term=(document.getElementById("search")?.value || "").trim().toLowerCase();

  const list=products.filter(p=>{
    const categoryOk=currentCategory==="Todos" || p.category===currentCategory;
    const textOk=!term || p.name.toLowerCase().includes(term);
    return categoryOk && textOk;
  });

  if(!list.length){
    box.innerHTML=`<div class="empty" style="grid-column:1/-1">No encontramos ese producto.</div>`;
    return;
  }

  box.innerHTML=list.map((p,index)=>`
    <article class="card">
      <div class="card-image">
        <img
          src="${esc(p.image)}"
          alt="${esc(p.name)}"
          loading="lazy"
          onerror="this.src='${esc(fallbackImage(p.name,p.category))}'"
        >
      </div>

      <div class="card-body">
        <div class="card-name">${esc(p.name)}</div>
        <div class="card-unit">${esc(p.unitLabel)}</div>

        <div class="card-bottom">
          <span class="price">S/ ${p.price.toFixed(2)}</span>
          <button class="add" data-add="${p.id}">+</button>
        </div>
      </div>
    </article>
  `).join("");

  box.querySelectorAll("[data-add]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      addToCart(Number(btn.dataset.add));
    });
  });
}

/* =================================================
   CART
================================================= */

function cartQuantity(){
  return cart.reduce((sum,item)=>sum+item.quantity,0);
}

function cartTotal(){
  return cart.reduce((sum,item)=>sum+(item.price*item.quantity),0);
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p) return;

  const item=cart.find(x=>x.id===id);

  if(item) item.quantity++;
  else cart.push({...p,quantity:1});

  updateBadges();

  if(currentView==="cart") renderCart();
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item) return;

  item.quantity+=delta;

  if(item.quantity<=0){
    cart=cart.filter(x=>x.id!==id);
  }

  updateBadges();
  renderCart();
}

function removeItem(id){
  cart=cart.filter(x=>x.id!==id);
  updateBadges();
  renderCart();
}

function renderCart(){
  currentView="cart";

  const app=document.getElementById("app");

  app.innerHTML=`
    ${header()}

    <div class="screen-head">
      <button class="back" id="backHome">‹</button>
      <h1 class="screen-title">Mi carrito</h1>
    </div>

    ${
      cart.length
      ? `
        <main class="page">

          <section class="cart-list">
            ${cart.map(item=>`
              <article class="cart-item">

                <img
                  src="${esc(item.image)}"
                  alt="${esc(item.name)}"
                  onerror="this.src='${esc(fallbackImage(item.name,item.category))}'"
                >

                <div>
                  <div class="cart-item-name">${esc(item.name)}</div>
                  <div class="cart-item-meta">S/ ${item.price.toFixed(2)} · ${esc(item.unitLabel)}</div>

                  <div class="qty">
                    <button data-minus="${item.id}">−</button>
                    <strong>${item.quantity}</strong>
                    <button data-plus="${item.id}">+</button>
                  </div>
                </div>

                <div class="cart-item-right">
                  <button class="remove" data-remove="${item.id}">🗑</button>
                  <strong>S/ ${(item.price*item.quantity).toFixed(2)}</strong>
                </div>

              </article>
            `).join("")}
          </section>

          <div class="cart-subtotal">
            <span>Total (${cartQuantity()} productos)</span>
            <strong>S/ ${cartTotal().toFixed(2)}</strong>
          </div>

          <button class="primary" id="continueOrder">
            Continuar con el pedido →
          </button>

        </main>
      `
      : `
        <div class="empty">
          <div style="font-size:48px">🛒</div>
          <strong>Tu carrito está vacío.</strong>
          <p>Agrega productos para continuar.</p>
        </div>
      `
    }
  `;

  document.getElementById("backHome")?.addEventListener("click",()=>navigate("home"));
  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));

  document.querySelectorAll("[data-minus]").forEach(b=>{
    b.addEventListener("click",()=>changeQty(Number(b.dataset.minus),-1));
  });

  document.querySelectorAll("[data-plus]").forEach(b=>{
    b.addEventListener("click",()=>changeQty(Number(b.dataset.plus),1));
  });

  document.querySelectorAll("[data-remove]").forEach(b=>{
    b.addEventListener("click",()=>removeItem(Number(b.dataset.remove)));
  });

  document.getElementById("continueOrder")?.addEventListener("click",openCheckout);

  updateBadges();
}

/* =================================================
   CHECKOUT
================================================= */

function openCheckout(){
  if(!cart.length){
    navigate("cart");
    return;
  }

  currentView="checkout";
  selectedPayment="";

  const app=document.getElementById("app");

  app.innerHTML=`
    ${header()}

    <main class="page checkout">

      <section class="checkout-card">

        <h2 class="checkout-heading">
          <span class="heading-icon">🚚</span>
          Datos de entrega
        </h2>

        <div class="form-row">
          <div class="form-icon">♙</div>
          <div class="field">
            <label>Nombre completo</label>
            <input id="name" placeholder="Tu nombre completo">
          </div>
        </div>

        <div class="form-row">
          <div class="form-icon">☎</div>
          <div class="field">
            <label>Teléfono / WhatsApp</label>
            <input id="phone" type="tel" placeholder="Tu número">
          </div>
        </div>

        <div class="form-row">
          <div class="form-icon">⌖</div>
          <div class="field">
            <label>Dirección de entrega</label>
            <input id="address" placeholder="Tu dirección">
          </div>
        </div>

        <div class="form-row" style="margin-bottom:0">
          <div class="form-icon">▤</div>
          <div class="field">
            <label>Referencia (opcional)</label>
            <input id="reference" placeholder="Ej. departamento, edificio, etc.">
          </div>
        </div>

      </section>

      <section class="checkout-card">

        <h2 class="checkout-heading">
          <span class="heading-icon">▰</span>
          Forma de pago
        </h2>

        <div class="payment-grid">

          <button class="payment" data-payment="Yape">
            <div class="payment-logo yape-logo">yape</div>
            <div class="payment-name">Yape</div>
          </button>

          <button class="payment" data-payment="Plin">
            <div class="payment-logo plin-logo">plin</div>
            <div class="payment-name">Plin</div>
          </button>

          <button class="payment" data-payment="Transferencia bancaria">
            <div class="payment-logo bank-logo">🏦</div>
            <div class="payment-name">Transferencia<br>bancaria</div>
          </button>

          <button class="payment" data-payment="Efectivo / Pago contra entrega">
            <div class="payment-logo cash-logo">S/</div>
            <div class="payment-name">Pago contra<br>entrega</div>
          </button>

        </div>

        <p class="payment-note">Selecciona una forma de pago.</p>

      </section>

      <section class="summary">

        <h2 class="checkout-heading">
          <span class="heading-icon">▤</span>
          Resumen del pedido
        </h2>

        ${cart.map(item=>`
          <div class="summary-line">
            <img
              src="${esc(item.image)}"
              alt="${esc(item.name)}"
              onerror="this.src='${esc(fallbackImage(item.name,item.category))}'"
            >
            <div>
              <div class="summary-name">${esc(item.name)}</div>
              <div class="summary-meta">${item.quantity} ${esc(item.unitLabel)} × S/ ${item.price.toFixed(2)}</div>
            </div>
            <div class="summary-price">S/ ${(item.price*item.quantity).toFixed(2)}</div>
          </div>
        `).join("")}

        <div class="totals">
          <div class="total-line">
            <span>Subtotal</span>
            <strong>S/ ${cartTotal().toFixed(2)}</strong>
          </div>

          <div class="total-line">
            <span>Costo de envío</span>
            <strong>S/ 0.00</strong>
          </div>

          <div class="total-final">
            <span>TOTAL</span>
            <strong>S/ ${cartTotal().toFixed(2)}</strong>
          </div>
        </div>

        <button class="confirm" id="confirm">
          ✓ Confirmar pedido
        </button>

      </section>

    </main>
  `;

  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));

  document.querySelectorAll("[data-payment]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-payment]").forEach(x=>x.classList.remove("selected"));
      btn.classList.add("selected");
      selectedPayment=btn.dataset.payment;
    });
  });

  document.getElementById("confirm").addEventListener("click",saveOrder);

  updateBadges();
  window.scrollTo(0,0);
}

/* =================================================
   SAVE ORDER
================================================= */

async function saveOrder(){

  const name=document.getElementById("name").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const address=document.getElementById("address").value.trim();
  const reference=document.getElementById("reference").value.trim();

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

  const button=document.getElementById("confirm");
  button.disabled=true;
  button.textContent="Registrando pedido...";

  const orderProducts=cart.map(item=>({
    id:item.id,
    nombre:item.name,
    cantidad:item.quantity,
    unidad:item.unit,
    precio:item.price,
    subtotal:Number((item.price*item.quantity).toFixed(2))
  }));

  const total=Number(cartTotal().toFixed(2));

  try{

    const {error}=await client
      .from("pedidos")
      .insert({
        nombre_cliente:name,
        telefono:phone,
        direccion:address,
        referencia:reference || null,
        forma_pago:selectedPayment,
        productos:orderProducts,
        total,
        estado:"Pendiente"
      });

    if(error) throw error;

    const text=buildWhatsAppMessage({
      name,
      phone,
      address,
      reference,
      payment:selectedPayment,
      total,
      products:orderProducts
    });

    showSuccess(text);

  }catch(error){

    console.error("Error registrando pedido:",error);

    button.disabled=false;
    button.textContent="✓ Confirmar pedido";

    alert("No se pudo registrar el pedido. Revisa tu conexión e inténtalo nuevamente.");
  }
}

function buildWhatsAppMessage(order){

  let text=
`*NUEVO PEDIDO - VERDULERÍA TERÁN*\n\n`;

  text+=`*Cliente:* ${order.name}\n`;
  text+=`*Teléfono:* ${order.phone}\n`;
  text+=`*Dirección:* ${order.address}\n`;

  if(order.reference){
    text+=`*Referencia:* ${order.reference}\n`;
  }

  text+=`*Pago:* ${order.payment}\n\n`;
  text+=`*PRODUCTOS:*\n`;

  order.products.forEach(item=>{
    text+=`• ${item.nombre} x ${item.cantidad} ${item.unidad} = S/ ${item.subtotal.toFixed(2)}\n`;
  });

  text+=`\n*TOTAL: S/ ${order.total.toFixed(2)}*`;

  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/* =================================================
   SUCCESS
================================================= */

function showSuccess(whatsappUrl){

  currentView="success";

  document.getElementById("app").innerHTML=`
    ${header()}

    <main class="success-wrap">

      <section class="success-card">

        <div class="success-check">✓</div>

        <h2>¡Pedido registrado!</h2>

        <p>
          Tu pedido fue registrado correctamente en Verdulería Terán.
        </p>

        <p>
          Ahora puedes enviarlo por WhatsApp para que podamos confirmarlo.
        </p>

        <div class="order-box">
          <strong>Estado del pedido</strong><br>
          <span style="font-size:12px;color:#277443">Pendiente de confirmación</span>
        </div>

        <button class="whatsapp" id="sendWhatsApp">
          ◉ Enviar pedido por WhatsApp
        </button>

        <button class="secondary" id="buyAgain">
          ⌂ Volver a comprar
        </button>

      </section>

    </main>
  `;

  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));

  document.getElementById("sendWhatsApp").addEventListener("click",()=>{
    window.open(whatsappUrl,"_blank");
  });

  document.getElementById("buyAgain").addEventListener("click",()=>{
    cart=[];
    selectedPayment="";
    updateBadges();
    navigate("home");
  });

  updateBadges();
}

/* =================================================
   OTHER SCREENS
================================================= */

function renderOrders(){
  currentView="orders";

  document.getElementById("app").innerHTML=`
    ${header()}
    <main class="page">
      <section class="info-card">
        <h2>Mis pedidos</h2>
        <p>Los pedidos registrados se procesan como <strong>Pendiente</strong> hasta su confirmación.</p>
        <p>Para consultar un pedido, puedes comunicarte con Verdulería Terán por WhatsApp.</p>
        <button class="primary" id="orderBack">Volver al inicio</button>
      </section>
    </main>
  `;

  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("orderBack").addEventListener("click",()=>navigate("home"));
}

function renderAccount(){
  currentView="account";

  document.getElementById("app").innerHTML=`
    ${header()}
    <main class="page">
      <section class="info-card">
        <h2>Mi cuenta</h2>
        <p>Compra productos frescos de Verdulería Terán y recibe tu pedido en las zonas de reparto disponibles.</p>
        <p><strong>Reparto:</strong> San Borja, San Luis, San Isidro y La Victoria.</p>
        <button class="primary" id="accountBack">Volver al inicio</button>
      </section>
    </main>
  `;

  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("accountBack").addEventListener("click",()=>navigate("home"));
}

function navigate(view){

  if(view==="home"){
    renderHome();
    return;
  }

  if(view==="categories"){
    currentCategory="Todos";
    renderHome();
    setTimeout(()=>{
      document.getElementById("categories")?.scrollIntoView({behavior:"smooth",block:"start"});
    },50);
    return;
  }

  if(view==="cart"){
    renderCart();
    return;
  }

  if(view==="orders"){
    renderOrders();
    return;
  }

  if(view==="account"){
    renderAccount();
    return;
  }
}

/* =================================================
   LOAD PRODUCTS
================================================= */

// Catálogo de respaldo: evita que la pantalla quede vacía si Supabase tarda
// o no responde. Cuando Supabase responde con productos, estos reemplazan
// automáticamente este catálogo de respaldo.
const starterCatalog = [
  {id:-1,name:"Tomate",category:"Verduras",unit:"kg",price:4.50},
  {id:-2,name:"Cebolla roja",category:"Verduras",unit:"kg",price:3.80},
  {id:-3,name:"Zanahoria",category:"Verduras",unit:"kg",price:2.50},
  {id:-4,name:"Lechuga",category:"Verduras",unit:"unidad",price:2.00},
  {id:-5,name:"Limón",category:"Frutas",unit:"kg",price:5.00},
  {id:-6,name:"Papa amarilla",category:"Tubérculos",unit:"kg",price:3.50},
  {id:-7,name:"Brócoli",category:"Verduras",unit:"kg",price:5.00},
  {id:-8,name:"Pepino criollo",category:"Verduras",unit:"kg",price:3.20},
  {id:-9,name:"Culantro",category:"Hierbas",unit:"atado",price:1.50},
  {id:-10,name:"Papa blanca",category:"Tubérculos",unit:"kg",price:3.50}
];

function useCatalogRows(rows){
  products.length=0;
  (rows || []).forEach(row=>{
    const category=row.categoria || row.category || "Otros";
    const name=row.nombre || row.name || "Producto";
    const unit=row.unidad || row.unit || "kg";
    products.push({
      id:row.id,
      name,
      category,
      unit,
      unitLabel:unitLabel(unit),
      price:Number(row.precio ?? row.price)||0,
      image:fallbackImage(name,category)
    });
  });
  renderProductGrid();
}

async function loadProducts(){

  // Mostrar inmediatamente un catálogo válido. Esto evita la pantalla
  // vacía mientras Supabase responde.
  useCatalogRows(starterCatalog);

  if(!SUPABASE_READY || !client){
    return;
  }

  try{
    const request=client
      .from("productos")
      .select("*")
      .order("id");

    const timeout=new Promise((_,reject)=>
      setTimeout(()=>reject(new Error("TIMEOUT_PRODUCTS")),7000)
    );

    const result=await Promise.race([request,timeout]);

    if(!result.error && Array.isArray(result.data) && result.data.length){
      const activeRows=result.data.filter(row=>row.activo !== false);
      useCatalogRows(activeRows.length ? activeRows : result.data);
    }
  }catch(error){
    console.warn("Catálogo remoto no disponible; se mantiene el catálogo de respaldo.",error);
  }
}

function unitLabel(unit){

  const u=String(unit||"kg").toLowerCase();

  if(u==="kg" || u==="kilo" || u==="kilos") return "Venta por kg";
  if(u==="1/2 kg" || u==="medio kilo") return "Venta por 1/2 kg";
  if(u==="unidad" || u==="und") return "Venta por unidad";
  if(u==="atado") return "Venta por atado";
  if(u.includes("250")) return "Bandeja 250 g";
  if(u.includes("200")) return "Bandeja 200 g";

  return `Venta por ${unit}`;
}

/* =================================================
   START
================================================= */

renderShell();
renderHome();
loadProducts();
