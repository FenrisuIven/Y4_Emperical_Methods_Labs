export default class Distribution {
    distributionSize: number;
    normalDistribution: number[];
    exponentialDistribution: number[];

    constructor(distSize: number) {
        this.distributionSize = distSize || 19;
        this.normalDistribution = []
        this.exponentialDistribution = []
    }

    public GenerateNormal({ mean, stdDev, count, maxRange }:{
        mean: number,     // середнє значення
        stdDev: number,   // стандартне відхилення
        count: number,    // кількість елементів
        maxRange: number  // максимальне значення
    }): number[] {
        const dist: number[] = [];

        while (dist.length < count) {
            let r = 0, v = 0;
            while(r === 0) r = Math.random();
            while(v === 0) v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(r)) * Math.cos(2.0 * Math.PI * v);
            const value = z * stdDev + mean;

            if (value >= 0 && value <= maxRange) {
                dist.push(value);
            }
        }

        this.normalDistribution = dist;
        return dist;
    }

    public GenerateExponential({ lambda, count, maxRange }:{
        lambda: number,   // параметр розподілу
        count: number,    // кількість елементів
        maxRange: number  // максимальне значення}
    }): number[] {
        const dist: number[] = [];

        while (dist.length < count) {
            const value = -Math.log(1 - Math.random()) / lambda;

            if (value >= 0 && value <= maxRange) {
                dist.push(value);
            }
        }

        this.exponentialDistribution = dist;
        return dist;
    }
}