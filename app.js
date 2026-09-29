const products = [];
let cart = [];

const BUSINESS_WHATSAPP = "51983130700";

/* =========================================================
   ESTILO COMPLETO VERDULERÍA TERÁN
========================================================= */

const style = document.createElement("style");

style.textContent = `

* {
  box-sizing: border-box;
}

body {
  margin: 0 !important;
  padding-top: 92px !important;
  padding-bottom: 78px !important;
  background:
    linear-gradient(
      180deg,
      #fffdf8 0%,
      #f8fff8 45%,
      #fff8f4 100%
    ) !important;
  color: #172018;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* =========================================================
   CARRITO SUPERIOR
========================================================= */

.top-cart {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  padding: 8px 10px;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(14px);
  box-shadow:
    0 5px 22px rgba(0,0,0,.13);
}

.top-cart-button {
  width: 100%;
  min-height: 74px;
  border: 0;
  border-radius: 22px;
  background:
    linear-gradient(
      100deg,
      #fff8df,
      #f2fff0,
      #fff
    );
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 13px;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px #e8eee2;
}

.top-cart-left {
  display: flex;
  align-items: center;
  gap: 11px;
}

.top-cart-image {
  width: 64px;
  height: 58px;
  border-radius: 17px;
  object-fit: cover;
  box-shadow:
    0 4px 10px rgba(0,0,0,.14);
}

.top-cart-title {
  text-align: left;
}

.top-cart-title strong {
  display: block;
  font-size: 19px;
  font-weight: 900;
  color: #173d24;
}

.top-cart-title span {
  display: block;
  font-size: 13px;
  color: #69716b;
  margin-top: 2px;
}

.top-cart-total {
  background:
    linear-gradient(
      135deg,
      #ef174c,
      #d70055
    );
  color: white;
  padding: 11px 15px;
  border-radius: 17px;
  font-size: 19px;
  font-weight: 900;
  box-shadow:
    0 5px 12px rgba(215,0,85,.24);
}

.top-cart-panel {
  display: none;
  margin-top: 8px;
  padding: 8px 12px 14px;
  background: white;
  border-radius: 18px;
  max-height: 62vh;
  overflow-y: auto;
}

.top-cart-panel.open {
  display: block;
}

.top-cart-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 0;
  border-bottom: 1px solid #ececec;
}

.top-cart-item-name {
  flex: 1;
  font-size: 14px;
  font-weight: 800;
}

.cart-mini-button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 9px;
  background: #eef7ed;
  color: #17733b;
  font-size: 20px;
  font-weight: 800;
}

.cart-delete {
  border: 0;
  background: transparent;
  font-size: 19px;
}

.top-cart-checkout {
  width: 100%;
  margin-top: 13px;
  padding: 14px;
  border: 0;
  border-radius: 14px;
  background:
    linear-gradient(
      90deg,
      #13a44b,
      #19c46a
    );
  color: white;
  font-size: 16px;
  font-weight: 900;
}

/* =========================================================
   HERO
========================================================= */

.teran-hero {
  margin: 12px;
  min-height: 245px;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background:
    linear-gradient(
      90deg,
      rgba(4,78,40,.88),
      rgba(4,78,40,.38),
      rgba(255,120,0,.12)
    ),
    url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200")
    center / cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow:
    0 8px 25px rgba(0,0,0,.15);
}

.teran-hero-content {
  color: white;
  padding: 25px;
  text-shadow:
    0 3px 10px rgba(0,0,0,.32);
}

.teran-brand {
  font-size: 42px;
  line-height: .95;
  font-weight: 950;
  letter-spacing: -2px;
}

.teran-brand span {
  display: block;
  color: #ff7a00;
  font-style: italic;
}

.teran-slogan {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 800;
}

.teran-delivery {
  margin-top: 14px;
  display: inline-block;
  background: rgba(255,255,255,.92);
  color: #174b2c;
  padding: 9px 15px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 13px;
}

/* =========================================================
   BUSCADOR
========================================================= */

.teran-search-box {
  margin: 15px 12px 10px;
  background: white;
  border-radius: 19px;
  box-shadow:
    0 4px 16px rgba(0,0,0,.08);
  display: flex;
  align-items: center;
  padding: 3px 15px;
}

.teran-search-icon {
  font-size: 24px;
  color: #77817a;
}

#search {
  flex: 1;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
  font-size: 17px !important;
  padding: 14px 10px !important;
}

/* =========================================================
   CATEGORÍAS
========================================================= */

.teran-categories {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 5px 12px 12px;
  scrollbar-width: none;
}

.teran-categories::-webkit-scrollbar {
  display: none;
}

.teran-category {
  flex: 0 0 auto;
  border: 0;
  border-radius: 18px;
  padding: 11px 15px;
  background: white;
  box-shadow:
    0 3px 12px rgba(0,0,0,.08);
  font-weight: 800;
  font-size: 14px;
  color: #263129;
}

.teran-category.active {
  background:
    linear-gradient(
      135deg,
      #11a84b,
      #08c36b
    );
  color: white;
}

/* =========================================================
   TÍTULO PRODUCTOS
========================================================= */

.products-heading {
  margin: 5px 12px 14px;
  padding: 15px;
  border-radius: 21px;
  background:
    linear-gradient(
      100deg,
      #e8fce8,
      #fff8c9
    );
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.products-heading h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 950;
}

.products-heading p {
  margin: 4px 0 0;
  color: #66706a;
  font-size: 13px;
}

.quality-badge {
  background: #ffd83d;
  border-radius: 14px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 900;
  color: #4b3b00;
}

/* =========================================================
   GRID PRODUCTOS
========================================================= */

#products {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 11px;
  padding: 0 12px;
}

.card {
  overflow: hidden !important;
  background: white !important;
  border-radius: 21px !important;
  box-shadow:
    0 5px 17px rgba(0,0,0,.10) !important;
  padding-bottom: 11px !important;
  border: 1px solid #edf0ec;
}

.card > div:first-child {
  height: 145px !important;
  background: #f3f7f1 !important;
}

.card img {
  transition: transform .2s ease;
}

.card:active img {
  transform: scale(1.04);
}

.card > div:last-child {
  padding: 11px !important;
}

.card > div:last-child > div:first-child {
  font-size: 17px !important;
  line-height: 1.1;
}

.card button {
  color: white !important;
  border-radius: 12px !important;
  font-weight: 900 !important;
  padding: 11px !important;
}

/* =========================================================
   COLORES VARIADOS DE BOTONES
========================================================= */

.card:nth-child(4n+1) button {
  background:
    linear-gradient(
      90deg,
      #11a94b,
      #18c761
    ) !important;
}

.card:nth-child(4n+2) button {
  background:
    linear-gradient(
      90deg,
      #ff3151,
      #ed1648
    ) !important;
}

.card:nth-child(4n+3) button {
  background:
    linear-gradient(
      90deg,
      #9b20c8,
      #d124a8
    ) !important;
}

.card:nth-child(4n+4) button {
  background:
    linear-gradient(
      90deg,
      #ff7a00,
      #ff4d12
    ) !important;
}

/* =========================================================
   BANNER FRUTAS
========================================================= */

.fresh-banner {
  margin: 17px 12px;
  min-height: 105px;
  border-radius: 21px;
  padding: 20px;
  background:
    linear-gradient(
      90deg,
      rgba(238,28,70,.92),
      rgba(255,127,0,.74)
    ),
    url("https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1000")
    center / cover;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow:
    0 6px 18px rgba(0,0,0,.14);
}

.fresh-banner strong {
  font-size: 23px;
  line-height: 1;
}

.fresh-banner small {
  display: block;
  margin-top: 5px;
  font-size: 13px;
  font-weight: 700;
}

.fresh-banner button {
  border: 0;
  border-radius: 12px;
  background: white;
  color: #e63728;
  padding: 10px 12px;
  font-weight: 900;
}

/* =========================================================
   BARRA INFERIOR
========================================================= */

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99990;
  background: rgba(255,255,255,.97);
  backdrop-filter: blur(15px);
  box-shadow:
    0 -4px 18px rgba(0,0,0,.12);
  padding: 7px 7px
    calc(7px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(5,1fr);
}

.bottom-nav-item {
  border: 0;
  background: transparent;
  color: #69706c;
  font-size: 10px;
  font-weight: 800;
  padding: 3px;
}

.bottom-nav-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 2px;
}

.bottom-nav-item.active {
  color: #119c4c;
}

.bottom-cart-circle {
  width: 52px;
  height: 52px;
  margin: -24px auto 1px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #10aa4e,
      #00c969
    );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow:
    0 5px 15px rgba(0,150,70,.35);
}

/* =========================================================
   CHECKOUT
========================================================= */

.checkout-wrapper {
  margin: 24px 12px;
  background:
    linear-gradient(
      180deg,
      #f7fff5,
      #fff
    );
  border-radius: 25px;
  padding: 15px;
  border: 1px solid #e0eadf;
}

.checkout-header {
  text-align: center;
  padding: 8px 0 20px;
}

.checkout-logo {
  width: 75px;
  height: 58px;
  object-fit: cover;
  border-radius: 17px;
  margin: auto;
  display: block;
}

.checkout-title {
  font-size: 25px;
  font-weight: 950;
  color: #1a713b;
  margin: 9px 0 0;
}

.checkout-subtitle {
  color: #777;
  margin-top: 5px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.checkout-card {
  background: white;
  border-radius: 20px;
  padding: 18px;
  box-shadow:
    0 5px 18px rgba(0,0,0,.07);
}

.checkout-card h3 {
  margin: 0 0 6px;
  font-size: 21px;
}

.checkout-card p {
  margin: 0 0 17px;
  color: #777;
  font-size: 14px;
}

.field {
  position: relative;
  margin-bottom: 11px;
}

.field-icon {
  position: absolute;
  left: 13px;
  top: 12px;
  font-size: 18px;
}

.checkout-input {
  width: 100%;
  padding: 13px 13px 13px 42px;
  border: 1px solid #d9ded9;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
}

.continue-btn {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 13px;
  background:
    linear-gradient(
      90deg,
      #12a74d,
      #13c76a
    );
  color: white;
  font-size: 17px;
  font-weight: 900;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border: 2px solid #e3e5e3;
  border-radius: 15px;
  margin-bottom: 9px;
}

.payment-option.selected {
  border-color: #16a34a;
  background: #f1fff5;
}

.payment-radio {
  width: 20px;
  height: 20px;
  accent-color: #13a34b;
}

.payment-logo {
  width: 47px;
  height: 47px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}

.yape-logo {
  background: #742283;
  color: white;
}

.plin-logo {
  background: #00a8c7;
  color: white;
}

.bank-logo,
.cash-logo {
  background: #eef7ee;
  font-size: 25px;
}

.payment-name {
  font-weight: 900;
}

.payment-description {
  color: #777;
  font-size: 13px;
  margin-top: 3px;
}

.summary {
  margin-top: 16px;
  background: #fafafa;
  border-radius: 15px;
  padding: 14px;
  border: 1px solid #e5e5e5;
}

.summary-title {
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 13px;
  font-size: 20px;
  font-weight: 950;
}

.whatsapp-btn {
  width: 100%;
  padding: 15px;
  border: 0;
  border-radius: 14px;
  background:
    linear-gradient(
      90deg,
      #16bd58,
      #25d366
    );
  color: white;
  font-size: 17px;
  font-weight: 950;
  margin-top: 14px;
}

.hidden-payment {
  display: none;
}

@media (min-width: 760px) {

  .checkout-grid {
    grid-template-columns: 1fr 1fr;
  }

  #products {
    grid-template-columns:
      repeat(4,minmax(0,1fr));
  }

}

`;

