/* =========================================================
   VERDULERÍA TERÁN
   APP COMPLETA
========================================================= */

const client = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

const BUSINESS_WHATSAPP = "51983130700";

const products = [];
let cart = [];
let currentCategory = "";

/* =========================================================
   ESTILOS
========================================================= */

const style = document.createElement("style");

style.textContent = `
*{
  box-sizing:border-box;
}

body{
  margin:0;
  font-family:Arial,Helvetica,sans-serif;
  background:#fffaf4;
  color:#222;
}

header{
  display:none;
}

main{
  max-width:1200px;
  margin:auto;
  padding:110px 16px 100px;
}

#search{
  width:100%;
  height:50px;
  border:2px solid #eee;
  border-radius:16px;
  padding:0 18px;
  font-size:16px;
  background:#fff;
  outline:none;
  box-shadow:0 4px 15px rgba(0,0,0,.06);
}

#search:focus{
  border-color:#ff7043;
}

#category{
  display:none !important;
}

.top-cart{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:1000;
  height:82px;
  background:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 16px;
  box-shadow:0 3px 15px rgba(0,0,0,.12);
}

.top-cart-left{
  display:flex;
  align-items:center;
  gap:10px;
}

.top-cart-image{
  width:58px;
  height:58px;
  border-radius:16px;
  object-fit:cover;
}

.top-cart-title strong{
  display:block;
  font-size:17px;
  color:#222;
}

.top-cart-title span{
  font-size:13px;
  color:#777;
}

.cart-total{
  background:#e91e63;
  color:white;
  font-weight:bold;
  padding:11px 15px;
  border-radius:20px;
  white-space:nowrap;
}

.cart-badge{
  position:absolute;
  left:55px;
  top:5px;
  background:#ff1744;
  color:#fff;
  width:22px;
  height:22px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:bold;
}

.hero{
  margin:0 0 20px;
  min-height:240px;
  border-radius:24px;
  overflow:hidden;
  position:relative;
  background-image:
    linear-gradient(90deg,rgba(0,0,0,.68),rgba(0,0,0,.18)),
    url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200");
  background-size:cover;
  background-position:center;
  display:flex;
  align-items:center;
  padding:30px;
  color:#fff;
}

.hero h2{
  margin:0 0 10px;
  font-size:36px;
  line-height:1.05;
}

.hero h2 span{
  color:#ff9800;
}

.hero p{
  margin:6px 0;
  font-size:16px;
}

.hero-small{
  font-size:14px !important;
  opacity:.95;
}

.categories{
  display:flex;
  gap:9px;
  overflow-x:auto;
  padding:4px 0 18px;
  scrollbar-width:none;
}

.categories::-webkit-scrollbar{
  display:none;
}

.category-chip{
  border:0;
  padding:11px 17px;
  border-radius:25px;
  background:#fff;
  box-shadow:0 3px 12px rgba(0,0,0,.08);
  font-weight:bold;
  white-space:nowrap;
  cursor:pointer;
}

.category-chip.active{
  background:#43a047;
  color:white;
}

.section-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin:8px 0 15px;
}

.section-title h2{
  margin:0;
  font-size:24px;
}

.section-title span{
  background:#ffca28;
  padding:7px 11px;
  border-radius:15px;
  font-size:12px;
  font-weight:bold;
}

#products{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:13px;
}

.product-card{
  background:#fff;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 4px 15px rgba(0,0,0,.08);
  border:1px solid #f1f1f1;
}

.product-image{
  width:100%;
  height:135px;
  object-fit:cover;
  background:#f3f3f3;
}

.product-info{
  padding:12px;
}

.product-name{
  font-size:16px;
  font-weight:bold;
  margin-bottom:5px;
}

.product-unit{
  font-size:12px;
  color:#777;
  margin-bottom:8px;
}

.product-price{
  font-size:18px;
  font-weight:bold;
  margin-bottom:10px;
}

.add-button{
  width:100%;
  border:0;
  border-radius:12px;
  padding:11px 8px;
  color:#fff;
  font-weight:bold;
  cursor:pointer;
  background:#43a047;
}

.add-button:nth-child(odd){
  background:#e91e63;
}

.qty-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:5px;
}

.qty-row button{
  width:34px;
  height:34px;
  border:0;
  border-radius:10px;
  font-size:19px;
  font-weight:bold;
  cursor:pointer;
  background:#eee;
}

.qty-number{
  font-weight:bold;
}

.fresh-banner{
  margin:25px 0;
  min-height:150px;
  border-radius:22px;
  padding:25px;
  color:#fff;
  display:flex;
  align-items:center;
  background-image:
    linear-gradient(90deg,rgba(0,0,0,.55),rgba(0,0,0,.05)),
    url("https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1000");
  background-size:cover;
  background-position:center;
}

.fresh-banner h2{
  margin:0 0 6px;
  font-size:25px;
}

.bottom-nav{
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  z-index:1000;
  height:70px;
  background:#fff;
  box-shadow:0 -3px 15px rgba(0,0,0,.12);
  display:flex;
  justify-content:space-around;
  align-items:center;
}

.bottom-nav button{
  border:0;
  background:transparent;
  font-size:11px;
  color:#777;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:3px;
}

.bottom-nav .cart-nav{
  width:54px;
  height:54px;
  border-radius:50%;
  background:#43a047;
  color:#fff;
  margin-top:-25px;
  font-size:12px;
  box-shadow:0 4px 12px rgba(67,160,71,.4);
}

#cart{
  position:fixed;
  bottom:78px;
  left:12px;
  right:12px;
  z-index:900;
  background:#fff;
  border-radius:20px;
  padding:16px;
  box-shadow:0 5px 25px rgba(0,0,0,.2);
}

#cart strong{
  font-size:18px;
}

#cart button{
  width:100%;
  border:0;
  border-radius:14px;
  background:#e91e63;
  color:#fff;
  padding:13px;
  font-weight:bold;
  font-size:16px;
}

.cart-item{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:9px 0;
  border-bottom:1px solid #eee;
}

.cart-item-name{
  flex:1;
  font-weight:bold;
  font-size:14px;
}

.cart-controls{
  display:flex;
  align-items:center;
  gap:5px;
}

.cart-controls button{
  width:30px !important;
  height:30px;
  padding:0 !important;
  border-radius:8px !important;
  font-size:15px !important;
  background:#eee !important;
  color:#222 !important;
}

.checkout-box{
  background:#fff;
  border-radius:20px;
  padding:20px;
  box-shadow:0 4px 20px rgba(0,0,0,.1);
  margin-top:20px;
}

.checkout-box input,
.checkout-box textarea{
  width:100%;
  padding:13px;
  margin:7px 0;
  border:1px solid #ddd;
  border-radius:12px;
  font-size:15px;
}

.payment-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin:12px 0;
}

.payment-button{
  border:2px solid #eee;
  background:#fff;
  border-radius:14px;
  padding:14px 8px;
  font-weight:bold;
}

.payment-button.selected{
  border-color:#43a047;
  background:#e8f5e9;
}

.primary-button{
  width:100%;
  border:0;
  border-radius:14px;
  padding:14px;
  background:#43a047;
  color:#fff;
  font-weight:bold;
  font-size:16px;
}

.whatsapp-button{
  width:100%;
  border:0;
  border-radius:14px;
  padding:14px;
  background:#25d366;
  color:#fff;
  font-weight:bold;
  font-size:16px;
  margin-top:10px;
}

@media(min-width:700px){
  main{
    padding-left:25px;
    padding-right:25px;
  }

  #products{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }

  .product-image{
    height:170px;
  }
}
`;

