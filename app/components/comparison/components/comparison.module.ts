import { NgModule } from '@angular/core';
// Provider imports
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ComparisonDetailsComponent } from './comparison-details.component';
import { ComparisonFootnoteComponent } from './comparison-footnote.component';
import { ComparisonComponent } from './comparison.component';
import { PipesModule } from '../../pipes/pipes.module';
import { InputModule } from '../../input/input.module';
import { OutputModule } from '../../output/output.module';
import { ComparisonService } from './comparison.service';
import { ComparisonDataService } from './comparison-data.service';
import { ComparisonConfigService } from './comparison-config.service';
import { ComparisonCitationService } from './comparison-citation.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        InputModule,
        OutputModule,
        PipesModule
    ],
    exports: [
        ComparisonComponent
    ],
    declarations: [
        ComparisonComponent,
        ComparisonDetailsComponent,
        ComparisonFootnoteComponent
    ],
    providers: [
        ComparisonService,
        ComparisonDataService,
        ComparisonConfigService,
        ComparisonCitationService,
        Title
    ]
})
export class ComparisonModule {
}
