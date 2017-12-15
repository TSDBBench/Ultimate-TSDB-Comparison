import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as showdown from 'showdown';

@Injectable()
export class ComparisonService {
    public converter: Showdown.Converter;

    public footnotes: {[name: string]: {value: string, index: string, count: number}; } = {};
    public findex = 0;

    public getFootnotes(): Array<string> {
        const fnotes: Array<string> = [];
        let ind = 0;
        for (const key in this.footnotes) {
            if (!this.footnotes.hasOwnProperty(key)) {
                continue;
            }
            if (this.footnotes[key].count < 1) {
                continue;
            }
            const item = this.footnotes[key];
            fnotes.push('\\footnotetext[\\numexpr\\snum+' +
                        (ind++) +
                        ']&#123;' +
                        item.value +
                        ' \\label&#123;' +
                        item.index +
                        '&#125; &#125;');
        }
        return fnotes;
    }


    constructor(public _sanitizer: DomSanitizer) {
        this.converter = new showdown.Converter();
    }
}
