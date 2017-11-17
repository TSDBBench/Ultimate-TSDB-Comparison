import { Criteria } from './criteria';

export class CriteriaSelection {
    constructor(public values: Array<String> | KeyboardEvent | { target: { value: string }} = [],
                public criteria: Criteria = new Criteria()) {
    }

}
