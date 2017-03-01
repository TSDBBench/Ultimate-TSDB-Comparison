import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { ComparisonCitationService } from "./../../comparison/components/comparison-citation.service";

@Component({
    selector: 'htmlcitationtext',
    templateUrl: './html-citation-text.component.html',
    styleUrls: ['./html-citation-text.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlCitationTextComponent {
    @Input() description: string = " ";
    @Input() citationServ: ComparisonCitationService;
}