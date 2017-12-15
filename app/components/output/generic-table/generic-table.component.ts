import {
    AfterViewChecked,
    ApplicationRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output
} from '@angular/core';
import { CriteriaSelection, Data, TableData } from './../../comparison/shared/index';
import { ComparisonCitationService } from './../../comparison/components/comparison-citation.service';
import { ComparisonConfigService } from '../../comparison/components/comparison-config.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { ComparisonComponent } from '../../comparison/components/comparison.component';
import { Select2Component } from '../../input/select2/select2.component';
import { InputInterface } from "../../input/input-interface";
import { NumberInputComponent } from "../../input/number-input/number-input.component";
import { Criteria } from "../../comparison/shared/components/criteria";

declare const anchors;

@Component({
    selector: 'generictable',
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericTableComponent implements AfterViewChecked, OnChanges {
    private counter = 0;
    private table;

    @Input() display = false;
    @Input() settings = false;
    @Input() columns: Array<TableData> = [];

    @Input() data: Array<Data> = [];
    @Input() query: { [name: string]: CriteriaSelection; } = {};
    @Input() displayTemplate = false;

    @Input() citationServ: ComparisonCitationService;

    @Output() settingsCallback: EventEmitter<any> = new EventEmitter();
    @Output() showDetails: EventEmitter<any> = new EventEmitter();

    @Input() changeNum = 0;

    @Input() order: Array<String> = [];
    @Output() orderChange: EventEmitter<any> = new EventEmitter();
    @Input() orderOption: Array<number> = [];
    @Output() orderOptionChange: EventEmitter<any> = new EventEmitter();

    @Input() comparisonComponent: ComparisonComponent;

    private ctrlCounter = 0;

    constructor(private ar: ApplicationRef,
                private confServ: ComparisonConfigService,
                private sanitization: DomSanitizer,
                private http: Http,
                private cd: ChangeDetectorRef) {
    }

    private orderClick(e: MouseEvent, value: string) {
        const pos: number = this.order.findIndex(name => name === value);
        if (e.ctrlKey) {
            this.ctrlCounter = this.order[this.ctrlCounter] === value ? this.ctrlCounter : this.ctrlCounter + 1;
        } else {
            this.ctrlCounter = 0;
        }
        if (typeof pos !== 'undefined' && pos >= 0) {
            this.order[this.ctrlCounter] = value;
            this.orderOption[this.ctrlCounter] = this.orderOption[pos] === 1 ? -1 : 1;
            this.orderOption[pos] = pos !== this.ctrlCounter ? 0 : this.orderOption[this.ctrlCounter];
        } else {
            this.order[this.ctrlCounter] = value;
            this.orderOption[this.ctrlCounter] = 1;
        }
        if (this.ctrlCounter === 0) {
            for (let i = 1; i < this.orderOption.length; i++) {
                this.orderOption[i] = 0;
            }
        }
        this.orderChange.emit(this.order);
        this.orderOptionChange.emit(this.orderOption);
        this.table.trigger('reflow');
    }

    private displayOrder(value: string, option: number): boolean {
        if (this.order.length === 0 && this.orderOption.length === 0) {
            this.order[this.ctrlCounter] = 'tag';
            this.orderOption[this.ctrlCounter] = 1;
        }
        return this.order.findIndex(val => val === value) >= 0 && this.orderOption[this.order.findIndex(val => val === value)] === option;
    }

    ngAfterViewChecked(): void {
        this.table = (<any>$('table.table.table-hover'));
        this.table.floatThead();
        anchors.options = {
            placement: 'right'
        };
        anchors.add('.anchored');
    }

    ngOnChanges(): void {
        this.update();
    }

    public update(): void {
        if (this.table != null) {
            this.table.trigger('reflow');
        }
    }

    public shouldBeShown(data: Data) {
        if (this.confServ.comparison && this.confServ.comparison.displayall) {
            return true;
        }
        let val = true;
        for (const column of this.confServ.tableDataSet.getTableDataArray()) {
            if (column.display && data.properties[column.tag] != null && data.properties[column.tag].plain !== '') {
                return true;
            }
            if (column.display && data.properties[column.tag] != null) {
                val = false;
            }
        }
        return val;
    }

    public getColor(column: TableData, label: string): SafeHtml {
        return this.sanitization.bypassSecurityTrustStyle(column.type.colors.getColor(label));
    }

    public getForegroundColor(column: TableData, label: string): SafeHtml {
        const color = column.type.foregroundColors.getColor(label);
        if (color === '') {
            return this.sanitization.bypassSecurityTrustStyle('#0d0d0d');
        } else {
            return this.sanitization.bypassSecurityTrustStyle(color);
        }
    }

    public searchFor(column: string, value: string | number) {
        let c: Criteria = null;
        for (const crit of this.confServ.criteriaSet.getCriteriaArray()) {
            if (crit.name === column || crit.tag === column) {
                c = crit;
                break;
            }
        }
        if (c === null) {
            return;
        }

        if (c.values.indexOf(value) !== -1) {
            return;
        }

        let input: InputInterface = null;
        if (c.range_search) {
            for (const ni of NumberInputComponent.components) {
                if (ni.tag === column || ni.name === column) {
                    input = ni;
                    break;
                }
            }
            if (input === null) {
                return;
            }
            value = String(value);
            this.cd.markForCheck();
        } else {
            for (const s2 of Select2Component.components) {
                if (s2.tag === column || s2.name === column) {
                    input = s2;
                    break;
                }
            }
            if (input === null) {
                return;
            }
            value = String(value);
            this.comparisonComponent.criteriaChanged([value], c);
            this.comparisonComponent.change();
        }
        input.addToGui(value);
    }

    public isUrl(text: string) {
        if (text === null || text === undefined) {
            return false;
        }
        return text.startsWith('http');
    }
}
