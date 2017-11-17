import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import { isNullOrUndefined } from "util";
import { InputInterface } from "../input-interface";

@Component({
    selector: 'select2',
    templateUrl: 'select2.template.html',
    styleUrls: [
        'select2.component.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Select2Component implements InputInterface {
    public static components: Array<Select2Component> = [];
    private ops = [{value: 't1', label: 't2'}];
    @Input() options: Array<Object> = [];
    @Input() maximumSelectionLength = 0;
    @Input() placeholder: string;
    @Input() tag: string;
    @Input() name: string;
    @ViewChild('selector') ngSelect: any;

    @Output() result: EventEmitter<any> = new EventEmitter();

    private value: Array<string> = [];

    public constructor(private cd: ChangeDetectorRef) {
        Select2Component.components.push(this);
    }

    public select(item) {
        this.value.push(item.text);
        this.result.emit(this.value);
    }

    public deSelect(item) {
        const index = this.value.indexOf(item.text);
        if (index >= -1) {
            this.value.splice(index, 1);
        }
        this.result.emit(this.value);
    }

    public addToGui(item: string) {
        if (isNullOrUndefined(this.ngSelect.active)) {
            this.ngSelect.active = [];
        }
        let value;
        for (const elem of this.ngSelect.itemObjects) {
            if (elem.text === item) {
                value = elem;
                break;
            }
        }

        // JS (and thus TS) has no contains method for arrays.
        // A workaround is checking if the index of an element is -1 (indicating not present)
        if (this.ngSelect.active.indexOf(value) !== -1) {
            return;
        }
        this.ngSelect.active.push(value);
        this.cd.markForCheck();
    }
}
