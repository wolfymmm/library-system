import { Outlet } from 'react-router-dom';
import './Layout.scss';

const Layout = () => (
  <div className="layout">
    <Outlet /> 
  </div>
);

export default Layout;