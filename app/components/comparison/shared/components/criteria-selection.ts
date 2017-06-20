import { Criteria } from "./criteria";

export class CriteriaSelection {
    constructor(public values: Array<String> = new Array<String>(),
                public criteria: Criteria = new Criteria()) {
    }

}