/* =========================================================
   INSERTAR ESTILOS
========================================================= */

document.head.appendChild(style);

/* =========================================================
   CARRITO SUPERIOR
========================================================= */

function createTopCart() {

  if (document.querySelector("#topCart")) {
    return;
  }

  const topCart =
    document.createElement("div");

  topCart.id = "topCart";
  topCart.className = "top-cart";

  topCart.innerHTML = `

    <button
      class="top-cart-button"
      onclick="toggleTopCart()"
    >

      <div class="top-cart-left">

        <img
          class="top-cart-image"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"
          alt="Verduras frescas"
        >

        <div class="top-cart-title">

          <strong>
            Mi carrito
          </strong>

          <span id="topCartCount">
            Carrito vacío
          </span>

        </div>

      </div>

      <div
        class="top-cart-total"
        id="topCartTotal"
      >
        S/ 0.00
      </div>

    </button>

    <div
      id="topCartPanel"
      class="top-cart-panel"
    ></div>

  `;

  document.body.prepend(topCart);
}

function toggleTopCart() {

  const panel =
    document.querySelector(
      "#topCartPanel"
    );

  panel.classList.toggle("open");

}

function closeTopCart() {

  const panel =
    document.querySelector(
      "#topCartPanel"
    );

  if (panel) {
    panel.classList.remove("open");
  }

}

