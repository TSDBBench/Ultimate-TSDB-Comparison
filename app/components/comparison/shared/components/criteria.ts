export class Criteria {
    constructor(public name: string = "",
                public tag: string = "",
                public description: string = "",
                public placeholder: string = "",
                public and_search: boolean = true,
                public values: Array<Object> = new Array<Object>()) {
    }

}