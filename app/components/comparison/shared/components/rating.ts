export class RatingSet {
    private set: Array<Rating> = new Array<Rating>();

    private average: number = 0;
    private sum: number = 0;

    constructor(jsonObj: any) {
        if (jsonObj.hasOwnProperty("childs")) {
            jsonObj.childs[0][0].forEach(item => {
                let starsString: string = /\[(\d*)\]/gm.exec(item.content)[1];
                let stars: number = parseInt(starsString);
                let text: string = /(?:\[\d*\])((?:.|\n)*)/gm.exec(item.content)[1];
                let rating: Rating = new Rating(stars, text);
                this.set.push(rating);
                this.sum += stars;
            });
        }

        this.average = this.set.length > 0 ? this.sum / this.set.length : this.sum;
    }

    public getRatings(): Array < Rating > {
        return this.set;
    }

    public getAverage(): number {
        return this.average;
    }
}

export class Rating {
    constructor(public stars: number = 0,
                public text: string) {
    }
}