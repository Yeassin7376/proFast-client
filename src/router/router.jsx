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
import Payment from '../pages/Dashboard/Payment/Payment';
import PaymentHistory from '../pages/Dashboard/PymentHistory/PaymentHistory';
import TrackParcel from '../pages/Dashboard/TrackParcel/TrackParcel';
import BeARider from '../pages/Dashboard/BeARider/BeARider';
import PendingRiders from '../pages/Dashboard/PendingRIders/PendingRiders';
import ActiveRiders from '../pages/Dashboard/ActiveRIders/ActiveRiders';
import MakeAdmin from '../pages/Dashboard/MakeAdmin/MakeAdmin';
import Forbidden from '../pages/Forbidden/Forbidden';
import AdminRoute from '../routes/AdminRoute';
import AssignRider from '../pages/Dashboard/AssignRider/AssignRider';

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
        loader: () => fetch('./warehouses.json'),
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        )
      },
      {
        path: '/beARider',
        loader: () => fetch('./warehouses.json'),
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        )
      },
      {
        path: 'forbidden',
        Component: Forbidden
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
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'myParcels',
        Component: MyParcels
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },
      {
        path: 'paymentHistory',
        Component: PaymentHistory
      },
      {
        path: 'track',
        Component: TrackParcel
      },
      {
        path: 'assignRider',
        element: <AdminRoute>
          <AssignRider></AssignRider>
        </AdminRoute>
      },
      {
        path: 'pendingRiders',
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        )
      },
      {
        path: 'activeRiders',
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        )
      },
      {
        path: 'makeAdmin',
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        )
      }
    ]
  }
]);
