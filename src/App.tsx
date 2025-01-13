import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import ManageSamples from './components/ManageSamples';
import CategoryPage from './components/CategoryPage';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div className="flex-1 p-8">
          <h1 className='text-6xl '>Auto parts GenAI Admin</h1>
          <h1 className='text-xl mt-5 text-gray-500 '>Manage Categories and Update the knowledge base for ingestion!</h1>
          </div>} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/manage-samples" element={<ManageSamples />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;