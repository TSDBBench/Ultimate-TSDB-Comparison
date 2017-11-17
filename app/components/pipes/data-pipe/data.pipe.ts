import { Pipe, PipeTransform } from '@angular/core';
import { Data } from './../../comparison/shared/index';
import { ListItem } from '../../comparison/shared/components/list-item';

@Pipe({
    name: 'datafilter',
    pure: false

})
export class DataPipe implements PipeTransform {
    private query: any[];

    transform(value: Array<Data>, args: Array<any> = []) {
        this.query = args[0];
        if (!this.query) {
            return value;
        }
        return value.filter((item) => {
            if (item.tag.trim() === 'Template' && !args[1]) {
                return false;
            }
            if (!item.enabled) {
                return false;
            }
            for (const key in this.query) {
                if (!this.query.hasOwnProperty(key)) {
                    continue;
                }
                const cont = this.query[key];
                const values: Array<string> = item.getPropertyTags(cont.criteria.tag);
                if (cont.criteria.range_search) {
                    let propertyValue = cont.values.target.value;
                    propertyValue = propertyValue.replace(/ /g, '');
                    if (propertyValue.length === 0) {
                        return true;
                    }
                    const tokens = propertyValue.split(',');
                    for (const token of tokens) {
                        if (token.lastIndexOf('-') >= 1) {
                            if (this.rangeSearch(token, item.properties[cont.criteria.tag].list)) {
                                return true;
                            }
                        } else {
                            if (this.numberSearch(Number.parseFloat(token), item.properties[cont.criteria.tag].list)) {
                                return true;
                            }
                        }
                    }
                    return false;
                } else {
                    if (!((cont.values.length < 1) || (this.intersect(cont.values, values, cont.criteria.and_search)))) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    intersect(small_set: Array<string>, big_set: Array<string>, all: boolean) {
        let inter: boolean = all;
        if (!big_set) {
            return false;
        }
        if (all) {
            // all elements from the small_set must be in the big_set
            small_set.every(element => {
                if (big_set.indexOf(element) < 0) {
                    inter = false;
                    return false;
                }
                return true;
            });
        } else {
            // at least one elmenet must fit
            small_set.some(element => {
                if (big_set.indexOf(element) > -1) {
                    inter = true;
                    return true;
                }
            });
        }
        if (!inter && small_set.length === 0) {
            return true;
        }
        return inter;
    }

    private rangeSearch(range: string, list: Array<ListItem>) {
        let negativeMin = false;
        if (range.startsWith('-')) {
            negativeMin = true;
            range = range.substr(1);
        }
        let negativeMax = false;
        if (range.indexOf('--') + 1 === range.lastIndexOf('-')) {
            negativeMax = true;
        }
        const rValues = range.split(/-/).filter(el => el.length !== 0);
        if (rValues.length < 2) {
            return this.numberSearch(Number.parseFloat(rValues[0]), list);
        }
        rValues[1] = rValues[rValues.length - 1];
        let min = Number.parseFloat(rValues[0]);
        if (negativeMin) {
            min *= -1;
        }
        let max = Number.parseFloat(rValues[1]);
        if (negativeMax) {
            max *= -1;
        }
        if (max < min) {
            const t = max;
            max = min;
            min = t;
        }

        for (const item of list) {
            const n = Number.parseFloat(item.content);
            if (min <= n && n <= max) {
                return true;
            }
        }
        return false;
    }

    private numberSearch(number: number, list: Array<ListItem>) {
        if (isNaN(number)) {
            return false;
        }

        for (const item of list) {
            if (Number.parseFloat(item.content) === number) {
                return true;
            }
        }
        return false;
    }
}
