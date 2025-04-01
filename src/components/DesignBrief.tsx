
import React from 'react';
import { DesignBriefLayout } from './DesignBriefLayout';
import { IntroSection } from './sections/IntroSection';
import { ProjectInfoSection } from './sections/ProjectInfoSection';
import { BudgetSection } from './sections/BudgetSection';
import { LifestyleSection } from './sections/LifestyleSection';
import { SiteSection } from './sections/SiteSection';
import { SpacesSection } from './sections/SpacesSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { ContractorsSection } from './sections/ContractorsSection';
import { CommunicationSection } from './sections/CommunicationSection';
import { InspirationSection } from './sections/InspirationSection';
import { UploadsSection } from './sections/UploadsSection';
import { SummarySection } from './sections/SummarySection';
import { useDesignBrief } from '@/context/DesignBriefContext';

export function DesignBrief() {
  const { currentSection } = useDesignBrief();
  
  const renderSection = () => {
    switch(currentSection) {
      case 'intro':
        return <IntroSection />;
      case 'projectInfo':
        return <ProjectInfoSection />;
      case 'contractors':
        return <ContractorsSection />;
      case 'budget':
        return <BudgetSection />;
      case 'lifestyle':
        return <LifestyleSection />;
      case 'spaces':
        return <SpacesSection />;
      case 'site':
        return <SiteSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'inspiration':
        return <InspirationSection />;
      case 'uploads':
        return <UploadsSection />;
      case 'communication':
        return <CommunicationSection />;
      case 'summary':
        return <SummarySection />;
      default:
        return <IntroSection />;
    }
  };
  
  return (
    <DesignBriefLayout>
      {renderSection()}
    </DesignBriefLayout>
  );
}
