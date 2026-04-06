import { Routes, Route } from 'react-router-dom'; // Додано Routes
import HomePage from './pages/HomePage/HomePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PopularPage from './pages/PopularPage/PopularPage';
import Layout from './Layout';
import './App.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Header/>
      <Routes> {/* Обов'язкова обгортка для всіх Route */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/popular" element={<PopularPage />} />
        </Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;