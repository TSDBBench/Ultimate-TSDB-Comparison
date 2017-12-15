import { Pipe, PipeTransform } from '@angular/core';
import { Data } from '../../comparison/shared/components/data';
import { isNullOrUndefined } from 'util';

@Pipe({
    name: 'orderAttributes',
    pure: false
})
export class AttributePipe implements PipeTransform {
    transform(values: Array<Data>, ...args: any[]): any {
        const tdata = args[0][0];
        const mult = tdata.order === 'asc' ? 1 : -1;
        let weightFound = true;
        for (const key in tdata.values) {
            if (!tdata.values.hasOwnProperty(key)) {
                continue;
            }
            weightFound = weightFound && !isNullOrUndefined(tdata.values[key].weight);
        }
        if (!weightFound) {
            return this.sortAlphabetically(values, mult);
        }
        return values.sort((o1, o2) => {
            let w1, w2;
            for (const key in tdata.values) {
                if (!tdata.values.hasOwnProperty(key)) {
                    continue;
                }
                if (o1['content'] === key) {
                    w1 = tdata.values[key].weight;
                }
                if (o2['content'] === key) {
                    w2 = tdata.values[key].weight;
                }
            }
            return mult * (w1 - w2);
        });
    }

    private sortAlphabetically(values: any, mult: number) {
        return values.sort((o1, o2) => {
            return mult * o1.content.localeCompare(o2.content);
        });
    }
}
