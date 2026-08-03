import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import PageLoader from './components/common/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Guide = lazy(() => import('./pages/Guide'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Store = lazy(() => import('./pages/Store'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/store" element={<Store />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </Layout>
              <Toaster position="top-right" />
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