function updateTopCart() {

  createTopCart();

  const count =
    cart.reduce(
      (sum,p) =>
        sum + p.quantity,
      0
    );

  document.querySelector(
    "#topCartCount"
  ).textContent =

    count === 0
      ? "Carrito vacío"
      : `${count} producto${count !== 1 ? "s" : ""}`;

  document.querySelector(
    "#topCartTotal"
  ).textContent =
    `S/ ${getCartTotal().toFixed(2)}`;

  const panel =
    document.querySelector(
      "#topCartPanel"
    );

  if (!cart.length) {

    panel.innerHTML = `

      <div style="
        padding:15px;
        text-align:center;
        color:#777;
      ">
        Tu carrito está vacío.
      </div>

    `;

    return;
  }

  panel.innerHTML = `

    ${cart.map(p => `

      <div class="top-cart-item">

        <div class="top-cart-item-name">

          ${p.name}

          <br>

          <small style="color:#777">
            S/ ${p.price.toFixed(2)} c/u
          </small>

        </div>

        <button
          class="cart-mini-button"
          onclick="decrease(${p.id})"
        >
          −
        </button>

        <strong>
          ${p.quantity}
        </strong>

        <button
          class="cart-mini-button"
          onclick="increase(${p.id})"
        >
          +
        </button>

        <button
          class="cart-delete"
          onclick="removeItem(${p.id})"
        >
          🗑️
        </button>

      </div>

    `).join("")}

    <button
      class="top-cart-checkout"
      onclick="
        showOrder();
        closeTopCart();
      "
    >
      Ver productos y continuar
    </button>

  `;

}

