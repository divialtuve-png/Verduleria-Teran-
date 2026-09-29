const products = [];
let cart = [];

const BUSINESS_WHATSAPP = "51983130700";

/* ================================
   SUPABASE
================================ */

function getSupabaseClient() {
  if (!window.supabase) {
    throw new Error("Supabase no se cargó");
  }

  if (!window.SUPABASE_CONFIG) {
    throw new Error("Falta config.js");
  }

  return window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.publishableKey
  );
}

/* ================================
   ESTILOS GENERALES
================================ */

const style = document.createElement("style");

style.textContent = `

  body {
    padding-top: 78px !important;
  }

  .top-cart {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: white;
    box-shadow: 0 3px 14px rgba(0,0,0,.15);
    border-bottom: 1px solid #e5e5e5;
  }

  .top-cart-button {
    width: 100%;
    border: 0;
    background: white;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .top-cart-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .top-cart-icon {
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: #2e7d32;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 23px;
  }

  .top-cart-title {
    text-align: left;
  }

  .top-cart-title strong {
    display: block;
    font-size: 16px;
    color: #222;
  }

  .top-cart-title span {
    display: block;
    font-size: 13px;
    color: #777;
    margin-top: 2px;
  }

  .top-cart-total {
    font-size: 18px;
    font-weight: 900;
    color: #2e7d32;
    white-space: nowrap;
  }

  .top-cart-panel {
    display: none;
    padding: 0 16px 16px;
    background: white;
    max-height: 65vh;
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
    border-bottom: 1px solid #eee;
  }

  .top-cart-item-name {
    flex: 1;
    font-size: 14px;
    font-weight: 700;
  }

  .cart-mini-button {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 8px;
    background: #f0f0f0;
    font-size: 19px;
  }

  .cart-delete {
    border: 0;
    background: transparent;
    font-size: 19px;
  }

  .top-cart-checkout {
    width: 100%;
    margin-top: 14px;
    padding: 13px;
    border: 0;
    border-radius: 11px;
    background: #2e7d32;
    color: white;
    font-size: 16px;
    font-weight: 800;
  }

  .checkout-wrapper {
    margin-top: 24px;
    background: #f6faf5;
    border-radius: 22px;
    padding: 18px;
    border: 1px solid #dce8d8;
  }

  .checkout-header {
    text-align: center;
    padding: 10px 0 20px;
  }

  .checkout-logo {
    font-size: 42px;
  }

  .checkout-title {
    font-size: 25px;
    font-weight: 800;
    color: #215c28;
    margin: 0;
  }

  .checkout-subtitle {
    color: #777;
    margin: 5px 0 0;
  }

  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .checkout-card {
    background: white;
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,.07);
  }

  .checkout-card h3 {
    margin: 0 0 6px;
    font-size: 21px;
  }

  .checkout-card p {
    margin: 0 0 18px;
    color: #777;
    font-size: 14px;
  }

  .field {
    position: relative;
    margin-bottom: 12px;
  }

  .field-icon {
    position: absolute;
    left: 13px;
    top: 13px;
    font-size: 18px;
  }

  .checkout-input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 13px 13px 43px;
    border: 1px solid #d6d6d6;
    border-radius: 11px;
    font-size: 16px;
    outline: none;
  }

  .continue-btn {
    width: 100%;
    padding: 14px;
    border: 0;
    border-radius: 12px;
    background: #2e7d32;
    color: white;
    font-size: 17px;
    font-weight: 800;
  }

  .payment-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 2px solid #e2e2e2;
    border-radius: 14px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .payment-option.selected {
    border-color: #2e7d32;
    background: #f3faf3;
  }

  .payment-radio {
    width: 20px;
    height: 20px;
    accent-color: #2e7d32;
  }

  .payment-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    flex: none;
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
    background: #e9f3e9;
    font-size: 26px;
  }

  .payment-name {
    font-weight: 800;
  }

  .payment-description {
    color: #777;
    font-size: 13px;
    margin-top: 3px;
  }

  .summary {
    margin-top: 18px;
    background: #fafafa;
    border-radius: 14px;
    padding: 15px;
    border: 1px solid #e5e5e5;
  }

  .summary-title {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 12px;
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
    padding-top: 14px;
    font-size: 20px;
    font-weight: 900;
  }

  .whatsapp-btn {
    width: 100%;
    padding: 15px;
    border: 0;
    border-radius: 13px;
    background: #25D366;
    color: white;
    font-size: 17px;
    font-weight: 900;
    margin-top: 15px;
  }

  .hidden-payment {
    display: none;
  }

  @media (min-width: 760px) {

    .checkout-wrapper {
      padding: 28px;
    }

    .checkout-grid {
      grid-template-columns: 1fr 1fr;
    }

  }

`;

document.head.appendChild(style);

/* ================================
   CARRITO SUPERIOR
================================ */

