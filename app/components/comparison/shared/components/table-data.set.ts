import { TableData, LabelCls, Value, Type } from '../index';
import { ColorDictionary } from './color-dictionary';
import { isNullOrUndefined } from 'util';

export class TableDataSet {
    private tableDataSet: {[name: string]: TableData;} = {};
    private set: Array<TableData> = [];
    public ready = false;

    constructor() {

    }

    public load(jsonObj: any) {
        jsonObj.forEach(obj => {
            const lcls: LabelCls = new LabelCls();
            const values: any = {};
            if (obj.type.values) {
                obj.type.values.forEach(val => {
                    const value: Value = new Value(val.name, val.description);
                    if (isNullOrUndefined(val['min-age'])) {
                        values[val.name] = { tag: val.description, weight: val.weight };
                    } else {
                        const v = {};
                        v['min-age'] = val['min-age'];
                        v['min-age-unit'] = val['min-age-unit'];
                        v['max-age'] = val['max-age'];
                        v['max-age-unit'] = val['max-age-unit'];
                        v['description'] = val.description;
                        values[val.name] = v;
                    }
                    switch (val.class) {
                        case 'label-success':
                            lcls.label_success.push(value);
                            break;
                        case 'label-warning':
                            lcls.label_warning.push(value);
                            break;
                        case 'label-danger':
                            lcls.label_danger.push(value);
                            break;
                        case 'label-default':
                            lcls.label_default.push(value);
                            break;
                        case 'label-info':
                            lcls.label_info.push(value);
                            break;
                        case 'label-primary':
                            lcls.label_primary.push(value);
                            break;
                    }
                });
            }
            const colors: ColorDictionary = new ColorDictionary();
            if (obj.type && obj.type.values) {
                for (const v of obj.type.values) {
                    if (v.color) {
                        colors.setColor(v.name, v.color);
                    }
                }
            }
            const foregroundColors: ColorDictionary = new ColorDictionary();
            if (obj.type && obj.type.values) {
                for (const v of obj.type.values) {
                    if (v.foreground) {
                        foregroundColors.setColor(v.name, v.foreground);
                    }
                }
            }
            const type: Type = new Type(
                obj.type.tag,
                obj.type.class,
                lcls,
                colors,
                foregroundColors
            );
            let order = obj.order;
            if (!isNullOrUndefined(order)) {
                order = order.toLowerCase();
            }
            const td: TableData = new TableData(
                obj.name,
                obj.tag,
                obj.urlTag,
                obj.style,
                obj.display,
                type,
                values,
                obj.sort,
                obj.repo,
                order
            );
            this.tableDataSet[obj.tag] = td;
        });
        this.ready = true;
    }

    public getTableData(tag: string): TableData {
        if (!this.ready) {
            return new TableData();
        }
        return this.tableDataSet[tag] ? this.tableDataSet[tag] : new TableData();
    }

    public getTableDataArray(): Array<TableData> {
        if (!this.ready) {
            return [];
        }
        let size = 0;
        for (const key in this.tableDataSet) {
            if (!this.tableDataSet.hasOwnProperty(key)) {
                continue;
            }
            size++;
        }
        if (this.set.length !== size) {
            for (const key in this.tableDataSet) {
                if (!this.tableDataSet.hasOwnProperty(key)) {
                    continue;
                }
                this.set.push(this.tableDataSet[key]);
            }
        }
        return this.set;
    }
}
