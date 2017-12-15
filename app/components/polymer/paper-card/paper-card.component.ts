import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'pcard',
    templateUrl: './paper-card.component.html',
    styleUrls: ['./paper-card.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperCardComponent {
    @Input() heading: string;
    @Input() symbol = false;
    @Output() shrinkExpandEmitter: EventEmitter<any> = new EventEmitter();
    public shrinked = false;

    public shrinkExpand() {
        this.shrinked = !this.shrinked;
        this.shrinkExpandEmitter.emit();
    }
}
