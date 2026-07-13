/* ===== theme ===== */
(function(){
    try{
      const saved = localStorage.getItem('cb_theme');
      if(saved === 'dark') document.documentElement.setAttribute('data-theme','dark');
    }catch(e){}
})();

/* ===== firebase ===== */
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCkwgKbyxgfzAWOQwBCHw_Vqwth_2KlU1U",
    authDomain: "citybois-kulture.firebaseapp.com",
    projectId: "citybois-kulture",
    storageBucket: "citybois-kulture.firebasestorage.app",
    messagingSenderId: "375696582249",
    appId: "1:375696582249:web:f5f809d929db29e4bc24f8",
    measurementId: "G-JWCVHC22ZF"
  };
  const app = initializeApp(firebaseConfig);
  try{ getAnalytics(app); }catch(e){}
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Live product listener — fires immediately with current data, then again on every
  // admin add/edit/delete, so the storefront always reflects Firestore in real time.
  window.cbListenProducts = function(cb){
    return onSnapshot(collection(db,'products'), snap=>{
      cb(snap.docs.map(d=>({id:d.id, ...d.data()})));
    }, err=>{ cb(null, err); });
  };

  // Called after a successful client-side Flutterwave callback. See the code comment
  // near its usage: this should be re-verified server-side via webhook before fulfillment.
  window.cbCreateOrder = async function(order){
    const ref = await addDoc(collection(db,'orders'), { ...order, createdAt: serverTimestamp() });
    return ref.id;
  };

  // Customer accounts — optional, just speeds up checkout by remembering email.
  window.cbCustomerAuth = {
    signUp: (email, pw) => createUserWithEmailAndPassword(auth, email, pw),
    signIn: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    signOut: () => signOut(auth),
    onChange: (cb) => onAuthStateChanged(auth, cb),
  };
  window.cbFirebaseReady = true;
  window.dispatchEvent(new Event('cb-ready'));

/* ===== main ===== */
/* SEED_PRODUCTS: starting catalog, only used by the admin "Seed Sample Products" button
   to populate Firestore the first time. The live storefront never reads this array directly —
   it always renders from Firestore via PRODUCTS below. */
