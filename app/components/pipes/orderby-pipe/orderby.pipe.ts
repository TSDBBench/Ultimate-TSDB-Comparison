import { Pipe, PipeTransform } from "@angular/core";
import { Data } from "./../../comparison/shared/index";

@Pipe({
    name: 'orderBy',
    pure: false
})
export class OrderByPipe implements PipeTransform {

    static _comparator(a: any, b: any) {
        if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
        } else {
            if (parseFloat(a) < parseFloat(b)) return -1;
            if (parseFloat(a) > parseFloat(b)) return 1;
        }
        return 0;
    }

    private params: any;

    transform(value: Array<Data>, args: Array<any> = []) {
        this.params = {value: args[0], option: args[1]};

        return value.sort((a: Data, b: Data) => {
            for (let i: number = 0; i < this.params.value.length; i++) {
                if (this.params.option[i] == 0) continue;
                let desc = this.params.option[i] == -1 ? true : false;
                let pA = a[this.params.value[i]] ? a[this.params.value[i]] : a.properties[this.params.value[i]].plain;
                let pB = b[this.params.value[i]] ? b[this.params.value[i]] : b.properties[this.params.value[i]].plain;
                let comparison = !desc ? OrderByPipe._comparator(pA, pB) : -OrderByPipe._comparator(pA, pB);
                if (comparison != 0) return comparison;
            }
            return 0;
        });
    }
}