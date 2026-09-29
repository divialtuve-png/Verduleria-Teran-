const supabase = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

let products = [];
let cart = [];

async function loadProducts() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
  console.error("Error cargando productos:", error);
  document.querySelector("#products").innerHTML =
    `<div>Error al cargar productos: ${error.message}</div>`;
  return;
  }

  products = data.map(p => ({
    id: p.id,
    name: p.nombre,
    category: p.categoria,
    unit: p.unidad,
    price: Number(p.precio),
    emoji: p.emoji || "🥬"
  }));

  render();
}

function money(n) {
  return `S/ ${Number(n).toFixed(2)}`;
}

function render() {
  const q = document.querySelector("#search").value.toLowerCase().trim();
  const c = document.querySelector("#category").value;

  const list = products.filter(
    p =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!c || p.category === c)
  );

  const el = document.querySelector("#products");

  el.innerHTML = list.length
    ? list.map(p => `
      <article class="card">
        <div class="emoji">${p.emoji}</div>
        <div class="name">${p.name}</div>
        <div class="unit">Venta por ${p.unit}</div>
        <div class="price">${money(p.price)}</div>
        <button class="add" onclick="add(${p.id})">Agregar</button>
      </article>
    `).join("")
    : `<div class="empty">No encontramos productos.</div>`;

  updateCart();
}

function add(id) {
  const p = products.find(x => x.id === id);
  if (p) cart.push(p);
  updateCart();
}

function updateCart() {
  document.querySelector("#cart").hidden = !cart.length;
  document.querySelector("#count").textContent = cart.length;
  document.querySelector("#total").textContent =
    money(cart.reduce((s, p) => s + p.price, 0));
}

function showOrder() {
  const text = cart
    .map(p => `• ${p.name} — ${money(p.price)}`)
    .join("\n");

  alert(
    `PEDIDO VERDULERÍA TERÁN\n\n${text}\n\nTotal: ${money(
      cart.reduce((s, p) => s + p.price, 0)
    )}`
  );
}

document.querySelector("#search").addEventListener("input", render);
document.querySelector("#category").addEventListener("change", render);

loadProducts();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .catch(() => {});
}