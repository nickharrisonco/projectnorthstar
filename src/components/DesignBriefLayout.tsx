
import React from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';
import { ThemeToggle } from './ThemeProvider';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { AppLogo } from './AppLogo';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  const { lastSaved } = useDesignBrief();
  
  const lastSavedFormatted = lastSaved 
    ? formatDistanceToNow(new Date(lastSaved), { addSuffix: true })
    : 'Not saved yet';
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesignBriefSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10">
          <div className="flex items-center space-x-2">
            <AppLogo size="small" />
            <span className="text-xs text-muted-foreground">
              Last saved {lastSavedFormatted}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        <footer className="h-12 border-t flex items-center justify-between px-4 text-xs text-muted-foreground">
          <div>© 2025 Northstar by www.nickharrison.co</div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">About Northstar</Link>
            <a href="#help" className="hover:underline">Need help?</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
