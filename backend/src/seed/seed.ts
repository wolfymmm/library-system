import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Author from '../models/Author.js';
import Book from '../models/Book.js';
import Library from '../models/Library.js';
import Order from '../models/Order.js';

const seedDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Підключено до MongoDB Atlas...');

    await Promise.all([
      User.deleteMany({}),
      Author.deleteMany({}),
      Book.deleteMany({}),
      Library.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('Старі дані видалено.');

    const libraries = await Library.insertMany([
      {
        name: 'Літачок',
        address: 'вул. Знань, 4',
        city: 'Львів,',
        phone: '+380442048513',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Сб: 09:00-20:00'
      },
      {
        name: 'Слово',
        address: 'вул. Антоновича, 50',
        city: 'Київ',
        phone: '+380447898513',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Пт: 08:30-19:00'
      },
      {
        name: 'Поза часом',
        address: 'вул. Соборна, 40',
        city: 'Фастів',
        phone: '+380442046398',
        image: 'https://lh3.googleusercontent.com/gg/AMW1TPrdgXmOFGqEwTb6NH2FX7fbgfqrBCtHONoA35W94cQOF9jk5F7EpctvxyfocA8ZPGApwQSH2rGEBamXh_U35C8_BD6UxJJ0j6FoEdViT4gYSGZSEwwvH_19DaUWkAxDXHU3HphtQenz-c-0QGatTKMAUvvOPfa6CQ-76jAAxtAStzP2cRC_9U3Z9NfHCOt7CDGqAURAiTz0v6MZZav_7p0hsft_2AWy57odaeoGqc8dJDL3ZdkdTRz-mO8YbbxGaZed1cD0cwtvhZMKhrSs07ZZ85k1t5AQjw5kZOUIUG-CGqOx7PMNkRB662dm9zMdqc-2nYkFTH9Fwp9OZ-7LLlP4=s1600',
        workingHours: 'Пн-Пт: 08:30-19:00'
      }
    ]);

    const authors = await Author.insertMany([
      {
        name: 'Хлої Волш',
        bio: 'Відома ірландська письменниця, що спеціалізується на емоційних любовних романах, зокрема в жанрі young adult та сучасної прози.',
        country: 'Ірландія',
        birthDate: new Date('1903-06-25'),
        image: 'https://images.example.com/orwell.jpg'
      },
      {
        name: 'Тесс Ґеррітсен',
        bio: 'Відома американська письменниця, авторка бестселерів у жанрах медичного трилера та романтичного саспенсу. Її книги перекладені 40 мовами, а загальний наклад перевищує 30 мільйонів примірників.',
        country: 'США',
        birthDate: new Date('1953-06-12'),
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Tess_Gerritsen_%282009%29.jpg/500px-Tess_Gerritsen_%282009%29.jpg'
      },
         {
        name: 'Джейсон Рекулак',
        bio: 'Американський письменник та видавець, відомий психологічними трилерами з елементами містики, зокрема світовим бестселером «Приховані малюнки».',
        country: 'США',
        birthDate: new Date('1953-06-12'),
        image: 'https://knigogo.top/wp-content/uploads/2023/03/Jason-Rekulak-237x284.jpg'
      },
         {
        name: 'Ана Хван',
        bio: 'Сучасна американська письменниця китайсько-американського походження, яка створює емоційно насичені романи в жанрі романтики та New Adult.',
        country: 'США',
        birthDate: new Date('1991-03-07'),
        image: 'https://ksd.ua/storage/authors/photos/medium/QUm4Of4UNEiiuR62M4wzpTXEHBX3u5qVgGnSPdJo.jpg.webp?v=1755896169'
      },
         {
        name: 'Гері Бравер',
        bio: 'Він є професором англійської мови в Північно-Східному університеті в Бостоні, де викладає курси з наукової фантастики, фільмів жахів та сучасної літератури.',
        country: 'США',
        birthDate: new Date('1942-08-20'),
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXxDQG5SJEvEkLYWS8sNAPmIRYV3YYUmxVrkdr0yZq9Ge85iIPW5BLuhMZpMqp5RIR9PuCocPQ0u9V2Q9SXGnSjz3WqfcvQ1ThCoxC3KjOfQ&s=10'
      },
         {
        name: 'Ліз Томфорд',
        bio: 'Популярна завдяки спортивним любовним романам, зокрема серії «Місто вітрів».',
        country: 'США',
        birthDate: new Date('1990-03-13'),
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQezAaC-9llBl4P4hsF5_NrPJzR-q0ERrm_6A&s'
      },
         {
        name: 'М. Л. Стедман',
        bio: 'Австралійська письменниця та юристка.',
        country: 'Австралія',
        birthDate: new Date('1953-06-12'),
        image: 'https://cdn.litres.ru/pub/authors/100/03/21/36/03213601.jpg'
      },
         {
        name: 'Саймон Бекетт',
        bio: 'Популярний британський письменник, автор детективів і трилерів.',
        country: 'Велика Британія',
        birthDate: new Date('1960-04-20'),
        image: 'https://knigogo.top/wp-content/uploads/2023/01/Simon-Beckett-237x284.jpg'
      },
            {
        name: 'Стівен Кінг',
        bio: 'Культовий американський письменник, відомий як «Король жаху»',
        country: 'США',
        birthDate: new Date('1947-09-21'),
        image: 'https://laboratory.ua/files/authors_resized/stiven-king.350x350.jpg.webp'
      }
    ]);

    const books = await Book.insertMany([
      {
        title: 'Захопити Тринадцятого. Книга 1',
        author: authors[0]!._id, 
        isbn: '978-617-15-1536-9',
        pages: 1008,
        writingYear: 2018,
        releaseYear: 2025,
        description: 'Вони абсолютні протилежності, але коли їхні два світи зіткнуться, ніщо вже не буде таким, як раніше. У Джонні Кавана все йде на його користь. На регбійному полі він сила, з якою потрібно рахуватися. Налаштований на славу, він прямує прямо до вершини. Ніщо не може стати на його шляху, чи не так? Навіть соромязлива нова дівчина з коледжу Томмен. Та, що з сумними очима та прихованими синцями. Та, що відволікає його, як ніхто інший. Життя ніколи не було легким для Шеннон Лінч. Знущання та тортури, вона прибуває до коледжу Томмен посеред навчального року, молячись про новий початок і відчайдушно намагаючись позбутися демонів, які її переслідують. У свій перший день у престижній приватній школі вона стикається з горезвісним Джонні Кавана. Шеннон знову опиняється мішенню для знущань, коли вона утворює крихкий союз із висхідною зіркою регбі. Потрапивши у складну дружбу та борючись із безперечною хімією між собою, Джонні та Шеннон ніколи не могли передбачити перешкоди, які загрожуватимуть їхнім стосункам...',
        category: 'Романтична проза',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/HlH1fUVyyZfhuEj7W4DiFV452I575DJtWin82UhA.png.webp?v=1755526205',
        stock: new Map([
          ['Літачок', 5],
          ['Слово', 2],
          ['Поза часом', 4]
        ])
      },
      {
        title: 'Підтримка життя',
        author: authors[1]!._id,
        isbn: '978-617-15-1806-3',
        pages: 416,
        writingYear: 1997,
        releaseYear: 2026,
        description: 'Тобі Гарпер, лікарка відділення швидкої допомоги, стикається з дивним випадком. У її зміну до лікарні потрапляє літній дезорієнтований чоловік із симптомами, що вказують на імовірне ураження мозку. За даними його медичної картки, а також за свідченнями родини, Гаррі був абсолютно здоровим і сповненим сил. Після обстеження пацієнт безслідно зникає просто з палати. Намагаючись розібратися, куди зник Гаррі і що саме могло спричинити його стан, Тобі стикається з подібними симптомами в іншого пацієнта. Поступово лікарка усвідомлює: рідкісна хвороба не може передаватись у природний спосіб. І той, хто стоїть за її поширенням, майстерно замітає сліди…',
        category: 'Трилери та жахи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/xhagpPYmqQCKk23DpDCv35Xxh9MbchqQV9jxJKVe.png.webp?v=1768899476',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Остання гостя на весіллі',
        author: authors[2]!._id,
        isbn: '978-617-15-1801-8',
        pages: 384,
        writingYear: 2024,
        releaseYear: 2026,
        description: 'Френк Шатовскі - ветеран війни в Перській затоці й водій сервісу доставки онлайн-замовлень. Він уже три роки не спілкувався зі своєю донькою Меґґі. Тож коли несподівано отримує запрошення на її весілля, хапається за можливість виправити ситуацію. Меґґі знайомить батька зі своїм нареченим, Ейданом Ґарднером, - сином впливового мільярдера і відлюдькуватим художником, що спеціалізується на моторошних портретах. Під час весільних урочистостей Френк вирішує дізнатися більше про родину Ґарднерів і помічає чимало дивного. Близькість Ейдана з учителем мистецтв, поведінка його матері, чутки про сімейну таємницю. Подейкують, що Ейдан міг бути причетний до зникнення 21-річної дівчини. Чи навіть до чогось більш жаского.',
        category: 'Трилери та жахи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/rdbYGdYOFGG2J9JToGxK3iSzWrgsZyszoee0RP0Q.png.webp?v=1770196185',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Вберегти Тринадцятого. Книга 2',
        author: authors[0]!._id,
        isbn: '978-617-15-1799-8',
        pages: 1104,
        writingYear: 1997,
        releaseYear: 2026,
        description: 'Життя шкільної зірки регбі Джонні Кавани перевернулося двічі. Уперше - коли травма вивела його з гри. І вдруге - коли він зустрів її, Шеннон Лінч. Її життя сповнене таємниць, а душа пошрамована й зневірена. Те, що сталося в Дубліні, зламало Шеннон. Але Джонні готовий витягнути її з тіні, в якій дівчина прагне сховатися. Вони обоє - зранені й потребують підтримки та тепла одне одного. Однак таємниці, про які Шеннон так хотіла забути, невдовзі розкриються. Зауважте, що ця книжка містить елементи, які можуть підійти не всім читачам. Через сексуальні сцени, сцени насильства, дорослі теми, тригери та ненормативну лексику книга призначена для читачів віком від 18 років. ',
        category: 'Романтична проза',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/WCPGcVjgT7M9KEGMBd3W5pyp85F80W6RUHNJ0agN.png.webp?v=1770980581',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Хірург. Книга 1',
        author: authors[1]!._id,
        isbn: '978-617-12-1462-0',
        pages: 416,
        writingYear: 1997,
        releaseYear: 2016,
        description: 'Він приходить лише уночі. Безшумно проникає у дім. Крадеться до спальні, де тільки но прокинувшись від сну, самотні жінки потрапляють до приголомшливого кошмару. Зважаючи на те, що він робить зі своїми жертвами, можна припустити, що злодій знається на медицині. Саме через це його називають Хірург. Томас Мур та Джейн Ріццолі розслідують серію страшенних вбивств. Злочинець наслідує почерк серійного маніяка, якого було вбито два роки тому. Він копією навіть такі дрібні деталі, про які мало кому відомо. Остання з жертв загиблого маніяка Кетрін Корделл, вбила його, та саме через це стає метою нового вбивці. З кожною наступною жертвою невідомий наближається до Кетрін. Саме Томасу та Джейн доведеться зупинити геніального вбивцю, чого б це не коштувало.',
        category: 'Трилери та жахи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/uccpgCmCwl5ht7MugqeZb81WlwNXQnf4UFpPIgJA.jpg.webp?v=1733325880',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Король гніву. Книга 1',
        author: authors[3]!._id,
        isbn: '9786171713963',
        pages: 496,
        writingYear: 1997,
        releaseYear: 2026,
        description: 'Данте Руссо любить контролювати все в особистому й професійному житті. Один із найбагатших чоловіків Нью-Йорка, зарозумілий генеральний директор великої корпорації, він ніколи не планував одружуватися. Але шантаж змусив його погодитися на заручини з ледь знайомою Вів’єн Лау — ідеальною в усіх сенсах спадкоємицею ювелірного бізнесу, дочкою його нового ворога. Байдуже, яка вона елегантна, амбітна й вишукана. Данте Руссо зробить усе, щоб знищити компрометувальні фотографії і розірвати заручини. Якщо не закохається…',
        category: 'Романтична проза',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/al4x243Xyju7ktgOklDUF5BRc8s3HbbfE7sxOnAv.jpg.webp?v=1765979484',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Клуб Мефісто',
        author: authors[1]!._id,
        isbn: '978-617-12-8840-9',
        pages: 384,
        writingYear: 1997,
        releaseYear: 2021,
        description: 'Це Різдво мало стати дивом. А перетворилося на кошмар. На очах Джейн Ріццолі руйнується багаторічний шлюб її батьків, а подруга Мора зізнається у гріховних стосунках зі священником. Одне за одним відбуваються моторошні вбивства, схожі на ритуальні жертвоприношення. Шокована детектив Ріццолі починає свою звичну роботу: пошук убивці. Розслідування виводить Джейн на таємничий фонд «Мефісто», члени якого переконані: ці вбивства — справа рук демона, що ходить поміж людей. Що в їхніх словах правда, а що — вигадка? Що приховує директор фонду, Ентоні Сансоне? І чи справді його організація прагне допомогти, чи лишень зводить поліцію на манівці? Запитань так багато. А тим часом убивця вже готовий завдати нового удару...',
        category: 'Трилери та жахи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/n6ygNAW8RWaxA5u8TQnkTZI7YuZWSFrNw72cgOrr.jpg.webp?v=1733323713',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Вище неба. Місто вітрів. Книга 1',
        author: authors[5]!._id,
        isbn: '978-617-15-1207-8',
        pages: 640,
        writingYear: 1997,
        releaseYear: 2024,
        description: 'Дебютна книга циклу «Місто вітрів» - «Вище неба», написана під час пандемії, стала TikTok-сенсацією. Вона відображає особистий досвід Ліз, адже головна героїня, як і сама авторка, працює бортпровідницею. Бортпровідниця Стіві починає працювати на приватному літаку хокейної команди із Чикаго, і відтоді її життя змінюється. Тут вона знайомиться з харизматичним Еваном Зандерсом, чий егоїзм та неабияка самовпевненість викликають роздратування. Проте з кожним новим польотом Стіві помічає, що під маскою зарозумілого поганця ховається щось зовсім інше. Колись вона зареклася мати романтичні стосунки зі спортсменами, однак дівчині щодалі важче опиратися своїм почуттям до Зандерса. Стіві опиняється на роздоріжжі між відданістю власним принципам і нездоланним потягом до харизматичного хокеїста.',
        category: 'Романтична проза',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/M7uzsSrKrgNO1WjWIMn2KAP2Xom2hLlhy0xeq1ba.jpg.webp?v=1733318639',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Асистент. Книга 2',
        author: authors[1]!._id,
        isbn: '978-617-12-3184-9',
        pages: 368,
        writingYear: 1997,
        releaseYear: 2017,
        description: 'Рік тому детективу Джейн Ріццолі вдалося вистежити злочинця на прізвисько Хірург, якого називали Джеком-Різником ХХI століття. Тоді Джейн дивом врятувалася від убивці і посадила його за грати. Та ось на вулицях з’явився новий злочинець. Він копіює почерк Хірурга як асистент повторює рухи досвідченого лікаря. А невдовзі і сам Хірург тікає з в’язниці. Тепер убивць двоє. Їхніми жертвами стають нові й нові жінки. І ось Дженн розуміє, що наступною жертвою має стати вона...',
        category: 'Трилери та жахи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/uowmRK3P8y8aGhciYC7Gvpf0IX7UFXCH8UwcuhKk.jpg.webp?v=1733325751',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Світло між двох океанів',
        author: authors[6]!._id,
        isbn: '978-617-15-1888-9',
        pages: 416,
        writingYear: 1997,
        releaseYear: 2026,
        description: 'По завершенні Першої світової війни молодий ветеран Том Шерборн влаштовується наглядачем маяка на західному узбережжі Австралії й разом із дружиною, Ізабель, оселяється на маленькому острові. Кохання могло б зцілити всі рани Тома, та доля безжальна - подружжя втратило двох дітей. Одного ранку до берега їхнього острова хвилі приносять шлюпку. Чоловік у шлюпці мертвий, та поруч із його тілом захлинається криком немовля. Переконана, що дитина осиротіла, Ізабель вмовляє Тома зробити, здавалося б, невинний вибір. Та його руйнівні наслідки тягнутимуться крізь роки й кілометри…',
        category: 'Сучасні автори',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/mFwzXWyRHwBWFIM6xFY8XTwnIhp7jGwV1XMkb8XN.png.webp?v=1771503723',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Хімія смерті. Перше розслідування',
        author: authors[7]!._id,
        isbn: '978-617-15-0899-6',
        pages: 384,
        writingYear: 2015,
        releaseYear: 2026,
        description: 'Судовий антрополог Девід Гантер утратив дружину і дочку. Покинувши роботу, він переїздить до містечка Менем та влаштовується на посаду терапевта. Ніхто з нових знайомих і гадки не має про минуле Девіда. Здається, його життя потихеньку повертається у спокійне русло. Поки місцеві хлопці не знаходять на болоті тіло вбитої жінки. Згодом зникає ще одна жінка, а за кілька днів знаходять і її понівечене тіло. Схоже, в Менемі з’явився серійний убивця. У містечку наростає тривога. Мешканці підозрюють одне одного у скоєному. Девід не може стояти осторонь та втягується в розслідування. До того ж остання зникла - нова знайома Девіда.',
        category: 'Детективи',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/cBaHFKFkdDwJ91pMHIBS78VbVbsackkcGwbWWFPW.jpg.webp?v=1733321969',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      },
       {
        title: 'Темрява, як ви любите',
        author: authors[8]!._id,
        isbn: '978-617-15-1788-2',
        pages: 736,
        writingYear: 1997,
        releaseYear: 2026,
        description: 'Двоє чоловіків здобувають дивовижні здібності внаслідок таємничої події, яку вони хочуть приховати та забути. Вдівець, що їде відпочити, але замість цього отримує несподівану спадщину із серйозними умовами (продовження подій роману "Куджо"). Мовчазний ветеран відгукується на оголошення про роботу і дізнається, що є куточки всесвіту, які краще залишити недослідженими. Адже вони настільки темні, що навіть сама темрява на їхньому тлі видається нестрашною…',
        category: 'Фентезі',
        image: 'https://ksd.ua/storage/products/gallery/medium_x2/4gqfgku5zgPb5ZLu3zBgNqxviOsVWVxj2G3IQdJ2.png.webp?v=1768899570',
        stock: new Map([
          ['Літачок', 3],
          ['Слово', 4],
          ['Поза часом', 1]
        ])
      }
    ]);

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const users = await User.insertMany([
      {
        name: 'Yana',
        email: 'yana@admin.com',
        password: adminPassword,
        phone: '+380951112233',
        address: 'Київ, вул. Політехнічна, 5',
        birthDate: new Date('2004-05-20'),
        role: 'admin',
        orders: []
      },
      {
        name: 'Олексій',
        email: 'oleksii@reader.com',
        password: userPassword,
        phone: '+380674445566',
        address: 'Київ, вул. Саксаганського, 12',
        birthDate: new Date('1998-11-10'),
        role: 'reader',
        orders: []
      }
    ]);

    const orders = await Order.insertMany([
      {
        userId: users[1]!._id, 
        bookId: books[0]!._id, 
        delivery: {
          method: 'library_pickup',
          libraryName: 'Науково-технічна бібліотека КПІ',
        },
        status: 'pending',
        orderDate: new Date(),
        returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ]);

    if (users[1] && orders[0]) {
      await User.findByIdAndUpdate(users[1]._id, {
        $push: { orders: orders[0]._id }
      });
    }

    console.log('✅ База даних успішно заповнена!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Помилка заповнення:', err);
    process.exit(1);
  }
};

seedDB();