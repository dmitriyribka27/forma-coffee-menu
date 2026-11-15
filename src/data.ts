import type { MenuData, Dish, Language } from './types';
const langs = ['ka', 'en', 'ru'] as const;
const today = '2026-11-15T00:00:00+04:00';
const translation = (ka: string, en: string, ru: string) => ({ ka, en, ru });
const opts = (dishId: string, volumes: Array<[number, number]>) => volumes.map(([ml, gel], i) => ({
  id: `${dishId}-size-${ml}`, label_translations: translation(`${ml} მლ`, `${ml} ml`, `${ml} мл`), price_minor: gel * 100,
  quantity: ml, unit: 'ml' as const, sort_order: i + 1, is_default: i === 0, is_available: true
}));
function dish(id: string, category_id: string, name: [string, string, string], desc: [string, string, string], ingredients: [string, string, string], price: number | null, sizes: Array<[number,number]> = [], other: Partial<Dish> = {}): Dish {
  return {
    id, category_id, slug: id, translations: { name: translation(...name), description: translation(...desc), ingredients: translation(...ingredients) },
    base_price_minor: price === null ? null : price * 100, price_options: opts(id,sizes), image_id: null, allergen_ids: [], is_published: true, is_visible: true,
    availability: 'available', sort_order: 0, created_at: today, updated_at: today, ...other
  };
}
const dishes = [
  dish('espresso','coffee',['ესპრესო','Espresso','Эспрессо'],["სქელი კრემით, შოკოლადის ნოტებითა და თხილის მსუბუქი სიტკბოთი — პატარა ფინჯანში დიდი ხასიათი.","A short, intense shot with velvety crema, dark chocolate notes and a soft nutty finish.","Короткий, насыщенный шот с бархатистой крема, нотами тёмного шоколада и мягким ореховым послевкусием."],["ახლად დაფქული არაბიკა, გაფილტრული წყალი.","Freshly ground Arabica coffee, filtered water.","Свежемолотая арабика, фильтрованная вода."],7),
  dish('americano','coffee',['ამერიკანო','Americano','Американо'],["ესპრესო ცხელი წყლით — მსუბუქი ტექსტურა, ღრმა არომატი და სუფთა გემო.","Espresso lengthened with hot water: aromatic, smooth and easy to enjoy slowly.","Эспрессо, разбавленный горячей водой: насыщенный аромат, лёгкая текстура и чистый кофейный вкус."],["არაბიკის ესპრესო, ცხელი გაფილტრული წყალი.","Arabica espresso, hot filtered water.","Эспрессо из арабики, горячая фильтрованная вода."],null,[[200,8],[300,10]]),
  dish('cappuccino','coffee',['კაპუჩინო','Cappuccino','Капучино'],["ესპრესო, თბილი რძე და ჰაეროვანი მიკროქაფი — იდეალური ბალანსი.","A rich espresso wrapped in steamed milk and silky microfoam, with a gentle caramel sweetness.","Насыщенный эспрессо, тёплое молоко и шелковистая микропена с мягкой карамельной сладостью."],["არაბიკის ესპრესო, ძროხის რძე.","Arabica espresso, cow’s milk.","Эспрессо из арабики, коровье молоко."],null,[[200,9],[300,11]],{allergen_ids:['milk']}),
  dish('latte','coffee',['ლატე','Latte','Латте'],["რბილი რძიანი ყავა, ნაზი ტექსტურითა და მსუბუქი ყავის არომატით.","A mellow, creamy coffee with a delicate espresso aroma and a generous layer of steamed milk.","Нежный сливочный кофе с деликатным ароматом эспрессо и большим количеством взбитого молока."],["არაბიკის ესპრესო, ძროხის რძე.","Arabica espresso, cow’s milk.","Эспрессо из арабики, коровье молоко."],null,[[300,10],[400,12]],{allergen_ids:['milk']}),
  dish('flat-white','coffee',['ფლეტ უაიტი','Flat White','Флэт уайт'],["ორმაგი ესპრესო და თხელი მიკროქაფი — მკვეთრი ყავის გემო.","Double espresso with a thin layer of velvety microfoam: bold coffee character, smooth finish.","Двойной эспрессо под тонким слоем бархатистой микропены: яркий кофейный вкус и мягкое послевкусие."],["ორმაგი არაბიკის ესპრესო, ძროხის რძე.","Double Arabica espresso, cow’s milk.","Двойной эспрессо из арабики, коровье молоко."],11,[],{allergen_ids:['milk']}),
  dish('iced-latte','cold',['ცივი ლატე','Iced Latte','Айс-латте'],["ცივი რძე, ყინული და ესპრესო — რბილი, გამაგრილებელი და არომატული.","Chilled milk and ice layered with fresh espresso: creamy, refreshing and beautifully balanced.","Холодное молоко, кубики льда и свежий эспрессо: сливочный, бодрящий и освежающий напиток."],["არაბიკის ესპრესო, ძროხის რძე, ყინული.","Arabica espresso, cow’s milk, ice.","Эспрессо из арабики, коровье молоко, лёд."],null,[[300,12],[400,14]],{allergen_ids:['milk']}),
  dish('iced-matcha','cold',['ცივი მატჩა','Iced Matcha','Айс-матча'],["მატჩას მდიდარი გემო ცივ რძესა და ყინულთან ერთად.","Earthy Japanese-style matcha blended with cold milk and ice for a smooth, gently sweet sip.","Яркая травянистая матча с холодным молоком и льдом — мягкий вкус и нежная кремовая текстура."],["მატჩას მწვანე ჩაის ფხვნილი, ძროხის რძე, ყინული.","Matcha green tea powder, cow’s milk, ice.","Порошок зелёного чая матча, коровье молоко, лёд."],13,[],{allergen_ids:['milk']}),
  dish('espresso-tonic','cold',['ესპრესო ტონიკი','Espresso Tonic','Эспрессо-тоник'],["ცივი ტონიკი, ესპრესო და ფორთოხალი — ციტრუსოვანი და ცქრიალა.","A sparkling mix of bittersweet tonic and espresso, lifted with fresh orange and ice.","Игристый тоник с насыщенным эспрессо, льдом и апельсином — цитрусовая свежесть с кофейной горчинкой."],["არაბიკის ესპრესო, ტონიკი, ფორთოხალი, ყინული.","Arabica espresso, tonic water, orange, ice.","Эспрессо из арабики, тоник, апельсин, лёд."],13),
  dish('lemonade','cold',['სახლის ლიმონათი','House Lemonade','Домашний лимонад'],["ლიმონის ცოცხალი მჟავიანობა, პიტნა და მსუბუქი სიტკბო.","Fresh lemon, fragrant mint and a light sparkle: bright, zesty and made for sunny afternoons.","Свежий лимон, ароматная мята и лёгкая сладость — яркий, освежающий лимонад с пузырьками."],["ლიმონი, პიტნა, გაზიანი წყალი, შაქრის სიროფი, ყინული.","Lemon, mint, sparkling water, sugar syrup, ice.","Лимон, мята, газированная вода, сахарный сироп, лёд."],null,[[300,10],[500,14]]),
  dish('omelette','breakfast',['ომლეტი','Omelette','Омлет'],["ფაფუკი ომლეტი კარაქით, მწვანილითა და ნაზი ტექსტურით.","Soft, buttery eggs folded into a fluffy omelette and finished with fresh herbs.","Пышный омлет на сливочном масле со свежей зеленью — нежный внутри и слегка золотистый снаружи."],["კვერცხი, რძე, კარაქი, ოხრახუში, მარილი.","Eggs, milk, butter, parsley, salt.","Яйца, молоко, сливочное масло, петрушка, соль."],17,[],{allergen_ids:['eggs','milk']}),
  dish('avocado-toast','breakfast',['ავოკადოს ტოსტი','Avocado Toast','Тост с авокадо'],["ხრაშუნა პური, კრემოვანი ავოკადო, ლიმონი და მწვანილი.","Toasted sourdough piled with ripe avocado, lemon and fresh greens for a bright, satisfying breakfast.","Поджаренный хлеб на закваске со спелым авокадо, лимонным соком и свежей зеленью."],["ხორბლის პური, ავოკადო, ლიმონი, მიკრომწვანილი, მარილი.","Wheat sourdough bread, avocado, lemon, microgreens, salt.","Пшеничный хлеб на закваске, авокадо, лимон, микрозелень, соль."],19,[],{allergen_ids:['gluten']}),
  dish('syrniki','breakfast',['სირნიკები','Syrniki','Сырники'],["ოქროსფერი ხაჭოს სირნიკები არაჟნითა და ახალი კენკრით.","Golden cottage-cheese pancakes with a tender center, served with sour cream and fresh berries.","Румяные сырники с нежной творожной серединкой, сметаной и свежими ягодами."],["ხაჭო, კვერცხი, ხორბლის ფქვილი, შაქარი, არაჟანი, კენკრა.","Cottage cheese, egg, wheat flour, sugar, sour cream, berries.","Творог, яйцо, пшеничная мука, сахар, сметана, ягоды."],18,[],{allergen_ids:['milk','eggs','gluten']}),
  dish('croissant','desserts',['კრუასანი','Croissant','Круассан'],["ხრაშუნა ოქროსფერი ქერქი და კარაქიანი, ჰაეროვანი ფენები.","A golden, flaky croissant with a crisp shell and delicate buttery layers inside.","Золотистый круассан с хрустящей корочкой и тонкими воздушными слоями сливочного теста."],["ხორბლის ფქვილი, კარაქი, რძე, საფუარი, შაქარი, კვერცხი.","Wheat flour, butter, milk, yeast, sugar, egg.","Пшеничная мука, сливочное масло, молоко, дрожжи, сахар, яйцо."],8,[],{allergen_ids:['gluten','milk']}),
  dish('cheesecake','desserts',['ჩიზქეიქი','Cheesecake','Чизкейк'],["კრემოვანი ჩიზქეიქი ნაზი ვანილის არომატითა და ორცხობილის ფუძით.","Silky baked cheesecake with a gentle vanilla note and a buttery biscuit crust.","Нежный запечённый чизкейк с ванильными нотами и рассыпчатой основой из печенья."],["კრემ-ყველი, კვერცხი, ნაღები, შაქარი, ვანილი, ხორბლის ორცხობილა.","Cream cheese, eggs, cream, sugar, vanilla, wheat biscuits.","Сливочный сыр, яйца, сливки, сахар, ваниль, пшеничное печенье."],16,[],{allergen_ids:['milk','eggs','gluten']}),
  dish('brownie','desserts',['ბრაუნი','Brownie','Брауни'],["მუქი შოკოლადის მდიდარი გემო, ნაზი შუაგული და ხრაშუნა ზედაპირი.","Rich dark chocolate brownie with a fudgy center, delicate crust and deep cocoa aroma.","Плотный шоколадный брауни с влажной серединкой, тонкой корочкой и насыщенным ароматом какао."],["მუქი შოკოლადი, კაკაო, ხორბლის ფქვილი, კარაქი, კვერცხი, შაქარი.","Dark chocolate, cocoa, wheat flour, butter, eggs, sugar.","Тёмный шоколад, какао, пшеничная мука, сливочное масло, яйца, сахар."],14,[],{allergen_ids:['milk','eggs','gluten'],availability:'sold_out'})
];
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
  return visibleDishes(m).filter(d=>d.translations.name[lang].toLocaleLowerCase().includes(q));
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
   if(new Set(d.price_options.map(o=>o.id)).size!==d.price_options.length)errors.push(`${d.id}: duplicate price option ID`);
   if(d.price_options.length && d.price_options.filter(o=>o.is_default).length!==1) errors.push(`${d.id}: expected one default option`);
   for(const l of m.settings.supported_languages){
     if(!d.translations.name[l]?.trim())errors.push(`${d.id}: missing name ${l}`);
     for(const field of ['description','ingredients'] as const)if(Object.values(d.translations[field]).some(x=>x?.trim())&&!d.translations[field][l]?.trim())errors.push(`${d.id}: missing ${field} ${l}`);
     for(const o of d.price_options)if(!o.label_translations[l]?.trim())errors.push(`${d.id}: missing option label ${l}`);
   }
   for(const id of d.allergen_ids)if(!m.allergens.some(a=>a.id===id))errors.push(`${d.id}: unknown allergen ${id}`);
 }
 return errors;
}