const SEED_PRODUCTS = [
  {id:'set-black', family:'set', name:'Camp-Collar Set', edition:'Black', swatch:'#141310', cat:'set', catLabel:'Casual Set', price:68000, images:['images/set-black.jpg','images/model-black.jpg'], tag:'NEW', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The signature City Bois silhouette — a relaxed camp-collar shirt and drawstring shorts, cut from waffle-textured cotton with the CB monogram and skyline embroidered in gold thread across the back.',
    fabric:'Waffle-weave cotton blend, brushed for a heavier drape that softens with every wash.', fit:'Relaxed boxy fit through the body, camp collar, elastic-and-drawstring waist.'},
  {id:'set-cream', family:'set', name:'Camp-Collar Set', edition:'Cream', swatch:'#ece4d0', cat:'set', catLabel:'Casual Set', price:68000, images:['images/set-cream.jpg','images/model-cream.jpg'], tag:'NEW', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The signature City Bois silhouette — a relaxed camp-collar shirt and drawstring shorts, cut from waffle-textured cotton with the CB monogram and skyline embroidered across the back.',
    fabric:'Waffle-weave cotton blend, brushed for a heavier drape that softens with every wash.', fit:'Relaxed boxy fit through the body, camp collar, elastic-and-drawstring waist.'},
  {id:'set-green', family:'set', name:'Camp-Collar Set', edition:'Green', swatch:'#4a4b36', cat:'set', catLabel:'Casual Set', price:68000, images:['images/set-green.jpg','images/model-green.jpg'], tag:'NEW', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The signature City Bois silhouette — a relaxed camp-collar shirt and drawstring shorts, cut from waffle-textured cotton with the CB monogram and skyline embroidered in gold thread across the back.',
    fabric:'Waffle-weave cotton blend, brushed for a heavier drape that softens with every wash.', fit:'Relaxed boxy fit through the body, camp collar, elastic-and-drawstring waist.'},
  {id:'scarf-black', family:'scarf', name:'Fringe Scarf', edition:'Black', swatch:'#141310', cat:'scarf', catLabel:'Fringe Scarf', price:24500, images:['images/scarf-black.jpg'], tag:'LIMITED', inStock:true, sizes:['One Size'],
    description:'A fringe-edge wool-blend scarf carrying the CB monogram and City Bois skyline print, finished with a tonal stripe. Built to layer over the Camp-Collar Set or run solo.',
    fabric:'Brushed wool-cotton blend with hand-tied fringe edges.', fit:'One size — approximately 180cm x 30cm.'},
  {id:'scarf-cream', family:'scarf', name:'Fringe Scarf', edition:'Cream', swatch:'#ece4d0', cat:'scarf', catLabel:'Fringe Scarf', price:24500, images:['images/scarf-cream.jpg'], tag:'LIMITED', inStock:true, sizes:['One Size'],
    description:'A fringe-edge wool-blend scarf carrying the CB monogram and City Bois skyline print, finished with a tonal stripe. Built to layer over the Camp-Collar Set or run solo.',
    fabric:'Brushed wool-cotton blend with hand-tied fringe edges.', fit:'One size — approximately 180cm x 30cm.'},
  {id:'scarf-green', family:'scarf', name:'Fringe Scarf', edition:'Green', swatch:'#4a4b36', cat:'scarf', catLabel:'Fringe Scarf', price:24500, images:['images/scarf-green.jpg'], tag:'LIMITED', inStock:true, sizes:['One Size'],
    description:'A fringe-edge wool-blend scarf carrying the CB monogram and City Bois skyline print, finished with a tonal stripe. Built to layer over the Camp-Collar Set or run solo.',
    fabric:'Brushed wool-cotton blend with hand-tied fringe edges.', fit:'One size — approximately 180cm x 30cm.'},
  {id:'bundle-black', family:'bundle', name:'The Look Bundle', edition:'Black', swatch:'#141310', cat:'bundle', catLabel:'Look Bundle', price:86000, compareAt:92500, images:['images/model-black.jpg','images/set-black.jpg','images/scarf-black.jpg'], tag:'SET + SCARF', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The full City Bois look, bundled — Camp-Collar Set and Fringe Scarf in the same edition, one price. The exact pairing shot in the campaign.',
    fabric:'Waffle-weave cotton set + brushed wool-cotton scarf.', fit:'Relaxed boxy fit set, one-size scarf.'},
  {id:'bundle-cream', family:'bundle', name:'The Look Bundle', edition:'Cream', swatch:'#ece4d0', cat:'bundle', catLabel:'Look Bundle', price:86000, compareAt:92500, images:['images/model-cream.jpg','images/set-cream.jpg','images/scarf-cream.jpg'], tag:'SET + SCARF', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The full City Bois look, bundled — Camp-Collar Set and Fringe Scarf in the same edition, one price. The exact pairing shot in the campaign.',
    fabric:'Waffle-weave cotton set + brushed wool-cotton scarf.', fit:'Relaxed boxy fit set, one-size scarf.'},
  {id:'bundle-green', family:'bundle', name:'The Look Bundle', edition:'Green', swatch:'#4a4b36', cat:'bundle', catLabel:'Look Bundle', price:86000, compareAt:92500, images:['images/model-green.jpg','images/set-green.jpg','images/scarf-green.jpg'], tag:'SET + SCARF', inStock:true, sizes:['S','M','L','XL','XXL'],
    description:'The full City Bois look, bundled — Camp-Collar Set and Fringe Scarf in the same edition, one price. The exact pairing shot in the campaign.',
    fabric:'Waffle-weave cotton set + brushed wool-cotton scarf.', fit:'Relaxed boxy fit set, one-size scarf.'},
];
let PRODUCTS = []; // populated live from Firestore — see bottom of this script
const tagClass = t => t==='NEW' ? 'tag-new' : t==='LIMITED' ? 'tag-limited' : 'tag-bundle';

const fmt = n => '₦' + n.toLocaleString('en-NG');
function catLabel(c){
  const found = PRODUCTS.find(p=>p.cat===c && p.catLabel);
  if(found) return found.catLabel;
  return c==='set'?'Casual Set':c==='scarf'?'Fringe Scarf':c==='bundle'?'Look Bundle':(c.charAt(0).toUpperCase()+c.slice(1));
}
function catLabelPlural(c){
  const label = catLabel(c);
  return label.endsWith('s') ? label : label + 's';
}

let activeCat = 'all';
let activeEd = 'all';
let searchTerm = '';
let sortBy = 'featured';

