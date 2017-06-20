import { TableData, LabelCls, Value, Type } from "../index";
import { ColorDictionary } from "./color-dictionary";

export class TableDataSet {
    private tableDataSet: {[name: string]: TableData;} = {}
    private set: Array<TableData> = new Array<TableData>();
    public ready: boolean = false;

    constructor(jsonObj: any) {
        jsonObj.forEach(obj => {
            let lcls: LabelCls = new LabelCls();
            var values: {[name: string]: string;} = {};
            if (obj.type.values) {
                obj.type.values.forEach(val => {
                    let value: Value = new Value(val.name, val.description);
                    values[val.name] = val.description;
                    switch (val.class) {
                        case "label-success":
                            lcls.label_success.push(value);
                            break;
                        case "label-warning":
                            lcls.label_warning.push(value);
                            break;
                        case "label-danger":
                            lcls.label_danger.push(value);
                            break;
                        case "label-default":
                            lcls.label_default.push(value);
                            break;
                        case "label-info":
                            lcls.label_info.push(value);
                            break;
                        case "label-primary":
                            lcls.label_primary.push(value);
                            break;
                    }
                })
            }
            let colors: ColorDictionary = new ColorDictionary();
            if (obj.type && obj.type.values) {
                for (const v of obj.type.values) {
                    if (v.color) {
                        colors.setColor(v.name, v.color);
                    }
                }
            }
            let type: Type = new Type(
                obj.type.tag,
                obj.type.class,
                lcls,
                colors
            )
            let td: TableData = new TableData(
                obj.name,
                obj.tag,
                obj.urlTag,
                obj.style,
                obj.display,
                type,
                values,
                obj.sort
            )
            this.tableDataSet[obj.tag] = td;
        })
        this.ready = true;
    }

    public getTableData(tag: string): TableData {
        return this.tableDataSet[tag] ? this.tableDataSet[tag] : new TableData();
    }

    public getTableDataArray(): Array<TableData> {
        let size: number = 0;
        for (let key in this.tableDataSet) {
            if (!this.tableDataSet.hasOwnProperty(key)) continue;
            size++;
        }
        if (this.set.length != size) {
            for (let key in this.tableDataSet) {
                if (!this.tableDataSet.hasOwnProperty(key)) continue;
                this.set.push(this.tableDataSet[key]);
            }
        }
        return this.set;
    }
}