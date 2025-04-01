
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ProjectData, SectionKey } from '@/types';

const initialProjectData: ProjectData = {
  formData: {
    projectInfo: {
      clientName: '',
      projectAddress: '',
      contactEmail: '',
      contactPhone: '',
      projectType: '',
      projectDescription: '',
    },
    budget: {
      budgetRange: '',
      flexibilityNotes: '',
      priorityAreas: '',
      timeframe: '',
    },
    lifestyle: {
      occupants: '',
      projectTimeframe: '', // Added this field to match the type
      occupationDetails: '',
      dailyRoutine: '',
      entertainmentStyle: '',
      specialRequirements: '',
    },
    site: {
      existingConditions: '',
      siteFeatures: '',
      viewsOrientations: '',
      accessConstraints: '',
      neighboringProperties: '',
      topographicSurvey: '',
      existingHouseDrawings: '',
      septicDesign: '',
      certificateOfTitle: '',
      covenants: '',
    },
    spaces: {
      rooms: [],
      additionalNotes: '',
    },
    architecture: {
      stylePrefences: '',
      externalMaterials: '',
      internalFinishes: '',
      sustainabilityGoals: '',
      specialFeatures: '',
    },
    contractors: {
      preferredBuilder: '',
      goToTender: false,
      professionals: [],
      additionalNotes: '',
    },
    communication: {
      preferredMethods: [],
      bestTimes: [],
      availableDays: [],
      frequency: '',
      urgentContact: '',
      responseTime: '',
      additionalNotes: '',
    },
  },
  files: {
    uploadedFiles: [],
    uploadedInspirationImages: [],
    inspirationSelections: [],
  },
  summary: {
    generatedSummary: '',
    editedSummary: '',
  },
  lastSaved: new Date().toISOString(),
  currentSection: 'intro',
};

type UpdateFormData = <K extends keyof ProjectData['formData']>(
  section: K,
  updates: Partial<ProjectData['formData'][K]>
) => void;

interface DesignBriefContextType {
  projectData: ProjectData;
  formData: ProjectData['formData'];
  files: ProjectData['files'];
  summary: ProjectData['summary'];
  updateFormData: UpdateFormData;
  addRoom: (room: { type: string; quantity: number; description: string; isCustom: boolean }) => void;
  updateRoom: (room: ProjectData['formData']['spaces']['rooms'][0]) => void;
  removeRoom: (id: string) => void;
  addProfessional: (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
  updateProfessional: (professional: ProjectData['formData']['contractors']['professionals'][0]) => void;
  removeProfessional: (id: string) => void;
  currentSection: SectionKey;
  setCurrentSection: (section: SectionKey) => void;
  saveProjectData: () => void;
  updateFiles: (updates: Partial<ProjectData['files']>) => void;
  updateSummary: (updates: Partial<ProjectData['summary']>) => void;
  generateSummary: () => Promise<void>;
  sendByEmail: (email: string) => Promise<boolean>;
  exportAsPDF: () => Promise<void>;
}

const updateCommunicationPreferences = (
  draft: ProjectData, 
  updates: { 
    preferredMethods?: string[], 
    bestTimes?: string[], 
    availableDays?: string[], 
    frequency?: string, 
    urgentContact?: string, 
    responseTime?: string, 
    additionalNotes?: string 
  }
) => {
  draft.formData.communication = {
    ...draft.formData.communication,
    ...updates
  };
};

const DesignBriefContext = createContext<DesignBriefContextType | undefined>(undefined);

export const DesignBriefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [currentSection, setCurrentSection] = useState<SectionKey>('intro');

  // Generic update function for any section in formData
  const updateFormData: UpdateFormData = useCallback((section, updates) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData[section] = { 
        ...updatedDraft.formData[section], 
        ...updates 
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  // Add updateFiles function
  const updateFiles = useCallback((updates: Partial<ProjectData['files']>) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.files = {
        ...updatedDraft.files,
        ...updates
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  // Add updateSummary function
  const updateSummary = useCallback((updates: Partial<ProjectData['summary']>) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.summary = {
        ...updatedDraft.summary,
        ...updates
      };
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const addRoom = useCallback((room: { type: string; quantity: number; description: string; isCustom: boolean }) => {
    setProjectData(draft => {
      const newRoom = {
        ...room,
        id: crypto.randomUUID(),
      };
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms.push(newRoom);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const updateRoom = useCallback((room: ProjectData['formData']['spaces']['rooms'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const roomIndex = updatedDraft.formData.spaces.rooms.findIndex(r => r.id === room.id);
      if (roomIndex !== -1) {
        updatedDraft.formData.spaces.rooms[roomIndex] = room;
      }
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const removeRoom = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.spaces.rooms = updatedDraft.formData.spaces.rooms.filter(room => room.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const addProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals.push(professional);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const updateProfessional = useCallback((professional: ProjectData['formData']['contractors']['professionals'][0]) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      const professionalIndex = updatedDraft.formData.contractors.professionals.findIndex(p => p.id === professional.id);
      if (professionalIndex !== -1) {
        updatedDraft.formData.contractors.professionals[professionalIndex] = professional;
      }
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const removeProfessional = useCallback((id: string) => {
    setProjectData(draft => {
      const updatedDraft = { ...draft };
      updatedDraft.formData.contractors.professionals = updatedDraft.formData.contractors.professionals.filter(p => p.id !== id);
      updatedDraft.lastSaved = new Date().toISOString();
      return updatedDraft;
    });
  }, []);

  const saveProjectData = useCallback(() => {
    localStorage.setItem('projectData', JSON.stringify(projectData));
  }, [projectData]);

  // Fix the Promise<void> type for generateSummary
  const generateSummary = useCallback(async (): Promise<void> => {
    // In a real app, this would call an API to generate the summary
    // For now, we'll just set a mock summary after a delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        updateSummary({
          generatedSummary: `This is a mock generated summary for ${projectData.formData.projectInfo.clientName || 'your'} project at ${projectData.formData.projectInfo.projectAddress || 'the specified address'}.`,
          editedSummary: `This is a mock generated summary for ${projectData.formData.projectInfo.clientName || 'your'} project at ${projectData.formData.projectInfo.projectAddress || 'the specified address'}.`
        });
        resolve();
      }, 1500);
    });
  }, [projectData.formData.projectInfo, updateSummary]);

  const sendByEmail = useCallback(async (email: string): Promise<boolean> => {
    // Mock implementation - in a real app, this would send the email
    console.log(`Sending email to ${email}`);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  }, []);

  // Fix the Promise<void> type for exportAsPDF
  const exportAsPDF = useCallback(async (): Promise<void> => {
    // Mock implementation - in a real app, this would export to PDF
    console.log('Exporting as PDF');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }, []);

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
    generateSummary,
    sendByEmail,
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
