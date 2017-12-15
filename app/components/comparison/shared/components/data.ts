import { Property, ListItem, RatingSet, Rating } from './../index';
import { isNullOrUndefined } from 'util';
import { TableData } from './table-data';
import { ChangeDetectorRef } from '@angular/core';
import { ComparisonService } from '../../components/comparison.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ComparisonDataService } from '../../components/comparison-data.service';

declare const moment: any;

export class Data {
    private static repoData: {[name: string]: {lastCommit: Date, lastSync: Date}} = {};
    private changeDetector: ChangeDetectorRef = null;

    constructor(private lss: LocalStorageService,
                private dataService: ComparisonDataService,
                private comparisonService: ComparisonService,
                public tag: string = '',
                public descr: string = '',
                public url: string = '',
                public properties: {[name: string]: Property; } = {},
                public rating: RatingSet = new RatingSet({}),
                public enabled: boolean = true) {
        const temp: any = this.lss.get('repoData') || null;
        if (temp !== null) {
            if (Data.repoData === null) {
                Data.repoData = {};
            }
            for (const key in temp) {
                if (!temp.hasOwnProperty(key)) {
                    continue;
                }
                Data.repoData[key] = {lastCommit: new Date(temp[key].lastCommit), lastSync: new Date(temp[key].lastSync)};
            }
        }
    }

    public getProperty(name: string): Property {
        switch (name) {
            case 'tag':
                return new Property(this.tag, this.tag);
            case 'descr':
                return new Property(this.descr, this.descr);
            case 'url':
                return new Property(this.url, this.url);
            case 'Rating':
                return new Property(this.getRating() + '', this.getRating() + '');
            default:
                return this.properties[name] ? this.properties[name] : new Property();
        }
    }

    public getRepoLabels(td: TableData, change: ChangeDetectorRef) {
        if (this.changeDetector === null) {
            this.changeDetector = change;
        }
        moment.relativeTimeThreshold('m', 60);
        if (isNullOrUndefined(Data.repoData[this.tag]) ||
            moment(Data.repoData[this.tag].lastSync).fromNow().endsWith('hour ago') ||
            moment(Data.repoData[this.tag].lastSync).fromNow().endsWith('hours ago') ||
            moment(Data.repoData[this.tag].lastSync).fromNow().endsWith('days ago')) {

            this.dataService.getRepoData(this, this.properties['Repo'].plain);
            this.updateRepoLabels(td);
        }
        if (isNullOrUndefined(this.properties[td.tag])) {
            this.updateRepoLabels(td);
        }
        return this.properties[td.tag];
    }

    public updateRepoLabels(td: TableData) {
        if (isNullOrUndefined(Data.repoData[this.tag])) {
            return;
        }
        const current = moment(Data.repoData[this.tag].lastCommit);
        const now = moment();
        if (!isNullOrUndefined(this.properties[td.tag])) {
            this.properties[td.tag].list = [];
        } else {
            this.properties[td.tag] = new Property();
        }
        for (const key in td.values) {
            if (!td.values.hasOwnProperty(key)) {
                continue;
            }

            const value = td.values[key];

            let child = 'The last commit is ';
            const dateStrings = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
            for (const s of dateStrings) {
                const diff = Math.abs(now.diff(current, s));
                if (diff !== 0) {
                    child += diff;
                    // append unit in singular or plural
                    child += ' ' + (diff === 1 ? s.substr(0, s.length - 1) : s);
                    break;
                }
            }
            child += ' old';

            const min = value['min-age'];
            const minUnit = value['min-age-unit'];
            const max = value['max-age'];
            const maxUnit = value['max-age-unit'];

            const minDiff = Math.abs(now.diff(current, minUnit));
            const maxDiff = Math.abs(now.diff(current, maxUnit));

            if ((min === -1 || minDiff >= min) && (max === -1 || maxDiff < max)) {
                this.properties[td.tag].list.push(new ListItem(key, child, this.comparisonService.converter));
                this.properties[td.tag].plain = Math.abs(now.diff(current));
                return this.properties[td.tag];
            }
        }
    }

    public setRepoData(data: {lastCommit: Date, lastSync: Date}) {
        if (Data.repoData === null) {
            Data.repoData = {};
        }
        Data.repoData[this.tag] = data;
        const saving = {};
        for (const d in Data.repoData) {
            if (Data.repoData.hasOwnProperty(d)) {
                continue;
            }
            saving[d] = {
                lastCommit: Data.repoData[d].lastCommit.getTime(),
                lastSync: Data.repoData[d].lastSync.getTime()
            };
        }
        this.lss.set('repoData', saving);
        this.changeDetector.markForCheck();
    }

    public getPropertyTags(name: string): Array<string> {
        const tagList: Array<string> = [];
        const p: Property = this.getProperty(name);
        p.list.forEach(item => {
            tagList.push(item.content);
        });
        return tagList;
    }

    public getPropertyListItems(name: string): Array<ListItem> {
        return this.getProperty(name).list;
    }

    public getRating(): number {
        return this.rating.getAverage();
    }

    public getRatings(): Array<Rating> {
        return this.rating.getRatings();
    }
}
