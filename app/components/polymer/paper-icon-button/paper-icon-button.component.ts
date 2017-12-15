import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'picon-button',
    templateUrl: './paper-icon-button.component.html',
    styleUrls: ['./paper-icon-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperIconButtonComponent {
    @Input() icon: string;
    @Input() title: string;
}
