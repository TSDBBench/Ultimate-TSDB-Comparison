import { LabelCls } from "./labelcls";
import { ColorDictionary } from "./color-dictionary";

export class Type {
    constructor(public tag: string = "",
                public cls: string = "",
                public labelCls: LabelCls = new LabelCls(),
                public colors: ColorDictionary = new ColorDictionary()) {
    }

    public getCls(item: string): string {
        let labelClsString = this.labelCls.getCls(item);
        if (this.cls == "" && labelClsString == "" && this.colors[item] === "") {
            return "label label-default";
        } else if (this.cls == "" && labelClsString == "") {
            return "label";
        } else if (labelClsString != "") {
            return "label " + labelClsString;
        } else {
            //quick fix for old implementations
            return this.cls != "label" ? this.cls : this.cls + "label-default";
        }
    }
}