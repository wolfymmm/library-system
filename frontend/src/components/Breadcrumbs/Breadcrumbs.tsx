import './Breadcrumbs.scss';

const Breadcrumbs = ({ activeFilter }) => {
  return (
    <nav className="breadcrumbs-container" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {/* Головна завжди статична */}
        <li className="breadcrumb-item">
          <a href="/">Головна</a>
        </li>

        {/* Поточна сторінка */}
        <li className={`breadcrumb-item ${!activeFilter ? 'active' : ''}`}>
          {activeFilter ? (
            <a href="/popular">Популярне</a>
          ) : (
            "Популярне"
          )}
        </li>

        {/* Додатковий рівень, якщо обрано категорію/фільтр */}
        {activeFilter && (
          <li className="breadcrumb-item active">
            {activeFilter}
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;