document.head.appendChild(style);

/* =========================================================
   FUNCIONES AUXILIARES
========================================================= */

function cleanName(name){
  return String(name || "")
    .replace(/^[🌱🥬🍅🥕🍋🍎🍌🌿🧅🥦🍊🍉🍇🍓🥔🫑]+/g,"")
    .trim();
}

function getEmoji(name){
  const n = cleanName(name).toLowerCase();

  if(n.includes("papa")) return "🥔";
  if(n.includes("tomate")) return "🍅";
  if(n.includes("cebolla")) return "🧅";
  if(n.includes("zanahoria")) return "🥕";
  if(n.includes("limón") || n.includes("limon")) return "🍋";
  if(n.includes("lechuga")) return "🥬";
  if(n.includes("culantro")) return "🌿";
  if(n.includes("perejil")) return "🌿";
  if(n.includes("brócoli") || n.includes("brocoli")) return "🥦";
  if(n.includes("plátano") || n.includes("platano")) return "🍌";
  if(n.includes("manzana")) return "🍎";
  if(n.includes("naranja")) return "🍊";
  if(n.includes("uva")) return "🍇";
  if(n.includes("fresa")) return "🍓";
  if(n.includes("sandía") || n.includes("sandia")) return "🍉";
  if(n.includes("ají") || n.includes("aji")) return "🌶️";
  if(n.includes("pimiento")) return "🫑";

  return "🥕";
}

  function getImage(name){
    const n = cleanName(name).toLowerCase();
  
    const images = {
      papa:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
      tomate:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500",
      cebolla:"https://images.unsplash.com/photo-1518977956818-3c1c7b9f5d0b?w=500",
      zanahoria:"https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500",
      limon:"https://images.unsplash.com/photo-1590502593747-42a996133562?w=500",
      lechuga:"https://images.unsplash.com/photo-1622205313162-be1d5712a43b?w=500",
      brocoli:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500",
      platano:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
      manzana:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
      naranja:"https://images.unsplash.com/photo-1547514701-42782101795e?w=500",
      uva:"https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500",
      fresa:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500"
    };
  
    for(const key in images){
      if(n.includes(key)) return images[key];
    }
  
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";
  }

