import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DataPipe } from "./data-pipe/data.pipe";
import { TablePipe } from "./table-pipe/table.pipe";
import { OrderByPipe } from "./orderby-pipe/orderby.pipe";
import { CitationPipe } from "./citation-pipe/citation.pipe";
import { SanitizerPipe } from "./sanitizer-pipe/sanitizer.pipe";

@NgModule({
    imports: [
        BrowserModule
    ],
    exports: [
        DataPipe,
        TablePipe,
        OrderByPipe,
        CitationPipe,
        SanitizerPipe
    ],
    declarations: [
        DataPipe,
        TablePipe,
        OrderByPipe,
        CitationPipe,
        SanitizerPipe
    ],
    providers: [
        DataPipe,
        TablePipe,
        OrderByPipe,
        CitationPipe,
        SanitizerPipe
    ]
})
export class PipesModule {
}