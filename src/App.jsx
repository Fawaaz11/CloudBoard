import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { UsersManagement } from './components/dashboard/UsersManagement';
import { ItemsManagement } from './components/dashboard/ItemsManagement';

const AuthenticatedApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersManagement />;
      case 'items':
        return <ItemsManagement />;
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced analytics and reporting features coming soon...
              </p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Reports
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive reporting system coming soon...
              </p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Security Center
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Security monitoring and compliance tools coming soon...
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Application settings and configuration options coming soon...
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AuthWrapper = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return isLoginMode ? (
    <LoginForm onToggleMode={() => setIsLoginMode(false)} />
  ) : (
    <RegisterForm onToggleMode={() => setIsLoginMode(true)} />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;