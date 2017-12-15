import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ComparisonCitationService } from './../../comparison/components/comparison-citation.service';

@Component({
    selector: 'referencestable',
    templateUrl: './references-table.component.html',
    styleUrls: ['./references-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferencesTableComponent {
    @Input() citationServ: ComparisonCitationService;
    @Input() changeNum = 0;
}