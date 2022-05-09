import { ContinuousFeature, Feature, type FeatureType } from "./Feature";
import type { LeafType } from "./TreeNode";

export type OutcomeType = string | number;

export abstract class AbstractEvent<T extends FeatureType, E extends LeafType> {
    constructor(public readonly features: Feature<T>[], public readonly outcome: E) {}
}

export default class Events<T extends FeatureType, E extends LeafType> {
    constructor(public readonly events: AbstractEvent<T, E>[]) {}
}

export type IrisAttributes = "Sepal length" | "Sepal width" | "Petal length" | "Petal width";

/**
 * IrisEvent class represents a particular measurement and its assigned result. 
 * A measurement consists of four parameters in the following order: sepal length, sepal width, petal length and petal width. 
 * All are in the unit centimeter, therefore all are continous feature.
 * Every measurement is assigned to a result in the form of a plant name. There are three possible outcomes/classes: Iris-setosa, Iris-versicolor and Iris-virginica.
 * 
 * Usage: use the static method 'build' to create an event. E.g. 
 * new IrisEvent([IrisEvent.build(0, '4.5'), 
 *                IrisEvent.build(1, '3.4'), 
 *                IrisEvent.build(2, '2'),
 *                IrisEvent.build(3, '1.3')], 'Iris-virginica');
 */
export class IrisEvent extends AbstractEvent<FeatureType, string> {
    private static features: IrisAttributes[] = ["Sepal length", "Sepal width", "Petal length", "Petal width"];

    constructor(public readonly features: Feature<FeatureType>[], public readonly outcome: string) {
        super(features, outcome);
    }

    static getFeatures(): string[] {
        return IrisEvent.features;
    }

    static nameToIndex(feature: string) {
        return this.features.findIndex((v) => v === feature);
    }

    /**
    7. Attribute Information:
    1. sepal length in cm
    2. sepal width in cm
    3. petal length in cm
    4. petal width in cm
    5. class: 
       -- Iris Setosa
       -- Iris Versicolour
       -- Iris Virginica
    */
    static build(index: number, value: string): Feature<FeatureType> {
        const name: IrisAttributes | undefined = IrisEvent.features[index];

        if (name){
            return new ContinuousFeature(Number.parseFloat(value), name as string);
        }

        throw new Error("Invalid data");
    }
}