import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SelectModule } from "angular2-select";
import { Select2Component } from "./select2/select2.component";

@NgModule({
    imports: [
        BrowserModule,
        SelectModule
    ],
    exports: [
        Select2Component
    ],
    declarations: [
        Select2Component
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputModule {
}