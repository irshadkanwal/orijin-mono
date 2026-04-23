export type GeneralConfig = {
    phoneCountryCode?: string;
    phoneValidationPhoneOnlyRegex?: string;
    phoneValidationRegex?: string;
    standardAreaUnit?: string;
    standardAreaUnitForImport?: string;
    standardDateFormat?: string;
    standardDateTimeFormat?: string;
    standardRounding?: string;
    standardWeightUnit?: string;
    testWorkspace?: string;
    masterWorkspace?: string;
  };
  
  export type LocalityConfig = {
    availableCurrencyUnits?: string;
    availableLocales?: string;
    availableTemperatureUnits?: string;
    availableWeightUnits?: string;
    defaultCountry?: string;
    defaultCountryCode?: string;
    defaultCurrencyUnit?: string;
    defaultLocale?: string;
    defaultTemperatureUnit?: string;
    defaultWeightUnit?: string;
  };
  