/* =========================================================
   HERO
========================================================= */

function createHero() {

  if (
    document.querySelector(
      "#teranHero"
    )
  ) {
    return;
  }

  const hero =
    document.createElement("section");

  hero.id = "teranHero";
  hero.className = "teran-hero";

  hero.innerHTML = `

    <div class="teran-hero-content">

      <div class="teran-brand">
        Verdulería
        <span>Terán</span>
      </div>

      <div class="teran-slogan">
        Productos frescos directo a tu hogar
      </div>

      <div class="teran-delivery">
        🚚 Reparto en San Borja · San Isidro ·
        San Luis · La Victoria
      </div>

    </div>

  `;

  const main =
    document.querySelector("main");

  main.prepend(hero);

}

/* =========================================================
   CATEGORÍAS
========================================================= */

function createCategories() {

  if (
    document.querySelector(
      "#teranCategories"
    )
  ) {
    return;
  }

  const box =
    document.createElement("div");

  box.id =
    "teranCategories";

  box.className =
    "teran-categories";

  box.innerHTML = `

    <button
      class="teran-category active"
      data-category=""
      onclick="selectCategory(this,'')"
    >
      ▦ Todos
    </button>

    <button
      class="teran-category"
      data-category="Verduras"
      onclick="
        selectCategory(this,'Verduras')
      "
    >
      🌿 Verduras
    </button>

    <button
      class="teran-category"
      data-category="Frutas"
      onclick="
        selectCategory(this,'Frutas')
      "
    >
      🍎 Frutas
    </button>

    <button
      class="teran-category"
      data-category="Tubérculos"
      onclick="
        selectCategory(this,'Tubérculos')
      "
    >
      🥔 Tubérculos
    </button>

    <button
      class="teran-category"
      data-category="Hierbas"
      onclick="
        selectCategory(this,'Hierbas')
      "
    >
      🌱 Hierbas
    </button>

  `;

  const search =
    document.querySelector(
      "#search"
    );

  search.parentElement.after(box);

}

function selectCategory(
  button,
  category
) {

  document
    .querySelectorAll(
      ".teran-category"
    )
    .forEach(b =>
      b.classList.remove(
        "active"
      )
    );

  button.classList.add(
    "active"
  );

  document.querySelector(
    "#category"
  ).value = category;

  render();

}

