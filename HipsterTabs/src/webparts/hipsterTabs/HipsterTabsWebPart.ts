import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneToggle } from "@microsoft/sp-webpart-base";
import {
  CustomCollectionFieldType,
  PropertyFieldCollectionData,
} from "@pnp/spfx-property-controls/lib/PropertyFieldCollectionData";
import * as strings from "HipsterTabsWebPartStrings";
import * as React from "react";
import * as ReactDom from "react-dom";

import HipsterTabs, { IHipsterTabsProps } from "./components/HipsterTabs";
import { IHipsterTab } from "./components/IHipsterTab";
import { IHipsterTabsWebPartProps } from "./IHipsterTabsWebPartProps";

export default class HipsterTabsWebPart extends BaseClientSideWebPart<IHipsterTabsWebPartProps> {

  protected onInit(): Promise<void> {
    //this.properties.tabModel = hipsterTabsToModel(this.properties.tabs, this.getZones());

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IHipsterTabsProps > = React.createElement(
      HipsterTabs,
      {
        instanceId: this.instanceId,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateTitle: (title:string) => {
          this.properties.title = title;
        },
        configure: () => {
          this.context.propertyPane.open();
        },
        tabs: this.properties.tabs,
        showAsLinks: this.properties.showAsLinks,
        normalSize: this.properties.normalSize,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private getZones(): Array<[string,string]> {
    const zones = new Array<[string,string]>();

    const zoneElements:NodeListOf<HTMLElement> = <NodeListOf<HTMLElement>>document.querySelectorAll(".CanvasZoneContainer > .CanvasZone");
    for(let z = 0; z < zoneElements.length; z++) {
      // disqualify the zone containing this webpart
      if(!zoneElements[z].querySelector(`[data-instanceId="${this.instanceId}"]`)) {
        const zoneId = zoneElements[z].dataset.spA11yId;
        const sectionCount = zoneElements[z].getElementsByClassName("CanvasSection").length;
        let zoneName:string = `${strings.PropertyPane_SectionName_Section} ${z+1} (${sectionCount} ${sectionCount==1 ? strings.PropertyPane_SectionName_Column : strings.PropertyPane_SectionName_Columns})`;
        zones.push([zoneId, zoneName]);
      }
    }

    return zones;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneFieldChanged(propertyPath:string, oldValue:any, newValue:any): void {
    if (propertyPath == "tabs") {
      // Get Unique tab names
      const tabNames = new Array<string>();
      this.properties.tabs.forEach((tab:IHipsterTab) => {
        if(tabNames.indexOf(tab.name) == -1) {
          tabNames.push(tab.name);
        }
      });

      // Group entries by tab name (preserving the order)
      // also removes duplicate section entries
      const groupedTabs = new Array<IHipsterTab>();
      const assignedSections = new Array<string>();
      tabNames.forEach((name:string) => {
        groupedTabs.push(...
          this.properties.tabs.filter((tab:IHipsterTab) => {
            if(tab.name == name) {
              if(assignedSections.indexOf(tab.sectionId) == -1) {
                assignedSections.push(tab.sectionId);
                return true;
              }
            }
            return false;
          })
        );
      });

      this.properties.tabs = groupedTabs;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyFieldCollectionData("tabs", {
                  key: "tabs",
                  label: strings.PropertyPane_TabsLabel,
                  panelHeader: strings.PropertyPane_TabsHeader,
                  manageBtnLabel: strings.PropertyPane_TabsButtonLabel,
                  value: this.properties.tabs,
                  
                  fields: [
                    {
                      id: "name",
                      title: strings.PropertyPane_TabsField_Name,
                      type: CustomCollectionFieldType.string,
                      required: true,
                    },
                    {
                      id: "sectionId",
                      title: strings.PropertyPane_TabsField_Section,
                      type: CustomCollectionFieldType.dropdown,
                      required: true,
                      options: this.getZones().map((zone:[string,string]) => {
                        return {
                          key: zone["0"],
                          text: zone["1"],
                        };
                      }),
                    },
                  ],
                }),
                PropertyPaneToggle("showAsLinks", {
                  label: strings.PropertyPane_LinksLabel,
                  checked: this.properties.showAsLinks,
                  onText: strings.PropertyPane_LinksOnLabel,
                  offText: strings.PropertyPane_LinksOffLabel,
                }),
                PropertyPaneToggle("normalSize", {
                  label: strings.PropertyPane_SizeLabel,
                  checked: this.properties.normalSize,
                  onText: strings.PropertyPane_SizeOnLabel,
                  offText: strings.PropertyPane_SizeOffLabel,
                }),
              ]
            },
          ]
        }
      ]
    };
  }
}
