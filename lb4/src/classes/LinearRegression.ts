import {type MathNode, parse} from "mathjs"

export class LinearRegression {
    private _equation: MathNode;
    private _N: number;
    private _slope: number;  // k
    private _offset: number; // b

    private _calculatedPoints: Array<[number, number]>;
    private _noisedPoints: Array<[number, number]>;

    public get equationString(){
        return this._equation.toString();
    }
    public set equation(newEq: string) {
        this._equation = parse(newEq);
    }
    public get NoisedPoints(){
        return this._noisedPoints;
    }
    public get Points(){
        return this._calculatedPoints;
    }
    public get desmosCalculatedPoints(){
        return this._calculatedPoints.map(point => `(${point[0]}, ${point[1]})`).join(', ');
    }
    public get desmosNoisedPoints(){
        return this._noisedPoints.map(point => `(${point[0]}, ${point[1]})`).join(', ');
    }

    constructor({equation, N, slope, offset}: {
        equation: string,
        N?: number,
        slope?: number
        offset?: number
    }) {
        this._equation = parse(equation);
        this._N = N || 19;
        this._slope = slope || -2;
        this._offset = offset || 4;
        this._calculatedPoints = [];
        this._noisedPoints = [];

        this.CalculatePoints();
    }

    public GetValueFor(x: number): number {
        return this._equation.evaluate({ x, k: this._slope, b: this._offset });
    }

    public CalculatePoints(args? : { start: number; end: number }) {
        const { start, end } = args || {};
        const interval: number[] = [];
        if (start && end) {
            if (start < end) {
                interval.push(start, end);
            }
        } else {
            interval.push(this._N - 10, this._N + 10);
        }

        const points: Array<[number, number]> = [];
        for (let x = interval[0]; x < interval[1]; x++) {
            const y = this.GetValueFor(x);
            points.push([x, y]);
        }

        this._calculatedPoints = points;
        return points;
    }

    public CalculateNoisedPoints(args?: {noiseStd: number}){
        const { noiseStd } = args || {};
        const noisedPoints: Array<[number, number]> = [];
        const std = noiseStd || (this._N / 5);
        for (let i = 0; i < this._calculatedPoints.length; i++) {
            const [x, y] = this._calculatedPoints[i];
            const noise = (Math.random() - 0.5) * std;
            noisedPoints.push([x, y + noise]);
        }

        this._noisedPoints = noisedPoints;
        return noisedPoints;
    }

    public CalculateLinearRegressionCoefficients(useNoised: boolean = true) {
        const points = useNoised ? this._noisedPoints : this._calculatedPoints;
        const n = points.length;
        const sumX = points.reduce((acc, curr)=>acc + curr[0], 0);
        const sumY = points.reduce((acc, curr)=>acc + curr[1], 0);
        const sumXY = points.reduce((acc, curr, i) => acc + curr[0] * points[i][1], 0);
        const sumX2 = points.reduce((acc, curr) => acc + curr[0] * curr[0], 0);

        const k = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
        const b = (sumY - k*sumX) / n;

        return { k, b };
    }
}