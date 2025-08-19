import React from 'react';
import { Cloud, User, Settings, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'user': return 'default';
      case 'viewer': return 'secondary';
      default: return 'outline';
    }
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CloudBoard
            </h1>
          </div>
          <Badge variant="outline" className="text-xs">
            v2.1.0
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="text-gray-600 dark:text-gray-300"
            title={`Current theme: ${theme}`}
          >
            <ThemeIcon className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </span>
            </div>
            <Badge variant={getRoleBadgeVariant(user?.role || '')}>
              {user?.role}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};