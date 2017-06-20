import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'pcard',
    templateUrl: './paper-card.component.html',
    styleUrls: ['./paper-card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperCardComponent {
    @Input() heading: string;
}