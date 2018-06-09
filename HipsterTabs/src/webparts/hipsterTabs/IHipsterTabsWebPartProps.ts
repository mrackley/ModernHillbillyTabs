import { IHipsterTab } from "./components/IHipsterTab";

export interface IHipsterTabsWebPartProps {
	title: string;
	tabs: Array<IHipsterTab>;
	showAsLinks: boolean;
	normalSize: boolean;
  }
