import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/lib/theme-utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
