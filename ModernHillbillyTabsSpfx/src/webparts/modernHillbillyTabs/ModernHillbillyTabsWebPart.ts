import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape, times } from '@microsoft/sp-lodash-subset';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';


import styles from './ModernHillbillyTabsWebPart.module.scss';
import * as strings from 'ModernHillbillyTabsWebPartStrings';

import {SPComponentLoader} from '@microsoft/sp-loader';

export interface IModernHillbillyTabsWebPartProps {
  cssFile: string;
  tabData: any[];
}

import 'jquery';  
import 'jqueryui';

declare var $;

export default class ModernHillbillyTabsWebPart extends BaseClientSideWebPart<IModernHillbillyTabsWebPartProps> {

  public render(): void {
    SPComponentLoader.loadCss(this.properties.cssFile);

    require('./HillbillyTabs.js');
    console.log(this.instanceId);
    this.domElement.innerHTML = `
      <div class="${ this.instanceId }"><ul class="${ this.instanceId }"></ul>
      </div>`;

    $().HillbillyTabsModern({
      tabClass: this.instanceId,
      tabData: this.properties.tabData
    });

  }

  protected get disableReactivePropertyChanges(): boolean {	
    return true;
  }
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('cssFile', {
                  label: strings.CSSFileLable
                }),
                PropertyFieldCollectionData("tabData", {
                  key: "tabData",
                  label: "Tab Information",
                  panelHeader: "Enter Tab Information",
                  manageBtnLabel: "Manage tab configuration",
                  value: this.properties.tabData,
                  fields: [
                    {
                      id: "TabName",
                      title: "Tab Name",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "WebParts",
                      title: "Web Part Titles (separated by ;#)",
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ],
                  disabled: false
                }),                
              ]
            }
          ]
        }
      ]
    };
  }
}
