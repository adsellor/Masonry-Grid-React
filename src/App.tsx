import * as stylex from '@stylexjs/stylex';
import HomePage from './pages/HomePage';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import "./stylex.css";
import { PhotoDetailsPage } from './pages/PhotoDetalisPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const styles = stylex.create({
  app: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
});

const AppLayout = () => {
  return (
    <div {...stylex.props(styles.app)}>
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "photo/:id",
        element: <PhotoDetailsPage />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />
};

export default App;

