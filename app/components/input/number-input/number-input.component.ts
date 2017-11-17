import { Component, Input, ViewChild } from '@angular/core';
import { ComparisonComponent } from "../../comparison/components/comparison.component";
import { Criteria } from "../../comparison/shared/components/criteria";
import { InputInterface } from "../input-interface";
import { isNullOrUndefined } from "util";

@Component({
    templateUrl: './number-input.template.html',
    selector: 'number-input',
    styleUrls: ['./number-input.component.css']
})
export class NumberInputComponent implements InputInterface {
    public static components: Array<NumberInputComponent> = [];
    @Input() comparisonComponent: ComparisonComponent;
    @Input() criteria: Criteria;
    @Input() tag: string;
    @Input() name: string;
    @ViewChild('content') content: any;

    public constructor() {
        NumberInputComponent.components.push(this);
    }

    public criteriaChanged(value: Array<String> | KeyboardEvent | { target: { value: string }}) {
        this.comparisonComponent.criteriaChanged(value, this.criteria);
    }

    public addToGui(item: string): void {
        if (isNullOrUndefined(this.content)) {
            return;
        }

        // regex for finding out if the item is already in the list.
        // tests "^ *item *$", "^ *item *,", ", *item *$", and ", *item *,"
        // these represent following patterns:
        // 1. arbitrary number of spaces, item, arbitrary number of spaces, complete field
        // 2. arbitrary number of spaces, item, arbitrary number of spaces, comma, start of field
        // 3. comma, arbitrary number of spaces, item, arbitrary number of spaces, end of field
        // 4. comma, arbitrary number of spaces, item, arbitrary number of spaces, comma, in the middle of the field
        // The commas are needed to make sure that it matches the complete number instead of partly, because else
        // "13" would match the pattern "3$".
        const regex = '(^ *' + item + ' *$|^ *' + item + ' *,|, *' + item + ' *,|, *' + item + ' *$)';
        if (new RegExp(regex).test(this.content.nativeElement.value)) {
            return;
        }

        if (this.content.nativeElement.value !== '') {
            item = ', ' + item;
        }
        this.content.nativeElement.value += item;
        this.criteriaChanged({ target: { value: this.content.nativeElement.value }});
    }
}
