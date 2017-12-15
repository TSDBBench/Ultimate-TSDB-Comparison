export class ColorDictionary {
    private colorDict: {[label: string]: string} = {};

    public setColor(label: string, color: string) {
        this.colorDict[label] = color;
    }

    public getColor(label: string): string {
        if (this.colorDict[label]) {
            return this.colorDict[label];
        } else {
            return '';
        }
    }

    public isEmpty(): boolean {
        return Object.keys(this.colorDict).length === 0;
    }
}
