import { IrisEvent, type AbstractEvent } from '@/Events';
import Entropy from './Entropy';
import type { FeatureType } from './Feature';
import TreeNode, { type LeafType } from './TreeNode';

export type IrisEvents = IrisEvent[];
export type Split<S extends FeatureType, U extends LeafType, T extends AbstractEvent<S, U>> = {
    left: T[];
    right: T[];
}

export type IrisSplit = Split<FeatureType, string, IrisEvent>

/**
 * This is a basic implementation of the decision tree algorithm.
 * It uses recursion to build a decision tree, that consist of split nodes with given treshold and leaf nodes, a.k.a. terminal nodes, that allow to make an actual decision.
 * 
 * Use the static method train to train a tree and classify to make a prediction based on an event with unknown outcome and a trained tree.
 */
export default class DecisionTreeClassifier {
    train(events: IrisEvents, depth: number = 0, min_samples: number = 3, max_depth = 10): TreeNode {
        if (events.length < min_samples || depth == max_depth || DecisionTreeClassifier.isPure(events)) {
            return DecisionTreeClassifier.calculateLeaf(events);
        } else {
            depth++;
            const best_split = DecisionTreeClassifier.bestSplit(events);
            const split = DecisionTreeClassifier.split(best_split.feature, best_split.treshold, events);
            best_split.left = this.train(split.left, depth, max_depth);
            best_split.right = this.train(split.right, depth, max_depth);
            return best_split;
        }
    }

    classify(event: IrisEvent, root_node: TreeNode): LeafType {
        if (root_node.value) {
            return root_node.value;
        } else {
            if (event.features[IrisEvent.nameToIndex(root_node.feature)].condition(root_node.treshold)){
                return this.classify(event, root_node.left as TreeNode);
            } else {
                return this.classify(event, root_node.right as TreeNode);
            }
        }
    }

    private static bestSplit(events: IrisEvents): TreeNode {
        if (!events || events.length === 0)
            throw new Error('Invalid argument: events');
        // max information gain
        let max_information_gain = Number.NEGATIVE_INFINITY;
        const tree_node = new TreeNode();

        const splits = DecisionTreeClassifier.getPossibleSplits(events);
        
        IrisEvent.getFeatures().forEach((feature) => {
            splits[feature as any].forEach((treshold) => {
                const split = this.split(feature, treshold, events);
                const entropy_overall = Entropy.compute(events);
                const entropy_l = Entropy.compute(split.left);
                const entropy_r = Entropy.compute(split.right);
                const entropy_by_feature = split.left.length / events.length * entropy_l + split.right.length / events.length * entropy_r;
                const information_gain = entropy_overall - entropy_by_feature;

                if (information_gain >= max_information_gain) {
                    max_information_gain = information_gain;
                    tree_node.feature = feature;
                    tree_node.treshold = treshold;
                }
            });
        });
        
        return tree_node;
    }

    private static split(feature: FeatureType, treshold: LeafType, events: IrisEvents): IrisSplit {
        const nodes_to_left: (e: IrisEvent) => boolean = (e) => { 
            return e.features[IrisEvent.nameToIndex(feature as string)].condition(treshold);             
        };
        const nodes_to_right: (e: IrisEvent) => boolean = (e) => !nodes_to_left(e);
        return {
            left: events.filter(nodes_to_left),
            right: events.filter(nodes_to_right)
        };        
    }
    
    private static getPossibleSplits(events: IrisEvents) {
        const possible_splits:Array<Set<FeatureType>> = new Array<Set<FeatureType>>();

        events.forEach(event => {
            event.features.forEach(f => {
                const splits:Set<FeatureType> = possible_splits[f.name as any] ?? new Set<FeatureType>();
                splits.add(f.value);
                if (f.name) {
                    possible_splits[f.name as any] = splits;
                }
            });
        });

        for (const iterator in possible_splits) {
            const values = Array.from(possible_splits[iterator]).sort();
            const reduced = [];
            for (let i = 0, j = 1; j < values.length; i++, j++) {
                if (typeof values[j] === 'number' && typeof values[i] === 'number' ) {
                    reduced.push((values[i] as number) + (((values[j] as number) - (values[i] as number)) as number / 2));
                } else {
                    reduced.push(values[i]);
                }
            }

            possible_splits[iterator] = new Set(reduced);
        }

        return possible_splits;
    }

    private static calculateLeaf(events: IrisEvents) {
        const outcomes = DecisionTreeClassifier.filterUniqueOutcomes(events);
        let count = 0;
        let leaf: LeafType;
        outcomes.forEach(outcome => {
            const eventsCount = events.filter(e => e.outcome === outcome).length;
            if (eventsCount > count) { 
                count = eventsCount;
                leaf = outcome;
            }
        });

        return TreeNode.newLeafNode(leaf);
    }

    static filterUniqueOutcomes(events: IrisEvents): Set<LeafType> {
        return new Set(events.map(e => e.outcome));
    }

    static filterUniqueValues(name: string, events: IrisEvents): Set<FeatureType> {
        return new Set(events.map(e => e.features)
                             .map(features => features.filter(f => f.name === name)
                                                      .map(f => f.value)
                                                      .reduce((v1, v2) => v1)));
    }

    private static isPure(events: IrisEvents) {
        return DecisionTreeClassifier.filterUniqueOutcomes(events).size === 1;
    }
}