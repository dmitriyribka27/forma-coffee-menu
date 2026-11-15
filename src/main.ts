import './style.css';
import { menu, validateMenu, categoryDishes, visibleDishes, searchDishes, minPrice, money } from './data';
import { languages, t } from './i18n';
import type { Dish, Language, Category } from './types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root missing');
const root = app;
const STORE_KEY = `gameapps:menu:${menu.settings.menu_id}:language`;
const readLang = (): Language | null => {
  try { const saved=localStorage.getItem(STORE_KEY); return menu.settings.supported_languages.includes(saved as Language) ? saved as Language : null; }
  catch { return null; }
};
const writeLang = (l:Language) => { try {localStorage.setItem(STORE_KEY,l);}catch{/* browsing without persistent storage */} };
const state: { lang: Language|null; gateSelection: Language|null; sidebar: boolean; dishId: string|null; search:string; selectedOption: string|null; activeCategory:string; preSearchScroll:number; wasSearching:boolean; } = {
 lang:readLang(),gateSelection:null,sidebar:false,dishId:null,search:'',selectedOption:null,activeCategory:'coffee',preSearchScroll:0,wasSearching:false
};
let latestTrigger: HTMLElement | null = null;
let sidebarTrigger: HTMLElement | null = null;
let frozenScrollY=0;
let scrollObserver: IntersectionObserver | null=null;
let debounceScroll:number | undefined;

