
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('[data-view]');

function smoothScrollTo(view) {
  const el = document.getElementById('view-' + view);
  if (!el) return;

  const topbar = document.querySelector('.topbar');
  const offset = (topbar?.offsetHeight || 0) + 12; 

  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-view]');
  if (!btn) return;

  if (btn.tagName === 'BUTTON') e.preventDefault();

  const view = btn.dataset.view;
  if (view) smoothScrollTo(view);
});


navButtons.forEach(btn => {
  btn.addEventListener('click', () => show(btn.dataset.view));
});

const themeToggle = document.getElementById('themeToggle');
function applyTheme(mode){ document.documentElement.setAttribute('data-theme', mode); localStorage.setItem('theme', mode); }
applyTheme(localStorage.getItem('theme') || 'dark');
themeToggle?.addEventListener('click', () => {
  const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(now);
});

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const mode = tab.dataset.auth;
    if (mode === 'login') { loginForm.classList.remove('hidden'); signupForm.classList.add('hidden'); }
    else { signupForm.classList.remove('hidden'); loginForm.classList.add('hidden'); }
  });
});

const data = [
  { title: 'Algoritmi & Structuri',       author: 'Ioana Radu • UTM',    price: 79, image: 'images/algo.png' },
  { title: 'Python pentru începători',    author: 'Andrei Popescu • UTM',price: 49, image: 'images/python-logo.png' },
  { title: 'Baze de date',                author: 'Alex D. • UTM',       price: 59, image: 'images/3.png' },
  { title: 'Prog. C — atestare',          author: 'Venia G. • UTM',      price: 45, image: 'images/atest.png' },
  { title: 'Calcul diferențial',          author: 'Ioana R. • UTM',      price: 69, image: 'images/calcul.png' },
  { title: 'TPA — proiect',               author: 'Mihai P. • UTM',      price: 39, image: 'images/proiect.png' },
];

const grid = document.getElementById('catalogGrid');
const safeImg = (src) => (src && src.trim() ? src : 'images/placeholder.jpg');

function renderCatalog(items){
  grid.innerHTML = items.map((item, i) => `
    <article class="card reveal" data-anim="fade-up" style="--i:${i}">
      <div class="thumb">
        <img src="${safeImg(item.image)}" alt="${item.title}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p class="sub">${item.author}</p>
        <div class="row">
          <span class="price">${item.price} MDL</span>
          <button class="btn sm" data-view="checkout">Cumpără</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => show(b.dataset.view)));
  revealInit(grid); 
}
renderCatalog(data);

const q = document.getElementById('q');
const cat = document.getElementById('cat');
const sort = document.getElementById('sort');
[q, cat, sort].forEach(el => el?.addEventListener('input', () => {
  let items = data.filter(x => (q.value ? x.title.toLowerCase().includes(q.value.toLowerCase()) : true));
  if (sort.value === 'cheap') items = items.slice().sort((a,b)=>a.price-b.price);
  renderCatalog(items);
}));

document.querySelectorAll('.brand').forEach(b => b.addEventListener('click', () => show('landing')));
document.querySelectorAll('footer [data-view]').forEach(b => b.addEventListener('click', () => show(b.dataset.view)));

function revealInit(rootEl = document){
  const els = rootEl.querySelectorAll?.('.reveal[data-anim]:not(.in)') || [];
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  els.forEach(el => io.observe(el));
}


document.addEventListener('DOMContentLoaded', ()=>{
 
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal[data-anim]{
      opacity:0;
      transform: translateY(32px);
      transition: opacity 1.6s cubic-bezier(.2,.8,.2,1),
                  transform 1.6s cubic-bezier(.2,.8,.2,1);
      will-change: opacity, transform;
      transition-delay: calc(var(--i, 0) * .15s);
    }
    .reveal[data-anim].in{ opacity:1; transform:none; }
    .reveal[data-anim="fade-left"]  { transform: translateX(-50px); }
    .reveal[data-anim="fade-right"] { transform: translateX(50px);  }
    .reveal[data-anim="fade-down"]  { transform: translateY(-50px); }
    @media (prefers-reduced-motion: reduce){
      .reveal[data-anim]{ opacity:1 !important; transform:none !important; transition:none !important; }
    }
  `;
  document.head.appendChild(style);

  
  document.querySelectorAll('.section-title, .testi, .card').forEach((el,i)=>{
    el.classList.add('reveal');
    if(!el.hasAttribute('data-anim')) el.setAttribute('data-anim','fade-up');
    if (el.closest('.grid')) el.style.setProperty('--i', i % 12);
  });

  const heroText = document.querySelector('.hero-text');
  const heroArt  = document.querySelector('.hero-art');
  heroText?.classList.add('reveal');  heroText?.setAttribute('data-anim','fade-right');
  heroArt?.classList.add('reveal');   heroArt?.setAttribute('data-anim','fade-left');

  revealInit();
});
