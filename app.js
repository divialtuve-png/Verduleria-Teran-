
/*
====================================================
 VERDULERÍA TERÁN — VERSIÓN CORREGIDA DEL CATÁLOGO
 Diseño: referencia aprobada
 Funciones: Supabase + carrito + checkout + pagos
           + pedidos + WhatsApp
====================================================
*/

const SUPABASE_READY = Boolean(
  window.supabase &&
  window.SUPABASE_CONFIG &&
  window.SUPABASE_CONFIG.url &&
  window.SUPABASE_CONFIG.publishableKey &&
  !String(window.SUPABASE_CONFIG.url).includes("TU-PROYECTO") &&
  !String(window.SUPABASE_CONFIG.publishableKey).includes("TU-PUBLISHABLE-KEY")
);

const client = SUPABASE_READY
  ? window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.publishableKey
    )
  : null;

const BUSINESS_WHATSAPP = "51983130700";

const products = [];
let cart = [];
let currentCategory = "Todos";
let selectedPayment = "";
let currentView = "home";
let currentUser = null;
let authMode = "login";

/* =================================================
   ESTILOS
================================================= */

const style = document.createElement("style");

style.textContent = `

:root{
  --green:#218E49;
  --green-dark:#176B37;
  --green-light:#E8F7EC;
  --orange:#F28C28;
  --pink:#F28C28;
  --purple:#263653;
  --blue:#218E49;
  --text:#263653;
  --muted:#657386;
  --line:#E3E8ED;
  --cream:#FFFDF7;
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

/* Imagen independiente del logo y cabecera compacta */
.brand{flex:1;min-width:0;max-width:none;gap:0}
.brand-logo-final{display:block;width:min(100%,245px);height:auto;max-height:74px;object-fit:contain;object-position:left center}
@media(max-width:430px){.brand-logo-final{width:min(100%,226px);max-height:68px}.topbar{gap:5px}.top-cart{gap:3px}}
@media(max-width:375px){.brand-logo-final{width:min(100%,199px);max-height:61px}.top-cart-total{padding:8px 6px;font-size:11px}}

/* Cabecera opción 5: imagen de marca aprobada y adaptable */
.brand{gap:7px;flex:1;max-width:calc(100% - 116px)}
.brand-emblem{width:62px;height:61px;flex:none;display:grid;place-items:center}
.brand-emblem svg{width:100%;height:100%;filter:drop-shadow(0 2px 2px rgba(13,75,35,.14))}
.brand-wordmark{display:flex;flex-direction:column;min-width:0;justify-content:center}
.brand-wordmark .brand-title{display:flex;flex-direction:column;align-items:flex-start;font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:22px;line-height:.92;font-weight:900;letter-spacing:-1.1px;color:#07552d;text-shadow:0 .5px 0 #0d773f;white-space:nowrap}
.brand-wordmark .brand-title span{font-size:26px;color:#f47a16;align-self:center;text-shadow:0 .5px 0 #c95910}
.brand-wordmark .brand-caption{font-size:8px;font-weight:750;line-height:1.2;color:#23683d;margin-top:5px;white-space:nowrap}
.top-cart{flex:none;gap:4px}
@media(max-width:390px){.topbar{padding-left:7px;padding-right:7px}.brand{gap:4px;max-width:calc(100% - 111px)}.brand-emblem{width:48px;height:53px}.brand-wordmark .brand-title{font-size:18px}.brand-wordmark .brand-title span{font-size:22px}.brand-wordmark .brand-caption{font-size:7px}.top-cart-icon{width:32px;height:36px;font-size:19px}.top-cart-total{padding:9px 7px;font-size:11px}}


.brand-mark{
  width:47px;
  height:47px;
  border-radius:15px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:29px;
  background:linear-gradient(145deg,#FFFDF7,#BDECE8);
  flex:none;
}

.brand-name{
  font-weight:900;
  line-height:.96;
  font-size:18px;
  color:#263653;
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
  border-radius:19px;
  overflow:hidden;
  background:#e5f5df;
}

.hero-image{
  display:block;
  width:100%;
  height:auto;
  aspect-ratio:792 / 694;
  object-fit:contain;
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
  background:#218E49;
  color:#FFFFFF;
  border-color:#218E49;
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
  color:var(--green);
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


/* Mi cuenta: estilos aislados; no modifica el banner ni el catálogo */
.account-page{padding:14px 12px 110px;max-width:720px}
.account-welcome{display:flex;gap:12px;align-items:center;background:linear-gradient(115deg,#e8f7ec,#fff);border:1px solid #d9eadc;border-radius:20px;padding:19px 16px;margin-bottom:13px}
.account-welcome-icon{width:50px;height:50px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:26px;flex:none}
.account-welcome h1{font-size:23px;margin:0 0 5px;color:#176b37}
.account-welcome p{font-size:12px;line-height:1.5;margin:0;color:#475569}
.account-panel{background:#fff;border:1px solid #e4e9e5;border-radius:17px;padding:17px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.025)}
.account-panel h2{font-size:17px;margin:0 0 10px;color:#263653}
.account-panel h3{font-size:13px;margin:14px 0 8px;color:#176b37}
.account-panel p{font-size:12px;line-height:1.55;color:#647084;margin:0 0 12px}
.account-actions{display:grid;gap:8px}
.account-action-main,.account-action-alt,.account-whatsapp{display:block;width:100%;text-align:center;border-radius:11px;padding:12px;font-size:13px;font-weight:800;text-decoration:none;cursor:pointer}
.account-action-main{background:#218e49;color:#fff;border:1px solid #218e49}
.account-action-alt{background:#f3faf5;color:#176b37;border:1px solid #cfe7d5}
.account-zones{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}
.account-zones span{padding:7px 10px;border-radius:20px;background:#edf8ef;color:#176b37;font-size:11px;font-weight:800}
.account-panel .account-small{font-size:11px;margin:0}
.account-line{display:flex;align-items:baseline;justify-content:space-between;gap:8px;border-bottom:1px solid #eef1ef;padding:9px 0;font-size:11px}
.account-line strong{text-align:right;font-size:11px;color:#176b37}
.account-whatsapp{background:#20a85a;color:white}
.account-footnote{text-align:center;font-size:10px;color:#829087;padding:4px 10px}

@media(max-width:700px){
  .products{grid-template-columns:repeat(2,minmax(0,1fr))}
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

style.textContent += `
.auth-form{display:grid;gap:10px}.auth-form label{font-size:12px;font-weight:800;color:#263653}
.auth-form input{width:100%;border:1px solid #d5dfd7;border-radius:11px;padding:13px;font-size:14px;background:white}
.auth-note{font-size:12px;color:#647084;line-height:1.5}.auth-error{color:#ad2831;font-size:12px;white-space:pre-wrap}
.auth-success{color:#176b37;font-size:12px;white-space:pre-wrap}.auth-link{border:0;background:transparent;color:#176b37;text-decoration:underline;font-weight:800;padding:9px}
`;
style.textContent += '\n/* Canasta Inteligente Terán — estilos independientes */\n.smart-entry{margin:12px 10px;padding:17px;border-radius:20px;background:linear-gradient(115deg,#126b38,#249d4e);color:white;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 8px 22px #116b3825}\n.smart-entry h2{margin:0 0 6px;font-size:20px;color:white}.smart-entry p{margin:0 0 12px;font-size:12px;line-height:1.45;color:#f0fff3}\n.smart-entry button,.smart-action{border:0;border-radius:13px;padding:12px 15px;font-weight:900;background:#fff;color:#126b38}\n.smart-entry-icon{font-size:54px;flex:none}\n.smart-wrap{padding:12px 12px 115px;max-width:680px;margin:auto}\n.smart-hero{background:linear-gradient(130deg,#e9f9e8,#fff9eb);padding:22px 17px;border-radius:22px;text-align:center;margin-bottom:13px}\n.smart-hero .smart-emoji{font-size:56px}.smart-hero h2{margin:6px 0;color:#176b37;font-size:23px}.smart-hero p{font-size:13px;line-height:1.5;color:#52645a;margin:6px 0}\n.smart-panel{background:white;border:1px solid #e1eae1;border-radius:18px;padding:17px;margin-bottom:12px}\n.smart-panel h3{margin:0 0 12px;color:#176b37;font-size:16px}\n.smart-budget{display:flex;align-items:center;gap:8px}.smart-budget input{width:100%;min-width:0;padding:12px;border:1px solid #cdded1;border-radius:11px;font-size:21px;font-weight:900;color:#176b37;text-align:center}\n.smart-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.smart-chips button,.smart-choice button{border:1px solid #d4e5d6;background:#f6fbf6;border-radius:11px;padding:10px 12px;color:#176b37;font-weight:800}\n.smart-choice{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.smart-choice button.active{background:#218e49;color:#fff;border-color:#218e49}\n.smart-muted{font-size:12px;color:#657386;line-height:1.45}.smart-result{background:#edf9e9;border:1px solid #cfe8ca;border-radius:16px;padding:15px;margin-bottom:12px}\n.smart-result strong{color:#176b37}.smart-row{display:grid;grid-template-columns:46px 1fr auto;gap:9px;align-items:center;border-bottom:1px solid #eef1ee;padding:10px 0}\n.smart-row img{width:46px;height:46px;object-fit:cover;border-radius:10px}.smart-row b{font-size:12px}.smart-row small{display:block;color:#68796c;font-size:10px;margin-top:3px}\n.smart-qty{display:flex;gap:7px;align-items:center}.smart-qty button{border:0;border-radius:8px;background:#e6f5e9;color:#176b37;font-weight:900;width:29px;height:29px}.smart-qty span{min-width:14px;text-align:center;font-weight:800}\n.smart-total{display:flex;justify-content:space-between;font-size:19px;font-weight:900;color:#176b37;padding:15px 0}\n.smart-submit{display:block;width:100%;padding:15px;border:0;border-radius:14px;background:#218e49;color:#fff;font-size:15px;font-weight:900}\n.smart-submit:disabled{opacity:.45}.smart-note{font-size:11px;color:#647084;margin:9px 0}\n';
style.textContent += '\n/* Catálogo Terán: tarjetas limpias con fotografías protagonistas. */\n.products{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:0 12px}\n.card{background:#fff;border:1px solid #e4eae4;border-radius:16px;box-shadow:0 4px 15px rgba(18,75,37,.06)}\n.card-image{aspect-ratio:1/1;background:#fff;padding:8px;box-sizing:border-box}\n.card-image img{object-fit:contain;border-radius:9px}\n.card-body{padding:10px 11px 12px}\n.card-name{font-size:14px;line-height:1.25;min-height:0}\n.card-unit{font-size:11px;color:#69776d}\n.card-bottom{margin-top:10px;gap:6px}\n.price{font-size:16px;color:#176b37}\n.add{min-width:34px;min-height:34px;border-radius:10px;font-size:20px}\n@media(min-width:800px){.products{grid-template-columns:repeat(4,minmax(0,1fr))}}\n@media(max-width:360px){.products{gap:8px}.card-body{padding:8px}.card-name{font-size:12px}.price{font-size:14px}}\n';
style.textContent += `
/* Canasta inteligente — presentación aprobada verde y blanco */
.smart-entry{background:linear-gradient(125deg,#eaffdb,#baf18a 65%,#70ca55);color:#07572b;border:1px solid #c6eeb3;box-shadow:0 6px 22px #2c883022}
.smart-entry h2{color:#07572b}.smart-entry p{color:#285d35}.smart-entry button{background:linear-gradient(110deg,#0a9d16,#078023);color:white;box-shadow:0 4px 12px #188c3333}
.smart-entry-icon{font-size:35px;letter-spacing:-13px;padding-right:14px}
.smart-wrap{background:linear-gradient(#f4fff0,#fff 320px);min-height:75vh}
.smart-hero{background:radial-gradient(circle at 35% 60%,#c5f6a6,#effde9 60%,#fffef4);display:flex;justify-content:space-around;align-items:center;gap:12px;text-align:left;min-height:176px;padding:16px 12px}
.smart-robot{font-size:82px;line-height:1;position:relative;filter:drop-shadow(0 7px 8px #286b2930)}
.smart-robot span{display:block;font-size:25px;text-align:center;margin-top:-5px}
.smart-hello{background:white;border-radius:24px;padding:17px 14px;max-width:175px;box-shadow:0 4px 14px #226a2418}
.smart-hello strong{font-size:20px;color:#07572b}.smart-hello p{font-size:12px;color:#274c2e;line-height:1.4;margin:4px 0}
.smart-panel{box-shadow:0 4px 17px #174f1b0b;border:1px solid #e7efe3}
.smart-panel h3{color:#075a26}
.smart-budget{background:#f9fcf8;border:1px solid #e6eee3;padding:7px;border-radius:35px}
.smart-budget input{border:0;background:transparent;outline:none;font-size:24px;padding:7px 2px;min-width:0}
.smart-budget button{flex:none;width:38px;height:38px;border:0;border-radius:50%;background:linear-gradient(150deg,#20c51c,#058c19);color:#fff;font-size:25px;font-weight:800;line-height:1}
.smart-choice button{padding:14px 5px;min-height:62px;background:#f7faf6}
.smart-choice button.active{background:#e9fbe6;color:#075e19;border:2px solid #0ba423;box-shadow:0 3px 8px #118b231a}
.smart-submit{border-radius:30px;background:linear-gradient(105deg,#10b81d,#008b17);box-shadow:0 5px 13px #168e2533}
.smart-result{background:linear-gradient(120deg,#eafbe1,#f8fff1)}
.smart-row{grid-template-columns:52px minmax(0,1fr) auto}
.smart-row img{width:52px;height:52px;object-fit:contain;background:#fff}
.smart-qty button{background:linear-gradient(135deg,#13b923,#00871b);color:white;border-radius:9px}
@media(max-width:375px){.smart-robot{font-size:67px}.smart-hello{padding:12px 10px}.smart-choice button{font-size:11px}.smart-row{gap:5px}.smart-qty{gap:4px}}
`;
style.textContent += `
/* Canasta sin robot ni canasta vacía; presentación sencilla de verduras */
.smart-entry-icon{font-size:31px;letter-spacing:-9px;padding-right:12px;white-space:nowrap}
.smart-produce{font-size:38px;letter-spacing:-10px;line-height:1.3;min-width:125px;filter:drop-shadow(0 5px 6px #245d2520)}
.smart-hello{max-width:210px}
.smart-entry button{cursor:pointer;touch-action:manipulation;position:relative;z-index:2}
@media(max-width:375px){.smart-produce{font-size:29px;min-width:90px}.smart-entry-icon{font-size:25px}}
`;
style.textContent += `
/* Corrección final: canasta sin robot, ilustraciones vacías ni elementos que bloqueen pulsaciones */
.smart-entry{background:linear-gradient(120deg,#edffe5 0%,#c5f3aa 68%,#91dc73 100%);border:1px solid #b6e8a1;color:#095b2c}
.smart-entry-icon{font-size:32px;letter-spacing:0;padding:0 8px 0 0;line-height:1.25;min-width:96px;text-align:center;pointer-events:none}
.smart-entry button{position:relative;z-index:5;display:inline-flex;align-items:center;justify-content:center;min-height:49px;touch-action:manipulation;pointer-events:auto;background:linear-gradient(110deg,#13b828,#087e29);color:#fff}
.smart-entry .smart-entry-icon{user-select:none}
.smart-hero{background:linear-gradient(130deg,#f2ffe8,#dcf8cc 70%,#fffdf1);border:1px solid #d5ebcf}
.smart-produce{min-width:0;font-size:43px;letter-spacing:0;line-height:1.2;max-width:42%;overflow-wrap:anywhere}
.smart-hello{flex:1;max-width:none}
.smart-robot{display:none!important}
@media(max-width:375px){.smart-entry-icon{font-size:26px;min-width:70px}.smart-produce{font-size:33px}}
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
        <img class="brand-logo-final" src="logo-teran-opcion5.png" alt="Verdulería Terán — verduras frescas y de calidad">
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


/* Banner aprobado integrado en este mismo archivo para actualizar GitHub una sola vez. */
const TERAN_BANNER_IMAGE = "data:image/jpeg;base64,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";

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
        <img class="hero-image" src="${TERAN_BANNER_IMAGE}" alt="Verdulería Terán: verduras frescas y pedidos por WhatsApp">
      </section>

      <section class="smart-entry"><div><h2>🥬 Canasta Inteligente Terán</h2><p>Dinos tu presupuesto y preparamos la mejor selección de verduras para ti.</p><button id="openSmartBasket">✨ Crear mi canasta →</button></div><div class="smart-entry-icon" aria-hidden="true">🥬🥕🍅</div></section>

      <div class="search-wrap">
        <input id="search" class="search" placeholder="⌕  Buscar productos...">
      </div>

      <div class="categories" id="categories">
        ${["Todos","Verduras","Tubérculos","Hierbas"].map(c=>`
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

  // La apertura se gestiona por delegación para resistir cambios del DOM.

  document.getElementById("search").addEventListener("input",renderProductGrid);

  renderProductGrid();
  updateBadges();
}

function renderProductGrid(){
  const box=document.getElementById("products");
  if(!box) return;

  const term=(document.getElementById("search")?.value || "").trim().toLowerCase();

  const list=products.filter(p=>{
    const categoryOk=["verduras","tuberculos","hierbas"].includes(normalize(p.category)) && (currentCategory==="Todos" || normalize(p.category)===normalize(currentCategory));
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
          onerror="this.onerror=null;this.src='${esc(fallbackImage(p.name,p.category))}'"
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
                  onerror="this.onerror=null;this.src='${esc(fallbackImage(item.name,item.category))}'"
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

const DELIVERY_RATES={"San Borja":12,"San Luis":10,"San Isidro":18,"La Victoria":15};
function selectedDeliveryCost(){
  const district=document.getElementById("deliveryDistrict")?.value;
  return Object.prototype.hasOwnProperty.call(DELIVERY_RATES,district)?DELIVERY_RATES[district]:null;
}
function updateCheckoutDelivery(){
  const cost=selectedDeliveryCost();
  const shipping=document.getElementById("shippingAmount");
  const total=document.getElementById("checkoutTotal");
  if(shipping) shipping.textContent=cost===null?"Selecciona un distrito":`S/ ${cost.toFixed(2)}`;
  if(total) total.textContent=cost===null?`S/ ${cartTotal().toFixed(2)} + envío`:`S/ ${(cartTotal()+cost).toFixed(2)}`;
}
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
            <label>Distrito de entrega</label>
            <select id="deliveryDistrict" required style="width:100%;min-height:46px;border:1px solid #d9dfdb;border-radius:10px;padding:10px;background:white;font:inherit;color:#26344c">
              <option value="">Selecciona tu distrito</option>
              ${Object.entries(DELIVERY_RATES).map(([district,cost])=>`<option value="${district}">${district} — S/ ${cost.toFixed(2)}</option>`).join("")}
            </select>
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
              onerror="this.onerror=null;this.src='${esc(fallbackImage(item.name,item.category))}'"
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
            <strong id="shippingAmount">Selecciona un distrito</strong>
          </div>

          <div class="total-final">
            <span>TOTAL</span>
            <strong id="checkoutTotal">S/ ${cartTotal().toFixed(2)} + envío</strong>
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

  document.getElementById("deliveryDistrict").addEventListener("change",updateCheckoutDelivery);
  updateCheckoutDelivery();
  document.getElementById("confirm").addEventListener("click",saveOrder);

  updateBadges();
  window.scrollTo(0,0);
}

/* Historial privado de este navegador. No consulta pedidos de otros clientes. */
const LOCAL_ORDERS_KEY="teran_my_orders_v1";
function readLocalOrders(){
  try{const value=JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY)||"[]");return Array.isArray(value)?value:[];}
  catch(_){return [];}
}
function rememberLocalOrder(order){
  try{
    const previous=readLocalOrders();
    previous.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY,JSON.stringify(previous.slice(0,30)));
  }catch(error){console.warn("No se pudo guardar historial local",error);}
}
function localOrderDate(value){
  try{return new Date(value).toLocaleString("es-PE",{dateStyle:"medium",timeStyle:"short"});}
  catch(_){return "Fecha no disponible";}
}

/* =================================================
   SAVE ORDER
================================================= */

async function saveOrder(){

  const name=document.getElementById("name").value.trim();
  const phone=document.getElementById("phone").value.trim();
  const address=document.getElementById("address").value.trim();
  const district=document.getElementById("deliveryDistrict").value;
  const shippingCost=selectedDeliveryCost();
  const reference=document.getElementById("reference").value.trim();

  if(!name || !phone || !address){
    alert("Completa nombre, teléfono y dirección.");
    return;
  }

  if(shippingCost===null){
    alert("Selecciona el distrito para calcular el delivery.");
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

  const subtotal=Number(cartTotal().toFixed(2));
  const total=Number((subtotal+shippingCost).toFixed(2));

  try{

    if(!client){
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }

    const {data:authData,error:authError}=await client.auth.getUser();
    if(authError) console.warn("No se pudo verificar sesión",authError);
    const userId=authData?.user?.id || null;
    const {error}=await client
      .from("pedidos")
      .insert({
        ...(userId ? {user_id:userId} : {}),
        nombre_cliente:name,
        telefono:phone,
        direccion:`${address} - ${district}`,
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
      district,
      reference,
      payment:selectedPayment,
      subtotal,
      shippingCost,
      total,
      products:orderProducts
    });

    rememberLocalOrder({
      localRef:"VT-"+Date.now().toString(36).toUpperCase(),
      createdAt:new Date().toISOString(),
      products:orderProducts,
      total,
      subtotal,
      shippingCost,
      district,
      payment:selectedPayment,
      statusAtCreation:"Pendiente",
      whatsappUrl:text
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
  text+=`*Distrito:* ${order.district}\n`;

  if(order.reference){
    text+=`*Referencia:* ${order.reference}\n`;
  }

  text+=`*Pago:* ${order.payment}\n\n`;
  text+=`*PRODUCTOS:*\n`;

  order.products.forEach(item=>{
    text+=`• ${item.nombre} x ${item.cantidad} ${item.unidad} = S/ ${item.subtotal.toFixed(2)}\n`;
  });

  text+=`\n*Subtotal:* S/ ${order.subtotal.toFixed(2)}\n`;
  text+=`*Delivery (${order.district}):* S/ ${order.shippingCost.toFixed(2)}\n`;
  text+=`*TOTAL: S/ ${order.total.toFixed(2)}*`;

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

async function renderOrders(){
  currentView="orders";
  const history=readLocalOrders();
  document.getElementById("app").innerHTML=`
    ${header()}
    <main class="page account-page">
      <section class="account-welcome"><div class="account-welcome-icon">📦</div>
        <div><h1>Mis pedidos</h1><p>${currentUser ? "Consulta tus pedidos desde cualquier dispositivo al iniciar sesión." : "Inicia sesión para consultar tus pedidos desde cualquier celular."}</p></div>
      </section>
      ${currentUser ? `<section class="account-panel" id="remoteOrders"><p>Buscando tus pedidos guardados en Supabase...</p></section>` : `<section class="account-panel"><p>Para consultar pedidos desde otro celular, entra a Mi cuenta y accede con tu correo y contraseña.</p><button class="account-action-main" id="ordersLogin">Iniciar sesión o crear cuenta</button></section>`}
      <section class="account-panel"><h2>Pedidos guardados en este dispositivo</h2><p>Este historial local conserva pedidos anteriores. Los pedidos realizados antes de iniciar sesión no se vinculan automáticamente a tu cuenta.</p></section>
      ${history.length ? history.map(order=>`
        <section class="account-panel"><h2>🧾 Pedido ${esc(order.localRef)}</h2>
          <div class="account-line"><span>Fecha</span><strong>${esc(localOrderDate(order.createdAt))}</strong></div>
          <div class="account-line"><span>Estado inicial</span><strong>${esc(order.statusAtCreation)}</strong></div>
          <div class="account-line"><span>Forma de pago</span><strong>${esc(order.payment)}</strong></div>
          <h3>Productos</h3>
          ${(Array.isArray(order.products)?order.products:[]).map(item=>`<div class="account-line"><span>${esc(item.nombre)} × ${Number(item.cantidad)||0}</span><strong>S/ ${(Number(item.subtotal)||0).toFixed(2)}</strong></div>`).join("")}
          ${order.subtotal != null ? `<div class="account-line"><span>Subtotal</span><strong>S/ ${(Number(order.subtotal)||0).toFixed(2)}</strong></div>` : ""}
          ${order.shippingCost != null ? `<div class="account-line"><span>Delivery ${esc(order.district||"")}</span><strong>S/ ${(Number(order.shippingCost)||0).toFixed(2)}</strong></div>` : ""}
          <div class="account-line"><span><b>TOTAL</b></span><strong>S/ ${(Number(order.total)||0).toFixed(2)}</strong></div>
          ${order.whatsappUrl ? `<a class="account-whatsapp" href="${esc(order.whatsappUrl)}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a>` : ""}
        </section>`).join("") : `<section class="account-panel"><p>No hay pedidos guardados en este navegador.</p></section>`}
      <button class="account-action-main" id="orderBack">Volver al inicio</button>
    </main>`;
  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("orderBack")?.addEventListener("click",()=>navigate("home"));
  document.getElementById("ordersLogin")?.addEventListener("click",()=>navigate("account"));
  updateBadges();window.scrollTo(0,0);
  if(currentUser && client){
    const target=document.getElementById("remoteOrders");
    try{
      const {data,error}=await client.from("pedidos")
        .select("id,fecha,estado,forma_pago,productos,total,direccion")
        .eq("user_id",currentUser.id).order("fecha",{ascending:false}).limit(50);
      if(error) throw error;
      if(currentView!=="orders" || !target?.isConnected) return;
      target.innerHTML=`<h2>Pedidos de mi cuenta</h2>`+(data?.length ? data.map(order=>{
        const items=Array.isArray(order.productos)?order.productos:[];
        return `<div style="border-top:1px solid #e4e9e5;padding:12px 0">
          <h3>Pedido #${esc(order.id)}</h3>
          <div class="account-line"><span>Fecha</span><strong>${esc(localOrderDate(order.fecha))}</strong></div>
          <div class="account-line"><span>Estado actual</span><strong>${esc(order.estado||"Pendiente")}</strong></div>
          <div class="account-line"><span>Pago</span><strong>${esc(order.forma_pago||"—")}</strong></div>
          ${items.map(item=>`<div class="account-line"><span>${esc(item.nombre||"Producto")} × ${Number(item.cantidad)||0}</span><strong>S/ ${(Number(item.subtotal)||0).toFixed(2)}</strong></div>`).join("")}
          <div class="account-line"><span><b>Total con delivery</b></span><strong>S/ ${(Number(order.total)||0).toFixed(2)}</strong></div>
        </div>`;
      }).join("") : `<p>Todavía no hay pedidos vinculados a esta cuenta.</p>`);
    }catch(error){
      console.error("No se pudo consultar pedidos",error);
      if(target?.isConnected) target.innerHTML=`<h2>Pedidos de mi cuenta</h2><p>No pudimos cargar tus pedidos. Verifica que las políticas de Supabase permitan a cada usuario consultar únicamente sus pedidos.</p>`;
    }
  }
}

function renderAuthPanel(){
  if(!client) return `<section class="account-panel"><h2>Acceso de clientes</h2><p>La conexión a Supabase no está configurada. Verifica config.js antes de publicar.</p></section>`;
  if(currentUser) return `<section class="account-panel"><h2>🔐 Mi sesión</h2><p>Has iniciado sesión como <strong>${esc(currentUser.email||"Cliente")}</strong>.</p><div class="account-actions"><button class="account-action-main" id="authOrders">Ver mis pedidos en línea</button><button class="account-action-alt" id="authLogout">Cerrar sesión</button></div></section>`;
  return `<section class="account-panel"><h2>🔐 ${authMode==="signup"?"Crear cuenta":authMode==="reset"?"Recuperar contraseña":authMode==="update"?"Establecer contraseña nueva":"Iniciar sesión"}</h2>
    <p>Con una cuenta podrás consultar tus próximos pedidos desde cualquier celular.</p>
    <form class="auth-form" id="authForm">
      ${authMode!=="update"?`<label>Correo electrónico<input id="authEmail" type="email" autocomplete="email" required placeholder="correo@ejemplo.com"></label>`:""}
      ${authMode!=="reset" ? `<label>${authMode==="update"?"Nueva contraseña":"Contraseña"}<input id="authPassword" type="password" autocomplete="${authMode==="signup"?"new-password":"current-password"}" required minlength="6" placeholder="Mínimo 6 caracteres"></label>` : ""}
      <button class="account-action-main" type="submit">${authMode==="signup"?"Crear mi cuenta":authMode==="reset"?"Enviar enlace de recuperación":authMode==="update"?"Guardar nueva contraseña":"Entrar a mi cuenta"}</button>
      <div id="authMessage" role="status" aria-live="polite"></div>
    </form>
    <button class="auth-link" id="authToggle">${authMode==="signup"?"Ya tengo cuenta: iniciar sesión":"¿No tienes cuenta? Crear cuenta"}</button>
    ${authMode==="update"?"":authMode!=="reset"?`<button class="auth-link" id="authReset">Olvidé mi contraseña</button>`:`<button class="auth-link" id="authLogin">Volver a iniciar sesión</button>`}
  </section>`;
}

async function submitAuth(event){
  event.preventDefault();
  if(!client) return;
  const email=document.getElementById("authEmail")?.value.trim();
  const password=document.getElementById("authPassword")?.value||"";
  const message=document.getElementById("authMessage");
  const submit=document.querySelector("#authForm button[type=submit]");
  if((authMode!=="update"&&!email)|| (authMode!=="reset"&&password.length<6)) return;
  if(submit) submit.disabled=true;
  if(message){message.className="auth-note";message.textContent="Procesando...";}
  try{
    let result;
    if(authMode==="update") result=await client.auth.updateUser({password});
    else if(authMode==="signup") result=await client.auth.signUp({email,password,options:{emailRedirectTo:"https://divialtuve-png.github.io/Verduleria-Teran-/"}});
    else if(authMode==="reset") result=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
    else result=await client.auth.signInWithPassword({email,password});
    if(result.error) throw result.error;
    if(authMode==="update" && !result.error){authMode="login";currentUser=result.data?.user||currentUser;renderAccount();alert("Contraseña actualizada correctamente.");return;}
    if(result.data?.user && result.data?.session){currentUser=result.data.user;renderAccount();return;}
    if(message){message.className="auth-success";message.textContent=authMode==="signup"?"Revisa tu correo y confirma tu cuenta. Luego vuelve a iniciar sesión.":"Si el correo está registrado, recibirás un enlace con instrucciones.";}
  }catch(error){
    if(message){message.className="auth-error";message.textContent=error.message||"No se pudo completar la operación.";}
  }finally{if(submit?.isConnected)submit.disabled=false;}
}

function renderAccount(){
  currentView="account";

  document.getElementById("app").innerHTML=`
    ${header()}
    <main class="page account-page">
      <section class="account-welcome">
        <div class="account-welcome-icon">🌿</div>
        <div>
          <h1>Mi cuenta</h1>
          <p>¡Bienvenido a Verdulería Terán! Compra tus verduras favoritas de forma fácil y segura.</p>
        </div>
      </section>

      ${renderAuthPanel()}
      <section class="account-panel">
        <h2>🛍️ Tus compras</h2>
        <p>Elige tus verduras, agrégalas al carrito y confirma tu pedido.</p>
        <div class="account-actions">
          <button id="accountShop" class="account-action-main">Ver catálogo de verduras →</button>
          <button id="accountCart" class="account-action-alt">🛒 Ver mi carrito (${cartQuantity()})</button>
          <button id="accountOrders" class="account-action-alt">📦 Información de mis pedidos</button>
        </div>
      </section>

      <section class="account-panel">
        <h2>🚚 Zonas de reparto</h2>
        <p>Realizamos entregas en:</p>
        <div class="account-zones"><span>San Borja</span><span>San Luis</span><span>San Isidro</span><span>La Victoria</span></div>
        <p class="account-small">Confirma la disponibilidad de entrega para tu dirección antes de finalizar tu compra.</p>
      </section>

      <section class="account-panel">
        <h2>🕒 Horarios de atención</h2>
        <div class="account-line"><span>Lunes a sábado</span><strong>7:00 a. m. – 6:00 p. m.</strong></div>
        <div class="account-line"><span>Domingos y feriados</span><strong>7:00 a. m. – 3:00 p. m.</strong></div>
        <h3>Horario de entregas</h3>
        <div class="account-line"><span>Lunes a sábado</span><strong>7:00 a. m. – 2:30 p. m.</strong></div>
        <div class="account-line"><span>Domingos y feriados</span><strong>7:00 a. m. – 1:30 p. m.</strong></div>
      </section>

      <section class="account-panel">
        <h2>💳 Medios de pago</h2>
        <p>Yape · Plin · Transferencia bancaria · Efectivo</p>
      </section>

      <section class="account-panel">
        <h2>💬 ¿Necesitas ayuda?</h2>
        <p>Escríbenos por WhatsApp para consultar sobre productos, entregas o pedidos.</p>
        <a class="account-whatsapp" href="https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent('Hola, Verdulería Terán. Quisiera hacer una consulta.')}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp ↗</a>
      </section>
      <p class="account-footnote">Puedes comprar como invitado, pero solo los pedidos realizados con sesión iniciada estarán disponibles en otros dispositivos.</p>
    </main>
  `;

  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("accountShop")?.addEventListener("click",()=>navigate("home"));
  document.getElementById("accountCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("accountOrders")?.addEventListener("click",()=>navigate("orders"));
  document.getElementById("authForm")?.addEventListener("submit",submitAuth);
  document.getElementById("authToggle")?.addEventListener("click",()=>{authMode=authMode==="signup"?"login":"signup";renderAccount();});
  document.getElementById("authReset")?.addEventListener("click",()=>{authMode="reset";renderAccount();});
  document.getElementById("authLogin")?.addEventListener("click",()=>{authMode="login";renderAccount();});
  document.getElementById("authOrders")?.addEventListener("click",()=>navigate("orders"));
  document.getElementById("authLogout")?.addEventListener("click",async()=>{const {error}=await client.auth.signOut();if(error){alert("No se pudo cerrar sesión.");return;}currentUser=null;renderAccount();});
  updateBadges();
  window.scrollTo(0,0);
}


/* =================================================
   CANASTA INTELIGENTE TERÁN
   Sugerencias basadas en precios del catálogo cargado.
   No usa IA externa ni modifica pedidos, pagos o entregas.
================================================= */
const smartBasketState={budget:30,people:2,days:7,items:[],generated:false};
const smartKeywords=["tomate","zanahoria","cebolla","papa","lechuga","brocoli","pepino","espinaca","zapallo","apio","culantro","coliflor","pimiento","acelga","repollo","beterraga","camote","yuca"];
function smartEligibleProducts(){
  return products.filter(p=>["verduras","tuberculos","hierbas"].includes(normalize(p.category)) && Number.isFinite(p.price) && p.price>0 && Number.isFinite(Number(p.id)));
}
function smartBuildBasket(){
  const budget=smartBasketState.budget;
  const available=smartEligibleProducts();
  if(!available.length){smartBasketState.items=[];smartBasketState.generated=true;return;}
  // Prioriza diversidad de verduras y productos reconocibles; sin inventar precios.
  const ranked=available.map(p=>({p,rank:smartKeywords.findIndex(word=>normalize(p.name).includes(normalize(word)))}))
    .sort((a,b)=>(a.rank<0?999:a.rank)-(b.rank<0?999:b.rank) || a.p.price-b.p.price);
  const distinct=[];
  const used=new Set();
  ranked.forEach(({p})=>{
    const key=smartKeywords.find(word=>normalize(p.name).includes(normalize(word))) || normalize(p.name);
    if(!used.has(key)){distinct.push(p);used.add(key);}
  });
  const desired=Math.min(12,Math.max(3,Math.round(smartBasketState.people*smartBasketState.days/3)));
  let remaining=Math.round(budget*100);
  const chosen=[];
  // Primera pasada: variedad; segunda: aprovecha saldo sin sobrepasar presupuesto.
  for(const p of distinct){
    const cents=Math.round(p.price*100);
    if(chosen.length>=desired)break;
    if(cents<=remaining){chosen.push({id:p.id,quantity:1});remaining-=cents;}
  }
  for(const item of chosen){
    const p=available.find(p=>p.id===item.id);
    const cents=Math.round(p.price*100);
    while(item.quantity<4 && cents<=remaining){item.quantity++;remaining-=cents;}
  }
  smartBasketState.items=chosen;
  smartBasketState.generated=true;
}
function smartBasketTotal(){
  return smartBasketState.items.reduce((sum,item)=>{
    const p=products.find(p=>p.id===item.id);
    return sum+(p?p.price*item.quantity:0);
  },0);
}
function renderSmartBasket(){
  currentView="smart";
  const state=smartBasketState;
  const selected=(kind,value)=>state[kind]===value?'active':'';
  document.getElementById("app").innerHTML=`
    ${header()}
    <div class="screen-head"><button class="back" id="smartBack">‹</button><h1 class="screen-title">Canasta Inteligente</h1></div>
    <main class="smart-wrap page">
      <section class="smart-hero"><div class="smart-produce" aria-hidden="true">🥬🥦🥕🍅</div><div class="smart-hello"><strong>Tu selección ideal</strong><p>Elige tu presupuesto y preparamos una propuesta con las verduras disponibles.</p></div></section>
      <section class="smart-panel"><h3>💚 ¿Cuál es tu presupuesto?</h3><div class="smart-budget"><button type="button" id="smartBudgetMinus" aria-label="Reducir presupuesto">−</button><strong>S/</strong><input id="smartBudget" type="number" min="1" max="2000" step="1" inputmode="decimal" value="${state.budget}" aria-label="Presupuesto en soles"><button type="button" id="smartBudgetPlus" aria-label="Aumentar presupuesto">+</button></div><div class="smart-chips">${[20,30,50,80].map(v=>`<button type="button" data-budget="${v}">S/ ${v}</button>`).join("")}</div></section>
      <section class="smart-panel"><h3>👨‍👩‍👧 ¿Para cuántas personas?</h3><div class="smart-choice">${[1,2,3,4].map(v=>`<button class="${selected('people',v)}" data-people="${v}">${v===4?'4+':v} ${v===1?'persona':'personas'}</button>`).join("")}</div></section>
      <section class="smart-panel"><h3>📅 ¿Para cuántos días?</h3><div class="smart-choice">${[3,5,7,14].map(v=>`<button class="${selected('days',v)}" data-days="${v}">${v} días</button>`).join("")}</div></section>
      <button class="smart-submit" id="smartGenerate">✨ Crear mi canasta ❯</button>
      <p class="smart-note">Los precios son los del catálogo disponible. La sugerencia no garantiza cubrir todas las comidas; el delivery se calcula al finalizar el pedido.</p>
      ${state.generated?`<section class="smart-panel" id="smartResult"><h3>🧺 Tu Canasta Inteligente</h3>
        ${state.items.length?`<div class="smart-result"><strong>Selección personalizada</strong><p class="smart-muted">Puedes ajustar las cantidades antes de agregar los productos al carrito.</p></div>
        ${state.items.map(item=>{
          const p=products.find(p=>p.id===item.id);if(!p)return '';
          return `<div class="smart-row"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div><b>${esc(p.name)}</b><small>${esc(p.unitLabel)} · S/ ${p.price.toFixed(2)}</small></div><div class="smart-qty"><button data-smart-minus="${p.id}" aria-label="Quitar ${esc(p.name)}">−</button><span>${item.quantity}</span><button data-smart-plus="${p.id}" aria-label="Agregar ${esc(p.name)}">+</button></div></div>`;
        }).join('')}
        <div class="smart-total"><span>Total de verduras</span><span>S/ ${smartBasketTotal().toFixed(2)}</span></div><button class="smart-submit" id="smartAddCart">🛒 Agregar al carrito →</button>`:
        `<p class="smart-muted">No encontramos productos dentro de ese presupuesto. Prueba con un monto mayor o revisa el catálogo.</p>`}
      </section>`:''}
    </main>`;
  document.getElementById("smartBack")?.addEventListener("click",()=>navigate("home"));
  document.getElementById("topCart")?.addEventListener("click",()=>navigate("cart"));
  document.getElementById("smartBudget")?.addEventListener("change",e=>{
    state.budget=Math.max(1,Math.min(2000,Number(e.target.value)||30));state.generated=false;renderSmartBasket();
  });
  for(const [id,delta] of [["smartBudgetMinus",-5],["smartBudgetPlus",5]]){
    document.getElementById(id)?.addEventListener("click",()=>{state.budget=Math.max(1,Math.min(2000,state.budget+delta));state.generated=false;renderSmartBasket();});
  }
  document.querySelectorAll("[data-budget]").forEach(b=>b.addEventListener("click",()=>{state.budget=Number(b.dataset.budget);state.generated=false;renderSmartBasket();}));
  document.querySelectorAll("[data-people]").forEach(b=>b.addEventListener("click",()=>{state.people=Number(b.dataset.people);state.generated=false;renderSmartBasket();}));
  document.querySelectorAll("[data-days]").forEach(b=>b.addEventListener("click",()=>{state.days=Number(b.dataset.days);state.generated=false;renderSmartBasket();}));
  document.getElementById("smartGenerate")?.addEventListener("click",()=>{smartBuildBasket();renderSmartBasket();document.getElementById("smartResult")?.scrollIntoView({behavior:"smooth",block:"start"});});
  document.querySelectorAll("[data-smart-minus]").forEach(b=>b.addEventListener("click",()=>{
    const id=Number(b.dataset.smartMinus),item=state.items.find(i=>i.id===id);
    if(item){item.quantity--;if(item.quantity<1)state.items=state.items.filter(i=>i.id!==id);}renderSmartBasket();
  }));
  document.querySelectorAll("[data-smart-plus]").forEach(b=>b.addEventListener("click",()=>{
    const id=Number(b.dataset.smartPlus),item=state.items.find(i=>i.id===id),p=products.find(p=>p.id===id);
    if(item && p && item.quantity<20 && smartBasketTotal()+p.price<=state.budget+0.001){item.quantity++;renderSmartBasket();}
    else alert("La cantidad supera tu presupuesto o el límite de unidades.");
  }));
  document.getElementById("smartAddCart")?.addEventListener("click",()=>{
    // Combina con carrito existente sin borrar productos elegidos previamente.
    state.items.forEach(item=>{
      const p=products.find(p=>p.id===item.id);if(!p)return;
      const existing=cart.find(x=>x.id===item.id);
      if(existing)existing.quantity+=item.quantity;
      else cart.push({...p,quantity:item.quantity});
    });
    updateBadges();navigate("cart");
  });
  updateBadges();
}

// Delegated click listener: survives re-rendering of the home screen.
document.addEventListener("click",function(event){
  const trigger=event.target.closest && event.target.closest("#openSmartBasket");
  if(!trigger)return;
  event.preventDefault();
  event.stopPropagation();
  navigate("smart");
},true);

function navigate(view){
  if(view==="smart"){
    renderSmartBasket();
    return;
  }

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
    if(!["verduras","tuberculos","hierbas"].includes(normalize(category))) return;
    const name=row.nombre || row.name || "Producto";
    const unit=row.unidad || row.unit || "kg";
    products.push({
      id:row.id,
      name,
      category,
      unit,
      unitLabel:unitLabel(unit),
      price:Number(row.precio ?? row.price)||0,
      image:row.image_url || fallbackImage(name,category)
    });
  });
  renderProductGrid();
}

async function loadProducts(){

  // Mostrar inmediatamente un catálogo válido. Esto evita la pantalla
  // vacía mientras Supabase responde.
  useCatalogRows(starterCatalog);

  if(!client){
    console.warn("Supabase aún no está configurado. Se mantiene el catálogo de respaldo.");
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
if(client){
  client.auth.getUser().then(({data,error})=>{
    if(!error) currentUser=data?.user||null;
    if(currentView==="account") renderAccount();
    if(currentView==="orders") renderOrders();
  }).catch(error=>console.warn("No se pudo restaurar sesión",error));
  client.auth.onAuthStateChange((_event,session)=>{
    if(_event==="PASSWORD_RECOVERY") authMode="update";
    currentUser=session?.user||null;
    if(currentView==="account") renderAccount();
    if(currentView==="orders") renderOrders();
  });
}
