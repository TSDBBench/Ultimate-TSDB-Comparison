import { Component, Input, ChangeDetectionStrategy, HostBinding } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'ptooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
    @Input() tooltip: string = "";
    @Input() tooltipHtml: string = "";

    @Input() set position(p: string) {
        this.positionClass = p;
    }

    @HostBinding('class') positionClass = 'n';

    constructor(private _sanitizer: DomSanitizer) {
    }
}