/* ---------- CART — sessionStorage-backed so it survives page navigation ---------- */
function loadCart(){ try{ return JSON.parse(sessionStorage.getItem('cb_cart') || '{}'); }catch(e){ return {}; } }
function saveCart(c){ sessionStorage.setItem('cb_cart', JSON.stringify(c)); }
let cart = loadCart();

const params = new URLSearchParams(window.location.search);
if(params.get('edition')) activeEd = params.get('edition');
if(params.get('cat')) activeCat = params.get('cat');

function getFiltered(){
  let items = PRODUCTS.filter(p =>
    (activeCat === 'all' || p.cat === activeCat) &&
    (activeEd === 'all' || p.edition.toLowerCase() === activeEd) &&
    (searchTerm === '' || (p.name+' '+p.edition).toLowerCase().includes(searchTerm))
  );
  if(sortBy === 'price-asc') items = items.slice().sort((a,b)=>a.price-b.price);
  if(sortBy === 'price-desc') items = items.slice().sort((a,b)=>b.price-a.price);
  if(sortBy === 'name') items = items.slice().sort((a,b)=>a.name.localeCompare(b.name));
  return items;
}

function renderChips(){
  const chips = [];
  if(activeCat !== 'all') chips.push({type:'cat', label:catLabel(activeCat)});
  if(activeEd !== 'all') chips.push({type:'ed', label:activeEd[0].toUpperCase()+activeEd.slice(1)});
  if(searchTerm) chips.push({type:'search', label:'"'+searchTerm+'"'});
  document.getElementById('activeChips').innerHTML = chips.map(c=>`
    <span class="active-chip">${c.label}<button onclick="clearChip('${c.type}')">&times;</button></span>
  `).join('');
}
function clearChip(type){
  if(type==='cat'){ activeCat='all'; syncFilterUI('catFilters','cat','all'); }
  if(type==='ed'){ activeEd='all'; syncFilterUI('edFilters','ed','all'); }
  if(type==='search'){ searchTerm=''; document.getElementById('searchInput').value=''; }
  renderGrid();
}
function syncFilterUI(groupId, attr, val){
  [...document.getElementById(groupId).children].forEach(row=>{
    row.classList.toggle('active', row.dataset[attr]===val);
  });
}
function filterByCategory(cat){
  activeCat = cat;
  syncFilterUI('catFilters','cat',cat);
  renderGrid();
  window.scrollTo({top:document.querySelector('.shop-layout').offsetTop - 100, behavior:'smooth'});
}

function productCreatedAtSeconds(p){
  return (p.createdAt && p.createdAt.seconds) ? p.createdAt.seconds : 0;
}
function getGridAd(categoryFilter){
  const pool = categoryFilter ? PRODUCTS.filter(p=>p.cat===categoryFilter) : PRODUCTS;
  if(!pool.length) return '';
  const sorted = [...pool].sort((a,b)=> productCreatedAtSeconds(b) - productCreatedAtSeconds(a));
  const featured = sorted[0];
  const label = categoryFilter ? 'New In ' + catLabelPlural(categoryFilter) : 'New Drop';
  return `
  <div class="grid-ad" onclick="goToProduct('${featured.id}')" style="cursor:pointer;">
    <img src="${featured.images[0]}" alt="${featured.name} — ${featured.edition}">
    <div class="grid-ad-inner">
      <div>
        <span class="label">${label}</span>
        <h3>${featured.name} — ${featured.edition}</h3>
        <p>${catLabel(featured.cat)} · ${fmt(featured.price)}</p>
      </div>
      <a href="product.html?id=${featured.id}" class="btn-ad" onclick="event.stopPropagation();">Shop Now <span>→</span></a>
    </div>
  </div>`;
}
function renderSidebarAd(){
  const el = document.getElementById('sidebarAd');
  if(!el) return;
  const bundles = PRODUCTS.filter(p=>p.cat==='bundle').sort((a,b)=> productCreatedAtSeconds(b)-productCreatedAtSeconds(a));
  const pick = bundles[0] || PRODUCTS[0];
  if(!pick){ el.style.display = 'none'; return; }
  el.style.display = '';
  el.innerHTML = `
    <span class="sidebar-ad-tag">${pick.cat==='bundle' ? 'Ad · Look Bundle' : 'Ad · Featured'}</span>
    <img src="${pick.images[0]}" alt="${pick.name} promotion">
    <div class="sidebar-ad-content">
      <span class="label">${pick.tag || 'Featured'}</span>
      <h4>${pick.name}<br>${fmt(pick.price)}</h4>
      <a href="product.html?id=${pick.id}">Shop Now →</a>
    </div>`;
}

