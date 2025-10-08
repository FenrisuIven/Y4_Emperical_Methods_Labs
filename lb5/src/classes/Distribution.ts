export default class Distribution {
    distributionSize: number;
    distribution: number[];

    constructor(distSize: number) {
        this.distributionSize = distSize || 19;
        this.distribution = []
    }

    public GenerateLogDistribution() {
        const result = [];
        for (let i = 0; i < this.distributionSize; i++) {
            const x = i / (this.distributionSize - 1);         // from 0 to 1
            const logX = Math.log10(1 + 9 * x); // logarithmic curve
            result.push(logX * this.distributionSize);
        }
        return result;
    }
}