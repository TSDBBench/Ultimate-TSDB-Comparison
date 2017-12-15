import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ComparisonModule } from './components/comparison/index';
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
    imports: [
        BrowserModule,
        ComparisonModule,
        LocalStorageModule.withConfig({
            prefix: 'ultimate-comparison-base',
            storageType: 'localStorage'
        })
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
