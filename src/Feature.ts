import type { LeafType } from "./TreeNode";

export type FeatureType = string | number;

export abstract class Feature<T extends FeatureType> {
    constructor(public readonly value: T, public readonly name?: string) { }
    abstract condition(other: LeafType):boolean;
}

export class CategoricalFeature<T extends string> extends Feature<T> {
    condition(other: T): boolean {
        return this.value == other;
    }
}

export class ContinuousFeature<T extends number> extends Feature<T> {
    condition(other: T): boolean {
        return this.value <= other;
    }
}