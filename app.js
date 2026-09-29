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
function getEmoji(nombre) {
  const n = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
"holantao": "🫛",
"arracacha": "🥔",
"col blanca": "🥬",
ajo: "🧄",
aji: "🌶️",
"aji amarillo": "🌶️",
    ajo: "🧄",
    aji: "🌶️",
    pimiento: "🫑",
    choclo: "🌽",
    palta: "🥑",
    limon: "🍋",
    naranja: "🍊",
    platano: "🍌",
    manzana: "🍎",
    fresa: "🍓",
    uva: "🍇",
    sandia: "🍉",
    pina: "🍍",
    melon: "🍈",
    coco: "🥥",
    apio: "🥬",
    espinaca: "🌿",
    culantro: "🌿",
    perejil: "🌿",
    rabanito: "🔴",
    rabano: "🔴",
    beterraga: "🫜",
    remolacha: "🫜",
    nabo: "🥔",
    yuca: "🥔",
    camote: "🍠",
    arveja: "🫛",
    haba: "🫘",
    frejol: "🫘",
    vainita: "🫛",
    lenteja: "🫘",
    champinon: "🍄",
    hongo: "🍄",
    coliflor: "🥦",
    repollo: "🥬",
    col: "🥬",
    esparrago: "🌱",
    alcachofa: "🌿",
    poro: "🌱",
    puerro: "🌱",
    kion: "🫚",
    jengibre: "🫚",
    curcuma: "🫚",
    perejil: "🌿",
    hierbabuena: "🌿",
    albahaca: "🌿",
    romero: "🌿",
    oregano: "🌿",
    mandarina: "🍊",
    toronja: "🍊",
    papaya: "🥭",
    mango: "🥭",
    durazno: "🍑",
    pera: "🍐",
    kiwi: "🥝",
    granada: "🍎",
    maracuya: "🥭",
    melon: "🍈"
  };

  for (const clave in emojis) {
    if (n.includes(clave)) return emojis[clave];
  }

  return "🥬";
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
        <article class="card">
          <div class="emoji">${p.emoji}</div>
          <div class="name">${p.name}</div>
          <div class="unit">Venta por ${p.unit}</div>
          <div class="price">S/ ${p.price.toFixed(2)}</div>
          <button onclick="add(${p.id})">Agregar</button>
        </article>
      `).join("")
      : "<div>No encontramos productos.</div>";

  updateCart();
}

function add(id) {
  const product = products.find(p => p.id === id);
  if (product) cart.push(product);
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