function esc(str:string):string {return str.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]??c));}
const p=(l:Language)=>({ka:'ka',ru:'ru',en:'en'}[l]);
const line=(l:Language)=>`<span class="tiny-rule" aria-hidden="true"></span><span>${esc(t('browse',l))}</span>`;
function languagesMarkup(selected:Language|null, cls:string){
 return languages.filter(o=>menu.settings.supported_languages.includes(o.code)).map(o=>`<button type="button" class="lang-option ${cls} ${selected===o.code?'selected':''}" data-lang="${o.code}" aria-pressed="${selected===o.code}"><span class="lang-flag" aria-hidden="true">${o.flag}</span><span>${o.native}</span>${selected===o.code?'<span class="check" aria-hidden="true">✓</span>':''}</button>`).join('');
}
function errorView(errors:string[]){root.innerHTML=`<div class="error-screen"><div class="brand-mark">FORMA<span>COFFEE</span></div><h1>Menu unavailable</h1><p>The menu data needs attention.</p><pre>${esc(errors.join('\n'))}</pre></div>`;}
function gate(){
 const lang=state.gateSelection;
 document.documentElement.lang='en';
 root.innerHTML=`<main class="gate-screen"><div class="gate-decoration" aria-hidden="true"><div class="gate-disc"><div class="gate-disc-inner">f.</div></div></div><div class="gate-content"><div class="brand-mark">FORMA<span>COFFEE</span></div><div class="eyebrow"><span class="tiny-rule"></span> DIGITAL MENU</div><h1>Choose your<br><em>language.</em></h1><div class="gate-intro"><span lang="ka">აირჩიეთ ენა</span><span lang="en">Choose your language</span><span lang="ru">Выберите язык</span></div><div class="gate-languages">${languagesMarkup(lang,'gate-lang')}</div><button class="primary-action" id="gate-continue" ${lang?'':'disabled'}>${esc(t('viewMenu',lang??'en'))} <span aria-hidden="true">↗</span></button><div class="gate-footer">FORMA COFFEE <span aria-hidden="true">·</span> GAME APPS DEMO</div></div></main>`;
 root.querySelectorAll<HTMLButtonElement>('.gate-lang').forEach(b=>b.addEventListener('click',()=>{state.gateSelection=b.dataset.lang as Language;gate();}));
 root.querySelector<HTMLButtonElement>('#gate-continue')?.addEventListener('click',()=>{if(!state.gateSelection)return;state.lang=state.gateSelection;writeLang(state.lang);window.scrollTo(0,0);render();});
}
function priceMarkup(d:Dish,lang:Language){
 const cost=minPrice(d);
 if(!Number.isFinite(cost))return `<span class="status-tag">${t('unavailable',lang)}</span>`;
 return `<span class="price">${d.price_options.length?`<small>${t('from',lang)}</small> `:''}${money(cost,lang)}</span>`;
}
function dishCard(d:Dish,lang:Language){
 const unavailable=d.availability!=='available';
 return `<button type="button" class="dish-card ${unavailable?'dimmed':''}" data-dish="${d.id}" aria-label="${esc(d.translations.name[lang])}, ${esc(unavailable?t(d.availability==='sold_out'?'soldOut':'unavailable',lang):'')}">
 <span class="dish-thumb ${['coffee','cold','breakfast','desserts'].includes(d.category_id)?`thumb-${d.category_id}`:''}" aria-hidden="true"><span class="thumb-glyph">${{coffee:'◔',cold:'◌',breakfast:'◒',desserts:'✳'}[d.category_id]||'◌'}</span></span>
 <span class="dish-copy"><span class="dish-title">${esc(d.translations.name[lang])}</span><span class="dish-description">${esc(d.translations.description[lang])}</span><span class="dish-bottom">${priceMarkup(d,lang)}${unavailable?`<span class="status-tag">${t(d.availability==='sold_out'?'soldOut':'unavailable',lang)}</span>`:''}</span></span><span class="dish-arrow" aria-hidden="true">↗</span></button>`;
}
function sections(lang:Language){
 if(state.search.trim()){
  const res=searchDishes(menu,lang,state.search);
  return `<section class="search-results"><div class="section-heading"><div class="eyebrow">${line(lang)}</div><h2>${t('allResults',lang)}</h2><span class="result-count">${res.length}</span></div>${res.length?`<div class="dish-list">${res.map(d=>dishCard(d,lang)).join('')}</div>`:`<div class="empty-search"><span class="empty-sign" aria-hidden="true">⌕</span><h3>${t('noResults',lang)}</h3><p>${t('tryDifferent',lang)}</p><button type="button" id="empty-clear">${t('clear',lang)} ↗</button></div>`}</section>`;
 }
 return menu.categories.filter(c=>c.is_visible && categoryDishes(menu,c.id).length).sort((a,b)=>a.sort_order-b.sort_order).map((c,i)=>`<section class="menu-section" data-section="${c.id}" id="category-${c.id}"><div class="section-heading"><div class="eyebrow">${line(lang)}</div><h2>${esc(c.translations[lang])}</h2><span class="result-count">${categoryDishes(menu,c.id).length.toString().padStart(2,'0')}</span></div><div class="dish-list">${categoryDishes(menu,c.id).map(d=>dishCard(d,lang)).join('')}</div>${i===0?'<div class="editorial-note"><span class="note-star" aria-hidden="true">✳</span><p>FORMA<br><em>every day.</em></p></div>':''}</section>`).join('');
}
function tabs(lang:Language) {return menu.categories.filter(c=>c.is_visible && categoryDishes(menu,c.id).length).sort((a,b)=>a.sort_order-b.sort_order).map(c=>`<button type="button" class="category-tab ${state.activeCategory===c.id?'active':''}" data-category="${c.id}" aria-current="${state.activeCategory===c.id?'true':'false'}">${esc(c.translations[lang])}</button>`).join('');}
function sidebar(lang:Language){return `<div class="overlay sidebar-overlay" id="sidebar-overlay" aria-hidden="false"><div class="scrim" data-close-sidebar></div><aside class="sidebar" role="dialog" aria-modal="true" aria-label="${esc(t('menu',lang))}"><div class="sidebar-head"><div class="brand-mark">FORMA<span>COFFEE</span></div><button class="icon-button close-button" data-close-sidebar aria-label="${t('close',lang)}"><span aria-hidden="true">×</span></button></div><div class="sidebar-scroll"><div class="sidebar-block"><div class="sidebar-label">${t('language',lang)}</div><div class="sidebar-langs">${languagesMarkup(lang,'sidebar-lang')}</div></div><div class="sidebar-block"><div class="sidebar-label">${t('categories',lang)}</div><nav class="sidebar-nav">${menu.categories.filter(c=>c.is_visible && categoryDishes(menu,c.id).length).map((c,i)=>`<button type="button" class="sidebar-category ${state.activeCategory===c.id?'current':''}" data-category="${c.id}"><span>${esc(c.translations[lang])}</span><span aria-hidden="true">↗</span></button>`).join('')}</nav></div><div class="sidebar-foot"><span>FORMA COFFEE</span><p>${t('demo',lang)}</p><small>${t('by',lang)}</small></div></div></aside></div>`;}
function details(lang:Language){
 const d=visibleDishes(menu).find(item=>item.id===state.dishId);
 if(!d)return '';
 const selected=d.price_options.find(o=>o.id===state.selectedOption && o.is_available)||d.price_options.find(o=>o.is_default && o.is_available)||d.price_options.find(o=>o.is_available);
 const chosenPrice=selected?.price_minor??d.base_price_minor;
 const status=d.availability!=='available'?`<span class="status-tag status-large">${t(d.availability==='sold_out'?'soldOut':'unavailable',lang)}</span>`:'';
 return `<div class="details-cover" id="details-cover"><div class="details-dialog" role="dialog" aria-modal="true" aria-label="${esc(d.translations.name[lang])}"><div class="details-top"><button class="back-button" data-close-details aria-label="${t('back',lang)}"><span aria-hidden="true">←</span> ${t('back',lang)}</button><button class="icon-button" data-close-details aria-label="${t('close',lang)}"><span aria-hidden="true">×</span></button></div><div class="details-scroll"><div class="details-hero hero-${d.category_id}" aria-label="${t('photoComing',lang)}"><span class="hero-glyph" aria-hidden="true">${{coffee:'◔',cold:'◌',breakfast:'◒',desserts:'✳'}[d.category_id]}</span><span class="hero-caption">${t('photoComing',lang)}</span></div><div class="details-body"><div class="eyebrow"><span class="tiny-rule"></span>${esc(menu.categories.find(c=>c.id===d.category_id)?.translations[lang]??'')}</div><h2>${esc(d.translations.name[lang])}</h2><p class="details-description">${esc(d.translations.description[lang])}</p>${status}<div class="details-rule"></div><div class="detail-section"><h3>${t('ingredients',lang)}</h3><p>${esc(d.translations.ingredients[lang])}</p></div>${d.allergen_ids.length?`<div class="detail-section"><h3>${t('allergens',lang)}</h3><div class="allergen-list">${d.allergen_ids.map(id=>`<span class="allergen">${esc(menu.allergens.find(a=>a.id===id)?.translations[lang]??id)}</span>`).join('')}</div><p class="allergy-notice">${t('disclaimer',lang)}</p></div>`:''}${d.price_options.length?`<div class="detail-section"><h3>${t('options',lang)}</h3><div class="option-list">${d.price_options.map(o=>`<button type="button" class="price-option ${selected?.id===o.id?'chosen':''}" data-option="${o.id}" ${o.is_available?'':'disabled'} aria-pressed="${selected?.id===o.id}"><span class="option-radio" aria-hidden="true"></span><span>${esc(o.label_translations[lang])}</span><strong>${money(o.price_minor,lang)}</strong></button>`).join('')}</div></div>`:''}<div class="details-total"><span>${t('price',lang)}</span><strong>${chosenPrice!==null&&chosenPrice!==undefined?money(chosenPrice,lang):'—'}</strong></div></div></div></div></div>`;
}
function freeze(){if(document.body.classList.contains('modal-open'))return;frozenScrollY=window.scrollY;document.body.style.top=`-${frozenScrollY}px`;document.body.classList.add('modal-open');}
function unfreeze(){if(!document.body.classList.contains('modal-open'))return;document.body.classList.remove('modal-open');document.body.style.top='';window.scrollTo(0,frozenScrollY);}
function openSidebar(){sidebarTrigger=document.activeElement as HTMLElement;state.sidebar=true;freeze();mountOverlay();const overlay=root.querySelector<HTMLElement>('#sidebar-overlay');overlay?.querySelector<HTMLElement>('.close-button')?.focus();}
function closeSidebar(){state.sidebar=false;root.querySelector('#sidebar-overlay')?.remove();if(!state.dishId)unfreeze();sidebarTrigger?.focus();}
function openDetails(id:string){latestTrigger=document.activeElement as HTMLElement;state.dishId=id;const d=menu.dishes.find(x=>x.id===id);state.selectedOption=d?.price_options.find(o=>o.is_default)?.id??null;freeze();mountOverlay();root.querySelector<HTMLElement>('#details-cover [data-close-details]')?.focus();}
function closeDetails(){state.dishId=null;state.selectedOption=null;root.querySelector('#details-cover')?.remove();if(!state.sidebar)unfreeze();latestTrigger?.focus();}
function mountOverlay(){const lang=state.lang!;root.querySelector('#sidebar-overlay')?.remove();root.querySelector('#details-cover')?.remove();if(state.sidebar)root.insertAdjacentHTML('beforeend',sidebar(lang));if(state.dishId)root.insertAdjacentHTML('beforeend',details(lang));bindOverlay();}
function switchLang(l:Language){state.lang=l;writeLang(l);if(state.search){state.search='';state.wasSearching=false;}const current=window.scrollY;render();if(state.sidebar){freeze();setTimeout(()=>{window.scrollTo(0,current);root.querySelector<HTMLElement>('.sidebar .sidebar-lang.selected')?.focus();},0);}}
function setSearch(q:string){if(!state.wasSearching && q.trim()){state.preSearchScroll=window.scrollY;state.wasSearching=true;}state.search=q;const main=root.querySelector<HTMLElement>('#menu-content');if(main)main.innerHTML=sections(state.lang!);const tabsEl=root.querySelector<HTMLElement>('#category-tabs');if(tabsEl)tabsEl.hidden=Boolean(q.trim());bindDishCards();root.querySelector<HTMLButtonElement>('#empty-clear')?.addEventListener('click',clearSearch);if(q.trim())window.scrollTo({top:Math.max(0,(root.querySelector('#search-block')?.getBoundingClientRect().top??0)+window.scrollY-130),behavior:'instant'});if(!q.trim()&&state.wasSearching){state.wasSearching=false;setTimeout(()=>window.scrollTo({top:state.preSearchScroll,behavior:'instant'}),0);}observeSections();}
function clearSearch(){const inp=root.querySelector<HTMLInputElement>('#search-input');if(inp){inp.value='';setSearch('');inp.blur();}}
function goCategory(id:string){if(state.search)clearSearch();state.activeCategory=id;if(state.sidebar)closeSidebar();const el=root.querySelector<HTMLElement>(`#category-${id}`);if(el)el.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});updateTabs();}
function updateTabs(){root.querySelectorAll<HTMLButtonElement>('.category-tab').forEach(b=>{const active=b.dataset.category===state.activeCategory;b.classList.toggle('active',active);b.setAttribute('aria-current',String(active));if(active)b.scrollIntoView({behavior:'smooth',inline:'nearest',block:'nearest'});});}
function observeSections(){scrollObserver?.disconnect();if(state.search)return;const sections=root.querySelectorAll<HTMLElement>('.menu-section');if(!sections.length)return;scrollObserver=new IntersectionObserver(entries=>{const entriesIn=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(entriesIn.length){state.activeCategory=(entriesIn[0].target as HTMLElement).dataset.section??state.activeCategory;updateTabs();}},{rootMargin:'-125px 0px -55% 0px',threshold:0});sections.forEach(s=>scrollObserver!.observe(s));}
function bindDishCards(){root.querySelectorAll<HTMLButtonElement>('[data-dish]').forEach(b=>b.addEventListener('click',()=>openDetails(b.dataset.dish!)));}
function trapFocus(event:KeyboardEvent){if(event.key!=='Tab')return;const dialog=root.querySelector<HTMLElement>('#details-cover .details-dialog')||root.querySelector<HTMLElement>('#sidebar-overlay .sidebar');if(!dialog)return;const focusable=Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled])')).filter(el=>el.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}}
function bindOverlay(){
 root.querySelectorAll<HTMLElement>('[data-close-sidebar]').forEach(e=>e.addEventListener('click',closeSidebar));
 root.querySelectorAll<HTMLElement>('[data-close-details]').forEach(e=>e.addEventListener('click',closeDetails));
 root.querySelectorAll<HTMLButtonElement>('.sidebar-lang').forEach(e=>e.addEventListener('click',()=>switchLang(e.dataset.lang as Language)));
 root.querySelectorAll<HTMLButtonElement>('.sidebar-category').forEach(e=>e.addEventListener('click',()=>goCategory(e.dataset.category!)));
 root.querySelectorAll<HTMLButtonElement>('[data-option]').forEach(e=>e.addEventListener('click',()=>{state.selectedOption=e.dataset.option!;mountOverlay();root.querySelector<HTMLElement>(`[data-option="${state.selectedOption}"]`)?.focus();}));
}
function render(){
 if(!state.lang){gate();return;}
 const lang=state.lang;
 document.documentElement.lang=p(lang);
 document.title=`FORMA COFFEE · ${t('menu',lang)}`;
 root.innerHTML=`<div class="site-shell"><header class="site-header"><div class="header-inner"><div class="brand-mark">FORMA<span>COFFEE</span></div><button type="button" id="open-sidebar" class="menu-toggle" aria-label="${t('openMenu',lang)}"><span class="menu-bars"><i></i><i></i></span><span class="menu-toggle-text">${t('menu',lang)}</span></button></div></header><nav id="category-tabs" class="tab-rail" aria-label="${t('categories',lang)}" ${state.search?'hidden':''}><div class="tabs-inner">${tabs(lang)}</div></nav><main class="page-main"><section class="intro"><div class="eyebrow"><span class="tiny-rule"></span> FORMA COFFEE · DIGITAL MENU</div><h1>${lang==='ka'?'გამარჯობა.':lang==='ru'?'Привет.':'Hello.'}<br><em>${lang==='ka'?'კეთილი იყოს თქვენი მობრძანება.':lang==='ru'?'Рады вас видеть.':'Make yourself at home.'}</em></h1><p>${t('menuSubtitle',lang)}</p><div class="intro-seal" aria-hidden="true">f<span>.</span></div></section><div class="intro-bottom"><span>EST. IN IMAGINATION</span><span>SCROLL TO EXPLORE ↓</span></div><section class="search-block" id="search-block"><label for="search-input" class="sr-only">${t('search',lang)}</label><span class="search-icon" aria-hidden="true">⌕</span><input id="search-input" type="search" autocomplete="off" enterkeyhint="search" placeholder="${t('search',lang)}" value="${esc(state.search)}"/><button type="button" id="clear-search" aria-label="${t('clear',lang)}" ${state.search?'':'hidden'}>×</button></section><div id="menu-content">${sections(lang)}</div><footer class="site-footer"><div class="footer-brand">FORMA<span>COFFEE</span></div><p>${t('demo',lang)}</p><div class="footer-bottom"><span>${t('by',lang)}</span><span>© 2026</span></div></footer></main></div>`;
 root.querySelector('#open-sidebar')?.addEventListener('click',openSidebar);
 root.querySelectorAll<HTMLButtonElement>('.category-tab').forEach(b=>b.addEventListener('click',()=>goCategory(b.dataset.category!)));
 root.querySelector<HTMLInputElement>('#search-input')?.addEventListener('input',event=>{const inp=event.target as HTMLInputElement;setSearch(inp.value);const clear=root.querySelector<HTMLButtonElement>('#clear-search');if(clear)clear.hidden=!inp.value;});
 root.querySelector('#clear-search')?.addEventListener('click',clearSearch);
 bindDishCards();mountOverlay();observeSections();
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(state.dishId)closeDetails();else if(state.sidebar)closeSidebar();else if(state.search)clearSearch();}trapFocus(event);});
const errors=validateMenu(menu);
if(errors.length)errorView(errors);else render();