/* =========================================================
   CARGAR PRODUCTOS
========================================================= */

async function loadProducts(){

  const section = document.getElementById("products");

  try{

    section.innerHTML = "Cargando productos...";

    const { data, error } = await client
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id");

    if(error) throw error;

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

    render();

  }catch(error){

    console.error(error);

    section.innerHTML =
      "<div style='grid-column:1/-1;text-align:center;padding:30px'>No se pudieron cargar los productos.</div>";
  }
}

/* =========================================================
   RENDER PRODUCTOS
========================================================= */

function render(){

  const section = document.getElementById("products");

  const searchInput = document.getElementById("search");

  const search = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const filtered = products.filter(p => {

    const matchesSearch =
      cleanName(p.name).toLowerCase().includes(search);

    const matchesCategory =
      !currentCategory ||
      p.category === currentCategory;

    return matchesSearch && matchesCategory;
  });

  section.innerHTML = "";

  if(filtered.length === 0){

    section.innerHTML =
      "<div style='grid-column:1/-1;text-align:center;padding:35px'>No encontramos productos.</div>";

    updateTopCart();
    return;
  }

  filtered.forEach(p => {

    const item = cart.find(x => x.id === p.id);

    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `
      <img
        class="product-image"
        src="${getImage(p.name)}"
        alt="${cleanName(p.name)}"
        onerror="this.style.display='none'"
      >

      <div class="product-info">

        <div class="product-name">
          ${getEmoji(p.name)} ${cleanName(p.name)}
        </div>

        <div class="product-unit">
          ${p.unit}
        </div>

        <div class="product-price">
          S/ ${p.price.toFixed(2)}
        </div>

        ${
          item
          ? `
            <div class="qty-row">
              <button onclick="decrease(${p.id})">−</button>
              <span class="qty-number">${item.quantity}</span>
              <button onclick="increase(${p.id})">+</button>
            </div>
          `
          : `
            <button
              class="add-button"
              onclick="add(${p.id})"
            >
              🛒 Agregar
            </button>
          `
        }

      </div>
    `;

    section.appendChild(card);
  });

  updateTopCart();
}

/* =========================================================
   CARRITO
========================================================= */

function add(id){

  const product = products.find(p => p.id === id);

  if(!product) return;

  const existing = cart.find(p => p.id === id);

  if(existing){
    existing.quantity++;
  }else{
    cart.push({
      ...product,
      quantity:1
    });
  }

  render();
  updateCart();
}

function increase(id){

  const item = cart.find(p => p.id === id);

  if(item){
    item.quantity++;
  }

  render();
  updateCart();
}

function decrease(id){

  const item = cart.find(p => p.id === id);

  if(!item) return;

  item.quantity--;

  if(item.quantity <= 0){
    cart = cart.filter(p => p.id !== id);
  }

  render();
  updateCart();
}

function removeItem(id){

  cart = cart.filter(p => p.id !== id);

  render();
  updateCart();
}

function getCartCount(){

  return cart.reduce(
    (total,item) => total + item.quantity,
    0
  );
}

function getCartTotal(){

  return cart.reduce(
    (total,item) =>
      total + item.price * item.quantity,
    0
  );
}

/* =========================================================
   CARRITO SUPERIOR
========================================================= */

