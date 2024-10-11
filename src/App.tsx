import React from 'react';
import * as stylex from '@stylexjs/stylex';
import HomePage from './pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./stylex.css";

const styles = stylex.create({
  app: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage
  },
  {
    path: "photo/:id",
    element: <div> Hello </div>
  }
])

const App: React.FC = () => {
  return (
    <div style={styles.app}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