/* =========================================================
   PRODUCTOS
========================================================= */

async function loadProducts() {

  const box =
    document.querySelector(
      "#products"
    );

  try {

    const client =
      getSupabaseClient();

    box.innerHTML =
      "Cargando productos...";

    const {
      data,
      error
    } =
      await client
        .from("productos")
        .select("*")
        .eq("activo",true)
        .order("id");

    if (error) {
      throw error;
    }

    products.push(
      ...data.map(p => ({

        id:p.id,

        name:p.nombre,

        category:p.categoria,

        unit:p.unidad,

        price:Number(p.precio),

        image:getImage(
          p.nombre
        ),

        emoji:getEmoji(
          p.nombre
        )

      }))
    );

    render();

  } catch(error) {

    console.error(error);

    box.innerHTML = `

      <div style="
        padding:20px;
        color:#b00020;
      ">
        Error: ${error.message}
      </div>

    `;

  }

}

/* =========================================================
   SUPABASE
========================================================= */

function getSupabaseClient() {

  if (!window.supabase) {
    throw new Error(
      "Supabase no se cargó"
    );
  }

  if (!window.SUPABASE_CONFIG) {
    throw new Error(
      "Falta config.js"
    );
  }

  return window.supabase.createClient(

    window.SUPABASE_CONFIG.url,

    window.SUPABASE_CONFIG.publishableKey

  );

}

/* =========================================================
   NOMBRES / EMOJIS
========================================================= */

function cleanName(nombre) {

  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}

function getEmoji(nombre) {

  const n =
    cleanName(nombre);

  const emojis = {

    papa:"🥔",
    tomate:"🍅",
    cebolla:"🧅",
    zanahoria:"🥕",
    lechuga:"🥬",
    brocoli:"🥦",
    berenjena:"🍆",
    zapallo:"🎃",
    pepino:"🥒",
    holantao:"🫛",
    arracacha:"🥔",
    ajo:"🧄",
    aji:"🌶️",
    pimiento:"🫑",
    choclo:"🌽",
    maiz:"🌽",
    palta:"🥑",
    apio:"🌿",
    espinaca:"🌿",
    culantro:"🌿",
    perejil:"🌿",
    rabanito:"🔴",
    rabano:"🔴",
    beterraga:"🫜",
    nabo:"🥬",
    yuca:"🥔",
    camote:"🍠",
    arveja:"🫛",
    vainita:"🫛",
    haba:"🫘",
    frejol:"🫘",
    coliflor:"🥦",
    repollo:"🥬",
    esparrago:"🌱",
    alcachofa:"🌿",
    poro:"🌱",
    puerro:"🌱",
    kion:"🫚",
    jengibre:"🫚",
    hierbabuena:"🌿",
    albahaca:"🌿",
    romero:"🌿",
    oregano:"🌿"

  };

  for (
    const clave in emojis
  ) {

    if (
      n.includes(clave)
    ) {
      return emojis[clave];
    }

  }

  return "🌱";

}

/* =========================================================
   IMÁGENES
========================================================= */

function getImage(nombre) {

  const n =
    cleanName(nombre);

  const images = {

    papa:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",

    tomate:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600",

    cebolla:
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=600",

    zanahoria:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600",

    lechuga:
      "https://images.unsplash.com/photo-1622205313162-be1d5712a43c?w=600",

    brocoli:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600",

    berenjena:
      "https://images.unsplash.com/photo-1658231189973-5e5a4d6c8b8a?w=600",

    pepino:
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600",

    ajo:
      "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600",

    pimiento:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600"

  };

  for (
    const clave in images
  ) {

    if (
      n.includes(clave)
    ) {
      return images[clave];
    }

  }

  return "";

}

/* =========================================================
   RENDER
========================================================= */

