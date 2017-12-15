import { ListItem } from './list-item';

export class Property {
    constructor(public plain: string | number = '',
                public text = '',
                public list: Array<ListItem> = []) {
    }
}