import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home/Home/Home';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import PrivateRoute from '../routes/PrivateRoute';
import SendParcel from '../pages/SendParcel/SendParcel';
import DashboardLayout from '../layouts/DashboardLayout';
import MyParcels from '../pages/Dashboard/MyParcels/MyParcels';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'sendParcel',
        loader: ()=> fetch('./warehouses.json'),
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path:'myParcels',
        Component:MyParcels
      }
    ]
  }
]);
