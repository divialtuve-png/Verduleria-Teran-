const cfg=window.SUPABASE_CONFIG||{};
const READY=Boolean(window.supabase && /^https:\/\/.+/.test(String(cfg.url||'')) && String(cfg.publishableKey||'').length>20);
const supabase=READY?window.supabase.createClient(cfg.url,cfg.publishableKey):null;
const $=id=>document.getElementById(id);

function status(msg){ $('loginStatus').textContent=msg; }
function money(v){return `S/ ${Number(v||0).toFixed(2)}`;}

if(!READY){
  status('Primero configura URL y publishable key en config.js.');
  $('login').disabled=true;
}

$('login').addEventListener('click',async()=>{
  if(!READY)return;
  const email=$('email').value.trim(),password=$('password').value;
  if(!email||!password){status('Ingresa correo y contraseña.');return;}
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error){status(error.message);return;}
  showAdmin();
});

$('logout').addEventListener('click',async()=>{await supabase.auth.signOut();location.reload();});

async function showAdmin(){
  $('loginCard').classList.add('hidden');$('adminApp').classList.remove('hidden');$('logout').classList.remove('hidden');
  await Promise.all([loadProducts(),loadOrders()]);
}

async function loadProducts(){
  const {data,error}=await supabase.from('productos').select('*').order('id');
  if(error){$('productsStatus').textContent='Error cargando productos: '+error.message;return;}
  $('productsStatus').textContent=`${data.length} productos encontrados.`;
  $('productRows').innerHTML=data.map(p=>`<tr>
    <td>${esc(p.nombre)}</td><td>${esc(p.categoria||'')}</td><td>${esc(p.unidad||'')}</td>
    <td><input class="price-input" type="number" min="0" step="0.01" value="${Number(p.precio||0).toFixed(2)}" data-price="${p.id}"></td>
    <td><select data-active="${p.id}"><option value="true" ${p.activo?'selected':''}>Sí</option><option value="false" ${!p.activo?'selected':''}>No</option></select></td>
    <td><button class="primary" data-save="${p.id}">Guardar</button></td></tr>`).join('');
  document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>saveProduct(b.dataset.save));
}

async function saveProduct(id){
  const price=Number(document.querySelector(`[data-price="${CSS.escape(id)}"]`).value);
  const active=document.querySelector(`[data-active="${CSS.escape(id)}"]`).value==='true';
  if(!Number.isFinite(price)||price<0){alert('Precio inválido.');return;}
  const {error}=await supabase.from('productos').update({precio:price,activo:active}).eq('id',id);
  if(error){alert('No se pudo guardar: '+error.message);return;}
  await loadProducts();
}

async function loadOrders(){
  const {data,error}=await supabase.from('pedidos').select('*').order('created_at',{ascending:false}).limit(50);
  if(error){$('orderRows').innerHTML=`<tr><td colspan="7">No se pudieron cargar pedidos: ${esc(error.message)}</td></tr>`;return;}
  $('orderRows').innerHTML=(data||[]).map(o=>`<tr>
    <td>${esc(o.numero_pedido||'—')}</td><td>${esc(o.nombre_cliente||'')}</td><td>${esc(o.telefono||'')}</td><td>${money(o.total)}</td><td>${esc(o.forma_pago||'')}</td>
    <td><select data-order-status="${o.id}">${['Pendiente','Confirmado','Preparando','En camino','Entregado','Cancelado'].map(s=>`<option ${s===o.estado?'selected':''}>${s}</option>`).join('')}</select></td>
    <td><button class="primary" data-order-save="${o.id}">Guardar</button></td></tr>`).join('');
  document.querySelectorAll('[data-order-save]').forEach(b=>b.onclick=()=>saveOrderStatus(b.dataset.orderSave));
}

async function saveOrderStatus(id){
  const el=document.querySelector(`[data-order-status="${CSS.escape(id)}"]`);
  const {error}=await supabase.from('pedidos').update({estado:el.value}).eq('id',id);
  if(error){alert('No se pudo actualizar: '+error.message);return;} await loadOrders();
}

function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}

if(READY){supabase.auth.getSession().then(({data})=>{if(data.session)showAdmin();});}
