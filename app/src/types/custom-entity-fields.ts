export interface CustomEntityField {
  label: string;
  key: string;
  fieldType: {
    type: string;
  };
  validation?: {
    rule: string;
    errorMessage: string;
    level: string;
    validate: () => boolean;
  };
}