function render() {

  const q =
    document
      .querySelector("#search")
      .value
      .toLowerCase();

  const c =
    document
      .querySelector("#category")
      .value;

  let list =
    products.filter(p => {

      const matchesSearch =
        !q ||
        p.name
          .toLowerCase()
          .includes(q);

      let matchesCategory =
        true;

      if (c === "Tubérculos") {

        const n =
          cleanName(
            p.name
          );

        matchesCategory =
          [
            "papa",
            "yuca",
            "camote",
            "arracacha",
            "oca",
            "olluco"
          ].some(
            x => n.includes(x)
          );

      } else if (c) {

        matchesCategory =
          p.category === c;

      }

      return (
        matchesSearch &&
        matchesCategory
      );

    });

  const productsBox =
    document.querySelector(
      "#products"
    );

  productsBox.innerHTML =
    list.length

      ? list.map(p => `

        <article class="card">

          <div style="
            width:100%;
            height:145px;
            display:flex;
            align-items:center;
            justify-content:center;
            overflow:hidden;
            background:#f3f7f1;
          ">

            ${
              p.image

                ? `

                  <img
                    src="${p.image}"
                    alt="${p.name}"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                    "
                    onerror="
                      this.style.display='none';
                      this.nextElementSibling.style.display='block';
                    "
                  >

                  <div
                    style="
                      display:none;
                      font-size:65px;
                    "
                  >
                    ${p.emoji}
                  </div>

                `

                : `

                  <div
                    style="
                      font-size:65px;
                    "
                  >
                    ${p.emoji}
                  </div>

                `
            }

          </div>

          <div>

            <div style="
              font-size:17px;
              font-weight:900;
              margin-bottom:5px;
            ">
              ${p.name}
            </div>

            <div style="
              color:#707770;
              font-size:13px;
              margin-bottom:6px;
            ">
              Venta por ${p.unit}
            </div>

            <div style="
              font-size:20px;
              font-weight:950;
              margin-bottom:10px;
            ">
              S/ ${p.price.toFixed(2)}
            </div>

            <button
              onclick="add(${p.id})"
            >
              🛒 Agregar
            </button>

          </div>

        </article>

      `).join("")

      : `

        <div style="
          grid-column:1/-1;
          text-align:center;
          padding:30px;
          color:#777;
        ">
          No encontramos productos.
        </div>

      `;

  updateCart();

}

/* =========================================================
   CARRITO
========================================================= */

function add(id) {

  const product =
    products.find(
      p => p.id === id
    );

  if (!product) {
    return;
  }

  const existing =
    cart.find(
      p => p.id === id
    );

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({

      ...product,

      quantity:1

    });

  }

  updateCart();

}

function increase(id) {

  const item =
    cart.find(
      p => p.id === id
    );

  if (item) {
    item.quantity++;
  }

  updateCart();

}

function decrease(id) {

  const item =
    cart.find(
      p => p.id === id
    );

  if (!item) {
    return;
  }

  item.quantity--;

  if (
    item.quantity <= 0
  ) {

    cart =
      cart.filter(
        p => p.id !== id
      );

  }

  updateCart();

}

function removeItem(id) {

  cart =
    cart.filter(
      p => p.id !== id
    );

  updateCart();

}

function getCartTotal() {

  return cart.reduce(
    (sum,p) =>
      sum +
      p.price *
      p.quantity,
    0
  );

}

function updateCart() {

  createTopCart();

  updateTopCart();

  const cartBox =
    document.querySelector(
      "#cart"
    );

  if (cartBox) {

    cartBox.hidden =
      cart.length === 0;

  }

  const count =
    cart.reduce(
      (sum,p) =>
        sum + p.quantity,
      0
    );

  const countElement =
    document.querySelector(
      "#count"
    );

  const totalElement =
    document.querySelector(
      "#total"
    );

  if (countElement) {
    countElement.textContent =
      count;
  }

  if (totalElement) {
    totalElement.textContent =
      `S/ ${getCartTotal().toFixed(2)}`;
  }

}

/* =========================================================
   CHECKOUT
========================================================= */