function goToProduct(id){ window.location.href = 'product.html?id=' + id; }

function productCard(p, i){
  const oos = p.inStock === false;
  return `
    <div class="product-card" style="animation-delay:${Math.min(i,8)*0.06}s" onclick="goToProduct('${p.id}')">
      <div class="tile">
        ${oos ? `<span class="tag tag-oos">Out Of Stock</span>` : (p.tag ? `<span class="tag ${tagClass(p.tag)}">${p.tag}</span>` : '')}
        <img src="${p.images[0]}" alt="${p.name} — ${p.edition}" loading="lazy" style="${oos ? 'filter:grayscale(.6);opacity:.6;' : ''}">
        <img class="authenticity-sticker" src="images/logo-stamp-circle.png" alt="City Bois Worldwide" loading="lazy">
        <div class="add-overlay">
          ${oos
            ? `<button class="add-btn oos" disabled aria-label="Out of stock">✕</button>`
            : `<button class="add-btn" aria-label="Add ${p.name} ${p.edition} to bag" onclick="event.stopPropagation(); addToCart('${p.id}', this)">+</button>`
          }
        </div>
      </div>
      <div class="product-info">
        <div>
          <div class="name">${p.name} — ${p.edition}</div>
          <div class="cat mono">${catLabel(p.cat)}</div>
        </div>
        <div class="price-block">
          ${p.compareAt ? `<span class="compare">${fmt(p.compareAt)}</span>` : ''}
          <span class="price">${fmt(p.price)}</span>
          ${p.compareAt ? `<span class="save">Save ${fmt(p.compareAt - p.price)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function isFiltering(){ return activeCat!=='all' || activeEd!=='all' || searchTerm!=='' || sortBy!=='featured'; }

function updateShopHeader(){
  const titleEl = document.getElementById('shopHeaderTitle');
  const subEl = document.getElementById('shopHeaderSub');
  const crumbEl = document.getElementById('shopCrumb');
  if(activeCat !== 'all'){
    const label = catLabelPlural(activeCat);
    titleEl.textContent = label;
    subEl.textContent = `Every ${label.toLowerCase()} we've got right now, in every edition available.`;
    crumbEl.innerHTML = `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ${label}`;
  } else {
    titleEl.textContent = 'The Full Collection';
    subEl.textContent = "Sets, scarves, and full look bundles across every edition. Built different, made in the city.";
    crumbEl.innerHTML = `<a href="index.html">Home</a> / Shop`;
  }
}

function getDistinctCategories(){
  const seen = [];
  PRODUCTS.forEach(p=>{ if(p.cat && !seen.includes(p.cat)) seen.push(p.cat); });
  return seen;
}

function renderCategoryFilterRows(){
  const wrap = document.getElementById('catFilters');
  const cats = getDistinctCategories();
  const existingRow = wrap.querySelector('[data-cat="all"]');
  wrap.innerHTML = '';
  wrap.appendChild(existingRow);
  cats.forEach(c=>{
    const row = document.createElement('div');
    row.className = 'filter-row';
    row.dataset.cat = c;
    row.classList.toggle('active', activeCat === c);
    row.innerHTML = `<button>${catLabelPlural(c)}</button><span class="cnt" id="cnt-${c}">0</span>`;
    wrap.appendChild(row);
  });
}

function renderGrid(){
  renderCategoryFilterRows();
  updateShopHeader();
  document.getElementById('cnt-all').textContent = PRODUCTS.length;
  getDistinctCategories().forEach(c=>{
    const el = document.getElementById('cnt-'+c);
    if(el) el.textContent = PRODUCTS.filter(p=>p.cat===c).length;
  });
  renderChips();
  const area = document.getElementById('productArea');

  if(isFiltering()){
    const items = getFiltered();
    document.getElementById('resultCount').textContent = items.length + (items.length===1?' product':' products');
    if(items.length===0){
      area.innerHTML = `<div class="product-grid"><div class="empty-state"><span>No products found</span>Try clearing a filter or searching something else.<br><button onclick="clearChip('cat');clearChip('ed');clearChip('search');">Clear all filters</button></div></div>`;
      return;
    }
    let cards = items.map((p,i)=>productCard(p,i));
    const adHtml = getGridAd();
    if(adHtml){ if(items.length > 5){ cards.splice(5, 0, adHtml); } else { cards.push(adHtml); } }
    area.innerHTML = `<div class="product-grid">${cards.join('')}</div>`;
  } else {
    document.getElementById('resultCount').textContent = PRODUCTS.length + ' products';
    const cats = getDistinctCategories();
    area.innerHTML = cats.map((c,ci)=>{
      const items = PRODUCTS.filter(p=>p.cat===c);
      const cards = items.map((p,i)=>productCard(p,i)).join('');
      const adBlock = ci===0 ? getGridAd() : '';
      return `
        <div class="category-section">
          <div class="category-head">
            <h2>${catLabelPlural(c)}<span class="cnt-label">${items.length} styles</span></h2>
            <a href="#" onclick="filterByCategory('${c}');return false;">View All →</a>
          </div>
          <div class="product-grid">${cards}${adBlock}</div>
        </div>`;
    }).join('');
  }
}

document.getElementById('catFilters').addEventListener('click', e=>{
  const row = e.target.closest('.filter-row'); if(!row) return;
  activeCat = row.dataset.cat;
  syncFilterUI('catFilters','cat',activeCat);
  renderGrid();
});
document.getElementById('edFilters').addEventListener('click', e=>{
  const row = e.target.closest('.filter-row'); if(!row) return;
  activeEd = row.dataset.ed;
  syncFilterUI('edFilters','ed',activeEd);
  renderGrid();
});
document.getElementById('clearFilters').addEventListener('click', ()=>{
  activeCat='all'; activeEd='all'; searchTerm=''; sortBy='featured';
  document.getElementById('searchInput').value='';
  document.getElementById('sortSelect').value='featured';
  syncFilterUI('catFilters','cat','all');
  syncFilterUI('edFilters','ed','all');
  renderGrid();
});
document.getElementById('searchInput').addEventListener('input', e=>{
  searchTerm = e.target.value.trim().toLowerCase();
  renderGrid();
});
document.getElementById('sortSelect').addEventListener('change', e=>{
  sortBy = e.target.value;
  renderGrid();
});

/* ---------- CART ---------- */
function addToCart(id, btn, size, qtyToAdd){
  const key = size ? id+'::'+size : id;
  cart[key] = (cart[key]||0) + (qtyToAdd||1);
  saveCart(cart);
  updateCart();
  showToast('Added to bag');
  openCart();
  if(btn){ btn.classList.add('added'); btn.textContent='✓'; setTimeout(()=>{btn.classList.remove('added'); btn.textContent='+';}, 900); }
  const cartBtn = document.getElementById('cartOpenBtn');
  cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
}
function changeQty(key, delta){
  if(!cart[key]) return;
  cart[key] += delta;
  if(cart[key] <= 0) delete cart[key];
  saveCart(cart);
  updateCart();
}
function removeItem(key){ delete cart[key]; saveCart(cart); updateCart(); }
function cartItemProduct(key){
  const id = key.split('::')[0];
  return PRODUCTS.find(x=>x.id===id);
}
function updateCart(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = count;
  const itemsEl = document.getElementById('cartItems');
  const keys = Object.keys(cart);
  if(keys.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty"><span>Your bag is empty</span>Add a set, scarf, or bundle to get started.</div>`;
  } else {
    itemsEl.innerHTML = keys.map(key=>{
      const p = cartItemProduct(key);
      if(!p) return '';
      const size = key.includes('::') ? key.split('::')[1] : null;
      const qty = cart[key];
      return `
        <div class="cart-item">
          <img src="${p.images[0]}" alt="${p.name}">
          <div class="ci-info">
            <div><div class="ci-name">${p.name} — ${p.edition}${size ? ' · '+size : ''}</div><div class="ci-cat mono">${fmt(p.price)}</div></div>
            <div class="ci-row">
              <div class="qty-stepper"><button onclick="changeQty('${key}',-1)">−</button><span class="mono">${qty}</span><button onclick="changeQty('${key}',1)">+</button></div>
              <button class="ci-remove" onclick="removeItem('${key}')">Remove</button>
            </div>
          </div>
        </div>`;
    }).join('');
  }
  const subtotal = keys.reduce((sum,key)=>{ const p = cartItemProduct(key); return p ? sum + p.price * cart[key] : sum; }, 0);
  document.getElementById('cartSubtotal').textContent = fmt(subtotal);
}
function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('backdrop').classList.add('open');
}
function closeCart(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
}
document.getElementById('cartOpenBtn').addEventListener('click', openCart);
function checkout(){
  if(Object.keys(cart).length === 0){ showToast('Your bag is empty'); return; }
  closeCart();
  openCheckoutModal();
}

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

/* ---------- SCROLL PROGRESS ---------- */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', ()=>{
  const max = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}, {passive:true});

