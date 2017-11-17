import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SelectModule } from "ng2-select";
import { Select2Component } from "./select2/select2.component";
import { NumberInputComponent } from "./number-input/number-input.component";

@NgModule({
    imports: [
        BrowserModule,
        SelectModule
    ],
    exports: [
        Select2Component,
        NumberInputComponent
    ],
    declarations: [
        Select2Component,
        NumberInputComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputModule {
}
