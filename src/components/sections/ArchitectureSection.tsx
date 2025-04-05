
import React, { useState } from 'react';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

// Import the necessary components
import { StylePreferences } from '@/components/architecture/StylePreferences';
import { MaterialsSection } from '@/components/architecture/MaterialsSection';
import { SustainabilitySection } from '@/components/architecture/SustainabilitySection';
import { TechnologySection } from '@/components/architecture/TechnologySection';
import { InspirationEntryList, InspirationEntry } from '@/components/architecture/InspirationEntryList';

// Import helper functions
import { 
  getExternalMaterials, 
  getInternalMaterials,
} from '@/components/architecture/helpers';

// Material options for the helper functions
const externalMaterialOptions = [
  { value: 'Brick', label: 'Brick' },
  { value: 'Weatherboard', label: 'Weatherboard' },
  { value: 'Linea', label: 'Linea' },
  { value: 'Cedar', label: 'Cedar' },
  { value: 'Stone', label: 'Stone' },
  { value: 'Corten Steel', label: 'Corten Steel' },
  { value: 'Aluminum Composite Panel', label: 'Aluminum Composite Panel' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Stucco', label: 'Stucco' },
  { value: 'Fiber Cement', label: 'Fiber Cement' },
  { value: 'Metal Cladding', label: 'Metal Cladding' },
  { value: 'ColorSteel', label: 'ColorSteel' },
];

const internalMaterialOptions = [
  { value: 'Timber Flooring', label: 'Timber Flooring' },
  { value: 'Engineered Wood', label: 'Engineered Wood' },
  { value: 'Carpet', label: 'Carpet' },
  { value: 'Tile', label: 'Tile' },
  { value: 'Vinyl', label: 'Vinyl' },
  { value: 'Concrete', label: 'Concrete' },
  { value: 'Natural Stone', label: 'Natural Stone' },
  { value: 'Plasterboard', label: 'Plasterboard' },
  { value: 'Timber Paneling', label: 'Timber Paneling' },
  { value: 'Marble', label: 'Marble' },
  { value: 'Granite', label: 'Granite' },
  { value: 'Quartz', label: 'Quartz' },
];

export function ArchitectureSection() {
  const { setCurrentSection, updateFormData, formData } = useDesignBrief();
  const architectureData = formData.architecture;
  
  const handlePrevious = () => {
    setCurrentSection('spaces');
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setCurrentSection('uploads');
    window.scrollTo(0, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData('architecture', { [field]: value });
  };

  const handleStylesChange = (values: string[]) => {
    updateFormData('architecture', { preferredStyles: values });
  };

  const handleExternalMaterialsChange = (values: string[]) => {
    const externalValues = values.filter(v => 
      externalMaterialOptions.some(o => o.value === v)
    );
    
    const currentPreferences = architectureData.materialPreferences || [];
    
    const internalValues = currentPreferences.filter(p => 
      !externalMaterialOptions.some(o => o.value === p)
    );
    
    updateFormData('architecture', { 
      materialPreferences: [...internalValues, ...externalValues] 
    });
  };

  const handleInternalMaterialsChange = (values: string[]) => {
    const internalValues = values.filter(v => 
      internalMaterialOptions.some(o => o.value === v)
    );
    
    const currentPreferences = architectureData.materialPreferences || [];
    
    const externalValues = currentPreferences.filter(p => 
      !internalMaterialOptions.some(o => o.value === p)
    );
    
    updateFormData('architecture', { 
      materialPreferences: [...externalValues, ...internalValues] 
    });
  };

  const handleSustainabilityChange = (values: string[]) => {
    updateFormData('architecture', { sustainabilityFeatures: values });
  };

  const handleTechnologyChange = (values: string[]) => {
    updateFormData('architecture', { technologyRequirements: values });
  };
  
  const handleInspirationEntriesChange = (entries: InspirationEntry[]) => {
    updateFormData('architecture', { inspirationEntries: entries });
  };
  
  const externalMaterialsSelected = getExternalMaterials(
    architectureData.materialPreferences, 
    externalMaterialOptions
  );
  
  const internalMaterialsSelected = getInternalMaterials(
    architectureData.materialPreferences, 
    internalMaterialOptions
  );

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Architectural Style & Features" 
          description="Provide details about your design preferences, materials, and special architectural features."
        />
        
        {/* Moved Inspiration References Section to the top */}
        <div className="design-brief-form-group">
          <Card>
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-semibold mb-4">Inspiration References</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Add Inspiration References
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add URLs to websites, articles, or social media posts that showcase homes or projects you admire.
                    For each reference, describe what you like about it.
                  </p>
                  
                  <InspirationEntryList 
                    entries={architectureData.inspirationEntries || []}
                    onChange={handleInspirationEntriesChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="inspirationNotes" className="text-base font-medium mb-2 block">
                    Additional Notes
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Any other inspiration or design preferences you'd like to mention.
                  </p>
                  <Textarea
                    id="inspirationNotes"
                    value={architectureData.inspirationNotes || ''}
                    onChange={(e) => handleInputChange('inspirationNotes', e.target.value)}
                    placeholder="Any other design inspiration or preferences..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <StylePreferences 
          preferredStyles={architectureData.preferredStyles || []}
          stylePrefences={architectureData.stylePrefences || ''}
          onStylesChange={handleStylesChange}
          onInputChange={handleInputChange}
        />
        
        <MaterialsSection 
          externalMaterials={architectureData.externalMaterials || ''}
          internalFinishes={architectureData.internalFinishes || ''}
          externalMaterialsSelected={externalMaterialsSelected}
          internalMaterialsSelected={internalMaterialsSelected}
          onExternalMaterialsChange={handleExternalMaterialsChange}
          onInternalMaterialsChange={handleInternalMaterialsChange}
          onInputChange={handleInputChange}
        />
        
        <SustainabilitySection 
          sustainabilityGoals={architectureData.sustainabilityGoals || ''}
          sustainabilityFeatures={architectureData.sustainabilityFeatures || []}
          onSustainabilityChange={handleSustainabilityChange}
          onInputChange={handleInputChange}
        />
        
        <TechnologySection 
          specialFeatures={architectureData.specialFeatures || ''}
          inspirationNotes={architectureData.inspirationNotes || ''}
          architectureNotes={architectureData.architectureNotes || ''}
          technologyRequirements={architectureData.technologyRequirements || []}
          onTechnologyChange={handleTechnologyChange}
          onInputChange={handleInputChange}
        />
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Spaces</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Uploads</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
