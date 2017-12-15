import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { TableDataSet, CriteriaSet, Comparison, TableData } from './../shared/index';
import { ComparisonDataService } from './comparison-data.service';
import { ComparisonService } from './comparison.service';
import { ComparisonComponent } from './comparison.component';

@Injectable()
export class ComparisonConfigService {
    public tableDataSet = new TableDataSet();
    public criteriaSet: CriteriaSet;
    public comparison: Comparison;
    public description: string;
    public displayAllName = 'All';
    public displayAll: boolean;

    constructor(public title: Title,
                private http: Http,
                private comparisonDataService: ComparisonDataService,
                private comparisonService: ComparisonService) {
    }

    public loadTableData(cd: ChangeDetectorRef) {
        this.http.request('comparison-configuration/table.json')
            .subscribe(res => {
                this.tableDataSet.load(res.json());
                cd.markForCheck();
                this.comparisonDataService.loadData(this.tableDataSet, cd);
            });
    }

    public loadCriteria(cd: ChangeDetectorRef) {
        this.http.request('comparison-configuration/criteria.json')
            .subscribe(res => {
                this.criteriaSet = new CriteriaSet(res.json());
                cd.markForCheck();
            });
    }

    public loadComparison(cd: ChangeDetectorRef) {
        this.http.request('comparison-configuration/comparison.json')
            .subscribe(res => {
                this.comparison = new Comparison(res.json());
                this.title.setTitle(this.comparison.title);
                cd.markForCheck();
            });
    }

    public loadDescription(cd: ChangeDetectorRef) {
        this.http.request('comparison-configuration/description.md')
            .subscribe(res => {
                this.description = this.comparisonService.converter.makeHtml(res.text());
                cd.markForCheck();
            });
    }

    public getBodyAttachmentTags(): Array<string> {
        if (!this.comparison) {
            return [];
        }
        let tags: Array<string> = this.comparison.details.bodyAttachmentTags;
        if (tags.length === 0) {
            tags = this.comparisonDataService.getDefaultAttachmentTags();
        }
        return tags;
    }

    public displayAllChange(toggle: boolean, self: ComparisonComponent) {
        if (this.tableDataSet) {
            this.tableDataSet.getTableDataArray().forEach((item) => {
                item.display = toggle;
            });
            this.displayAllName = toggle ? 'None' : 'All';
            self.change();
        }
    }

    public displayChange(column: TableData, self: ComparisonComponent) {
        column.display = !column.display;
        self.change();
    }
}
