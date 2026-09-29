const demoProducts = [
  {id:1,name:"Papa blanca",category:"Verduras",unit:"kg",price:3.50,emoji:"🥔"},
  {id:2,name:"Tomate",category:"Verduras",unit:"kg",price:4.50,emoji:"🍅"},
  {id:3,name:"Cebolla roja",category:"Verduras",unit:"kg",price:4.00,emoji:"🧅"},
  {id:4,name:"Zanahoria",category:"Verduras",unit:"kg",price:3.00,emoji:"🥕"},
  {id:5,name:"Lechuga",category:"Verduras",unit:"unidad",price:2.50,emoji:"🥬"},
  {id:6,name:"Limón",category:"Frutas",unit:"kg",price:5.00,emoji:"🍋"},
  {id:7,name:"Culantro",category:"Hierbas",unit:"atado",price:1.50,emoji:"🌿"},
  {id:8,name:"Brócoli",category:"Verduras",unit:"unidad",price:4.50,emoji:"🥦"}
];
let products = demoProducts, cart = [let demoProducts = [];

async function loadProducts() {
  const { data, error } = await window.supabase
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error(error);
    return;
  }

  demoProducts = data;
  renderProducts(demoProducts);
}

loadProducts();];

function money(n){return `S/ ${Number(n).toFixed(2)}`}
function render(){
  const q=document.querySelector("#search").value.toLowerCase().trim();
  const c=document.querySelector("#category").value;
  const list=products.filter(p=>(!q||p.name.toLowerCase().includes(q))&&(!c||p.category===c));
  const el=document.querySelector("#products");
  el.innerHTML=list.length?list.map(p=>`<article class="card">
    <div class="emoji">${p.emoji||"🥬"}</div><div class="name">${p.name}</div>
    <div class="unit">Venta por ${p.unit}</div><div class="price">${money(p.price)}</div>
    <button class="add" onclick="add(${p.id})">Agregar</button>
  </article>`).join(""):`<div class="empty">No encontramos productos.</div>`;
  updateCart();
}
function add(id){const p=products.find(x=>x.id===id);if(p)cart.push(p);updateCart()}
function updateCart(){
  document.querySelector("#cart").hidden=!cart.length;
  document.querySelector("#count").textContent=cart.length;
  document.querySelector("#total").textContent=money(cart.reduce((s,p)=>s+p.price,0));
}
function showOrder(){
  const text=cart.map(p=>`• ${p.name} — ${money(p.price)}`).join("\n");
  alert(`PEDIDO VERDULERÍA TERÁN\n\n${text}\n\nTotal: ${money(cart.reduce((s,p)=>s+p.price,0))}`);
}
document.querySelector("#search").addEventListener("input",render);
document.querySelector("#category").addEventListener("change",render);
render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
