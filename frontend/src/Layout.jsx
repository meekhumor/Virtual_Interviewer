import { Outlet, useLocation } from 'react-router-dom';
import HomeHeader from './components/Header/HomeHeader';
import DashboardHeader from './components/Header/DashboardHeader';
import Footer from './components/Footer/Footer';
import RegisterHeader from './components/Header/RegisterHeader';


function Layout() {
  const location = useLocation();

  const renderHeader = () => {
    if (location.pathname === '/') {
      return <HomeHeader />;
    } else if(location.pathname === '/register'){
      return <RegisterHeader />;
    }else{
      return <DashboardHeader />;
    }
  };

  return (
    <>
      {renderHeader()}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
