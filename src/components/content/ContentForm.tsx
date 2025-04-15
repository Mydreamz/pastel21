
import React from 'react';
import ContentFormProvider from './form/ContentFormProvider';
import TitleField from './form/TitleField';
import TeaserField from './form/TeaserField';
import PriceField from './form/PriceField';
import ContentSection from './form/ContentSection';
import AdvancedSettings from './form/AdvancedSettings';
import FormActions from './form/FormActions';
import { ContentFormValues } from './form/ContentFormProvider';

interface ContentFormProps {
  onSubmit: (values: ContentFormValues) => void;
  onCancel: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, onCancel }) => {
  return (
    <ContentFormProvider onSubmit={onSubmit}>
      <TitleField />
      <TeaserField />
      <PriceField />
      <ContentSection />
      <AdvancedSettings />
      <FormActions onCancel={onCancel} />
    </ContentFormProvider>
  );
};

export default ContentForm;
// We're not re-exporting ContentFormValues as it's now imported directly from the provider
