
import React from 'react';
import { DesignBriefSidebar } from './DesignBriefSidebar';
import { ThemeToggle } from './ThemeProvider';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { AppLogo } from './AppLogo';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface DesignBriefLayoutProps {
  children: React.ReactNode;
}

export function DesignBriefLayout({ children }: DesignBriefLayoutProps) {
  const { projectData, currentSection } = useDesignBrief();
  
  // Create a form instance to provide FormContext
  const formMethods = useForm();
  
  const lastSavedFormatted = projectData.lastSaved 
    ? formatDistanceToNow(new Date(projectData.lastSaved), { addSuffix: true })
    : 'Not saved yet';
  
  // Create dynamic title based on client name and address
  const clientName = projectData?.formData?.projectInfo?.clientName || '';
  const projectAddress = projectData?.formData?.projectInfo?.projectAddress || '';
  
  const headerTitle = clientName ? `${clientName} Brief` : 'Design Brief';
  const headerSubtitle = projectAddress 
    ? `Create your project brief for ${projectAddress}`
    : currentSection === 'intro' 
      ? 'Create your project brief'
      : 'Create your project brief';
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DesignBriefSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-background z-10">
          <div className="flex items-center space-x-2">
            <AppLogo size="small" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{headerTitle}</span>
              <span className="text-xs text-muted-foreground">
                Last saved {lastSavedFormatted}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <Form {...formMethods}>
            {children}
          </Form>
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
