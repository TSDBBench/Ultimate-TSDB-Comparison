export class Criteria {
    constructor(public name: string = '',
                public tag: string = '',
                public description: string = '',
                public placeholder: string = '',
                public and_search: boolean = true,
                public values: Array<Object> = [],
                public range_search: boolean = false) {
    }

    public getSearchIndicator(): String {
        if (this.and_search) {
            return 'match all';
        }
        if (this.range_search) {
            return 'match range';
        }
        return 'match one';
    }
}
