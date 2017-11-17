export class RatingSet {
    private set: Array<Rating> = [];

    private average = 0;
    private sum = 0;

    constructor(jsonObj: any) {
        if (jsonObj.hasOwnProperty('childs')) {
            jsonObj.childs[0][0].forEach(item => {
                const starsString: string = /\[(\d*)\]/gm.exec(item.content)[1];
                const stars: number = parseInt(starsString, 10);
                const text: string = /(?:\[\d*\])((?:.|\n)*)/gm.exec(item.content)[1];
                const rating: Rating = new Rating(stars, text);
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