/* ---------- CONTACT MODAL ---------- */
function openContactModal(){
  document.getElementById('contactModal').classList.add('open');
  document.getElementById('contactBackdrop').classList.add('open');
}
function closeContactModal(){
  document.getElementById('contactModal').classList.remove('open');
  document.getElementById('contactBackdrop').classList.remove('open');
}

/* ---------- NIGERIA DELIVERY LOOKUP (shared with product.html) ---------- */
const DELIVERY_REGIONS = {
  lagos:        {label:'Lagos',                     fee:2500, min:1, max:2},
  southwest:    {label:'South West',                fee:3500, min:2, max:3},
  southsouth:   {label:'South South',                fee:4500, min:3, max:4},
  southeast:    {label:'South East',                 fee:4500, min:3, max:4},
  northcentral: {label:'North Central (incl. FCT)',  fee:4000, min:3, max:4},
  northwest:    {label:'North West',                 fee:5000, min:4, max:6},
  northeast:    {label:'North East',                 fee:5500, min:5, max:7},
};
const STATE_GROUPS = [
  {region:'lagos', label:'Lagos', states:['Lagos']},
  {region:'southwest', label:'South West', states:['Ogun','Oyo','Osun','Ondo','Ekiti']},
  {region:'southsouth', label:'South South', states:['Rivers','Delta','Akwa Ibom','Bayelsa','Cross River','Edo']},
  {region:'southeast', label:'South East', states:['Anambra','Enugu','Imo','Abia','Ebonyi']},
  {region:'northcentral', label:'North Central', states:['FCT (Abuja)','Niger','Kwara','Kogi','Benue','Plateau','Nasarawa']},
  {region:'northwest', label:'North West', states:['Kano','Kaduna','Katsina','Sokoto','Zamfara','Jigawa','Kebbi']},
  {region:'northeast', label:'North East', states:['Borno','Yobe','Adamawa','Bauchi','Gombe','Taraba']},
];
document.getElementById('coState').innerHTML += STATE_GROUPS.map(g=>
  `<optgroup label="${g.label}">${g.states.map(s=>`<option value="${g.region}">${s}</option>`).join('')}</optgroup>`
).join('');

