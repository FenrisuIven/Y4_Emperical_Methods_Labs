import { type MathNode, parse } from "mathjs"
import { createNoise2D } from 'simplex-noise'

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
        const { noiseStd: std } = args || {};
        const noisedPoints: Array<[number, number]> = [];
        const noiseMaxValue = std || (this._N / 5);
        const noise = createNoise2D();

        for (let i = 0; i < this._calculatedPoints.length; i++) {
            const [x, y] = this._calculatedPoints[i];
            const noiseMinValue = (x / this._calculatedPoints.length) * noiseMaxValue;
            const value = noise(noiseMinValue, noiseMaxValue);

            const yNoise = value * noiseMaxValue;
            noisedPoints.push([x, y + yNoise]);
        }

        this._noisedPoints = noisedPoints;
        return noisedPoints;
    }

    public CalculateLinearRegressionCoefficients(useNoised: boolean = true) {
        const points = useNoised ? this._noisedPoints : this._calculatedPoints;
        const n = points.length;

        let sumX = 0;
        let sumY = 0;
        let sumX2 = 0;
        let sumY2 = 0;
        let sumXY = 0;

        points.forEach(point => {
            const [x, y] = point;
            sumX += x;
            sumY += y;
            sumX2 += x * x;
            sumY2 += y * y;
            sumXY += x * y;
        })

        const avgX = sumX / n;
        const avgY = sumY / n;
        const avgXY = sumXY / n;
        const avgX2 = sumX2 / n;
        const avgY2 = sumY2 / n;

        const Sx = Math.sqrt(avgX2 - (avgX * avgX));
        const Sy = Math.sqrt(avgY2 - (avgY * avgY));
        const r = (avgXY - avgX * avgY) / (Sx * Sy);

        const k = r * (Sy / Sx);
        const b = avgY - k * avgX;

        return { k, b };
    }
}