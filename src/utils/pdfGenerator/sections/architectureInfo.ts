
import { ProjectData } from '@/types';
import { PDFContext } from '../types';
import { addSectionTitle, addText, addMultiLineText, addSpace } from '../layout';

export const renderArchitectureInfo = (ctx: PDFContext, projectData: ProjectData): void => {
  addSectionTitle(ctx, 'Architecture Preferences');
  
  if (projectData.formData.architecture.stylePrefences) {
    addText(ctx, 'Style Preferences', '');
    addMultiLineText(ctx, projectData.formData.architecture.stylePrefences);
  }
  
  if (projectData.formData.architecture.externalMaterials) {
    addText(ctx, 'External Materials', '');
    addMultiLineText(ctx, projectData.formData.architecture.externalMaterials);
  }
  
  if (projectData.formData.architecture.internalFinishes) {
    addText(ctx, 'Internal Finishes', '');
    addMultiLineText(ctx, projectData.formData.architecture.internalFinishes);
  }
  
  if (projectData.formData.architecture.sustainabilityGoals) {
    addText(ctx, 'Sustainability Goals', '');
    addMultiLineText(ctx, projectData.formData.architecture.sustainabilityGoals);
  }
  
  if (projectData.formData.architecture.specialFeatures) {
    addText(ctx, 'Special Features', '');
    addMultiLineText(ctx, projectData.formData.architecture.specialFeatures);
  }
  
  // Add the inspiration links and comments to the PDF
  if (projectData.formData.architecture.inspirationLinks) {
    addText(ctx, 'Inspiration Links', '');
    addMultiLineText(ctx, projectData.formData.architecture.inspirationLinks);
  }
  
  if (projectData.formData.architecture.inspirationComments) {
    addText(ctx, 'Inspiration Comments', '');
    addMultiLineText(ctx, projectData.formData.architecture.inspirationComments);
  }
  
  addSpace(ctx, 8);
};
