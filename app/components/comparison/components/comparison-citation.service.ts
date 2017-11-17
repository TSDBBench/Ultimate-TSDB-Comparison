import { Injectable, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ComparisonCitationService {
    public bibEntriesHtml = {};
    public bibEntriesInline = {};
    private keys: {[name: string]: string; } = {};
    public references: Array<String> = [];

    public check = false;
    private precheck = false;
    public ready = false;

    constructor(private http: Http) {
    }

    public sortedReferences(): any[] {
        const values: any[] = [];
        for (const reference of this.references) {
            const key: any = reference;
            const entry: any = {'html': this.bibEntriesHtml[key]};
            entry['key'] = key;
            entry['index'] = this.bibEntriesInline[key];
            entry['index'] = entry['index'].substr(1, entry['index'].length - 2);
            values.push(entry);
        }
        return values.sort((a, b) => a.index - b.index);
    }

    public loadCitationData(cd: ChangeDetectorRef) {
        this.http.request('citation/output/fbib.json')
            .subscribe(res => {
                this.bibEntriesHtml = res.json();
                if (!this.check && this.precheck) {
                    this.check = true;
                } else {
                    this.precheck = true;
                }
                cd.markForCheck();
            });
        this.http.request('citation/output/fkeys.json')
            .subscribe(res => {
                this.bibEntriesInline = res.json();
                if (!this.check && this.precheck) {
                    this.check = true;
                } else {
                    this.precheck = true;
                }
                cd.markForCheck();
            });
    }

    public getUsedEntries() {
        const entries: Array<any> = [];
        for (const key in this.keys) {
            if (!this.keys.hasOwnProperty(key)) {
                continue;
            }
            entries.push({key: key, html: this.bibEntriesHtml[this.keys[key]]});
        }
        return entries.length > 0 ? entries : [{key: 'emty', html: ''}];
    }

    public addUsedEntries(entries) {
        const newEntries: Array<String> = new Array<String>();
        for (const entry of entries) {
            if (!this.keys[entry]) {
                newEntries.push(entry);
                this.keys[entry] = entry;
            }
        }
        if (newEntries.length > 0) {
            if (this.references) {
                this.references = this.references.concat(newEntries);
            } else {
                this.references = newEntries;
            }
        }
    }

    public getBibEntriesHtml(key) {
        return this.bibEntriesHtml[key];
    }

    public getBibEntriesInline(key) {
        return this.bibEntriesInline[key];
    }
}
