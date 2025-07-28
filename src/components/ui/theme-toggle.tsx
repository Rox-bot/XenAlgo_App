import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

export function ThemeToggle() {
  const { preferences, setTheme, loading } = useUserPreferences();

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    try {
      console.log('Theme toggle clicked:', theme);
      console.log('Current preferences:', preferences);
      await setTheme(theme);
      toast.success(`Theme changed to ${theme}`);
    } catch (error) {
      console.error('Theme change error:', error);
      toast.error('Failed to change theme');
    }
  };

  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    if (!preferences) {
      console.log('No preferences available, using default icon');
      return <Sun className="h-4 w-4" />;
    }
    
    console.log('Current theme preference:', preferences.theme);
    
    switch (preferences.theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={loading}>
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 