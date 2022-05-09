import type { IrisEvents } from "./DecisionTreeClassifier";
import DecisionTreeClassifier from "./DecisionTreeClassifier";
import type { LeafType } from "./TreeNode";

type Statistics = {
    outcome: LeafType;
    probability: number;
    log2_probability: number;
}

/**
 * Computes entropy in bits (log2).
 * The static method compute return entropy of given events, using the standard formula to calculate entropy: S(e)= Sigma(-p(e) * log2[p(e)]).
 */
export default class Entropy {

    static compute(events: IrisEvents): number {
        let numberOfClasses = DecisionTreeClassifier.filterUniqueOutcomes(events);
        let statistics: Statistics[] = [];

        numberOfClasses.forEach((outcome) => {
            let p = Entropy.probability(outcome, events);
            statistics.push({
                outcome: outcome,
                probability: p,
                log2_probability: p > 0 ? Math.log2(p) : Infinity
            })
        });

        let entropy = 0;
        statistics
            .filter((statistic) => statistic.probability > 0)
            .forEach((statistic) => entropy -= statistic.probability * statistic.log2_probability);

        return entropy;
    }

    private static probability(outcome: LeafType, events: IrisEvents): number {
        if (!outcome || events.length === 0)
            return 0;

        return events.filter((event) => event.outcome === outcome).length / events.length;
    }
}