function showOrder() {

  if (!cart.length) {

    alert(
      "Agrega al menos un producto al carrito."
    );

    return;

  }

  let form =
    document.querySelector(
      "#customerForm"
    );

  if (form) {

    form.scrollIntoView({
      behavior:"smooth"
    });

    return;

  }

  const cartBox =
    document.querySelector(
      "#cart"
    );

  form =
    document.createElement(
      "div"
    );

  form.id =
    "customerForm";

  form.innerHTML = `

    <div class="checkout-wrapper">

      <div class="checkout-header">

        <img
          class="checkout-logo"
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300"
          alt="Verduras frescas"
        >

        <h2 class="checkout-title">
          Verdulería Terán
        </h2>

        <div class="checkout-subtitle">
          Completa tu pedido
        </div>

      </div>

      <div class="checkout-grid">

        <div class="checkout-card">

          <h3>
            Datos del cliente
          </h3>

          <p>
            Ingresa tus datos para la entrega
          </p>

          <div class="field">

            <span class="field-icon">
              👤
            </span>

            <input
              id="customerName"
              class="checkout-input"
              type="text"
              placeholder="Nombre completo"
            >

          </div>

          <div class="field">

            <span class="field-icon">
              📱
            </span>

            <input
              id="customerPhone"
              class="checkout-input"
              type="tel"
              placeholder="Teléfono / WhatsApp"
            >

          </div>

          <div class="field">

            <span class="field-icon">
              📍
            </span>

            <input
              id="customerAddress"
              class="checkout-input"
              type="text"
              placeholder="Dirección de entrega"
            >

          </div>

          <div class="field">

            <span class="field-icon">
              📝
            </span>

            <input
              id="customerReference"
              class="checkout-input"
              type="text"
              placeholder="Referencia (opcional)"
            >

          </div>

          <button
            class="continue-btn"
            onclick="confirmCustomerData()"
          >
            Continuar
          </button>

        </div>

        <div
          id="paymentPanel"
          class="checkout-card hidden-payment"
        >

          <h3>
            Forma de pago
          </h3>

          <p>
            Selecciona tu método de pago
          </p>

          <label class="payment-option selected">

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Efectivo - Pago contra entrega"
              checked
              onchange="selectPayment(this)"
            >

            <div class="payment-logo cash-logo">
              💵
            </div>

            <div>

              <div class="payment-name">
                Efectivo
              </div>

              <div class="payment-description">
                Pago contra entrega
              </div>

            </div>

          </label>

          <label class="payment-option">

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Yape"
              onchange="selectPayment(this)"
            >

            <div class="payment-logo yape-logo">
              yape
            </div>

            <div>

              <div class="payment-name">
                Yape
              </div>

              <div class="payment-description">
                Paga desde tu app Yape
              </div>

            </div>

          </label>

          <label class="payment-option">

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Plin"
              onchange="selectPayment(this)"
            >

            <div class="payment-logo plin-logo">
              plin
            </div>

            <div>

              <div class="payment-name">
                Plin
              </div>

              <div class="payment-description">
                Paga desde tu app Plin
              </div>

            </div>

          </label>

          <label class="payment-option">

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Transferencia bancaria"
              onchange="selectPayment(this)"
            >

            <div class="payment-logo bank-logo">
              🏦
            </div>

            <div>

              <div class="payment-name">
                Transferencia bancaria
              </div>

              <div class="payment-description">
                Transferencia a nuestra cuenta
              </div>

            </div>

          </label>

          <div class="summary">

            <div class="summary-title">
              Resumen del pedido
            </div>

            <div id="orderSummary"></div>

            <div class="summary-total">

              <span>
                Total
              </span>

              <span id="checkoutTotal">
                S/ 0.00
              </span>

            </div>

          </div>

          <button
            class="whatsapp-btn"
            onclick="sendWhatsAppOrder()"
          >
            💬 Confirmar pedido por WhatsApp
          </button>

        </div>

      </div>

    </div>

  `;

  cartBox.appendChild(
    form
  );

  form.scrollIntoView({
    behavior:"smooth"
  });

}

/* =========================================================
   DATOS CLIENTE
========================================================= */

function confirmCustomerData() {

  const name =
    document
      .querySelector(
        "#customerName"
      )
      .value
      .trim();

  const phone =
    document
      .querySelector(
        "#customerPhone"
      )
      .value
      .trim();

  const address =
    document
      .querySelector(
        "#customerAddress"
      )
      .value
      .trim();

  if (
    !name ||
    !phone ||
    !address
  ) {

    alert(
      "Por favor completa nombre, teléfono y dirección."
    );

    return;

  }

  const panel =
    document.querySelector(
      "#paymentPanel"
    );

  panel.classList.remove(
    "hidden-payment"
  );

  document.querySelector(
    "#orderSummary"
  ).innerHTML =

    cart.map(p => `

      <div class="summary-row">

        <span>
          ${p.name} x${p.quantity}
        </span>

        <strong>
          S/ ${
            (
              p.price *
              p.quantity
            ).toFixed(2)
          }
        </strong>

      </div>

    `).join("");

  document.querySelector(
    "#checkoutTotal"
  ).textContent =
    `S/ ${getCartTotal().toFixed(2)}`;

  panel.scrollIntoView({
    behavior:"smooth"
  });

}

