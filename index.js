/* ---------- NAV + PROGRESS ---------- */
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
}
window.addEventListener('scroll', ()=>{ nav.classList.toggle('scrolled', window.scrollY > 40); updateProgress(); }, {passive:true});

/* ---------- REVEAL ON SCROLL ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      if(e.target.hasAttribute('data-count') || e.target.querySelector('[data-count]')){
        e.target.querySelectorAll('[data-count]').forEach(animateCount);
      }
      io.unobserve(e.target);
    }
  });
},{threshold:.14});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger').forEach(el=>io.observe(el));

function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1200; const start = performance.now();
  function tick(now){
    const p = Math.min(1, (now-start)/dur);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(target*eased) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- AD CAROUSEL ---------- */
const adSlides = document.querySelectorAll('.ad-slide');
const adDotsWrap = document.getElementById('adDots');
adSlides.forEach((_,i)=>{
  const d = document.createElement('span');
  d.className = 'ad-dot' + (i===0?' active':'');
  d.addEventListener('click', ()=> goToAdSlide(i));
  adDotsWrap.appendChild(d);
});
let adIndex = 0;
function goToAdSlide(i){
  adSlides[adIndex].classList.remove('active');
  adDotsWrap.children[adIndex].classList.remove('active');
  adIndex = i;
  adSlides[adIndex].classList.add('active');
  adDotsWrap.children[adIndex].classList.add('active');
}
setInterval(()=> goToAdSlide((adIndex+1) % adSlides.length), 5000);

/* ---------- CONTACT MODAL ---------- */
function openContactModal(){
  document.getElementById('contactModal').classList.add('open');
  document.getElementById('contactBackdrop').classList.add('open');
}
function closeContactModal(){
  document.getElementById('contactModal').classList.remove('open');
  document.getElementById('contactBackdrop').classList.remove('open');
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeContactModal(); closeAccountModal(); } });

/* ---------- ACCOUNT MODAL (customer sign up / sign in) ---------- */
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
function bootCustomerAuth(){
  window.cbCustomerAuth.onChange(user=> renderAccountState(user));
}
if(window.cbFirebaseReady) bootCustomerAuth();
else window.addEventListener('cb-ready', bootCustomerAuth);
