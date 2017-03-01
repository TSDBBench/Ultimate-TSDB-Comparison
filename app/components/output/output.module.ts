import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PipesModule } from "./../pipes/pipes.module";
import { PolymerModule } from "./../polymer/polymer.module";
import { HtmlCitationTextComponent } from "./html-citation-text/html-citation-text.component";
import { GenericTableComponent } from "./generic-table/generic-table.component";
import { ReferencesTableComponent } from "./references-table/references-table.component";

@NgModule({
    imports: [
        BrowserModule,
        PipesModule,
        PolymerModule
    ],
    exports: [
        HtmlCitationTextComponent,
        GenericTableComponent,
        ReferencesTableComponent,
        PolymerModule
    ],
    declarations: [
        HtmlCitationTextComponent,
        GenericTableComponent,
        ReferencesTableComponent
    ],
    providers: []
})
export class OutputModule {
}