/* ---------- CHECKOUT MODAL + FLUTTERWAVE ---------- */
function cartSubtotal(){
  return Object.keys(cart).reduce((sum,key)=>{ const p = cartItemProduct(key); return p ? sum + p.price*cart[key] : sum; },0);
}
const PAYMENT_FEE_RATE = 0.02; // 2% payment processing fee
function renderCoSummary(){
  const subtotal = cartSubtotal();
  const region = document.getElementById('coState').value;
  const deliveryFee = region ? DELIVERY_REGIONS[region].fee : 0;
  const paymentFee = Math.round((subtotal + deliveryFee) * PAYMENT_FEE_RATE);
  document.getElementById('coSummary').innerHTML = `
    <div class="co-summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
    <div class="co-summary-row"><span>Delivery${region ? ' ('+DELIVERY_REGIONS[region].label+')' : ''}</span><span>${region ? fmt(deliveryFee) : '— select state'}</span></div>
    <div class="co-summary-row"><span>Payment Fee (2%)</span><span>${fmt(paymentFee)}</span></div>
    <div class="co-summary-row total"><span>Total</span><span>${fmt(subtotal+deliveryFee+paymentFee)}</span></div>
  `;
}
function openCheckoutModal(){
  renderCoSummary();
  const emailEl = document.getElementById('coEmail');
  if(currentCustomer){
    emailEl.value = currentCustomer.email;
    emailEl.readOnly = true;
  } else {
    emailEl.readOnly = false;
  }
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutBackdrop').classList.add('open');
}
function closeCheckoutModal(){
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutBackdrop').classList.remove('open');
}
document.getElementById('coState').addEventListener('change', renderCoSummary);

