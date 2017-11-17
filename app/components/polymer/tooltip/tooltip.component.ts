import { Component, Input, ChangeDetectionStrategy, HostBinding, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'ptooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit {
    @Input() tooltip: any = '';
    @Input() tooltipHtml = '';

    @Input() set position(p: string) {
        this.positionClass = p;
    }

    @HostBinding('class') positionClass = 'n';

    constructor(private _sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        if (typeof this.tooltip === 'number'){
            this.tooltip = this.tooltip.toString();
        }
        if (this.tooltip.indexOf('<') > -1 && this.tooltip.indexOf('>') > -1) {
            const tokens = this.tooltip.split(/[ ,\n\r]/);
            let tip = this.tooltip;
            for (let token of tokens) {
                token = token.substr(0, token.lastIndexOf('>') + 1);
                if (/<https?:\/\/[^>]+>/.test(token)) {
                    const href = token.substr(1, token.length - 2);
                    tip = tip.replace(token, '<a class=\'cite-link\' href=\'' + href + '\'>' + href + '</a>')
                }
            }
            this.tooltip = this._sanitizer.bypassSecurityTrustHtml(tip);
        }
    }
}

