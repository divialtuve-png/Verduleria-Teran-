/*
====================================================
 VERDULERÍA TERÁN — VERSIÓN FINAL
 Diseño: referencia aprobada
 Funciones: Supabase + carrito + checkout + pagos
           + pedidos + WhatsApp
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
  transform:translateZ(0);
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
  margin:12px 10px 0;
  min-height:225px;
  border-radius:19px;
  overflow:hidden;
  position:relative;
  background:linear-gradient(90deg,rgba(3,77,34,.95),rgba(34,112,54,.82)),radial-gradient(circle at 78% 25%,#c6a33f 0 8%,transparent 9%),radial-gradient(circle at 68% 48%,#e05a43 0 10%,transparent 11%),radial-gradient(circle at 88% 64%,#7bb34d 0 12%,transparent 13%),linear-gradient(135deg,#1c6334,#315e35);
}

.hero-content{
  padding:27px 22px;
  color:#fff;
}

.hero h1{
  margin:0;
  font-size:29px;
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
  aspect-ratio:1/0.92;
  background:#f7faf4;
  overflow:hidden;
  padding:5px;
}

.card-image img{
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius:12px;
}

.card-body{padding:7px}

.card-name{
  min-height:30px;
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

.card .add{background:var(--green)}

.fruit-banner{
  margin:15px 10px 0;
  min-height:125px;
  border-radius:18px;
  overflow:hidden;
  background:linear-gradient(90deg,#9b4d13,#d89a38);
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
  font-size:10px;
  font-weight:950;
  line-height:1.15;
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
  .products{grid-template-columns:repeat(3,minmax(0,1fr)) !important;gap:6px}
  .hero{min-height:215px}
}

@media(min-width:900px){
  .products{grid-template-columns:repeat(4,minmax(0,1fr))}
}

@media(max-width:360px){
  .products{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
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
function svgImage(kind,label){
  const safe=esc(label);
  let art='';
  if(kind==='papa') art=`<g fill="#c99a62"><ellipse cx="95" cy="86" rx="54" ry="34"/><ellipse cx="166" cy="112" rx="52" ry="35"/><ellipse cx="112" cy="150" rx="48" ry="32"/><ellipse cx="205" cy="167" rx="58" ry="37"/></g>`;
  else if(kind==='tomate') art=`<g fill="#e64a3b"><circle cx="86" cy="115" r="34"/><circle cx="145" cy="105" r="36"/><circle cx="207" cy="118" r="34"/></g><path d="M145 73l-13-22 22 12 18-13-7 24" fill="#3d9b4d"/>`;
  else if(kind==='cebolla') art=`<path d="M145 48c-8 18-31 23-45 43-25 35-4 81 45 81s70-46 45-81c-14-20-37-25-45-43z" fill="#c9a4d8"/><path d="M145 48v-22" stroke="#4f9c4a" stroke-width="9" stroke-linecap="round"/>`;
  else if(kind==='zanahoria') art=`<path d="M105 76l82 0-38 124c-8 22-36 22-44 0z" fill="#f08a22"/><path d="M125 72c-8-28-25-35-39-41M145 72c2-31 16-42 31-52M164 75c14-24 29-28 44-30" stroke="#4c9a4b" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  else if(kind==='lechuga') art=`<g fill="#5eaa52"><circle cx="105" cy="119" r="47"/><circle cx="159" cy="92" r="48"/><circle cx="199" cy="126" r="48"/><circle cx="151" cy="143" r="55"/></g>`;
  else if(kind==='limon') art=`<g fill="#f4d447"><ellipse cx="105" cy="120" rx="42" ry="31" transform="rotate(-18 105 120)"/><ellipse cx="174" cy="111" rx="43" ry="32" transform="rotate(14 174 111)"/><ellipse cx="145" cy="156" rx="40" ry="30" transform="rotate(-8 145 156)"/></g>`;
  else if(kind==='brocoli') art=`<g fill="#4e9c45"><circle cx="103" cy="92" r="34"/><circle cx="151" cy="77" r="40"/><circle cx="198" cy="95" r="34"/><circle cx="123" cy="124" r="40"/><circle cx="178" cy="128" r="42"/></g><path d="M139 124v70h24v-70" fill="#6e8e45"/>`;
  else if(kind==='platano') art=`<path d="M79 72c19 75 67 100 121 56 17-14 31-14 42-3-13 42-48 66-87 68-61 3-93-39-76-121z" fill="#f5d34d" stroke="#d4ae2d" stroke-width="7"/>`;
  else if(kind==='manzana') art=`<path d="M145 83c-42-33-83 7-69 58 13 47 50 70 69 70s56-23 69-70c14-51-27-91-69-58z" fill="#df4b46"/><path d="M145 84c-4-27 12-39 29-46" stroke="#4f9148" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  else if(kind==='pepino') art=`<g fill="#6da84f"><rect x="62" y="84" width="166" height="50" rx="25" transform="rotate(-12 145 109)"/><circle cx="100" cy="103" r="4" fill="#dce9b0"/><circle cx="153" cy="91" r="4" fill="#dce9b0"/><circle cx="194" cy="107" r="4" fill="#dce9b0"/></g>`;
  else if(kind==='palta') art=`<path d="M147 47c-41 4-70 43-66 86 4 46 29 78 65 78s61-32 65-78c4-43-23-82-64-86z" fill="#5b9b45"/><ellipse cx="147" cy="137" rx="29" ry="31" fill="#d9b45a"/>`;
  else if(kind==='naranja'||kind==='mandarina') art=`<circle cx="145" cy="128" r="68" fill="#f39b24"/><circle cx="145" cy="128" r="55" fill="#ffb13b" opacity=".55"/><path d="M145 61c9-20 24-28 41-25" stroke="#4f9148" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  else if(kind==='fresa') art=`<path d="M75 94c0-35 35-51 70-29 35-22 70-6 70 29 0 45-70 98-70 98S75 139 75 94z" fill="#e94b48"/><path d="M145 64l-18-22M145 64l23-21M145 65l0-28" stroke="#4f9b4b" stroke-width="9" stroke-linecap="round"/>`;
  else if(kind==='uva') art=`<g fill="#7550a5"><circle cx="125" cy="82" r="23"/><circle cx="165" cy="83" r="23"/><circle cx="105" cy="117" r="23"/><circle cx="145" cy="118" r="23"/><circle cx="185" cy="117" r="23"/><circle cx="125" cy="151" r="23"/><circle cx="165" cy="151" r="23"/><circle cx="145" cy="184" r="23"/></g>`;
  else if(kind==='sandia') art=`<path d="M70 85h150c-8 73-44 111-75 111S78 158 70 85z" fill="#4e9b4b"/><path d="M83 91h124c-10 53-33 78-62 78S93 144 83 91z" fill="#f25c4c"/><circle cx="115" cy="123" r="4" fill="#222"/><circle cx="145" cy="142" r="4" fill="#222"/><circle cx="174" cy="120" r="4" fill="#222"/>`;
  else if(kind==='mango') art=`<path d="M90 80c34-38 94-27 115 12 20 38-1 95-48 108-47 13-84-22-82-67 1-22 7-39 15-53z" fill="#f2a52e"/>`;
  else if(kind==='piña') art=`<path d="M145 64c-43 0-63 32-55 88 7 48 30 69 55 69s48-21 55-69c8-56-12-88-55-88z" fill="#d7aa38"/><path d="M145 65C118 44 111 27 119 14M145 65c-3-28 7-47 22-61M145 65c25-20 43-24 57-17" stroke="#4e9848" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  else art=`<g fill="#6aa94f"><circle cx="105" cy="118" r="42"/><circle cx="150" cy="96" r="45"/><circle cx="194" cy="121" r="42"/><circle cx="151" cy="145" r="49"/></g>`;
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 220"><rect width="290" height="220" rx="18" fill="#f8fbf2"/><g>${art}</g><text x="145" y="207" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#24452c">${safe}</text></svg>`);
}

function productKind(name){
  const n=normalize(name);
  const map=[['papa','papa'],['tomate','tomate'],['cebolla','cebolla'],['zanahoria','zanahoria'],['lechuga','lechuga'],['limon','limon'],['brocoli','brocoli'],['pepino','pepino'],['palta','palta'],['platano','platano'],['manzana','manzana'],['naranja','naranja'],['mandarina','naranja'],['fresa','fresa'],['uva','uva'],['sandia','sandia'],['mango','mango'],['pina','piña']];
  for(const [needle,kind] of map) if(n.includes(needle)) return kind;
  return 'generic';
}

const PHOTO_LIBRARY = {
  tomate: "https://images.unsplash.com/photo-1531730724745-a8d774fd1e64?auto=format&fit=crop&w=700&q=82",
  cebolla: "https://images.unsplash.com/photo-1594100585814-106545bd6e49?auto=format&fit=crop&w=700&q=82",
  zanahoria: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=82",
  lechuga: "https://images.unsplash.com/photo-1692606280428-7df25e4daefb?auto=format&fit=crop&w=700&q=82",
  limon: "https://images.unsplash.com/photo-1592951271867-b4e76e837658?auto=format&fit=crop&w=700&q=82",
  manzana: "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?auto=format&fit=crop&w=700&q=82",
  platano: "https://images.unsplash.com/photo-1623810836868-057b23aef3aa?auto=format&fit=crop&w=700&q=82",
  papa: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Potatoes.jpg?auto=format&fit=crop&w=700&q=82"
};

function photoFallback(name,category){
  const n=normalize(name);
  for(const [key,url] of Object.entries(PHOTO_LIBRARY)){
    if(n.includes(key)) return url;
  }
  return null;
}

function fallbackImage(name,category){
  return photoFallback(name,category) || svgImage(productKind(name),name);
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
          onerror="this.onerror=null;this.src='${esc(svgImage(productKind(p.name),p.name))}'"
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
                  onerror="this.onerror=null;this.src='${esc(svgImage(productKind(item.name),item.name))}'"
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
            <div class="payment-logo yape-logo"><span>Yape</span></div>
            <div class="payment-name">Yape</div>
          </button>

          <button class="payment" data-payment="Plin">
            <div class="payment-logo plin-logo"><span>Plin</span></div>
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
              onerror="this.onerror=null;this.src='${esc(svgImage(productKind(item.name),item.name))}'"
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
  button.textContent="Registrando pedido…";

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
      .insert([{
        nombre_cliente:name,
        telefono:phone,
        direccion:address,
        referencia:reference || null,
        forma_pago:selectedPayment,
        productos:orderProducts,
        total,
        estado:"Pendiente"
      }]);

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

    alert("No se pudo registrar el pedido. " + (error?.message || "Revisa la configuración de pedidos en Supabase."));
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

async function loadProducts(){

  const result=await Promise.all([
    client
      .from("productos")
      .select("*")
      .eq("activo",true)
      .order("id"),

    client
      .from("products")
      .select("id,name,description,image_url,active,stock,category_id")
  ]);

  const productosResult=result[0];
  const imagesResult=result[1];

  if(productosResult.error){
    console.error(productosResult.error);
    const box=document.getElementById("products");
    if(box){
      box.innerHTML=`
        <div class="empty" style="grid-column:1/-1">
          No se pudieron cargar los productos.
        </div>
      `;
    }
    return;
  }

  const imageMap=new Map();

  if(!imagesResult.error && Array.isArray(imagesResult.data)){
    imagesResult.data.forEach(row=>{
      if(row.name){
        imageMap.set(normalize(row.name),row.image_url || "");
      }
    });
  }

  products.length=0;

  productosResult.data.forEach(row=>{

    const category=row.categoria || "Otros";
    const name=row.nombre || "Producto";

    const mappedImage=imageMap.get(normalize(name));
    const photoImage=photoFallback(name,category);

    products.push({
      id:row.id,
      name,
      category,
      unit:row.unidad || "kg",
      unitLabel:unitLabel(row.unidad),
      price:Number(row.precio)||0,
      image:mappedImage || photoImage || svgImage(productKind(name),name)
    });
  });

  renderHome();
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
