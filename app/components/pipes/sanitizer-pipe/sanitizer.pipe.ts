import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml',
    pure: false
})
export class SanitizerPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(v: string): SafeHtml {
        const html = this._sanitizer.bypassSecurityTrustHtml(v);
        if (html.hasOwnProperty('changingThisBreaksApplicationSecurity') &&
            /^<p>\d+\./.test(html['changingThisBreaksApplicationSecurity'])) {
            html['changingThisBreaksApplicationSecurity'] =
                '<p>' + html['changingThisBreaksApplicationSecurity']
                    .substr(html['changingThisBreaksApplicationSecurity'].indexOf('.') + 1);
        }
        return html;
    }
} 
