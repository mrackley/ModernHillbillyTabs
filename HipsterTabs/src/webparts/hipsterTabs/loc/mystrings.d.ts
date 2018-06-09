declare interface IHipsterTabsWebPartStrings {
  PropertyPane_TabsLabel: string;
  PropertyPane_TabsHeader: string;
  PropertyPane_TabsButtonLabel: string;
  PropertyPane_TabsField_Name: string;
  PropertyPane_TabsField_Section: string;
  PropertyPane_SectionName_Section: string;
  PropertyPane_SectionName_Column: string;
  PropertyPane_SectionName_Columns: string;

  PropertyPane_LinksLabel: string;
  PropertyPane_LinksOnLabel: string;
  PropertyPane_LinksOffLabel: string;

  PropertyPane_SizeLabel: string;
  PropertyPane_SizeOnLabel: string;
  PropertyPane_SizeOffLabel: string;

  Placeholder_Header: string;
  Placeholder_Description: string;
  Placeholder_ButtonLabel: string;

  EditInstructions: string;
}

declare module 'HipsterTabsWebPartStrings' {
  const strings: IHipsterTabsWebPartStrings;
  export = strings;
}
