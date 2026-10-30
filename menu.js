/* =========================================================================
   SPEISEKARTE – Express Café & Bar, Holiday Inn Express Düsseldorf Airport
   -------------------------------------------------------------------------
   Abgetippt von der gedruckten Karte "Food & Drink DUS, Oktober 2026".
   Ändern sich Preise oder Artikel, wird NUR diese Datei bearbeitet.

   AUFBAU EINER KATEGORIE:
     id    = fester Anker für die Sprungnavigation (nicht übersetzen!)
     part  = "drinks" oder "food" – steuert nur die Gruppierung oben
     items = Liste der Artikel
     sub   = optionale Zwischenüberschrift vor einem Artikel

   AUFBAU EINES ARTIKELS:
     n   = Name, bleibt in allen Sprachen wie auf der gedruckten Karte
     s   = Größenangabe. Entweder wörtlich ("0,25 l") oder als Schlüssel
           mit @ davor ("@cup"), der je Sprache übersetzt wird.
     p   = Preis, wenn es nur einen gibt
     v   = mehrere Preisvarianten [{ l: Bezeichnung, p: Preis }]
     d   = Beschreibung je Sprache { de: "...", en: "...", ... }
     tag = "v" (vegetarisch) oder "ve" (vegan)
   ========================================================================= */

