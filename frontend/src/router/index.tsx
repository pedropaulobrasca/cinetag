import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { HomePage } from '../pages/Home';
import { MyListPage } from '../pages/MyList';
import { LoginPage } from '../pages/Login';
import { RegisterPage } from '../pages/Register';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/minha-lista',
        element: <MyListPage />,
      },
    ],
  },
]);
