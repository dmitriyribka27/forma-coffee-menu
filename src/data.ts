import type { MenuData, Dish, Language } from './types';
const langs = ['ka', 'en', 'ru'] as const;
const today = '2026-11-15T00:00:00+04:00';
const translation = (ka: string, en: string, ru: string) => ({ ka, en, ru });
const opts = (volumes: Array<[number, number]>) => volumes.map(([ml, gel], i) => ({
  id: `size-${ml}`, label_translations: translation(`${ml} მლ`, `${ml} ml`, `${ml} мл`), price_minor: gel * 100,
  quantity: ml, unit: 'ml' as const, sort_order: i + 1, is_default: i === 0, is_available: true
}));
function dish(id: string, category_id: string, name: [string, string, string], desc: [string, string, string], ingredients: [string, string, string], price: number | null, sizes: Array<[number,number]> = [], other: Partial<Dish> = {}): Dish {
  return {
    id, category_id, slug: id, translations: { name: translation(...name), description: translation(...desc), ingredients: translation(...ingredients) },
    base_price_minor: price === null ? null : price * 100, price_options: opts(sizes), image_id: null, allergen_ids: [], is_published: true, is_visible: true,
    availability: 'available', sort_order: 0, created_at: today, updated_at: today, ...other
  };
}
const dishes = [
  dish('espresso','coffee',['ესპრესო','Espresso','Эспрессо'],['მდიდარი და დაბალანსებული გემო.','Rich, balanced and full of character.','Насыщенный, сбалансированный вкус.'],['ყავა','Coffee','Кофе'],7),
  dish('americano','coffee',['ამერიკანო','Americano','Американо'],['ესპრესო და ცხელი წყალი.','Espresso with hot water.','Эспрессо с горячей водой.'],['ყავა, წყალი','Coffee, water','Кофе, вода'],null,[[200,8],[300,10]]),
  dish('cappuccino','coffee',['კაპუჩინო','Cappuccino','Капучино'],['ესპრესო რძის ნაზი ქაფით.','Espresso under silky milk foam.','Эспрессо с нежной молочной пеной.'],['ყავა, რძე','Coffee, milk','Кофе, молоко'],null,[[200,9],[300,11]],{allergen_ids:['milk']}),
  dish('latte','coffee',['ლატე','Latte','Латте'],['რბილი რძიანი ყავა.','Smooth espresso with steamed milk.','Мягкий кофе с подогретым молоком.'],['ყავა, რძე','Coffee, milk','Кофе, молоко'],null,[[300,10],[400,12]],{allergen_ids:['milk']}),
  dish('flat-white','coffee',['ფლეტ უაიტი','Flat White','Флэт уайт'],['ორმაგი ესპრესო და რძის თხელი ქაფი.','Double espresso with velvety microfoam.','Двойной эспрессо с тонкой молочной пеной.'],['ყავა, რძე','Coffee, milk','Кофе, молоко'],11,[],{allergen_ids:['milk']}),
  dish('iced-latte','cold',['ცივი ლატე','Iced Latte','Айс-латте'],['ყავა, რძე და ყინული.','Chilled espresso, milk and ice.','Охлаждённый эспрессо, молоко и лёд.'],['ყავა, რძე, ყინული','Coffee, milk, ice','Кофе, молоко, лёд'],null,[[300,12],[400,14]],{allergen_ids:['milk']}),
  dish('iced-matcha','cold',['ცივი მატჩა','Iced Matcha','Айс-матча'],['მატჩა რძითა და ყინულით.','Matcha, milk and plenty of ice.','Матча с молоком и льдом.'],['მატჩა, რძე, ყინული','Matcha, milk, ice','Матча, молоко, лёд'],13,[],{allergen_ids:['milk']}),
  dish('espresso-tonic','cold',['ესპრესო ტონიკი','Espresso Tonic','Эспрессо-тоник'],['ციტრუსოვანი, გამაგრილებელი ყავა.','Sparkling tonic topped with espresso.','Освежающий тоник с эспрессо.'],['ყავა, ტონიკი, ყინული','Coffee, tonic, ice','Кофе, тоник, лёд'],13),
  dish('lemonade','cold',['სახლის ლიმონათი','House Lemonade','Домашний лимонад'],['ციტრუსის ნათელი გემო.','Fresh citrus, gently sparkling.','Свежий цитрусовый вкус.'],['ლიმონი, წყალი, შაქარი','Lemon, water, sugar','Лимон, вода, сахар'],null,[[300,10],[500,14]]),
  dish('omelette','breakfast',['ომლეტი','Omelette','Омлет'],['მსუბუქი, ფაფუკი საუზმე.','Soft, fluffy eggs for a slow morning.','Нежный, воздушный завтрак.'],['კვერცხი, რძე, კარაქი','Eggs, milk, butter','Яйца, молоко, сливочное масло'],17,[],{allergen_ids:['eggs','milk']}),
  dish('avocado-toast','breakfast',['ავოკადოს ტოსტი','Avocado Toast','Тост с авокадо'],['ხრაშუნა პური და მწიფე ავოკადო.','Toasted sourdough with ripe avocado.','Хрустящий хлеб со спелым авокадо.'],['პური, ავოკადო, ლიმონი','Bread, avocado, lemon','Хлеб, авокадо, лимон'],19,[],{allergen_ids:['gluten']}),
  dish('syrniki','breakfast',['სირნიკები','Syrniki','Сырники'],['ხაჭოს ნაზი ბლინები.','Golden cottage-cheese pancakes.','Нежные сырники из творога.'],['ხაჭო, კვერცხი, ფქვილი','Cottage cheese, egg, flour','Творог, яйцо, мука'],18,[],{allergen_ids:['milk','eggs','gluten']}),
  dish('croissant','desserts',['კრუასანი','Croissant','Круассан'],['კარაქიანი, ფენოვანი ცომეული.','Buttery, delicate and freshly baked.','Слоёный, сливочный и воздушный.'],['ფქვილი, კარაქი, რძე','Flour, butter, milk','Мука, масло, молоко'],8,[],{allergen_ids:['gluten','milk']}),
  dish('cheesecake','desserts',['ჩიზქეიქი','Cheesecake','Чизкейк'],['კრემოვანი ტექსტურა, ნაზი გემო.','Creamy and delicately sweet.','Нежный сливочный десерт.'],['კრემ-ყველი, კვერცხი, ორცხობილა','Cream cheese, eggs, biscuit','Сливочный сыр, яйца, печенье'],16,[],{allergen_ids:['milk','eggs','gluten']}),
  dish('brownie','desserts',['ბრაუნი','Brownie','Брауни'],['მუქი შოკოლადის ინტენსიური გემო.','Deep dark chocolate, soft center.','Насыщенный шоколадный вкус и мягкая серединка.'],['შოკოლადი, ფქვილი, კარაქი, კვერცხი','Chocolate, flour, butter, eggs','Шоколад, мука, масло, яйца'],14,[],{allergen_ids:['milk','eggs','gluten'],availability:'sold_out'})
];
const order = ['coffee','cold','breakfast','desserts'];
for (const [i, d] of dishes.entries()) d.sort_order = i;
export const menu: MenuData = {
  settings: {
    schema_version:'1.0', menu_id:'forma-coffee-demo',restaurant_name:'FORMA COFFEE',default_language:'en',supported_languages:[...langs],currency:'GEL',
    contact_phone:null, instagram_url:null,address:null,updated_at:today,published_at:null
  },
  categories:[
    {id:'coffee',slug:'coffee',translations:translation('ყავა','Coffee','Кофе'),sort_order:0,is_visible:true},
    {id:'cold',slug:'cold-drinks',translations:translation('ცივი სასმელები','Cold Drinks','Холодные напитки'),sort_order:1,is_visible:true},
    {id:'breakfast',slug:'breakfast',translations:translation('საუზმე','Breakfast','Завтраки'),sort_order:2,is_visible:true},
    {id:'desserts',slug:'desserts',translations:translation('დესერტები','Desserts','Десерты'),sort_order:3,is_visible:true}
  ],
  dishes,
  allergens:[
    {id:'milk',translations:translation('რძე','Milk','Молоко')},
    {id:'eggs',translations:translation('კვერცხი','Eggs','Яйца')},
    {id:'gluten',translations:translation('გლუტენი','Gluten','Глютен')}
  ], media:[]
};
export const visibleDishes = (m: MenuData) => m.dishes.filter(d => d.is_published && d.is_visible && m.categories.some(c=>c.id===d.category_id && c.is_visible));
export const categoryDishes = (m: MenuData, categoryId: string) => visibleDishes(m).filter(d=>d.category_id===categoryId).sort((a,b)=>a.sort_order-b.sort_order);
export const searchDishes = (m: MenuData, lang: Language, text: string) => {
  const q=text.trim().toLocaleLowerCase();
  if (!q) return visibleDishes(m);
  return visibleDishes(m).filter(d=>[d.translations.name[lang],d.translations.description[lang],d.translations.ingredients[lang]].some(s=>s.toLocaleLowerCase().includes(q)));
};
export const minPrice = (d: Dish) => d.base_price_minor ?? Math.min(...d.price_options.filter(p=>p.is_available).map(p=>p.price_minor));
export const money = (minor: number, lang: Language) => `${(minor/100).toLocaleString(lang==='ka'?'ka-GE':lang==='ru'?'ru-RU':'en-GB',{minimumFractionDigits:0,maximumFractionDigits:2})} ₾`;
export function validateMenu(m: MenuData): string[] {
 const errors: string[]=[];
 if(m.settings.schema_version!=='1.0') errors.push('Invalid schema version');
 const ids=new Set<string>();
 for(const c of m.categories){if(ids.has(c.id))errors.push(`Duplicate id ${c.id}`);ids.add(c.id);for(const l of m.settings.supported_languages)if(!c.translations[l]?.trim())errors.push(`${c.id}: missing category ${l}`);}
 ids.clear();
 for(const d of m.dishes){
   if(ids.has(d.id))errors.push(`Duplicate dish ${d.id}`);ids.add(d.id);
   if(!m.categories.some(c=>c.id===d.category_id))errors.push(`${d.id}: missing category`);
   if((d.base_price_minor===null)===(d.price_options.length===0)) errors.push(`${d.id}: exactly one price model required`);
   if(d.base_price_minor!==null && (!Number.isInteger(d.base_price_minor)||d.base_price_minor<0)) errors.push(`${d.id}: invalid base price`);
   if(d.price_options.some(o=>!Number.isInteger(o.price_minor)||o.price_minor<0)) errors.push(`${d.id}: invalid option price`);
   if(d.price_options.length && d.price_options.filter(o=>o.is_default).length!==1) errors.push(`${d.id}: expected one default option`);
   for(const l of m.settings.supported_languages)if(!d.translations.name[l]?.trim())errors.push(`${d.id}: missing name ${l}`);
   for(const id of d.allergen_ids)if(!m.allergens.some(a=>a.id===id))errors.push(`${d.id}: unknown allergen ${id}`);
 }
 return errors;
}