function createTopCart(){

  const existing = document.querySelector(".top-cart");

  if(existing) existing.remove();

  const bar = document.createElement("div");

  bar.className = "top-cart";

  bar.innerHTML = `
    <div class="top-cart-left">

      <div style="position:relative">

        <img
          class="top-cart-image"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"
        >

        <div class="cart-badge" id="top-cart-count">
          0
        </div>

      </div>

      <div class="top-cart-title">
        <strong>Mi carrito</strong>
        <span id="top-cart-products">
          0 productos
        </span>
      </div>

    </div>

    <div class="cart-total" id="top-cart-total">
      S/ 0.00
    </div>
  `;

  document.body.prepend(bar);
}

function updateTopCart(){

  const count = getCartCount();

  const badge =
    document.getElementById("top-cart-count");

  const productsText =
    document.getElementById("top-cart-products");

  const total =
    document.getElementById("top-cart-total");

  if(badge) badge.textContent = count;

  if(productsText){

    productsText.textContent =
      count === 1
        ? "1 producto"
        : `${count} productos`;
  }

  if(total){

    total.textContent =
      `S/ ${getCartTotal().toFixed(2)}`;
  }
}

/* =========================================================
   HERO
========================================================= */

function createHero(){

  const main = document.querySelector("main");

  if(!main) return;

  const old = document.querySelector(".hero");

  if(old) old.remove();

  const hero = document.createElement("section");

  hero.className = "hero";

  hero.innerHTML = `
    <div>
      <h2>
        Verdulería <span>Terán</span>
      </h2>

      <p>
        Productos frescos directo a tu hogar
      </p>

      <p class="hero-small">
        🚚 Delivery en San Borja · San Luis ·
        San Isidro · La Victoria
      </p>
    </div>
  `;

  main.prepend(hero);
}

/* =========================================================
   CATEGORÍAS
========================================================= */

function createCategories(){

  const search = document.getElementById("search");

  if(!search) return;

  const old = document.querySelector(".categories");

  if(old) old.remove();

  const box = document.createElement("div");

  box.className = "categories";

  const categories = [
    ["Todos",""],
    ["Verduras","Verduras"],
    ["Frutas","Frutas"],
    ["Tubérculos","Tubérculos"],
    ["Hierbas","Hierbas"]
  ];

  categories.forEach(([label,value]) => {

    const button = document.createElement("button");

    button.className = "category-chip";

    if(value === currentCategory){
      button.classList.add("active");
    }

    button.textContent = label;

    button.onclick = () => {

      currentCategory = value;

      document
        .querySelectorAll(".category-chip")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      render();
    };

    box.appendChild(button);
  });

  search.insertAdjacentElement(
    "afterend",
    box
  );
}

/* =========================================================
   TÍTULO
========================================================= */

function createSectionTitle(){

  const productsSection =
    document.getElementById("products");

  if(!productsSection) return;

  const old =
    document.querySelector(".section-title");

  if(old) old.remove();

  const title =
    document.createElement("div");

  title.className = "section-title";

  title.innerHTML = `
    <h2>Nuestros productos</h2>
    <span>FRESCOS</span>
  `;

  productsSection.parentNode.insertBefore(
    title,
    productsSection
  );
}

/* =========================================================
   BANNER FRUTAS
========================================================= */

function createFreshBanner(){

  const productsSection =
    document.getElementById("products");

  if(!productsSection) return;

  const old =
    document.querySelector(".fresh-banner");

  if(old) old.remove();

  const banner =
    document.createElement("section");

  banner.className = "fresh-banner";

  banner.innerHTML = `
    <div>
      <h2>🍎 Frutas frescas y de temporada</h2>
      <div>
        Seleccionamos productos frescos para tu hogar.
      </div>
    </div>
  `;

  productsSection.insertAdjacentElement(
    "afterend",
    banner
  );
}

/* =========================================================
   NAVEGACIÓN INFERIOR
========================================================= */

function createBottomNav(){

  const old =
    document.querySelector(".bottom-nav");

  if(old) old.remove();

  const nav =
    document.createElement("nav");

  nav.className = "bottom-nav";

  nav.innerHTML = `
    <button onclick="window.scrollTo({top:0,behavior:'smooth'})">
      🏠
      <span>Inicio</span>
    </button>

    <button onclick="document.querySelector('.categories')?.scrollIntoView({behavior:'smooth'})">
      🗂️
      <span>Categorías</span>
    </button>

    <button
      class="cart-nav"
      onclick="showCart()"
    >
      🛒
      <span>Carrito</span>
    </button>

    <button onclick="showOrdersInfo()">
      📦
      <span>Mis pedidos</span>
    </button>

    <button onclick="showAccountInfo()">
      👤
      <span>Mi cuenta</span>
    </button>
  `;

  document.body.appendChild(nav);
}

