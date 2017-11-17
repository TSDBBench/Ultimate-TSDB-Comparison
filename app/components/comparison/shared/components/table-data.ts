import { Type } from './type';

export class TableData {
    constructor(public name: string = '',
                public tag: string = '',
                public url: string = '',
                public style: string = '',
                public display: boolean = false,
                public type: Type = new Type(),
                public values: {[name: string]: string; } = {},
                public sort: number = 0,
                public repo: boolean = false,
                public order: string = 'asc') {
    }
}
