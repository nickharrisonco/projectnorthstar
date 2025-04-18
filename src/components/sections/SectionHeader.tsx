
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionHeaderProps {
  title: string;
  description?: string;
  isBold?: boolean;
  icon?: React.ReactNode;
}

export function SectionHeader({ title, description, isBold = true, icon }: SectionHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className={`text-2xl font-bold ${isMobile ? 'mb-1' : 'mb-0'} flex items-center gap-2`}>
          {icon && icon}
          {title}
        </h1>
      </div>
      
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
