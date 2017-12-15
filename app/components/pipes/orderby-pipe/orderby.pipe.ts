import { Pipe, PipeTransform } from '@angular/core';
import { Data } from './../../comparison/shared/index';
import { isNullOrUndefined } from "util";

@Pipe({
    name: 'orderBy',
    pure: false
})
export class OrderByPipe implements PipeTransform {
    private params: any;

    static _comparator(a: any, b: any) {
        if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
        } else {
            if (parseFloat(a) < parseFloat(b)) {
                return -1;
            }
            if (parseFloat(a) > parseFloat(b)) {
                return 1;
            }
        }
        return 0;
    }

    transform(value: Array<Data>, args: Array<any> = []) {
        this.params = {value: args[0], option: args[1]};

        return value.sort((a: Data, b: Data) => {
            for (let i = 0; i < this.params.value.length; i++) {
                if (this.params.option[i] === 0) {
                    continue;
                }
                const desc = this.params.option[i] === -1;
                if (a.properties[this.params.value[i]] === undefined && b.properties[this.params.value[i]] === undefined) {
                    if (a[this.params.value[i]] === undefined && b[this.params.value[i]] === undefined) {
                        return 0;
                    }
                } else if (a.properties[this.params.value[i]] === undefined) {
                    // a lacks the attribute => it is always below the others
                    return 1;
                } else if (b.properties[this.params.value[i]] === undefined) {
                    // b lacks the attribute => it is always below the others
                    return -1;
                }
                const pA = isNullOrUndefined(a[this.params.value[i]]) ? a.properties[this.params.value[i]].plain : a[this.params.value[i]];
                const pB = isNullOrUndefined(b[this.params.value[i]]) ? b.properties[this.params.value[i]].plain : b[this.params.value[i]];
                const comparison = !desc ? OrderByPipe._comparator(pA, pB) : -OrderByPipe._comparator(pA, pB);
                if (comparison !== 0) {
                    return comparison;
                }
            }
            return 0;
        });
    }
}
