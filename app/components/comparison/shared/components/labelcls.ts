import { Value } from './value';

export class LabelCls {
    constructor(public label_success: Array<Value> = Array<Value>(),
                public label_warning: Array<Value> = Array<Value>(),
                public label_danger: Array<Value> = Array<Value>(),
                public label_default: Array<Value> = Array<Value>(),
                public label_info: Array<Value> = Array<Value>(),
                public label_primary: Array<Value> = Array<Value>()) {
    }

    public getCls(item: string): string {
        if (this.label_success.some(it => it.name === item)) {
            return 'label-success';
        }
        if (this.label_warning.some(it => it.name === item)) {
            return 'label-warning';
        }
        if (this.label_danger.some(it => it.name === item)) {
            return 'label-danger';
        }
        if (this.label_default.some(it => it.name === item)) {
            return 'label-default';
        }
        if (this.label_info.some(it => it.name === item)) {
            return 'label-info';
        }
        if (this.label_primary.some(it => it.name === item)) {
            return 'label-primary';
        }
        return '';
    }
}
