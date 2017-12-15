import { Pipe, PipeTransform } from '@angular/core';
import { ComparisonCitationService } from './../../comparison/components/comparison-citation.service';
import { isUndefined } from 'util';

@Pipe({
    name: 'citation',
    pure: false
})
export class CitationPipe implements PipeTransform {
    transform(value: string, args: Array<any> = []) {
        if (isUndefined(value) || value.length === 0) {
            return '';
        }
        const citServ: ComparisonCitationService = args[0];
        const latex: boolean = args[1];
        const entries: Array<string> = [];
        if (!latex) {
            value = value.replace(/(?:\[@)([^\]]*)(?:\])/g, (match, dec) => {
                entries.push(dec);
                return '<a class="cite-link" href="#' + dec + '">' + citServ.getBibEntriesInline(dec) + '</a>';
            });
        } else {
            value = value.replace(/(?:\[@)([^\]]*)(?:\])/g, (match, dec) => {
                return '\\cite{' + dec + '}';
            });
        }
        if (entries.length > 0) {
            citServ.addUsedEntries(entries);
            citServ.ready = true;
        }

        return value;
    }
}
