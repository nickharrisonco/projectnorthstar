
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from './SectionHeader';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, ArrowRight, Plus, Trash2, User } from 'lucide-react';
import { Professional } from '@/types';
import { MultiSelectButtons } from '@/components/MultiSelectButtons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Simplified list of professionals
const predefinedProfessionals = [
  { value: 'builder', label: 'Builder' },
  { value: 'architect', label: 'Architect' },
  { value: 'interior_designer', label: 'Interior Designer' },
  { value: 'landscape_architect', label: 'Landscape Architect' },
];

export function ContractorsSection() {
  const { formData, updateFormData, addProfessional, updateProfessional, removeProfessional, setCurrentSection } = useDesignBrief();
  const [newProfessional, setNewProfessional] = useState<Omit<Professional, 'id'>>({
    type: '',
    name: '',
    contact: '',
    notes: '',
  });
  const [professionalPreferences, setProfessionalPreferences] = useState<Record<string, { hasPreferred: string | null, name: string, contact: string }>>({});

  // Initialize professional preferences without default selections
  useEffect(() => {
    const initialPreferences: Record<string, { hasPreferred: string | null, name: string, contact: string }> = {};
    
    predefinedProfessionals.forEach(prof => {
      const existing = formData.contractors.professionals.find(p => p.type === prof.label);
      initialPreferences[prof.value] = {
        // Start with null (unselected) unless there's existing data
        hasPreferred: existing ? 'yes' : null,
        name: existing?.name || '',
        contact: existing?.contact || ''
      };
    });
    
    setProfessionalPreferences(initialPreferences);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('new_')) {
      const field = name.replace('new_', '');
      setNewProfessional(prev => ({ ...prev, [field]: value }));
    } else {
      updateFormData('contractors', { [name]: value });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    updateFormData('contractors', { goToTender: checked });
  };

  const handleAddProfessional = () => {
    if (newProfessional.type && newProfessional.name) {
      addProfessional({
        ...newProfessional,
        id: crypto.randomUUID(),
      });
      
      // Reset form
      setNewProfessional({
        type: '',
        name: '',
        contact: '',
        notes: '',
      });
    }
  };

  const handleRemoveProfessional = (id: string) => {
    removeProfessional(id);
  };

  const handleProfessionalChange = (id: string, field: string, value: string) => {
    const professional = formData.contractors.professionals.find(p => p.id === id);
    if (professional) {
      updateProfessional({
        ...professional,
        [field]: value,
      });
    }
  };
  
  const handlePreferenceChange = (professional: string, value: string) => {
    setProfessionalPreferences(prev => ({
      ...prev,
      [professional]: {
        ...prev[professional],
        hasPreferred: value
      }
    }));
    
    // If changing from yes to no, remove the professional
    if (value === 'no') {
      const profToRemove = formData.contractors.professionals.find(
        p => p.type === predefinedProfessionals.find(pre => pre.value === professional)?.label
      );
      if (profToRemove) {
        removeProfessional(profToRemove.id);
      }
    }
    
    // If changing from null/no to yes, add placeholder
    if (value === 'yes' && professionalPreferences[professional]?.hasPreferred !== 'yes') {
      const profLabel = predefinedProfessionals.find(p => p.value === professional)?.label;
      if (profLabel) {
        addProfessional({
          id: crypto.randomUUID(),
          type: profLabel,
          name: '',
          contact: '',
          notes: ''
        });
      }
    }
  };
  
  const handlePreferredProfessionalInfo = (professional: string, field: string, value: string) => {
    setProfessionalPreferences(prev => ({
      ...prev,
      [professional]: {
        ...prev[professional],
        [field]: value
      }
    }));
    
    // Update the professional in the form data
    const profLabel = predefinedProfessionals.find(p => p.value === professional)?.label;
    const existingProf = formData.contractors.professionals.find(p => p.type === profLabel);
    
    if (existingProf) {
      updateProfessional({
        ...existingProf,
        [field]: value
      });
    } else if (profLabel && field === 'name' && value) {
      // Add new professional if it doesn't exist
      addProfessional({
        id: crypto.randomUUID(),
        type: profLabel,
        name: value,
        contact: professionalPreferences[professional]?.contact || '',
        notes: ''
      });
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection('projectInfo');
  };
  
  const handleNext = () => {
    setCurrentSection('budget');
  };
  
  // Calculate completion percentage - revised to only count explicit user selections
  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;
    
    // Check preferredBuilder field
    total++;
    if (formData.contractors.preferredBuilder && formData.contractors.preferredBuilder.trim() !== '') {
      completed++;
    }
    
    // Check goToTender field - only count if explicitly set by user
    total++;
    if (formData.contractors.goToTender === true || formData.contractors.goToTender === false) {
      completed++;
    }
    
    // Check professionals
    // Count fields that have been actively filled (only for professionals where user selected "Yes")
    predefinedProfessionals.forEach(prof => {
      // First check if user has made a selection (yes/no) for this professional
      const prefKey = prof.value;
      const hasPreference = professionalPreferences[prefKey]?.hasPreferred;
      
      // Only count if user has made an explicit choice (not null)
      if (hasPreference === 'yes' || hasPreference === 'no') {
        // The selection itself counts as a completed field
        total++;
        completed++;
        
        // If user selected "Yes", check if they provided name and contact info
        if (hasPreference === 'yes') {
          // Name field
          total++;
          if (professionalPreferences[prefKey]?.name && professionalPreferences[prefKey].name.trim() !== '') {
            completed++;
          }
          
          // Contact field
          total++;
          if (professionalPreferences[prefKey]?.contact && professionalPreferences[prefKey].contact.trim() !== '') {
            completed++;
          }
        }
      } else {
        // If user hasn't made a selection, still count the field in total but not completed
        total++;
      }
    });
    
    // Custom professionals
    if (formData.contractors.professionals) {
      const customProfessionals = formData.contractors.professionals.filter(
        p => !predefinedProfessionals.some(pre => pre.label === p.type)
      );
      
      if (customProfessionals.length > 0) {
        // Each custom professional counts as a completed item
        total += customProfessionals.length;
        completed += customProfessionals.length;
      }
    }
    
    // Additional notes
    total++;
    if (formData.contractors.additionalNotes && formData.contractors.additionalNotes.trim() !== '') {
      completed++;
    }
    
    // Calculate percentage
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  const completionPercentage = calculateCompletion();

  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <div className="flex justify-between items-center mb-4">
          <SectionHeader 
            title="Project Team" 
            description="Tell us about the professionals you'd like to work with on your project." 
          />
          <div className="text-sm font-medium">
            {completionPercentage}% Complete
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="preferredBuilder">Preferred Builder</Label>
            <Input
              id="preferredBuilder"
              name="preferredBuilder"
              placeholder="Enter the name of your preferred builder (if any)"
              value={formData.contractors.preferredBuilder}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6 flex items-center space-x-2">
            <Switch
              id="goToTender"
              checked={formData.contractors.goToTender}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="goToTender">I would like to go to tender for a builder</Label>
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <h3 className="text-lg font-semibold mb-2">Project Professionals</h3>
          <p className="text-sm text-muted-foreground mb-4">Do you have any preferred professionals for the roles below?</p>
          
          <div className="space-y-6">
            {predefinedProfessionals.map((professional) => (
              <Card key={professional.value} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">{professional.label}</h4>
                    
                    <RadioGroup 
                      value={professionalPreferences[professional.value]?.hasPreferred || ''}
                      onValueChange={(value) => handlePreferenceChange(professional.value, value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${professional.value}-yes`} />
                        <Label htmlFor={`${professional.value}-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${professional.value}-no`} />
                        <Label htmlFor={`${professional.value}-no`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {professionalPreferences[professional.value]?.hasPreferred === 'yes' && (
                    <div className="grid gap-4 pl-6 border-l-2 border-primary/20">
                      <div>
                        <Label htmlFor={`${professional.value}-name`}>Name</Label>
                        <Input
                          id={`${professional.value}-name`}
                          value={professionalPreferences[professional.value]?.name || ''}
                          onChange={(e) => handlePreferredProfessionalInfo(professional.value, 'name', e.target.value)}
                          className="mt-1"
                          placeholder={`Enter preferred ${professional.label}'s name`}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`${professional.value}-contact`}>Contact Info</Label>
                        <Input
                          id={`${professional.value}-contact`}
                          value={professionalPreferences[professional.value]?.contact || ''}
                          onChange={(e) => handlePreferredProfessionalInfo(professional.value, 'contact', e.target.value)}
                          className="mt-1"
                          placeholder="Email or phone number"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-semibold mb-4">Add Custom Professional</h3>
            <Card className="mb-4 border-dashed">
              <CardContent className="p-4">
                <div className="grid gap-4 mb-4">
                  <div>
                    <Label htmlFor="new_type">Type of Professional</Label>
                    <Input
                      id="new_type"
                      name="new_type"
                      value={newProfessional.type}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g., Civil Engineer, Sustainability Consultant"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new_name">Name</Label>
                    <Input
                      id="new_name"
                      name="new_name"
                      value={newProfessional.name}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Professional's name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new_contact">Contact Info</Label>
                    <Input
                      id="new_contact"
                      name="new_contact"
                      value={newProfessional.contact}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Email or phone number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new_notes">Notes</Label>
                    <Textarea
                      id="new_notes"
                      name="new_notes"
                      value={newProfessional.notes}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Any additional information"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={handleAddProfessional}
                  disabled={!newProfessional.type || !newProfessional.name}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Custom Professional</span>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Any other information about your project team..."
              value={formData.contractors.additionalNotes || ''}
              onChange={handleInputChange}
              className="mt-1 h-32"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Project Info</span>
          </Button>
          
          <Button onClick={handleNext} className="group">
            <span>Next: Budget</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
