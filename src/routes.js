import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

import Login from './pages/Login';
import Page404 from './pages/Page404';
import Store from './pages/store/stores';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import DashboardAppPage from './pages/DashboardAppPage';
import Game from './pages/games/Games';
import ProductItem from './pages/productitem/productitem';
import ProductCategory from './pages/productcategory/productcategory';
import Partner from './pages/partners/Partners';
import User from './pages/user/Users';
import Report from './pages/report/report';
import Campaign from './pages/campaigns/campaign';



// ----------------------------------------------------------------------

export default function Router() {
  
  const routes = useRoutes([
    {
      path: '',
      element:  <DashboardLayout /> ,
      children: [
        { element: <Navigate to="app" />, index: true },
        { path: 'app', element:  <DashboardAppPage /> },
        { path: 'report', element:  <Report />  },
        { path: 'game', element:  <Game />  },
        { path: 'campaign', element:  <Campaign /> },
        { path: 'partner', element:  <Partner /> },
        { path: 'store', element:  <Store /> },
        { path: 'productcategory', element:  <ProductCategory /> },
        { path: 'productitem', element:  <ProductItem /> },
        { path: 'profile', element:  <Profile /> },
        { path: 'user', element:  <User /> },
        { path: 'logout', element:  <Logout /> },
        
      ],
    },
    {
      path: 'login',  
      element: <Login />,
    }, 
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