const MENU = [

  /* ============================== GETRÄNKE ============================== */

  { id: "water", part: "drinks", items: [
    { n: "Mineralwasser Medium", s: "0,25 l", p: "3,30" },
    { n: "Mineralwasser Medium", s: "0,75 l", p: "6,80" },
    { n: "Mineralwasser Still",  s: "0,25 l", p: "3,30" },
    { n: "Mineralwasser Still",  s: "0,75 l", p: "6,80" }
  ]},

  { id: "softdrinks", part: "drinks", items: [
    { n: "Coca-Cola",      s: "0,2 l",  p: "3,70" },
    { n: "Coca-Cola Zero", s: "0,2 l",  p: "3,70" },
    { n: "Fanta",          s: "0,2 l",  p: "3,70" },
    { n: "Sprite",         s: "0,2 l",  p: "3,70" },
    { n: "Red Bull",       s: "0,25 l", p: "5,50" }
  ]},

  { id: "juices", part: "drinks", items: [
    { n: "Apfelsaft",   s: "0,2 l", p: "2,90" },
    { n: "Orangensaft", s: "0,2 l", p: "2,90" },
    { n: "Saftschorle", s: "0,2 l", p: "2,90" },
    { n: "Saftschorle", s: "0,4 l", p: "4,90" }
  ]},

  { id: "hot", part: "drinks", items: [
    { n: "Kaffee",             s: "@cup",   p: "3,30" },
    { n: "Milchkaffee",        s: "@cup",   p: "4,50" },
    { n: "Latte Macchiato",    s: "@cup",   p: "4,80" },
    { n: "Espresso",           s: "@cup",   p: "2,20" },
    { n: "Doppelter Espresso", s: "@cup",   p: "3,00" },
    { n: "Cappuccino",         s: "@cup",   p: "4,50" },
    { n: "Tee-Auswahl",        s: "@glass", p: "3,30" }
  ]},

  { id: "beer", part: "drinks", items: [
    { n: "Radeberger", s: "0,3 l", p: "4,20", d: {
      de: "frisch gezapft vom Fass", en: "freshly tapped from the barrel",
      fr: "pression, fraîchement tirée", es: "de barril, recién tirada",
      it: "alla spina, appena spillata", tr: "fıçıdan taze",
      zh: "新鲜扎啤", ar: "طازجة من البرميل" } },
    { n: "Radeberger", s: "0,5 l", p: "6,00", d: {
      de: "frisch gezapft vom Fass", en: "freshly tapped from the barrel",
      fr: "pression, fraîchement tirée", es: "de barril, recién tirada",
      it: "alla spina, appena spillata", tr: "fıçıdan taze",
      zh: "新鲜扎啤", ar: "طازجة من البرميل" } },
    { n: "Paulaner Hefeweizen",  s: "0,5 l",  p: "6,00" },
    { n: "Paulaner Alkoholfrei", s: "0,5 l",  p: "6,00" },
    { n: "Schlösser Altbier", s: "0,25 l", p: "3,50" , d: {
      de: "frisch gezapft vom Fass", en: "freshly tapped from the barrel",
      fr: "pression, fraîchement tirée", es: "de barril, recién tirada",
      it: "alla spina, appena spillata", tr: "fıçıdan taze",
      zh: "新鲜扎啤", ar: "طازجة من البرميل" } },
    { n: "Schlösser Altbier", s: "0,4 l",  p: "4,90" , d: {
      de: "frisch gezapft vom Fass", en: "freshly tapped from the barrel",
      fr: "pression, fraîchement tirée", es: "de barril, recién tirada",
      it: "alla spina, appena spillata", tr: "fıçıdan taze",
      zh: "新鲜扎啤", ar: "طازجة من البرميل" }}
  ]},

  { id: "wine", part: "drinks", items: [
    { sub: "white", n: "Grauburgunder", d: {
        de: "Deutschland", en: "Germany", fr: "Allemagne", es: "Alemania",
        it: "Germania", tr: "Almanya", zh: "德国", ar: "ألمانيا" },
      v: [{ l: "0,2 l", p: "8,40" }, { l: "@bottle", p: "27,00" }] },
    { n: "Riesling", d: {
        de: "Deutschland", en: "Germany", fr: "Allemagne", es: "Alemania",
        it: "Germania", tr: "Almanya", zh: "德国", ar: "ألمانيا" },
      v: [{ l: "0,2 l", p: "7,90" }, { l: "@bottle", p: "24,00" }] },
    { n: "Sauvignon Blanc", d: {
        de: "Deutschland", en: "Germany", fr: "Allemagne", es: "Alemania",
        it: "Germania", tr: "Almanya", zh: "德国", ar: "ألمانيا" },
      v: [{ l: "0,2 l", p: "9,90" }, { l: "@bottle", p: "30,00" }] },

    { sub: "red", n: "Cuvée", d: {
        de: "Deutschland", en: "Germany", fr: "Allemagne", es: "Alemania",
        it: "Germania", tr: "Almanya", zh: "德国", ar: "ألمانيا" },
      v: [{ l: "0,2 l", p: "8,40" }, { l: "@bottle", p: "27,00" }] },
    { n: "Rioja", d: {
        de: "Spanien", en: "Spain", fr: "Espagne", es: "España",
        it: "Spagna", tr: "İspanya", zh: "西班牙", ar: "إسبانيا" },
      v: [{ l: "0,2 l", p: "9,90" }, { l: "@bottle", p: "30,00" }] },
    { n: "Cuvée", d: {
        de: "Frankreich", en: "France", fr: "France", es: "Francia",
        it: "Francia", tr: "Fransa", zh: "法国", ar: "فرنسا" },
      v: [{ l: "0,2 l", p: "9,90" }, { l: "@bottle", p: "30,00" }] }
  ]},

  { id: "prosecco", part: "drinks", items: [
    { n: "Scavi & Ray", v: [{ l: "@piccolo", p: "9,50" }, { l: "@bottle", p: "35,00" }] }
  ]},

  { id: "cocktails", part: "drinks", items: [
    { n: "Aperol Spritz", p: "8,90", d: {
      de: "Prosecco mit Aperol, Orangen und Soda", en: "Prosecco with Aperol, orange and soda",
      fr: "Prosecco avec Aperol, orange et soda", es: "Prosecco con Aperol, naranja y soda",
      it: "Prosecco con Aperol, arancia e soda", tr: "Prosecco, Aperol, portakal ve soda",
      zh: "普罗塞克配 Aperol、香橙与苏打水", ar: "بروسيكو مع أبيرول وبرتقال وصودا" } },
    { n: "Hugo", p: "8,90", d: {
      de: "Prosecco mit Holundersirup, Minze, Limette, Soda", en: "Prosecco with elderberry syrup, mint, lime, soda",
      fr: "Prosecco avec sirop de sureau, menthe, citron vert, soda", es: "Prosecco con sirope de saúco, menta, lima y soda",
      it: "Prosecco con sciroppo di sambuco, menta, lime e soda", tr: "Prosecco, mürver şurubu, nane, misket limonu ve soda",
      zh: "普罗塞克配接骨木糖浆、薄荷、青柠与苏打水", ar: "بروسيكو مع شراب البلسان والنعناع والليمون والصودا" } },
    { n: "Wildberry Lillet", p: "8,90", d: {
      de: "Lillet Blanc, Limonade, Eiswürfel", en: "Lillet Blanc with lemonade and ice cubes",
      fr: "Lillet Blanc, limonade, glaçons", es: "Lillet Blanc, limonada y hielo",
      it: "Lillet Blanc, limonata e ghiaccio", tr: "Lillet Blanc, limonata ve buz",
      zh: "Lillet Blanc 配柠檬汽水与冰块", ar: "ليليه بلان مع الليموناضة ومكعبات الثلج" } }
  ]},

  { id: "spirits", part: "drinks", items: [
    { sub: "whisky", n: "Johnnie Walker Red Label",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { sub: "gin", n: "Bombay Sapphire",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { sub: "vodka", n: "Absolut",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { sub: "rum", n: "Bacardi",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { n: "Havana Club",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { sub: "herbal", n: "Jägermeister",
      v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }, { l: "@longdrink", p: "9,80" }] },
    { n: "Ramazzotti", v: [{ l: "2 cl", p: "4,50" }, { l: "4 cl", p: "7,00" }] },
    { n: "Averna",     v: [{ l: "2 cl", p: "4,50" }, { l: "4 cl", p: "7,00" }] },
    { sub: "liqueur", n: "Sambuca Molinari", v: [{ l: "2 cl", p: "5,50" }, { l: "4 cl", p: "8,90" }] },
    { n: "Baileys", v: [{ l: "2 cl", p: "4,50" }, { l: "4 cl", p: "7,00" }] }
  ], foot: "redbull" },

  /* =============================== SPEISEN ============================== */

  { id: "italian", part: "food", items: [
    { n: "Spaghetti Pomodoro e Basilico", p: "10,90", d: {
      de: "Spaghetti mit Tomate und Basilikum", en: "Spaghetti with tomato and basil",
      fr: "Spaghettis à la tomate et au basilic", es: "Espaguetis con tomate y albahaca",
      it: "Spaghetti al pomodoro e basilico", tr: "Domates ve fesleğenli spagetti",
      zh: "番茄罗勒意面", ar: "سباغيتي بالطماطم والريحان" } },
    { n: "Gnocchi al Ragù", p: "12,90", d: {
      de: "Gnocchi mit herzhaftem Fleisch-Ragù", en: "Gnocchi with a hearty meat ragù",
      fr: "Gnocchis au ragoût de viande", es: "Ñoquis con sabroso ragú de carne",
      it: "Gnocchi con sostanzioso ragù di carne", tr: "Etli ragulu gnocchi",
      zh: "肉酱意式团子", ar: "نيوكي مع راغو اللحم" } },
    { n: "Tortellini Panna e Prosciutto", p: "12,90", d: {
      de: "Gefüllte Tortellini mit Sahne und Schinken", en: "Filled tortellini with cream and ham",
      fr: "Tortellinis farcis à la crème et au jambon", es: "Tortellini rellenos con nata y jamón",
      it: "Tortellini ripieni con panna e prosciutto", tr: "Kremalı ve jambonlu tortellini",
      zh: "奶油火腿馄饨面", ar: "تورتيليني محشوة بالكريمة والهام" } },
    { n: "Lasagne Emiliane", p: "14,50", d: {
      de: "Klassisch geschichtete Lasagne", en: "Classically layered lasagna",
      fr: "Lasagnes classiques", es: "Lasaña clásica por capas",
      it: "Lasagne classiche a strati", tr: "Klasik kat kat lazanya",
      zh: "经典千层面", ar: "لازانيا كلاسيكية بطبقات" } },
    { n: "Tiramisu al Bicchiere", p: "5,50", d: {
      de: "Tiramisu im Glas", en: "Tiramisu in a jar",
      fr: "Tiramisu en verrine", es: "Tiramisú en vaso",
      it: "Tiramisù al bicchiere", tr: "Bardakta tiramisu",
      zh: "杯装提拉米苏", ar: "تيراميسو في كوب" } }
  ], offer: true },

  { id: "pizza", part: "food", note: "pizzaNote", items: [
    { n: "Salami", p: "12,00", d: {
      de: "mit herzhafter Salami und feinem Mozzarella-Käse", en: "with salami and fine mozzarella cheese",
      fr: "avec salami et mozzarella", es: "con salami y mozzarella",
      it: "con salame e mozzarella", tr: "salam ve mozzarella ile",
      zh: "萨拉米配马苏里拉芝士", ar: "مع السلامي وجبن الموزاريلا" } },
    { n: "Schinken | Ham", p: "12,00", d: {
      de: "mit italienischem prosciutto cotto und Mozzarella-Käse", en: "with Italian ham and mozzarella cheese",
      fr: "avec jambon italien et mozzarella", es: "con jamón italiano y mozzarella",
      it: "con prosciutto cotto e mozzarella", tr: "İtalyan jambonu ve mozzarella ile",
      zh: "意式火腿配马苏里拉芝士", ar: "مع الهام الإيطالي وجبن الموزاريلا" } },
    { n: "Thunfisch mit roten Zwiebeln", p: "12,00", d: {
      de: "mit Thunfisch-Zwiebel-Belag und feinem Mozzarella-Käse", en: "with tuna-onion topping and fine mozzarella cheese",
      fr: "au thon, oignons rouges et mozzarella", es: "con atún, cebolla roja y mozzarella",
      it: "con tonno, cipolla rossa e mozzarella", tr: "ton balığı, kırmızı soğan ve mozzarella ile",
      zh: "金枪鱼红洋葱配马苏里拉芝士", ar: "مع التونة والبصل الأحمر وجبن الموزاريلا" } },
    { n: "Margherita", p: "10,50", tag: "v", d: {
      de: "mit würziger Tomatensoße und feinem Mozzarella-Käse", en: "with spicy tomato sauce and fine mozzarella cheese",
      fr: "sauce tomate relevée et mozzarella", es: "con salsa de tomate especiada y mozzarella",
      it: "con salsa di pomodoro saporita e mozzarella", tr: "baharatlı domates sosu ve mozzarella ile",
      zh: "香浓番茄酱配马苏里拉芝士", ar: "مع صلصة الطماطم المتبلة وجبن الموزاريلا" } },
    { n: "Chicken Kebab Pizza", p: "12,00", d: {
      de: "mit herzhaft gewürzten Hähnchenstreifen und cremigem Mozzarella", en: "with sliced chicken and creamy mozzarella",
      fr: "émincé de poulet épicé et mozzarella crémeuse", es: "con tiras de pollo especiado y mozzarella cremosa",
      it: "con straccetti di pollo speziato e mozzarella", tr: "baharatlı tavuk ve kremsi mozzarella ile",
      zh: "香料鸡肉配浓郁马苏里拉芝士", ar: "مع شرائح الدجاج المتبلة وجبن الموزاريلا" } },
    { n: "Beef Burger Pizza", p: "12,00", d: {
      de: "mit Hackfleisch, Cheddar und Barbecue-Sauce", en: "with minced meat, cheddar cheese and barbecue sauce",
      fr: "viande hachée, cheddar et sauce barbecue", es: "con carne picada, cheddar y salsa barbacoa",
      it: "con carne macinata, cheddar e salsa barbecue", tr: "kıyma, cheddar ve barbekü sos ile",
      zh: "牛肉末配切达芝士与烧烤酱", ar: "مع اللحم المفروم وجبن الشيدر وصلصة الباربكيو" } }
  ]},

  { id: "flammkuchen", part: "food", items: [
    { n: "„Elsässer Art“", p: "10,50", d: {
      de: "mit Speck und Zwiebeln", en: "with bacon and onions",
      fr: "au lard et aux oignons", es: "con bacon y cebolla",
      it: "con pancetta e cipolle", tr: "jambon ve soğan ile",
      zh: "培根洋葱风味", ar: "مع لحم مقدد وبصل" } }
  ]},

  { id: "snacks", part: "food", items: [
    { n: "Currywurst", p: "7,50", d: {
      de: "mit Brötchen", en: "with bread roll", fr: "avec petit pain",
      es: "con panecillo", it: "con panino", tr: "ekmek ile",
      zh: "配小面包", ar: "مع خبز" } },
    { n: "Tomatensuppe", p: "6,00", tag: "v", d: {
      de: "mit Brötchen", en: "with bread roll", fr: "avec petit pain",
      es: "con panecillo", it: "con panino", tr: "ekmek ile",
      zh: "配小面包", ar: "مع خبز" } }
  ]},

  { id: "icecream", part: "food", items: [
    { n: "Ben & Jerry's Strawberry Cheesecake", p: "5,50", tag: "v" },
    { n: "Ben & Jerry's Chocolate Brownie",     p: "5,50", tag: "v" }
  ]}
];
