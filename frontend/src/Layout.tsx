import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './Layout.scss';

const Layout = () => (
  <div className="layout">
    <Header/>
    <Outlet /> 
    <Footer/>
  </div>
);

export default Layout;