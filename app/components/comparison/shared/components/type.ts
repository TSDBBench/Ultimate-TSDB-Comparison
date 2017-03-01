import { LabelCls } from "./labelcls";

export class Type {
    constructor(public tag: string = "",
                public cls: string = "",
                public labelCls: LabelCls = new LabelCls()) {
    }

    public getCls(item: string): string {
        let labelClsString = this.labelCls.getCls(item);
        if (this.cls == "" && labelClsString == "") {
            return "label label-default";
        } else if (labelClsString != "") {
            return "label " + labelClsString;
        } else {
            //quick fix for old implementations
            return this.cls != "label" ? this.cls : this.cls + "label-default";
        }
    }
}