function createTopCart() {

  if (document.querySelector("#topCart")) return;

  const topCart = document.createElement("div");

  topCart.id = "topCart";
  topCart.className = "top-cart";

  topCart.innerHTML = `

    <button
      class="top-cart-button"
      onclick="toggleTopCart()"
    >

      <div class="top-cart-left">

        <div class="top-cart-icon">
          🛒
        </div>

        <div class="top-cart-title">

          <strong>
            Mi carrito
          </strong>

          <span id="topCartCount">
            0 productos
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
    document.querySelector("#topCartPanel");

  panel.classList.toggle("open");

}

function updateTopCart() {

  createTopCart();

  const count =
    cart.reduce(
      (sum, p) => sum + p.quantity,
      0
    );

  const total =
    getCartTotal();

  document.querySelector("#topCartCount").textContent =
    count === 0
      ? "Carrito vacío"
      : `${count} producto${count !== 1 ? "s" : ""}`;

  document.querySelector("#topCartTotal").textContent =
    `S/ ${total.toFixed(2)}`;

  const panel =
    document.querySelector("#topCartPanel");

  if (cart.length === 0) {

    panel.innerHTML = `
      <div style="
        padding:12px 0;
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
      onclick="showOrder(); closeTopCart();"
    >
      Ver pedido y continuar
    </button>

  `;

}

function closeTopCart() {

  const panel =
    document.querySelector("#topCartPanel");

  if (panel) {
    panel.classList.remove("open");
  }

}

/* ================================
   SUPABASE PRODUCTOS
================================ */

async function loadProducts() {

  const box =
    document.querySelector("#products");

  try {

    const client =
      getSupabaseClient();

    box.innerHTML =
      "Cargando productos...";

    const { data, error } =
      await client
        .from("productos")
        .select("*")
        .eq("activo", true)
        .order("id");

    if (error) throw error;

    products.push(
      ...data.map(p => ({
        id: p.id,
        name: p.nombre,
        category: p.categoria,
        unit: p.unidad,
        price: Number(p.precio),
        image: getImage(p.nombre),
        emoji: getEmoji(p.nombre)
      }))
    );

    render();

  } catch (error) {

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

/* ================================
   SUPABASE CLIENT
================================ */

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

/* ================================
   PRODUCTOS
================================ */

function cleanName(nombre) {

  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
    "col blanca":"🥬",
    ajo:"🧄",
    aji:"🌶️",
    pimiento:"🫑",
    choclo:"🌽",
    maiz:"🌽",
    palta:"🥑",
    apio:"🥬",
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
    col:"🥬",
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

  for (const clave in emojis) {

    if (n.includes(clave)) {
      return emojis[clave];
    }

  }

  return "🥬";

}

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

  for (const clave in images) {

    if (n.includes(clave)) {
      return images[clave];
    }

  }

  return "";

}

/* ================================
   RENDER PRODUCTOS
================================ */

function render() {

  const q =
    document.querySelector("#search")
      .value
      .toLowerCase();

  const c =
    document.querySelector("#category")
      .value;

  const list =
    products.filter(p =>
      (!q ||
        p.name
          .toLowerCase()
          .includes(q)) &&
      (!c ||
        p.category === c)
    );

  document.querySelector("#products").innerHTML =
    list.length

      ? list.map(p => `

        <article
          class="card"
          style="
            overflow:hidden;
            background:white;
            border-radius:18px;
            box-shadow:
              0 4px 14px rgba(0,0,0,.10);
            padding-bottom:16px;
          "
        >

          <div style="
            width:100%;
            height:170px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f4f8f2;
            overflow:hidden;
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
                      font-size:70px;
                    "
                  >
                    ${p.emoji}
                  </div>
                `

                : `
                  <div
                    style="
                      font-size:70px;
                    "
                  >
                    ${p.emoji}
                  </div>
                `
            }

          </div>

          <div style="
            padding:14px 16px 0;
          ">

            <div style="
              font-size:20px;
              font-weight:700;
              margin-bottom:6px;
            ">
              ${p.name}
            </div>

            <div style="
              color:#666;
              margin-bottom:8px;
            ">
              Venta por ${p.unit}
            </div>

            <div style="
              font-size:21px;
              font-weight:800;
              margin-bottom:12px;
            ">
              S/ ${p.price.toFixed(2)}
            </div>

            <button
              onclick="add(${p.id})"
              style="
                width:100%;
                padding:12px;
                border:0;
                border-radius:12px;
                background:#2e7d32;
                color:white;
                font-size:16px;
                font-weight:700;
              "
            >
              Agregar
            </button>

          </div>

        </article>

      `).join("")

      : `
        <div>
          No encontramos productos.
        </div>
      `;

  updateCart();

}

/* ================================
   CARRITO
================================ */

