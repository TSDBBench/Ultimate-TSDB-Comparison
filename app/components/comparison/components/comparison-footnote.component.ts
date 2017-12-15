import { Component, Input, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';
import { ComparisonService } from './comparison.service';
import { ComparisonCitationService } from './comparison-citation.service';
import { CitationPipe } from '../../pipes/citation-pipe/citation.pipe';

@Component({
    selector: 'comparison-footnote',
    template: '<div [innerHtml]="compiled_footnote|sanitizeHtml"></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComparisonFootnoteComponent implements OnChanges, OnDestroy {
    @Input() footnote: string;

    public compiled_footnote = '';

    constructor(private citationPipe: CitationPipe,
                private citationServ: ComparisonCitationService,
                private compServ: ComparisonService) {
    }

    private compile_footnote(note: string) {
        if (!this.compServ.footnotes[note]) {
            this.compServ.footnotes[note] = {
                value: this.citationPipe.transform(note, [this.citationServ, true]),
                index: (this.compServ.findex++ + 'r' + Math.random() * 100000).toString().substr(0, 5),
                count: 1
            };
        } else {
            this.compServ.footnotes[this.footnote].count++;
        }
        this.compiled_footnote = '\\footref&#123;' + this.compServ.footnotes[note].index + '&#125;';

    }

    ngOnChanges() {
        this.compile_footnote(this.footnote);
    }

    ngOnDestroy() {
        this.compServ.footnotes[this.footnote].count--;
        if (this.compServ.footnotes[this.footnote].count === 0) {
            delete this.compServ.footnotes[this.footnote];
        }
    }
}
