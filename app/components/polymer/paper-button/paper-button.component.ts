import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'pbutton',
    templateUrl: './paper-button.component.html',
    styleUrls: ['./paper-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperButtonComponent {
    @Input() text: string;
}