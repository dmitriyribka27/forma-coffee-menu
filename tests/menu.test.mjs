import assert from 'node:assert/strict';
import test from 'node:test';
import { menu, visibleDishes, searchDishes, categoryDishes, minPrice, validateMenu } from '../src/data.ts';

test('all 15 demonstration dishes and 4 categories are visible', () => {
 assert.equal(visibleDishes(menu).length, 15);
 assert.equal(menu.categories.length, 4);
 assert.deepEqual(menu.categories.map(c=>categoryDishes(menu,c.id).length),[5,4,3,3]);
});
test('every required label has all three translations', () => {
 assert.deepEqual(menu.settings.supported_languages,['ka','en','ru']);
 assert.deepEqual(validateMenu(menu),[]);
});
test('search uses active language and excludes unrelated positions', () => {
 assert.equal(searchDishes(menu,'en','latte').length,2);
 assert.equal(searchDishes(menu,'ru','латте').length,2);
 assert.equal(searchDishes(menu,'ka','ლატე').length,2);
 assert.equal(searchDishes(menu,'en','zzzz-unfindable').length,0);
});
test('hidden dishes are excluded from public menu and search', () => {
 const copy=structuredClone(menu);
 copy.dishes[0].is_visible=false;
 assert.equal(visibleDishes(copy).length,14);
 assert.equal(searchDishes(copy,'en','espresso').some(d=>d.id==='espresso'),false);
});
test('variant prices are represented in minor currency units', () => {
 const cappuccino=menu.dishes.find(d=>d.id==='cappuccino');
 assert.ok(cappuccino);
 assert.equal(cappuccino.base_price_minor,null);
 assert.equal(minPrice(cappuccino),900);
 assert.equal(cappuccino.price_options.length,2);
});
test('sold-out dishes remain visible and informational',()=>{
 const brownie=visibleDishes(menu).find(d=>d.id==='brownie');
 assert.equal(brownie?.availability,'sold_out');
});
test('validator catches conflicting price models',()=>{
 const copy=structuredClone(menu);
 copy.dishes[0].price_options=structuredClone(menu.dishes[1].price_options);
 assert.ok(validateMenu(copy).some(e=>e.includes('price model')));
});