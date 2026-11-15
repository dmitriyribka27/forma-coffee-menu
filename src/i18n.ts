import type { Language, Translated } from './types';
export const languages: Array<{ code: Language; flag: string; native: string }> = [
  { code: 'ka', flag: '🇬🇪', native: 'ქართული' },
  { code: 'en', flag: '🇬🇧', native: 'English' },
  { code: 'ru', flag: '🇷🇺', native: 'Русский' }
];
export const ui = {
  chooseLanguage: { ka: 'აირჩიეთ ენა', en: 'Choose your language', ru: 'Выберите язык' },
  viewMenu: { ka: 'მენიუს ნახვა', en: 'View menu', ru: 'Открыть меню' },
  welcome: { ka: 'კეთილი იყოს თქვენი მობრძანება', en: 'Welcome in', ru: 'Добро пожаловать' },
  menu: { ka: 'მენიუ', en: 'Menu', ru: 'Меню' },
  menuLabel: { ka: 'ჩვენი მენიუ', en: 'Our menu', ru: 'Наше меню' },
  menuSubtitle: { ka: 'ყავა, საუზმე და მცირე სიამოვნებები.', en: 'Good coffee and little everyday pleasures.', ru: 'Хороший кофе и маленькие ежедневные радости.' },
  browse: { ka: 'დაათვალიერეთ', en: 'Explore', ru: 'Смотрите и выбирайте' },
  search: { ka: 'მოძებნეთ მენიუში', en: 'Search the menu', ru: 'Поиск по меню' },
  clear: { ka: 'გასუფთავება', en: 'Clear search', ru: 'Очистить поиск' },
  close: { ka: 'დახურვა', en: 'Close', ru: 'Закрыть' },
  openMenu: { ka: 'მენიუს გახსნა', en: 'Open menu', ru: 'Открыть меню' },
  categories: { ka: 'კატეგორიები', en: 'Categories', ru: 'Категории' },
  language: { ka: 'ენა', en: 'Language', ru: 'Язык' },
  allResults: { ka: 'ძიების შედეგები', en: 'Search results', ru: 'Результаты поиска' },
  noResults: { ka: 'ვერაფერი მოიძებნა', en: 'Nothing found', ru: 'Ничего не найдено' },
  tryDifferent: { ka: 'სცადეთ სხვა საძიებო სიტყვა.', en: 'Try another search term.', ru: 'Попробуйте другой запрос.' },
  from: { ka: 'დან', en: 'from', ru: 'от' },
  soldOut: { ka: 'ამოიწურა', en: 'Sold out', ru: 'Закончилось' },
  unavailable: { ka: 'მიუწვდომელია', en: 'Unavailable', ru: 'Недоступно' },
  ingredients: { ka: 'შემადგენლობა', en: 'Ingredients', ru: 'Состав' },
  allergens: { ka: 'ალერგენები', en: 'Allergens', ru: 'Аллергены' },
  options: { ka: 'ზომა', en: 'Size', ru: 'Размер' },
  price: { ka: 'ფასი', en: 'Price', ru: 'Цена' },
  demo: { ka: 'დემო პროექტი · რეალური კაფე არ არის', en: 'Demo concept · Not a real café', ru: 'Демонстрация · Не настоящая кофейня' },
  by: { ka: 'შექმნილია GAME APPS-ის მიერ', en: 'A GAME APPS concept', ru: 'Концепция GAME APPS' },
  back: { ka: 'უკან მენიუში', en: 'Back to menu', ru: 'Назад к меню' },
  photoComing: { ka: 'ფოტო მალე დაემატება', en: 'Photo coming soon', ru: 'Фото скоро появится' },
  loadError: { ka: 'მენიუ ვერ ჩაიტვირთა', en: 'Could not load the menu', ru: 'Не удалось загрузить меню' },
  retry: { ka: 'თავიდან ცდა', en: 'Try again', ru: 'Повторить' },
  disclaimer: { ka: 'ალერგენების ინფორმაცია საჩვენებელია.', en: 'Allergen information is illustrative.', ru: 'Информация об аллергенах демонстрационная.' }
} satisfies Record<string, Translated>;
export function t(key: keyof typeof ui, lang: Language): string { return ui[key][lang]; }