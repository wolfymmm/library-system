import { Routes, Route } from 'react-router-dom'; // Додано Routes
import HomePage from './pages/HomePage/HomePage';
import Layout from './Layout';
import './App.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Routes> {/* Обов'язкова обгортка для всіх Route */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;