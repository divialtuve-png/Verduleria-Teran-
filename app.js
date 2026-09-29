const products = [];
let cart = [];

async function loadProducts() {
  const box = document.querySelector("#products");

  try {
    if (!window.supabase) {
      throw new Error("Supabase no se cargó");
    }

    if (!window.SUPABASE_CONFIG) {
      throw new Error("Falta config.js");
    }

    const client = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.publishableKey
    );

    box.innerHTML = "Cargando productos...";

    const { data, error } = await client
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("id");

    if (error) throw error;

    products.push(...data.map(p => ({
      id: p.id,
      name: p.nombre,
      category: p.categoria,
      unit: p.unidad,
      price: Number(p.precio),
      image: getImage(p.nombre),
      emoji: getEmoji(p.nombre)
    })));

    render();

  } catch (error) {
    console.error(error);
    box.innerHTML =
      `<div style="padding:20px;color:#b00020">
        Error: ${error.message}
      </div>`;
  }
}

function cleanName(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getEmoji(nombre) {
  const n = cleanName(nombre);

  const emojis = {
    papa: "🥔",
    tomate: "🍅",
    cebolla: "🧅",
    zanahoria: "🥕",
    lechuga: "🥬",
    brocoli: "🥦",
    berenjena: "🍆",
    zapallo: "🎃",
    pepino: "🥒",
    holantao: "🫛",
    arracacha: "🥔",
    "col blanca": "🥬",
    ajo: "🧄",
    aji: "🌶️",
    pimiento: "🫑",
    choclo: "🌽",
    maiz: "🌽",
    palta: "🥑",
    apio: "🥬",
    espinaca: "🌿",
    culantro: "🌿",
    perejil: "🌿",
    rabanito: "🔴",
    rabano: "🔴",
    beterraga: "🫜",
    nabo: "🥬",
    yuca: "🥔",
    camote: "🍠",
    arveja: "🫛",
    vainita: "🫛",
    haba: "🫘",
    frejol: "🫘",
    coliflor: "🥦",
    repollo: "🥬",
    col: "🥬",
    esparrago: "🌱",
    alcachofa: "🌿",
    poro: "🌱",
    puerro: "🌱",
    kion: "🫚",
    jengibre: "🫚",
    hierbabuena: "🌿",
    albahaca: "🌿",
    romero: "🌿",
    oregano: "🌿"
  };

  for (const clave in emojis) {
    if (n.includes(clave)) return emojis[clave];
  }

  return "🥬";
}

function getImage(nombre) {
  const n = cleanName(nombre);

  const images = {
    papa: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
    tomate: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600",
    cebolla: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600",
    zanahoria: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600",
    lechuga: "https://images.unsplash.com/photo-1622205313162-be1d5712a43c?w=600",
    brocoli: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600",
    berenjena: "https://images.unsplash.com/photo-1658231189973-5e5a4d6c8b8a?w=600",
    pepino: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600",
    ajo: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600",
    pimiento: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600"
  };

  for (const clave in images) {
    if (n.includes(clave)) return images[clave];
  }

  return "";
}

function render() {
  const q = document.querySelector("#search").value.toLowerCase();
  const c = document.querySelector("#category").value;

  const list = products.filter(p =>
    (!q || p.name.toLowerCase().includes(q)) &&
    (!c || p.category === c)
  );

  document.querySelector("#products").innerHTML =
    list.length
      ? list.map(p => `
        <article class="card" style="
          overflow:hidden;
          background:white;
          border-radius:18px;
          box-shadow:0 4px 14px rgba(0,0,0,.10);
          padding-bottom:16px;
        ">

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
                ? `<img
                    src="${p.image}"
                    alt="${p.name}"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                    "
                    onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
                  >
                  <div style="
                    display:none;
                    font-size:70px;
                  ">${p.emoji}</div>`
                : `<div style="font-size:70px">${p.emoji}</div>`
            }
          </div>

          <div style="padding:14px 16px 0">
            <div class="name" style="
              font-size:20px;
              font-weight:700;
              margin-bottom:6px;
            ">
              ${p.name}
            </div>

            <div class="unit" style="
              color:#666;
              margin-bottom:8px;
            ">
              Venta por ${p.unit}
            </div>

            <div class="price" style="
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
      : "<div>No encontramos productos.</div>";

  updateCart();
}

function add(id) {
  const product = products.find(p => p.id === id);

  if (product) {
    cart.push(product);
  }

  updateCart();
}

function updateCart() {
  const cartBox = document.querySelector("#cart");

  cartBox.hidden = cart.length === 0;

  document.querySelector("#count").textContent = cart.length;

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  document.querySelector("#total").textContent =
    `S/ ${total.toFixed(2)}`;
}

function showOrder() {
  const text = cart
    .map(p => `• ${p.name} - S/ ${p.price.toFixed(2)}`)
    .join("\n");

  alert(
    `PEDIDO VERDULERÍA TERÁN\n\n${text}\n\nTotal: S/ ${
      cart.reduce((s, p) => s + p.price, 0).toFixed(2)
    }`
  );
}

document.querySelector("#search")
  .addEventListener("input", render);

document.querySelector("#category")
  .addEventListener("change", render);

loadProducts();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}