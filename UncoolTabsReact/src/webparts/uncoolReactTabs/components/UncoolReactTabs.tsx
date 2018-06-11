import * as React from 'react';
import styles from './UncoolReactTabs.module.scss';
import { IUncoolReactTabsProps } from './IUncoolReactTabsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { LoDashWrapperBase } from 'lodash';
import * as ReactDOM from 'react-dom';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

export interface tabEntry {
  title: string;
  content: string;
  selectedWebPart?: string;
}

export interface webParts {
  webPart: string;
}

export interface tabConfig {
  items: Array<tabEntry>;
  webparts: Array<string>;
  allContent: any;
  availableWebParts: any;
  preview: boolean;
}


export interface tabState extends tabConfig {
}

export default class UncoolReactTabs extends React.Component<IUncoolReactTabsProps, {}> {


  state: tabState;
  textEntry: tabConfig;

  constructor(props) {

    super(props);

    this.textEntry = {
      items: [
        {
          title: "Tab 1",
          content: "Content of Tab 1",
          selectedWebPart: null
        },
        {
          title: "Tab 2",
          content: "Content of Tab 2",
          selectedWebPart: null
        },
        {
          title: "Tab 3",
          content: "Content of Tab 3",
          selectedWebPart: null
        }
      ],
      webparts: [],
      allContent: [],
      availableWebParts: [],
      preview: false
    }

    this.state = this.textEntry;

  }

  getAllWebparts() {

    let newState = this.state;
    newState.allContent = [];

    newState.preview = !newState.preview;

    this.setState(newState);

    if(newState.preview == false){
      return;
    }

    var items = this.state.items;

    for (let i = 0; i < items.length; i++) {

      console.log("webpart key", items[i].selectedWebPart);

      let webparts = document.querySelectorAll("div[data-sp-a11y-id='" + items[i].selectedWebPart + "']");

      let webPartsID = [];

      var myElement = webparts[0] as HTMLElement;

      console.log(myElement);
      webPartsID.push(myElement);

      myElement.style.display = "none";

      newState.allContent.push((
        <div dangerouslySetInnerHTML={{ __html: webparts[0].innerHTML }}></div>
      )
      )

    }

    this.setState(newState);

  }

  addNewTab() {

    let newTab = {
      title: "New Tab",
      content: "New Content"
    }

    let newState = this.state;
    newState.items.push(newTab);

    this.setState(newState);

  }

  componentDidMount() {
    console.log(ReactDOM);
  }

  getAllComponents() {

    let webparts = document.querySelectorAll('.ControlZone');

    console.log(webparts);

    let componentWebParts = [];

    for (let i = 0; i < webparts.length; i++) {

      let curWebPart = webparts[i];

      // in case no component name could be found
      let registeredComp = curWebPart.querySelectorAll("div[id^='cswpAccessibleLabelContextual']");

      let registeredName = null;

      // redefine if name is available
      if (registeredComp.length !== 0) {

        registeredName = registeredComp[0].textContent;

      } else {

        registeredName = "";

      }

      let componentWebPart = {
        key: curWebPart.getAttribute('data-sp-a11y-id'),
        text: registeredName
      }

      componentWebParts.push(componentWebPart);

    }

    console.log(componentWebParts);

    let newState = this.state;
    newState.availableWebParts = componentWebParts;

    this.setState(newState);

    return componentWebParts;

  }

  updateTabName(index, event) {

    var currentEntry = this.state.items[index];

    currentEntry.title = event.target.value;

    let newState = this.state;
    newState.items[index].title = event.target.value !== null ? event.target.value : 'Tabname';

    this.setState(newState);

  }

  changeOrder(index, event) {

    console.log(index, event);

    let stateItems = this.state.items,
      currentEntry = this.state.items[index],
      beforeIndex = event.key,
      beforeIndexEntry = this.state.items[event.key];

    stateItems[beforeIndex] = currentEntry;
    stateItems[index] = beforeIndexEntry;

    let newState = this.state;
    newState.items = stateItems;

    this.setState(newState);

  }

  positionOptions(max) {

    let options = [];

    for (let i = 0; i < max; i++) {

      let option = {
        key: i,
        text: i + 1
      }

      options.push(option);

    }

    return options;

  }

  saveWebPartSelection(index, selectedOption) {

    let newState = this.state;

    newState.items[index].selectedWebPart = selectedOption.key;

    this.setState(newState);

  }

  createEditZone(index: number) {

    if (this.state.preview) {
      return;
    }

    var currentEntry = this.state.items[index];

    let stateItem = {
      item: currentEntry,
      index: index
    };

    let positionOptions = this.positionOptions(this.state.items.length);

    return (
      <div className="editZone">
        <TextField label="Tab Name" value={currentEntry.title}
          onKeyUp={this.updateTabName.bind(this, index)} />
        <Dropdown
          label="Select Item Index"
          options={positionOptions}

          selectedKey={index}
          onChanged={this.changeOrder.bind(this, index)}
        />
        <Dropdown
          label="Select Web Part"
          options={this.state.availableWebParts}
          selectedKey={this.state.items[index].selectedWebPart}
          onChanged={this.saveWebPartSelection.bind(this, index)}
        // onFocus={this.getAllComponents.bind(this)}
        />
      </div>
    )

  }

  fillComponents(options) {

    options = this.getAllComponents();

  }

  public render(): React.ReactElement<IUncoolReactTabsProps> {

    let tabContent = this.state.items.map((item: tabEntry, index: number) => {

      let webpartContent = this.state.allContent[index] !== undefined ? this.state.allContent[index] : "";

      let editPanel = this.createEditZone(index);

      return (<PivotItem linkText={item.title}>
        {editPanel}
        {webpartContent}
      </PivotItem>)

    });

    return (
      <div className={styles.uncoolReactTabs} >
        <div className={styles.container}>
          <DefaultButton onClick={this.addNewTab.bind(this)} text="Add new Tab" />
          <DefaultButton onClick={this.getAllWebparts.bind(this)} text="Get All Web Parts" />
          <DefaultButton onClick={this.getAllComponents.bind(this)} text="Get All Component" />
          <Pivot>
            {tabContent}
          </Pivot>
        </div>
      </div>
    );
  }
}
