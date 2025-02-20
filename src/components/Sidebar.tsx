import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen flex flex-col">
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link 
          to="/" 
          className={`px-3 py-2 rounded-md block ${
            isActive('/') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Home
        </Link>
        <Link 
          to="/category" 
          className={`px-3 py-2 rounded-md block ${
            isActive('/category') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Category
        </Link>
        <Link 
          to="/manage-samples" 
          className={`px-3 py-2 rounded-md block ${
            isActive('/manage-samples') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Manage Samples
        </Link>
        <Link 
          to="/company-info" 
          className={`px-3 py-2 rounded-md block ${
            isActive('/company-info') 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Company info
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="text-gray-400 text-sm mb-2">You are logged in as Admin</div>
        <button
          onClick={logout}
          className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
}