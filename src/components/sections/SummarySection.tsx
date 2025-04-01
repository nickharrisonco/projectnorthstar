
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignBrief } from '@/context/DesignBriefContext';
import { ArrowLeft, FileText, Mail, Pencil, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './SectionHeader';

// Define New Zealand architecture inspiration images
const inspirationImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop', alt: 'Modern New Zealand house with glass facade' },
  { id: '2', src: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&auto=format&fit=crop', alt: 'Contemporary coastal New Zealand home' },
  { id: '3', src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop', alt: 'Minimalist New Zealand living space with mountain views' },
  { id: '4', src: 'https://images.unsplash.com/photo-1600566752355-09c79c71a7b0?w=800&auto=format&fit=crop', alt: 'Open plan New Zealand kitchen and dining' },
  { id: '5', src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop', alt: 'Auckland modern house with outdoor deck' },
  { id: '6', src: 'https://images.unsplash.com/photo-1575403071235-5dcd06cbf169?w=800&auto=format&fit=crop', alt: 'Queenstown cabin with lake views' },
];

export function SummarySection() {
  const { formData, files, summary, updateSummary, setCurrentSection, generateSummary, sendByEmail, exportAsPDF } = useDesignBrief();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(formData.projectInfo.contactEmail || '');
  const { toast } = useToast();
  
  // Generate summary on initial load if none exists
  useEffect(() => {
    if (!summary.generatedSummary && !isGenerating) {
      handleGenerateSummary();
    }
  }, [summary.generatedSummary]);
  
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      await generateSummary();
      toast({
        title: "Summary Generated",
        description: "We've created a summary based on your inputs.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem generating your summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSummary({ editedSummary: e.target.value });
  };
  
  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to receive the brief.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEmailSending(true);
    try {
      const success = await sendByEmail(recipientEmail);
      if (success) {
        toast({
          title: "Email Sent",
          description: "Your design brief has been sent to the provided email address.",
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSending(false);
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportAsPDF();
      toast({
        title: "PDF Generated",
        description: "Your design brief has been exported as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem exporting your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrevious = () => {
    setCurrentSection('communication');
  };
  
  // Function to generate a better summary text based on actual user inputs
  const generateBetterSummary = () => {
    // Project Info
    const clientName = formData.projectInfo.clientName || '[Client Name]';
    const projectAddress = formData.projectInfo.projectAddress || '[Project Address]';
    const projectType = formData.projectInfo.projectType 
      ? formData.projectInfo.projectType.replace('_', ' ') 
      : 'not specified';
    
    // Budget
    const budget = formData.budget.budgetRange || 'not specified';
    const timeframe = formData.budget.timeframe || 'not specified';
    
    // Occupants
    const occupants = formData.lifestyle.occupants || 'not specified';
    
    // Architecture
    const style = formData.architecture.stylePrefences || 'not specified';
    
    // Spaces
    const roomCount = formData.spaces.rooms.length;
    const roomList = roomCount > 0 
      ? formData.spaces.rooms.map(r => `${r.quantity} ${r.type}`).join(', ')
      : 'not specified';
    
    return `Design Brief Summary for ${clientName} at ${projectAddress}

This ${projectType} project has a budget of ${budget} with a timeframe of ${timeframe}. The home will be occupied by ${occupants} and is designed in a ${style} style.

The project includes ${roomCount} defined spaces: ${roomList}.

${formData.projectInfo.projectDescription ? `Additional project description: ${formData.projectInfo.projectDescription}` : ''}
${formData.budget.priorityAreas ? `Priority areas include: ${formData.budget.priorityAreas}` : ''}
${formData.lifestyle.specialRequirements ? `Special requirements: ${formData.lifestyle.specialRequirements}` : ''}
`;
  };
  
  // Update the summary when needed
  useEffect(() => {
    if (!summary.generatedSummary && !isGenerating) {
      const betterSummary = generateBetterSummary();
      updateSummary({
        generatedSummary: betterSummary,
        editedSummary: betterSummary
      });
    }
  }, [formData]);
  
  return (
    <div className="design-brief-section-wrapper">
      <div className="design-brief-section-container">
        <SectionHeader
          title="Design Brief Summary"
          description="Review your design brief summary and make any necessary edits before finalizing your brief."
        />
        
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="summary">Brief Summary</TabsTrigger>
            <TabsTrigger value="preview">Full Brief Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">AI-Generated Summary</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGenerateSummary}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Regenerate</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={!summary.editedSummary}
                      onClick={() => updateSummary({ editedSummary: summary.generatedSummary })}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span>Reset</span>
                    </Button>
                  </div>
                </div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Generating your summary...</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      <Pencil className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">You can edit this summary below</span>
                    </div>
                    <Textarea
                      value={summary.editedSummary || ""}
                      onChange={handleSummaryChange}
                      placeholder="Your AI-generated summary will appear here..."
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-bold">Finalize Your Brief</h3>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Export as PDF</h4>
                    <div className="flex items-start gap-4">
                      <Button 
                        onClick={handleExportPDF} 
                        disabled={isExporting}
                        className="min-w-[140px]"
                      >
                        <FileText className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                        <span>Export PDF</span>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Download your complete design brief as a PDF document with the title: 
                        <span className="font-semibold block">
                          "New Home Brief – {formData.projectInfo.clientName || "[Client Name]"} – {formData.projectInfo.projectAddress || "[Site Address]"}"
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Send by Email</h4>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <Label htmlFor="recipientEmail">Email Address</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="mt-1"
                          />
                        </div>
                        <div className="pt-6">
                          <Button 
                            onClick={handleSendEmail} 
                            disabled={isEmailSending}
                            className="min-w-[140px]"
                          >
                            <Mail className={`h-4 w-4 mr-2 ${isEmailSending ? 'animate-spin' : ''}`} />
                            <span>Send Email</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive a copy of your design brief by email. We'll also send a copy to our team for reference.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Complete Design Brief Preview</h3>
                
                <div className="border rounded-lg p-6 space-y-8">
                  {/* AI Summary Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Executive Summary</h4>
                    <div className="whitespace-pre-wrap text-sm">
                      {summary.editedSummary || (
                        <p className="text-muted-foreground italic">
                          No summary generated yet. Please go to the Summary tab to generate one.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Info Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Project Information</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Client Name:</p>
                        <p className="text-sm">{formData.projectInfo.clientName || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Project Address:</p>
                        <p className="text-sm">{formData.projectInfo.projectAddress || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact Email:</p>
                        <p className="text-sm">{formData.projectInfo.contactEmail || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Contact Phone:</p>
                        <p className="text-sm">{formData.projectInfo.contactPhone || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Project Type:</p>
                        <p className="text-sm">
                          {formData.projectInfo.projectType ? formData.projectInfo.projectType.replace('_', ' ') : "Not provided"}
                        </p>
                      </div>
                    </div>
                    
                    {formData.projectInfo.projectDescription && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Project Description:</p>
                        <p className="text-sm">{formData.projectInfo.projectDescription}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Budget Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Budget Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Budget Range:</p>
                        <p className="text-sm">{formData.budget.budgetRange || "Not provided"}</p>
                      </div>
                      {formData.budget.flexibilityNotes && (
                        <div>
                          <p className="text-sm font-medium">Budget Flexibility Notes:</p>
                          <p className="text-sm">{formData.budget.flexibilityNotes}</p>
                        </div>
                      )}
                      {formData.budget.priorityAreas && (
                        <div>
                          <p className="text-sm font-medium">Priority Areas:</p>
                          <p className="text-sm">{formData.budget.priorityAreas}</p>
                        </div>
                      )}
                      {formData.budget.timeframe && (
                        <div>
                          <p className="text-sm font-medium">Timeframe:</p>
                          <p className="text-sm">{formData.budget.timeframe}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Lifestyle Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Lifestyle</h4>
                    <div className="space-y-4">
                      {formData.lifestyle.occupants && (
                        <div>
                          <p className="text-sm font-medium">Occupants:</p>
                          <p className="text-sm">{formData.lifestyle.occupants}</p>
                        </div>
                      )}
                      {formData.lifestyle.occupationDetails && (
                        <div>
                          <p className="text-sm font-medium">Occupation Details:</p>
                          <p className="text-sm">{formData.lifestyle.occupationDetails}</p>
                        </div>
                      )}
                      {formData.lifestyle.dailyRoutine && (
                        <div>
                          <p className="text-sm font-medium">Daily Routine:</p>
                          <p className="text-sm">{formData.lifestyle.dailyRoutine}</p>
                        </div>
                      )}
                      {formData.lifestyle.entertainmentStyle && (
                        <div>
                          <p className="text-sm font-medium">Entertainment Style:</p>
                          <p className="text-sm">{formData.lifestyle.entertainmentStyle}</p>
                        </div>
                      )}
                      {formData.lifestyle.specialRequirements && (
                        <div>
                          <p className="text-sm font-medium">Special Requirements:</p>
                          <p className="text-sm">{formData.lifestyle.specialRequirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Site Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Site Information</h4>
                    <div className="space-y-4">
                      {formData.site.existingConditions && (
                        <div>
                          <p className="text-sm font-medium">Existing Conditions:</p>
                          <p className="text-sm">{formData.site.existingConditions}</p>
                        </div>
                      )}
                      {formData.site.siteFeatures && (
                        <div>
                          <p className="text-sm font-medium">Site Features:</p>
                          <p className="text-sm">{formData.site.siteFeatures}</p>
                        </div>
                      )}
                      {formData.site.viewsOrientations && (
                        <div>
                          <p className="text-sm font-medium">Views/Orientations:</p>
                          <p className="text-sm">{formData.site.viewsOrientations}</p>
                        </div>
                      )}
                      {formData.site.accessConstraints && (
                        <div>
                          <p className="text-sm font-medium">Access/Constraints:</p>
                          <p className="text-sm">{formData.site.accessConstraints}</p>
                        </div>
                      )}
                      {formData.site.neighboringProperties && (
                        <div>
                          <p className="text-sm font-medium">Neighboring Properties:</p>
                          <p className="text-sm">{formData.site.neighboringProperties}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Architecture Section */}
                  <div className="pb-6 border-b">
                    <h4 className="text-lg font-bold mb-4">Architectural Preferences</h4>
                    <div className="space-y-4">
                      {formData.architecture.stylePrefences && (
                        <div>
                          <p className="text-sm font-medium">Style Preferences:</p>
                          <p className="text-sm">{formData.architecture.stylePrefences}</p>
                        </div>
                      )}
                      {formData.architecture.externalMaterials && (
                        <div>
                          <p className="text-sm font-medium">External Materials:</p>
                          <p className="text-sm">{formData.architecture.externalMaterials}</p>
                        </div>
                      )}
                      {formData.architecture.internalFinishes && (
                        <div>
                          <p className="text-sm font-medium">Internal Finishes:</p>
                          <p className="text-sm">{formData.architecture.internalFinishes}</p>
                        </div>
                      )}
                      {formData.architecture.sustainabilityGoals && (
                        <div>
                          <p className="text-sm font-medium">Sustainability Goals:</p>
                          <p className="text-sm">{formData.architecture.sustainabilityGoals}</p>
                        </div>
                      )}
                      {formData.architecture.specialFeatures && (
                        <div>
                          <p className="text-sm font-medium">Special Features:</p>
                          <p className="text-sm">{formData.architecture.specialFeatures}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Uploads Section */}
                  {files.uploadedFiles.length > 0 && (
                    <div className="pb-6 border-b">
                      <h4 className="text-lg font-bold mb-4">Uploaded Files</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {files.uploadedFiles.map((file, index) => (
                          <div key={`upload-${index}`} className="text-sm">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Inspiration Section */}
                  {files.inspirationSelections.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold mb-4">Inspiration Selections</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {files.inspirationSelections.map((id) => {
                          const image = inspirationImages.find(img => img.id === id);
                          return image ? (
                            <div key={id} className="aspect-w-4 aspect-h-3 h-24">
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <p className="text-xs mt-1">{image.alt}</p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Communication Section */}
                  {(formData.communication.preferredMethods?.length > 0 || 
                    formData.communication.bestTimes?.length > 0 ||
                    formData.communication.availableDays?.length > 0 ||
                    formData.communication.frequency ||
                    formData.communication.urgentContact ||
                    formData.communication.responseTime) && (
                    <div className="pb-6 border-b">
                      <h4 className="text-lg font-bold mb-4">Communication Preferences</h4>
                      <div className="space-y-4">
                        {formData.communication.preferredMethods?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Preferred Methods:</p>
                            <p className="text-sm">{formData.communication.preferredMethods.join(', ')}</p>
                          </div>
                        )}
                        {formData.communication.bestTimes?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Best Times:</p>
                            <p className="text-sm">{formData.communication.bestTimes.join(', ')}</p>
                          </div>
                        )}
                        {formData.communication.availableDays?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Available Days:</p>
                            <p className="text-sm">{formData.communication.availableDays.join(', ')}</p>
                          </div>
                        )}
                        {formData.communication.frequency && (
                          <div>
                            <p className="text-sm font-medium">Update Frequency:</p>
                            <p className="text-sm">{formData.communication.frequency}</p>
                          </div>
                        )}
                        {formData.communication.urgentContact && (
                          <div>
                            <p className="text-sm font-medium">Urgent Contact:</p>
                            <p className="text-sm">{formData.communication.urgentContact}</p>
                          </div>
                        )}
                        {formData.communication.responseTime && (
                          <div>
                            <p className="text-sm font-medium">Expected Response Time:</p>
                            <p className="text-sm">{formData.communication.responseTime}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Previous: Communication</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
