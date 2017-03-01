import { Criteria, Value } from "../index";

export class CriteriaSet {
    private criteriaSet: {[name: string]: Criteria;} = {}

    constructor(jsonObj: any) {
        jsonObj.forEach(crit => {
            let criteria: Criteria = new Criteria();
            criteria.name = crit.name ? crit.name : crit.tag;
            criteria.tag = crit.tag;
            criteria.description = crit.description ? crit.description : "";
            criteria.and_search = typeof crit.and_search !== typeof undefined ? crit.and_search : true;
            crit.values.forEach(val => {
                let value: Value = new Value();
                value.name = val.name ? val.name : "undefined value";
                value.value = val.name ? val.name : "undefined value";
                value.label = val.name ? val.name : "undefined value";
                value.description = val.description ? val.description : "";
                criteria.values.push(value);
            });
            criteria.placeholder = crit.placeholder ? crit.placeholder : "";
            this.criteriaSet[crit.tag] = criteria;
        });
    }

    public getCriteriaArray(): Array<Criteria> {
        let set: Array<Criteria> = new Array<Criteria>();
        for (let key in this.criteriaSet) {
            if (!this.criteriaSet.hasOwnProperty(key)) continue;
            set.push(this.criteriaSet[key]);
        }
        return set;
    }

    public getCriteria(tag: string): Criteria {
        return this.criteriaSet[tag] ? this.criteriaSet[tag] : new Criteria();
    }
}