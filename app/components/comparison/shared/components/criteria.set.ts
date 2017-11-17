import { Criteria, Value } from '../index';

export class CriteriaSet {
    private criteriaSet: {[name: string]: Criteria; } = {};

    constructor(jsonObj: any) {
        jsonObj.forEach(crit => {
            const criteria: Criteria = new Criteria();
            criteria.name = crit.name ? crit.name : crit.tag;
            criteria.tag = crit.tag;
            criteria.description = crit.description ? crit.description : '';
            criteria.and_search = typeof crit.and_search !== typeof undefined ? crit.and_search : true;
            criteria.range_search = typeof crit.range_search !== typeof undefined ? crit.range_search : false;
            if (!criteria.range_search) {
                let id = 1;
                crit.values.forEach(val => {
                    const value: Value = new Value();
                    value.name = val.name ? val.name : 'undefined value';
                    value.value = val.name ? val.name : 'undefined value';
                    value.label = val.name ? val.name : 'undefined value';
                    value.text = val.name ? val.name : 'undefined value';
                    value.id = id;
                    value.description = val.description ? val.description : '';
                    criteria.values.push(value);
                    id++;
                });
            }
            criteria.placeholder = crit.placeholder ? crit.placeholder : '';
            this.criteriaSet[crit.tag] = criteria;
        });
    }

    public getCriteriaArray(): Array<Criteria> {
        const set: Array<Criteria> = [];
        for (const key in this.criteriaSet) {
            if (!this.criteriaSet.hasOwnProperty(key)) {
                continue;
            }
            set.push(this.criteriaSet[key]);
        }
        return set;
    }

    public getCriteria(tag: string): Criteria {
        return this.criteriaSet[tag] ? this.criteriaSet[tag] : new Criteria();
    }
}