/* =========================================================
   PAGO
========================================================= */

function selectPayment(input) {

  document
    .querySelectorAll(
      ".payment-option"
    )
    .forEach(option =>
      option.classList.remove(
        "selected"
      )
    );

  input
    .closest(
      ".payment-option"
    )
    .classList.add(
      "selected"
    );

}

/* =========================================================
   GUARDAR PEDIDO
========================================================= */

async function saveOrder() {

  const client =
    getSupabaseClient();

  const name =
    document
      .querySelector(
        "#customerName"
      )
      .value
      .trim();

  const phone =
    document
      .querySelector(
        "#customerPhone"
      )
      .value
      .trim();

  const address =
    document
      .querySelector(
        "#customerAddress"
      )
      .value
      .trim();

  const reference =
    document
      .querySelector(
        "#customerReference"
      )
      .value
      .trim();

  const payment =
    document.querySelector(
      'input[name="payment"]:checked'
    )?.value ||
    "Efectivo - Pago contra entrega";

  const orderProducts =
    cart.map(p => ({

      id:p.id,

      nombre:p.name,

      cantidad:p.quantity,

      unidad:p.unit,

      precio:p.price,

      subtotal:Number(
        (
          p.price *
          p.quantity
        ).toFixed(2)
      )

    }));

  /*
    IMPORTANTE:
    No usamos .select() después del insert.
    Así no necesitamos permiso SELECT
    para el cliente.
  */

  const {
    error
  } =
    await client
      .from("pedidos")
      .insert({

        nombre_cliente:name,

        telefono:phone,

        direccion:address,

        referencia:
          reference || null,

        forma_pago:payment,

        productos:
          orderProducts,

        total:
          Number(
            getCartTotal()
              .toFixed(2)
          ),

        estado:
          "Pendiente"

      });

  if (error) {
    throw error;
  }

  return true;

}

/* =========================================================
   WHATSAPP
========================================================= */

async function sendWhatsAppOrder() {

  const name =
    document
      .querySelector(
        "#customerName"
      )
      .value
      .trim();

  const phone =
    document
      .querySelector(
        "#customerPhone"
      )
      .value
      .trim();

  const address =
    document
      .querySelector(
        "#customerAddress"
      )
      .value
      .trim();

  const reference =
    document
      .querySelector(
        "#customerReference"
      )
      .value
      .trim();

  const payment =
    document.querySelector(
      'input[name="payment"]:checked'
    )?.value ||
    "Efectivo - Pago contra entrega";

  if (
    !name ||
    !phone ||
    !address
  ) {

    alert(
      "Completa los datos del cliente antes de confirmar."
    );

    return;

  }

  const button =
    document.querySelector(
      ".whatsapp-btn"
    );

  const originalText =
    button.textContent;

  button.disabled =
    true;

  button.textContent =
    "Guardando pedido...";

  try {

    await saveOrder();

    let message =

      `*VERDULERÍA TERÁN* 🛒\n\n` +

      `*DATOS DEL CLIENTE*\n` +

      `Nombre: ${name}\n` +

      `Teléfono: ${phone}\n` +

      `Dirección: ${address}\n` +

      `Referencia: ${
        reference ||
        "Sin referencia"
      }\n\n` +

      `*FORMA DE PAGO*\n` +

      `${payment}\n\n` +

      `*PEDIDO*\n`;

    cart.forEach(p => {

      message +=

        `• ${p.name} x${p.quantity} - S/ ` +

        `${(
          p.price *
          p.quantity
        ).toFixed(2)}\n`;

    });

    message +=

      `\n*TOTAL: S/ ` +

      `${getCartTotal().toFixed(2)}*`;

    const url =

      `https://wa.me/${BUSINESS_WHATSAPP}` +

      `?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
}

loadProducts();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}