document.getElementById('payBtn').addEventListener('click', ()=>{
  const name = document.getElementById('coName').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const region = document.getElementById('coState').value;
  const address = document.getElementById('coAddress').value.trim();
  const errEl = document.getElementById('coError');
  if(!name || !email || !phone || !region || !address){
    errEl.classList.add('show');
    return;
  }
  errEl.classList.remove('show');

  const subtotal = cartSubtotal();
  const fee = DELIVERY_REGIONS[region].fee;
  const paymentFee = Math.round((subtotal + fee) * PAYMENT_FEE_RATE);
  const total = subtotal + fee + paymentFee;
  const items = Object.keys(cart).map(key=>{
    const p = cartItemProduct(key);
    const size = key.includes('::') ? key.split('::')[1] : null;
    return { id:p.id, name:p.name, edition:p.edition, size, qty:cart[key], price:p.price };
  });
  const txRef = 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);

  const payBtn = document.getElementById('payBtn');
  payBtn.disabled = true; payBtn.textContent = 'Opening Flutterwave…';

  FlutterwaveCheckout({
    public_key: "FLWPUBK-5000677a0e4e7d4c4759f83d112397b0-X",
    tx_ref: txRef,
    amount: total,
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: { email, phone_number: phone, name },
    customizations: {
      title: "City Bois",
      description: "Order payment — " + items.length + " item(s)",
      logo: ""
    },
    callback: function(response){
      payBtn.disabled = false; payBtn.textContent = 'Pay With Flutterwave';
      if(response && (response.status === 'successful' || response.status === 'completed')){
        if(window.cbCreateOrder){
          window.cbCreateOrder({
            items, subtotal, deliveryFee: fee, paymentFee, total,
            customer: { name, email, phone },
            delivery: { region, regionLabel: DELIVERY_REGIONS[region].label, address },
            txRef, flwTransactionId: response.transaction_id || response.id || null,
            status: 'awaiting_verification'
            /* NOTE: this is set client-side on successful callback. Real production
               fulfillment should wait for server-side webhook verification using your
               Flutterwave SECRET key before shipping — never trust the client alone. */
          }).then(()=>{
            cart = {}; saveCart(cart); updateCart();
            closeCheckoutModal();
            showToast('Payment received — thank you!');
          }).catch(()=>{
            showToast('Payment succeeded, but saving your order failed — please contact us.');
          });
        } else {
          showToast('Payment succeeded, but order saving is offline.');
        }
      } else {
        showToast('Payment was not completed.');
      }
    },
    onclose: function(){
      payBtn.disabled = false; payBtn.textContent = 'Pay With Flutterwave';
    }
  });
});

/* ---------- ACCOUNT MODAL (customer sign up / sign in) ---------- */
let currentCustomer = null;
let accMode = 'signin';
function openAccountModal(){
  document.getElementById('accountModal').classList.add('open');
  document.getElementById('accountBackdrop').classList.add('open');
}
function closeAccountModal(){
  document.getElementById('accountModal').classList.remove('open');
  document.getElementById('accountBackdrop').classList.remove('open');
  document.getElementById('accError').classList.remove('show');
}
document.getElementById('accountBtn').addEventListener('click', openAccountModal);
document.getElementById('tabSignIn').addEventListener('click', ()=> setAccMode('signin'));
document.getElementById('tabSignUp').addEventListener('click', ()=> setAccMode('signup'));
function setAccMode(mode){
  accMode = mode;
  document.getElementById('tabSignIn').classList.toggle('active', mode==='signin');
  document.getElementById('tabSignUp').classList.toggle('active', mode==='signup');
  document.getElementById('accSubmitBtn').textContent = mode==='signin' ? 'Sign In' : 'Create Account';
  document.getElementById('accError').classList.remove('show');
}
document.getElementById('accSubmitBtn').addEventListener('click', async ()=>{
  const email = document.getElementById('accEmail').value.trim();
  const pw = document.getElementById('accPassword').value;
  const errEl = document.getElementById('accError');
  const btn = document.getElementById('accSubmitBtn');
  if(!email || !pw){ errEl.textContent = 'Enter an email and password.'; errEl.classList.add('show'); return; }
  btn.disabled = true; btn.textContent = accMode==='signin' ? 'Signing in…' : 'Creating account…';
  try{
    if(accMode === 'signin') await window.cbCustomerAuth.signIn(email, pw);
    else await window.cbCustomerAuth.signUp(email, pw);
    errEl.classList.remove('show');
  }catch(e){
    errEl.textContent = accMode==='signin' ? 'Sign-in failed — check your email and password.' : 'Could not create account — ' + (e.code==='auth/email-already-in-use' ? 'that email is already registered, try Sign In instead.' : 'try again.');
    errEl.classList.add('show');
  }finally{
    btn.disabled = false; btn.textContent = accMode==='signin' ? 'Sign In' : 'Create Account';
  }
});
document.getElementById('accSignOutBtn').addEventListener('click', ()=> window.cbCustomerAuth.signOut());
function renderAccountState(user){
  currentCustomer = user;
  const btnLabel = document.getElementById('accountBtnLabel');
  if(user){
    btnLabel.textContent = user.email.split('@')[0];
    document.getElementById('accountLoggedOut').style.display = 'none';
    document.getElementById('accountLoggedIn').style.display = 'block';
    document.getElementById('accEmailDisplay').textContent = user.email;
    document.getElementById('accAvatar').textContent = user.email[0].toUpperCase();
  } else {
    btnLabel.textContent = 'Account';
    document.getElementById('accountLoggedOut').style.display = 'block';
    document.getElementById('accountLoggedIn').style.display = 'none';
    document.getElementById('accEmail').value = '';
    document.getElementById('accPassword').value = '';
  }
}

