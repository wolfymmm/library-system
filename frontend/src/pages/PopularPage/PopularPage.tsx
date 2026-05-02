import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Додано useNavigate
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../features/books/bookSlice";
import type { RootState, AppDispatch } from "../../app/store";
import BookCard from "../../components/BookCard/BookCard";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs"; 
import './PopularPage.scss';

const CATEGORIES = ["Всі", "Сучасні автори", "Романтична проза", "Дарк романи", "Історична та пригодницька проза", "Детективи", "Трилери та жахи", "Фантастика", "Фентезі", "Класична література", "Комікси та манги"];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "Всі": "У цьому розділі ви зможете обрати та замовити найкращі романи про кохання, книжки сучасних авторів, історико-пригодницькі романи, детективи, фантастику та трилери, твори зарубіжних та вітчизняних класиків.",
    "Сучасні автори": "До вашої уваги книжки різних жанрів від відомих вітчизняних та світових авторів нашого сьогодення. Знайдуться захоплюючі бестселери на будь-який смак: фантастика, фентезі, детективи, романтика, трилери тощо.",
    "Романтична проза": "Для вас — дивовижні історії кохання, від романтичних до найвідвертіших. Відомі автори та нові імена.",
    "Дарк романи": "Dark romance — це жанр для тих, хто шукає сильні емоції, напружені сюжети та складні, неоднозначні стосунки між героями.",
    "Історична та пригодницька проза": "У цих історичних романах на вас чекають дивовижні пригоди і розповіді про долі незвичайних людей.",
    "Детективи": "Найкращі детективні історії від майстрів кримінального жанру: бойовики й інтелектуальні головоломки.",
    "Трилери та жахи": "Захоплюючі історії для тих, хто не проти полоскотати свої нерви. Психологічні, детективні та містичні трилери.",
    "Фантастика": "Найкращі книги для справжніх поціновувачів жанру. Тут ви знайдете найпопулярніші новинки від визнаних фантастів.",
    "Фентезі": "У цьому розділі зібрані найкращі твори у фентезійному жанрі. Небезпечні пригоди і чарівні істоти чекають на свого читача.",
    "Класична література": "Світова класика, великі письменники, великі твори – поезія, проза, драматургія.",
    "Комікси та манги": "Комікси та манґи — це захоплива і динамічна форма мистецтва, яка перетворює текст та малюнки на незабутні історії."
};

export default function PopularPage() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation(); // ОБОВ'ЯЗКОВО: ініціалізуємо location
    const navigate = useNavigate(); // Для очищення state
    const [activeCategory, setActiveCategory] = useState("Всі");
    const { items: books, status } = useSelector((state: RootState) => state.books);

    // Скрол та Drag-to-scroll логіка
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsMouseDown(true);
        if (scrollRef.current) {
            setStartX(e.pageX - scrollRef.current.offsetLeft);
            setScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    const handleMouseLeaveOrUp = () => setIsMouseDown(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Завантаження книг
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBooks());
        }
    }, [status, dispatch]);

    // ЛОГІКА ПЕРЕХОДУ З ХЕДЕРА
    useEffect(() => {
        if (location.state?.selectedCategory) {
            setActiveCategory(location.state.selectedCategory);
            // Очищуємо state, щоб при оновленні (F5) не повертало до категорії з хедера
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    const pageTitle = activeCategory === "Всі" ? "Популярне зараз" : activeCategory;
    const popularDescription = CATEGORY_DESCRIPTIONS[activeCategory] || CATEGORY_DESCRIPTIONS["Всі"];

    const filteredBooks = books.filter(book => {
        if (activeCategory === "Всі") return true;
        return book.category === activeCategory; 
    });

    return (
        <main className="popular-page">
            <div className="container">
                <Breadcrumbs activeFilter={activeCategory !== "Всі" ? activeCategory : undefined} />

                <section className="popular-header">
                    <h1 className="popular-title">{pageTitle}</h1>
                    <p className="popular-description">{popularDescription}</p>
                    
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
                                    if (!isMouseDown) setActiveCategory(category);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="books-grid">
                    {status === 'loading' && <p>Завантаження книг...</p>}
                    {status === 'succeeded' && filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))
                    ) : status === 'succeeded' && (
                        <p>Книг у цій категорії поки немає.</p>
                    )}
                </div>
            </div>
        </main>
    );
}