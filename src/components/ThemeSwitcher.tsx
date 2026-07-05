'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Theme = 'dark' | 'light' | 'light-cream';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  return (
    <div className="flex flex-col gap-2 p-2 border-t border-border-default mt-auto">
      <span className="text-xs text-text-muted px-2 uppercase tracking-wider font-semibold">Temas</span>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex-1 h-8 ${theme === 'dark' ? 'bg-bg-elevated text-link-focus' : 'text-text-secondary'}`}
          onClick={() => toggleTheme('dark')}
          title="Modo Oscuro (Obsidian)"
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex-1 h-8 ${theme === 'light' ? 'bg-bg-elevated text-link-focus' : 'text-text-secondary'}`}
          onClick={() => toggleTheme('light')}
          title="Modo Claro (Moderno)"
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex-1 h-8 ${theme === 'light-cream' ? 'bg-bg-elevated text-link-focus' : 'text-text-secondary'}`}
          onClick={() => toggleTheme('light-cream')}
          title="Modo Claro (Crema)"
        >
          <Coffee className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