/* ---------- LOAD PRODUCTS ---------- */
document.getElementById('productArea').innerHTML = '<div class="product-grid"><div class="empty-state"><span>Loading the collection…</span></div></div>';
const shopLoadTimeout = setTimeout(()=>{
  if(PRODUCTS.length === 0){
    document.getElementById('productArea').innerHTML = '<div class="product-grid"><div class="empty-state"><span>Nothing here yet</span>Check back soon — new pieces are on the way.<br><button onclick="location.reload()">Refresh</button></div></div>';
  }
}, 10000);

function bootFirebaseFeatures(){
  window.cbListenProducts((items, err)=>{
    clearTimeout(shopLoadTimeout);
    if(err){
      document.getElementById('productArea').innerHTML = '<div class="product-grid"><div class="empty-state"><span>Nothing here yet</span>Check back soon — new pieces are on the way.<br><button onclick="location.reload()">Refresh</button></div></div>';
      return;
    }
    PRODUCTS = items || [];
    if(PRODUCTS.length === 0){
      document.getElementById('productArea').innerHTML = '<div class="product-grid"><div class="empty-state"><span>Nothing here yet</span>Check back soon — new pieces are on the way.</div></div>';
      return;
    }
    renderGrid();
    renderSidebarAd();
    updateCart();
  });
  window.cbCustomerAuth.onChange(user=> renderAccountState(user));
}
if(window.cbFirebaseReady){
  bootFirebaseFeatures();
} else {
  window.addEventListener('cb-ready', bootFirebaseFeatures);
  // safety net in case Firebase truly fails to load at all
  setTimeout(()=>{
    if(!window.cbFirebaseReady && PRODUCTS.length === 0){
      clearTimeout(shopLoadTimeout);
      document.getElementById('productArea').innerHTML = '<div class="product-grid"><div class="empty-state"><span>Nothing here yet</span>Check back soon.</div></div>';
    }
  }, 12000);
}

/* ---------- THEME TOGGLE ---------- */
document.getElementById('themeToggle').addEventListener('click', ()=>{
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if(isDark){
    document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem('cb_theme','light'); }catch(e){}
  } else {
    document.documentElement.setAttribute('data-theme','dark');
    try{ localStorage.setItem('cb_theme','dark'); }catch(e){}
  }
});

/* init */
syncFilterUI('catFilters','cat',activeCat);
syncFilterUI('edFilters','ed',activeEd);
updateCart();

/* ===== expose functions referenced by inline onclick/onchange HTML attributes ===== */
window.checkout = checkout;
window.closeAccountModal = closeAccountModal;
window.closeCart = closeCart;
window.closeCheckoutModal = closeCheckoutModal;
window.closeContactModal = closeContactModal;
window.openContactModal = openContactModal;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.clearChip = clearChip;
window.filterByCategory = filterByCategory;
window.goToProduct = goToProduct;
window.removeItem = removeItem;
