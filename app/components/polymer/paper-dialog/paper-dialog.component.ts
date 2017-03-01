import { Component, Input, ElementRef, Renderer, HostListener } from "@angular/core";

@Component({
    selector: 'pdialog',
    templateUrl: './paper-dialog.component.html',
    styleUrls: ['./paper-dialog.component.css']
})
export class PaperDialogComponent {
    private opened: boolean = false;
    @Input() heading: string;

    @HostListener('click', ['$event.target']) onClick(target) {
        if (target.localName === "pdialog") {
            this.close();
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    public open() {
        this.renderer.setElementStyle(this.el.nativeElement, 'display', 'block');
        document.body.classList.add("modal-open");
        this.opened = true;
    }

    public close() {
        this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
        document.body.classList.remove("modal-open");
        this.opened = false;
    }
}