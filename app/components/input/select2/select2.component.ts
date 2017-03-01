import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'select2',
    templateUrl: 'select2.template.html',
    styleUrls: [
        'select2.component.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Select2Component {
    private ops = [{value: 't1', label: 't2'}]
    @Input() options: Array<Object> = new Array<Object>();
    @Input() maximumSelectionLength: number = 0;
    @Input() placeholder: string;

    @Output() result: EventEmitter<any> = new EventEmitter();

    private value: Array<string> = new Array<string>();

    private select(item) {
        this.value.push(item.value);
        this.result.emit(this.value);
    }

    private deSelect(item) {
        let index = this.value.indexOf(item.value);
        if (index >= -1) {
            this.value.splice(index, 1);
        }
        this.result.emit(this.value);
    }
}