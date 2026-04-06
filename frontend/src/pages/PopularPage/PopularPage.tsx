import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../features/books/bookSlice";
import type { RootState, AppDispatch } from "../../app/store";
import BookCard from "../../components/BookCard/BookCard";
// 1. ПЕРЕВІРКА: Якщо в Breadcrumbs.tsx "export default", то лишаємо так. 
// Якщо просто "export const Breadcrumbs", то додайте фігурні дужки: { Breadcrumbs }
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs"; 
import './PopularPage.scss';

const CATEGORIES = ["Всі", "Сучасні автори", "Романтична проза", "Дарк романи", "Історична та пригодницька проза", "Детективи", "Трилери та жахи", "Фантастика", "Фентезі", "Класична література", "Комікси та манги"];

export default function PopularPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [activeCategory, setActiveCategory] = useState("Всі");
    const { items: books, status } = useSelector((state: RootState) => state.books);

    const pageTitle = activeCategory === "Всі" 
        ? "Популярне зараз" 
        : `${activeCategory}`;

    const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "Всі": "У цьому розділі ви зможете обрати та замовити найкращі романи про кохання, книжки сучасних авторів, історико-пригодницькі романи, детективи, фантастику та трилери, твори зарубіжних та вітчизняних класиків.",
    "Сучасні автори": "До вашої уваги книжки різних жанрів від відомих вітчизняних та світових авторів нашого сьогодення. Знайдуться захоплюючі бестселери на будь-який смак: фантастика, фентезі, детективи, романтика, трилери тощо. Знайомтеся з новими іменами письменників та новинками знаних митців, замовляйте книги зараз і насолоджуйтеся історією!",
    "Романтична проза": "Для вас — дивовижні історії кохання, від романтичних до найвідвертіших. Відомі автори та нові імена. Заборонені бажання, королівські таємниці, фатальна пристрасть, сімейні саги, захоплюючі любовні пригоди.",
    "Дарк романи": "Dark romance — це жанр для тих, хто шукає сильні емоції, напружені сюжети та складні, неоднозначні стосунки між героями. У цьому розділі зібрані книги, де кохання межує з небезпекою, пристрастю та внутрішніми конфліктами. Тут ви знайдете історії з харизматичними антигероями, забороненим коханням і глибокою психологією персонажів. Якщо вам подобаються інтенсивні сюжети, темна естетика та книги, які викликають сильні відчуття — цей розділ саме для вас.",
    "Історична та пригодницька проза": "У цих історичних романах на вас чекають дивовижні пригоди і розповіді про долі незвичайних людей. Книги, які варто прочитати, щоб відчути дух епохи: екзотика і національний колорит, інтриги та чаклунство, загадки старовинних рукописів та давні пророцтва.",
    "Детективи": "Найкращі детективні історії від майстрів кримінального жанру: бойовики й інтелектуальні головоломки, «жіночі», іронічні, містичні детективи, світові й вітчизняні бестселери. Жорстокі вбивства, захопливі розслідування та неочікувані розв’язки!",
    "Трилери та жахи": "Захоплюючі історії для тих, хто не проти полоскотати свої нерви. Психологічні, детективні та містичні трилери, хоррор, книги, за якими були зняті найкращі фільми жахів.",
    "Фантастика": "Найкращі книги для справжніх поціновувачів жанру. Тут ви знайдете не лише найпопулярніші новинки від визнаних фантастів, але й цікаві видання, які підкорили читачів з усього світу.",
    "Фентезі": "У цьому розділі зібрані найкращі твори у фентезійному жанрі. Небезпечні пригоди і чарівні істоти чекають на свого читача, щоб віднести його у створений автором світ. Якщо й тікати від реальності, то тільки у книги! Будьте тим, ким завжди мріяли стати: ельфом, чарівником чи тролем — все обмежується лише вашою уявою.",
    "Класична література": "Світова класика, великі письменники, великі твори – поезія, проза, драматургія, в доступних і подарункових ілюстрованих виданнях. Окраса вашої домашньої бібліотеки! У цьому розділі ви також знайдете книжки, які увішли до шкільної програми.",
    "Комікси та манги": "Комікси та манґи — це захоплива і динамічна форма мистецтва, яка перетворює текст та малюнки на незабутні історії. У цьому розділі ви знайдете широкий вибір коміксів різних жанрів та форматів. Незалежно від того, чи ви є фанатом супергеройських історій, чи вам до душі художні комікси з оригінальними сюжетами. Ви знайдете все, що потрібно для затишного відпочинку чи подарунку для близьких. Пориньте у світ коміксів та перетворіть своє дозвілля на захоплюючу пригоду."
};    

    const popularDescription = CATEGORY_DESCRIPTIONS[activeCategory] || CATEGORY_DESCRIPTIONS["Всі"];


    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsMouseDown(true);
        if (scrollRef.current) {
            // Запам'ятовуємо початкову точку натискання
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const handleMouseLeaveOrUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        e.preventDefault();
        
        // Розраховуємо відстань, на яку пересунули мишу
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Множник 2 для швидкості
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBooks());
        }
    }, [status, dispatch]);
    
    // 2. Логіка фільтрації
    const filteredBooks = books.filter(book => {
        if (activeCategory === "Всі") return true;
        
        // Перевіряємо, чи збігається жанр/категорія книги з обраною
        // Примітка: переконайтеся, що у вашій моделі Book є поле genre або подібне
        return book.category === activeCategory; 
    });

    return (
        <main className="popular-page">
            <div className="container">
                <Breadcrumbs activeFilter={activeCategory !== "Всі" ? activeCategory : undefined} />

                <section className="popular-header">
                    <h1 className="popular-title">{pageTitle}</h1>
                    <p className="popular-description">{popularDescription}</p>
                    
                    {/* 3. Рендер кнопок (фільтрів) */}
                    <div 
                    className={`filter-chips ${isMouseDown ? 'active-scroll' : ''}`}
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeaveOrUp}
                    onMouseUp={handleMouseLeaveOrUp}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: isMouseDown ? 'grabbing' : 'grab' }}
                >
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            className={`chip ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => {
                                // Додайте перевірку, щоб клік не спрацьовував під час перетягування
                                if (!isMouseDown) setActiveCategory(category);
                            }}
                        >
                            {category}
                        </button>
                    ))}
                    </div>
                </section>

                <div className="books-grid">
                    {status === 'succeeded' && filteredBooks.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            </div>
        </main>
    );
}