function add(id) {

  const product =
    products.find(
      p => p.id === id
    );

  if (!product) return;

  const existing =
    cart.find(
      item => item.id === id
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

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {

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
      sum + (p.price * p.quantity),
    0
  );

}

function updateCart() {

  createTopCart();

  updateTopCart();

  const cartBox =
    document.querySelector("#cart");

  cartBox.hidden =
    cart.length === 0;

  document.querySelector("#count").textContent =
    cart.reduce(
      (sum,p) =>
        sum + p.quantity,
      0
    );

  document.querySelector("#total").textContent =
    `S/ ${getCartTotal().toFixed(2)}`;

}

/* ================================
   CHECKOUT
================================ */

function showOrder() {

  if (cart.length === 0) {

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
    document.querySelector("#cart");

  form =
    document.createElement("div");

  form.id =
    "customerForm";

  form.innerHTML = `

    <div class="checkout-wrapper">

      <div class="checkout-header">

        <div class="checkout-logo">
          🛒🥬
        </div>

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

          <label
            class="payment-option selected"
          >

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Efectivo - Pago contra entrega"
              checked
              onchange="selectPayment(this)"
            >

            <div
              class="payment-logo cash-logo"
            >
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

          <label
            class="payment-option"
          >

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Yape"
              onchange="selectPayment(this)"
            >

            <div
              class="payment-logo yape-logo"
            >
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

          <label
            class="payment-option"
          >

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Plin"
              onchange="selectPayment(this)"
            >

            <div
              class="payment-logo plin-logo"
            >
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

          <label
            class="payment-option"
          >

            <input
              class="payment-radio"
              type="radio"
              name="payment"
              value="Transferencia bancaria"
              onchange="selectPayment(this)"
            >

            <div
              class="payment-logo bank-logo"
            >
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

  cartBox.appendChild(form);

  form.scrollIntoView({
    behavior:"smooth"
  });

}

/* ================================
   CLIENTE → PAGO
================================ */

function confirmCustomerData() {

  const name =
    document
      .querySelector("#customerName")
      .value
      .trim();

  const phone =
    document
      .querySelector("#customerPhone")
      .value
      .trim();

  const address =
    document
      .querySelector("#customerAddress")
      .value
      .trim();

  if (!name || !phone || !address) {

    alert(
      "Por favor completa nombre, teléfono y dirección."
    );

    return;

  }

  const paymentPanel =
    document.querySelector(
      "#paymentPanel"
    );

  paymentPanel.classList.remove(
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
          S/ ${(p.price * p.quantity).toFixed(2)}
        </strong>

      </div>

    `).join("");

  document.querySelector(
    "#checkoutTotal"
  ).textContent =
    `S/ ${getCartTotal().toFixed(2)}`;

  paymentPanel.scrollIntoView({
    behavior:"smooth"
  });

}

/* ================================
   SELECCIÓN DE PAGO
================================ */

function selectPayment(input) {

  document
    .querySelectorAll(".payment-option")
    .forEach(option => {

      option.classList.remove(
        "selected"
      );

    });

  input
    .closest(".payment-option")
    .classList.add(
      "selected"
    );

}

/* ================================
   GUARDAR PEDIDO
================================ */

async function saveOrder() {

  const client =
    getSupabaseClient();

  const name =
    document
      .querySelector("#customerName")
      .value
      .trim();

  const phone =
    document
      .querySelector("#customerPhone")
      .value
      .trim();

  const address =
    document
      .querySelector("#customerAddress")
      .value
      .trim();

  const reference =
    document
      .querySelector("#customerReference")
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
        (p.price * p.quantity)
          .toFixed(2)
      )

    }));

  const {
    data,
    error
  } = await client
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

    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;

}

/* ================================
   WHATSAPP
================================ */

async function sendWhatsAppOrder() {

  const name =
    document
      .querySelector("#customerName")
      .value
      .trim();

  const phone =
    document
      .querySelector("#customerPhone")
      .value
      .trim();

  const address =
    document
      .querySelector("#customerAddress")
      .value
      .trim();

  const reference =
    document
      .querySelector("#customerReference")
      .value
      .trim();

  const payment =
    document.querySelector(
      'input[name="payment"]:checked'
    )?.value ||
    "Efectivo - Pago contra entrega";

  if (!name || !phone || !address) {

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

  button.disabled = true;

  button.textContent =
    "Guardando pedido...";

  try {

    const order =
      await saveOrder();

    let message =

      `*VERDULERÍA TERÁN* 🥬\n\n` +

      `*PEDIDO #${order.id}*\n\n` +

      `*DATOS DEL CLIENTE*\n` +

      `Nombre: ${name}\n` +

      `Teléfono: ${phone}\n` +

      `Dirección: ${address}\n` +

      `Referencia: ${
        reference || "Sin referencia"
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

    window.open(
      url,
      "_blank"
    );

  } catch (error) {

    console.error(error);

    alert(
      "No se pudo guardar el pedido.\n\n" +
      "Verifica tu conexión e inténtalo nuevamente."
    );

  } finally {

    button.disabled = false;

    button.textContent =
      originalText;

  }

}

/* ================================
   EVENTOS
================================ */

document
  .querySelector("#search")
  .addEventListener(
    "input",
    render
  );

document
  .querySelector("#category")
  .addEventListener(
    "change",
    render
  );

createTopCart();

loadProducts();

/* ================================
   SERVICE WORKER
================================ */

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("./sw.js")
    .catch(() => {});

}