/* =========================================================
   CARRITO DETALLADO
========================================================= */

function updateCart(){

  const cartBox =
    document.getElementById("cart");

  if(!cartBox) return;

  const count =
    document.getElementById("count");

  const total =
    document.getElementById("total");

  if(count){
    count.textContent = getCartCount();
  }

  if(total){
    total.textContent =
      `S/ ${getCartTotal().toFixed(2)}`;
  }

  if(getCartCount() === 0){

    cartBox.hidden = true;
    return;
  }

  cartBox.hidden = false;
}

function showCart(){

  if(getCartCount() === 0){

    alert("Tu carrito está vacío.");
    return;
  }

  let html = `
    <div class="checkout-box">

      <h2>🛒 Mi carrito</h2>
  `;

  cart.forEach(item => {

    html += `
      <div class="cart-item">

        <div class="cart-item-name">
          ${getEmoji(item.name)}
          ${cleanName(item.name)}
          <br>
          <small>
            S/ ${item.price.toFixed(2)}
          </small>
        </div>

        <div class="cart-controls">

          <button onclick="decrease(${item.id})">
            −
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button onclick="increase(${item.id})">
            +
          </button>

          <button onclick="removeItem(${item.id})">
            🗑️
          </button>

        </div>

      </div>
    `;
  });

  html += `
      <h3>
        Total:
        S/ ${getCartTotal().toFixed(2)}
      </h3>

      <button
        class="primary-button"
        onclick="showOrder()"
      >
        Continuar pedido
      </button>

    </div>
  `;

  const main = document.querySelector("main");

  const existing =
    document.querySelector(".checkout-box");

  if(existing) existing.remove();

  main.insertAdjacentHTML(
    "beforeend",
    html
  );

  window.scrollTo({
    top:document.body.scrollHeight,
    behavior:"smooth"
  });
}

/* =========================================================
   PEDIDO
========================================================= */

function showOrder(){

  if(getCartCount() === 0){

    alert("Agrega productos al carrito.");
    return;
  }

  const old =
    document.querySelector(".checkout-box");

  if(old) old.remove();

  const box =
    document.createElement("section");

  box.className = "checkout-box";

  box.innerHTML = `
    <h2>📋 Datos de entrega</h2>

    <input
      id="customer-name"
      placeholder="Nombre completo"
    >

    <input
      id="customer-phone"
      placeholder="Teléfono / WhatsApp"
      type="tel"
    >

    <input
      id="customer-address"
      placeholder="Dirección de entrega"
    >

    <input
      id="customer-reference"
      placeholder="Referencia (opcional)"
    >

    <button
      class="primary-button"
      onclick="confirmCustomerData()"
    >
      Continuar
    </button>
  `;

  document.querySelector("main")
    .appendChild(box);

  box.scrollIntoView({
    behavior:"smooth"
  });
}

function confirmCustomerData(){

  const name =
    document.getElementById("customer-name").value.trim();

  const phone =
    document.getElementById("customer-phone").value.trim();

  const address =
    document.getElementById("customer-address").value.trim();

  if(!name || !phone || !address){

    alert(
      "Completa nombre, teléfono y dirección."
    );

    return;
  }

  showPayment(
    name,
    phone,
    address
  );
}

/* =========================================================
   PAGO
========================================================= */

function showPayment(
  name,
  phone,
  address
){

  const reference =
    document.getElementById(
      "customer-reference"
    ).value.trim();

  const box =
    document.querySelector(".checkout-box");

  box.innerHTML = `

    <h2>💳 Forma de pago</h2>

    <div class="payment-grid">

      <button
        class="payment-button"
        onclick="selectPayment('Yape',this)"
      >
        📱 Yape
      </button>

      <button
        class="payment-button"
        onclick="selectPayment('Plin',this)"
      >
        📱 Plin
      </button>

      <button
        class="payment-button"
        onclick="selectPayment('Transferencia bancaria',this)"
      >
        🏦 Transferencia
      </button>

      <button
        class="payment-button"
        onclick="selectPayment('Pago contra entrega',this)"
      >
        💵 Contra entrega
      </button>

    </div>

    <div id="payment-selected"
      style="margin:12px 0;font-weight:bold">
      Selecciona una forma de pago
    </div>

    <h3>
      Total:
      S/ ${getCartTotal().toFixed(2)}
    </h3>

    <button
      class="primary-button"
      onclick="finishOrder(
        '${encodeURIComponent(name)}',
        '${encodeURIComponent(phone)}',
        '${encodeURIComponent(address)}',
        '${encodeURIComponent(reference)}'
      )"
    >
      Confirmar pedido
    </button>
  `;

  window.currentPayment = "";

  box.scrollIntoView({
    behavior:"smooth"
  });
}

