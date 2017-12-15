import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'myapp',
    template: '<comparison></comparison>',
    styleUrls: [
        './styles/bootstrap.min.css',
        './styles/style.css'
    ],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
