
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { PredictiveAddressFinder } from '@/components/PredictiveAddressFinder';

export function ProjectInfoSection() {
  const { formData, updateFormData, setCurrentSection } = useDesignBrief();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    formData.projectInfo.coordinates || null
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData('projectInfo', { [name]: value });
  };
  
  const handleProjectTypeChange = (value: string) => {
    updateFormData('projectInfo', { projectType: value });
  };

  const handleAddressChange = (address: string) => {
    updateFormData('projectInfo', { projectAddress: address });
  };

  const handleCoordinatesChange = (coords: [number, number]) => {
    setCoordinates(coords);
    updateFormData('projectInfo', { coordinates: coords });
  };
  
  const handleNext = () => {
    setCurrentSection('contractors');
  };
  
  // Calculate completion percentage based on required fields
  const calculateCompletion = () => {
    const requiredFields = ['clientName', 'projectAddress', 'contactEmail', 'contactPhone', 'projectType'];
    let filledCount = 0;
    
    requiredFields.forEach(field => {
      if (formData.projectInfo[field]) filledCount++;
    });
    
    return Math.round((filledCount / requiredFields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader 
          title="Project Information" 
          description="Tell us about yourself and your project. This information helps us understand the basics of what you're looking to achieve."
          progress={completionPercentage}
        />
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="clientName">Your Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="Enter your full name"
              value={formData.projectInfo.clientName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="projectAddress">Project Address</Label>
            <div className="mt-1 space-y-4">
              <PredictiveAddressFinder 
                address={formData.projectInfo.projectAddress} 
                onAddressChange={handleAddressChange}
                onCoordinatesChange={handleCoordinatesChange}
              />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="Your email address"
                value={formData.projectInfo.contactEmail}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="Your contact number"
                value={formData.projectInfo.contactPhone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        <div className="design-brief-form-group">
          <div className="mb-6">
            <Label htmlFor="projectType">Project Type</Label>
            <Select 
              value={formData.projectInfo.projectType} 
              onValueChange={handleProjectTypeChange}
            >
              <SelectTrigger id="projectType" className="mt-1">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_build">New Build</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="extension">Extension</SelectItem>
                <SelectItem value="interior_only">Interior Design Only</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="projectDescription">
              Project Description
              <span className="text-muted-foreground text-sm ml-2">(optional)</span>
            </Label>
            <Textarea
              id="projectDescription"
              name="projectDescription"
              placeholder="Briefly describe your project and what you hope to achieve..."
              value={formData.projectInfo.projectDescription}
              onChange={handleChange}
              className="mt-1 h-32"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <div></div> {/* Empty div for spacing */}
          <Button onClick={handleNext} className="group">
            <span>Next: Project Team</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