function selectPayment(
  payment,
  button
){

  window.currentPayment = payment;

  document
    .querySelectorAll(".payment-button")
    .forEach(b =>
      b.classList.remove("selected")
    );

  button.classList.add("selected");

  const selected =
    document.getElementById(
      "payment-selected"
    );

  selected.textContent =
    `Forma de pago: ${payment}`;
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
      nombre:cleanName(item.name),
      unidad:item.unit,
      precio:item.price,
      cantidad:item.quantity
    }));

  const { error } = await client
    .from("pedidos")
    .insert({
      nombre_cliente:name,
      telefono:phone,
      direccion:address,
      referencia:reference || null,
      forma_pago:payment,
      productos:orderProducts,
      total:Number(
        getCartTotal().toFixed(2)
      ),
      estado:"Pendiente"
    });

  if(error){

    console.error(error);

    throw error;
  }

  return true;
}

/* =========================================================
   FINALIZAR PEDIDO
========================================================= */

async function finishOrder(
  encodedName,
  encodedPhone,
  encodedAddress,
  encodedReference
){

  if(!window.currentPayment){

    alert(
      "Selecciona una forma de pago."
    );

    return;
  }

  const name =
    decodeURIComponent(encodedName);

  const phone =
    decodeURIComponent(encodedPhone);

  const address =
    decodeURIComponent(encodedAddress);

  const reference =
    decodeURIComponent(encodedReference);

  try{

    await saveOrder(
      name,
      phone,
      address,
      reference,
      window.currentPayment
    );

    sendWhatsAppOrder(
      name,
      phone,
      address,
      reference,
      window.currentPayment
    );

  }catch(error){

    alert(
      "No se pudo guardar el pedido. Intenta nuevamente."
    );
  }
}

/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsAppOrder(
  name,
  phone,
  address,
  reference,
  payment
){

  let message =
    `*NUEVO PEDIDO - VERDULERÍA TERÁN*\\n\\n`;

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
    `*PRODUCTOS:*\\n`;

  cart.forEach(item => {

    message +=
      `• ${cleanName(item.name)} x${item.quantity} - S/ ` +
      `${(
        item.price *
        item.quantity
      ).toFixed(2)}\\n`;
  });

  message +=
    `\\n*TOTAL: S/ ` +
    `${getCartTotal().toFixed(2)}*`;

  const url =
    `https://wa.me/${BUSINESS_WHATSAPP}` +
    `?text=${encodeURIComponent(message)}`;

  window.open(url,"_blank");

  alert(
    "Pedido registrado. Se abrirá WhatsApp para enviarlo."
  );

  cart = [];

  render();
  updateCart();
  updateTopCart();
}

/* =========================================================
   INFORMACIÓN
========================================================= */

function showOrdersInfo(){

  alert(
    "Tus pedidos se registran en Verdulería Terán. Para consultar el estado de un pedido, escríbenos por WhatsApp."
  );
}

function showAccountInfo(){

  alert(
    "Verdulería Terán\\n\\nDelivery en San Borja, San Luis, San Isidro y La Victoria."
  );
}

/* =========================================================
   BUSCADOR
========================================================= */

function setupSearch(){

  const search =
    document.getElementById("search");

  if(!search) return;

  search.addEventListener(
    "input",
    () => render()
  );
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initializeApp(){

  createTopCart();
  createHero();
  createCategories();
  createSectionTitle();
  createFreshBanner();
  createBottomNav();

  setupSearch();

  updateCart();
  updateTopCart();

  loadProducts();
}

if(
  document.readyState === "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}else{

  initializeApp();
}

/* =========================================================
   SERVICE WORKER
========================================================= */

if("serviceWorker" in navigator){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(error =>
          console.error(
            "Service Worker:",
            error
          )
        );

    }
  );
}