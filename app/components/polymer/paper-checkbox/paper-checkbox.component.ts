import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnChanges, Renderer, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'pcheckbox',
    templateUrl: './paper-checkbox.component.html',
    styleUrls: ['./paper-checkbox.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaperCheckboxComponent implements OnChanges {
    @Input() label: string;
    @Input() checked: boolean;
    @Output() checkedChange: EventEmitter<any> = new EventEmitter();

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngOnChanges() {
        if (this.checked) {
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'background-color', '#3f51b5');
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'border-color', '#3f51b5');
        } else {
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'background-color', '#fff');
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'border-color', '#000');
        }
        this.el.nativeElement.checked = this.checked;
    }

    private toogleCheck() {
    }

    @HostListener('click', ['$event'])
    onChange(e) {
        this.checked = !this.checked;
        if (this.checked) {
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'background-color', '#3f51b5');
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'border-color', '#3f51b5');
        } else {
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'background-color', '#fff');
            this.renderer.setElementStyle(this.el.nativeElement.children[0], 'border-color', '#000');
        }
        this.el.nativeElement.checked = this.checked;
        this.checkedChange.emit(this.checked);
    }
}
