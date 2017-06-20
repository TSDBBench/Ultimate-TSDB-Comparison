import { Details } from "./details";

export class Comparison {
    public title: string;
    public subtitle: string;
    public selecttitle: string;
    public tabletitle: string;
    public repository: string;
    public details: Details;
    public displaytemplate: boolean;
    public displayall: boolean;

    constructor(jsonObj: any) {
        this.title = jsonObj.title ? jsonObj.title : "Ultimate-Comparison";
        this.subtitle = jsonObj.subtitle ? jsonObj.subtitle : "Ultimate comparison framework";
        this.selecttitle = jsonObj.selecttitle ? jsonObj.selecttitle : "Criteria";
        this.tabletitle = jsonObj.tabletitle ? jsonObj.tabletitle : "Comparison of ...";
        this.repository = jsonObj.repository ? jsonObj.repository : "https://github.com/ultimate-comparisons/ultimate-comparison-BASE.git";
        this.details = jsonObj.details ? new Details(jsonObj.details) : new Details({});
        this.displaytemplate = jsonObj.displaytemplate ? jsonObj.displaytemplate : false;
        this.displayall = jsonObj.displayall ? jsonObj.displayall : false;
    }

}