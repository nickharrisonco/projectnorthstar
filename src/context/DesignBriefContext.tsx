
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ProjectData, SectionKey } from '@/types';
import { initialProjectData } from './initialState';
import { DesignBriefContextType } from './types';
import { useRoomsManagement } from './useRoomsManagement';
import { useProfessionalsManagement } from './useProfessionalsManagement';
import { useFileAndSummaryManagement } from './useFileAndSummaryManagement';

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'design_brief_data';

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default empty state
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');

  // Form data update functions
  const updateFormData: DesignBriefContextType['updateFormData'] = useCallback((section, updates) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData = {
        ...updatedDraft.formData,
        [section]: { 
          ...updatedDraft.formData[section], 
          ...updates 
        }
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  // Room management hooks
  const { addRoom, updateRoom, removeRoom } = useRoomsManagement(projectData, setProjectData);
  
  // Professional management hooks
  const { addProfessional, updateProfessional, removeProfessional } = useProfessionalsManagement(projectData, setProjectData);
  
  // File and summary management hooks
  const { updateFiles, updateSummary, saveProjectData, exportAsPDF } = useFileAndSummaryManagement(projectData, setProjectData);

  const value: DesignBriefContextType = {
    projectData,
    formData: projectData.formData,
    files: projectData.files,
    summary: projectData.summary,
    updateFormData,
    updateFiles,
    updateSummary,
    addRoom,
    updateRoom,
    removeRoom,
    addProfessional,
    updateProfessional,
    removeProfessional,
    currentSection,
    setCurrentSection,
    saveProjectData,
    exportAsPDF,
  };

  return (
    <DesignBriefContext.Provider value={value}>
      {children}
    </DesignBriefContext.Provider>
  );
};

export const useDesignBrief = () => {
  const context = useContext(DesignBriefContext);
  if (context === undefined) {
    throw new Error('useDesignBrief must be used within a DesignBriefProvider');
  }
  return context;
};
