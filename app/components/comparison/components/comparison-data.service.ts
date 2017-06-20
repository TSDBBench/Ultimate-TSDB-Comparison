import { Injectable, ChangeDetectorRef } from "@angular/core";
import { Http } from "@angular/http";
import { TableDataSet, Data, Property, ListItem, RatingSet } from "./../shared/index";
import { ComparisonService } from "./comparison.service";

@Injectable()
export class ComparisonDataService {
    private data: Array<Data> = new Array<Data>();
    private tags: {[name: string]: string;} = {};

    constructor(private http: Http,
                private comparisonService: ComparisonService) {
    }

    public loadData(tableDataSet: TableDataSet, cd: ChangeDetectorRef) {
        this.http.request('app/components/comparison/data/data.json')
            .subscribe(res => {
                res.json().forEach(obj => {
                    let data: Data = new Data();
                    data.tag = obj.tag;
                    let regArray = /^((?:(?:\w+\s*)(?:-?\s*\w+.)*)+)\s*-?\s*((?:(?:http|ftp|https)(?::\/\/)(?:[\w_-]+(?:(?:\.[\w_-]+)+))|(?:www.))(?:[\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?)$/gi.exec(data.tag);
                    data.url = regArray ? regArray[2] : "";
                    if (/^(www)/.test(data.url)) data.url = "http://" + data.url;
                    data.tag = regArray ? regArray[1] : data.tag;
                    for (let key in obj) {
                        if (!obj.hasOwnProperty(key)) continue;
                        switch (key) {
                            case "tag":
                                break;
                            case "descr":
                                data.descr = obj[key];
                                break;
                            case "Description":
                                data.properties[key] = new Property(obj[key].plain);
                                break;
                            case "Rating":
                                data.rating = new RatingSet(obj[key]);
                                break;
                            default:
                                let p: Property = new Property();
                                this.tags[key] = key;
                                p.plain = obj[key].plain
                                if (tableDataSet.getTableData(key).type.tag == "text") {
                                    p.text == obj[key].text
                                } else {
                                    if (typeof obj[key].childs[0][0] != 'string') {
                                        obj[key].childs[0][0].forEach(item => {
                                            let content: string = item.content;
                                            let plainChilds: string = item.plainChilds;
                                            if (item.childs && item.childs.length == 1) {
                                                plainChilds = item.childs[0].plain;
                                            }
                                            let itm: ListItem = new ListItem(content, plainChilds, this.comparisonService.converter);
                                            p.list.push(itm);
                                        });
                                    }
                                }
                                data.properties[key] = p;
                                break;
                        }
                    }
                    ;
                    this.data.push(data);
                });
                cd.markForCheck();
            });
    }

    public getDefaultAttachmentTags(): Array<string> {
        let tags: Array<string> = new Array<string>();
        for (let key in this.tags) {
            if (!this.tags.hasOwnProperty(key) || key == "tag" || key == "url" || key == "descr" || key == "Rating") continue;
            tags.push(this.tags[key]);
        }
        return tags;
    }

    public getLength(): number {
        return this.data.length;
    }
}