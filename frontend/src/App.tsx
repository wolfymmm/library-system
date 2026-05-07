import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, selectIsAuthenticated } from './features/auth/authSlice';

import HomePage from './pages/HomePage/HomePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PopularPage from './pages/PopularPage/PopularPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import UserPage from './pages/UserPage/UserPage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import Layout from './Layout';
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser && !isAuthenticated) {
      try {
        const user = JSON.parse(savedUser);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="app-wrapper">
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/profile" element={<UserPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;