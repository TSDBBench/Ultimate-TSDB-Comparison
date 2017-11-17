import { Component, Input } from '@angular/core';
import { TableData, Type, Data } from '../shared/index';
import { ComparisonConfigService } from './comparison-config.service';
import { ComparisonDataService } from './comparison-data.service';
import { ComparisonService } from './comparison.service';
import { ComparisonCitationService } from './comparison-citation.service';
import { isNullOrUndefined } from "util";

@Component({
    selector: 'comparison-details',
    templateUrl: '../templates/comparison-details.template.html',
    styleUrls: ['../styles/comparison-details.component.css']
})
export class ComparisonDetailsComponent {
    @Input() data: Data;

    private opened = false;
    private modalSelected: string;
    private selected: string;
    private template: string;
    private description;
    private table;
    private detail;
    private header = {
        html: '',
        text: '',
        label: {},
        url: '',
        column: new TableData(),
    };

    private body = '';

    constructor(public serv: ComparisonService,
                public dataServ: ComparisonDataService,
                public confServ: ComparisonConfigService,
                public citationServ: ComparisonCitationService) {
    }

    private getBody(): string {
        let data = <string> this.data.getProperty(this.confServ.comparison.details.body).plain;
        if (isNullOrUndefined(data)) {
            data = String(this.data.getProperty(this.confServ.comparison.details.body).plain);
        }
        const body = this.confServ.comparison ?
            this.serv.converter.makeHtml(data) : '';
        if (body && body !== this.body) {
            this.body = body;
        }
        return this.body;
    }

    private getHeaderText(): string {
        const headerText = this.confServ.comparison ? this.data[this.confServ.comparison.details.header] : '';
        if (headerText && headerText !== this.header.text) {
            this.header.text = headerText;
        }
        return this.header.text;
    }

    private getHeaderUrl(): string {
        const headerUrl = this.confServ.comparison ? this.data[this.confServ.comparison.details.headerUrl] : '';
        if (headerUrl && headerUrl !== this.header.url) {
            this.header.url = headerUrl;
        }
        return this.header.url;
    }

    private getHeaderColumn(): TableData {
        const headerColumn = (this.confServ.comparison && this.confServ.tableDataSet) ?
            this.confServ.tableDataSet.getTableData(this.confServ.comparison.details.headerLabel) :
            new TableData();
        if (headerColumn && headerColumn !== this.header.column) {
            this.header.column = headerColumn;
        }
        return this.header.column;
    }

    private getHeaderLabel(): Type {
        const headerLabel = (this.confServ.comparison && this.confServ.tableDataSet) ?
            this.confServ.tableDataSet.getTableData(this.confServ.comparison.details.headerLabel).type :
            new Type();
        if (headerLabel && headerLabel !== this.header.label) {
            this.header.label = headerLabel;
        }
        return headerLabel;
    }

    private getTable(tag: string): TableData {
        return this.confServ.tableDataSet ? this.confServ.tableDataSet.getTableData(tag) : new TableData();
    }
}
