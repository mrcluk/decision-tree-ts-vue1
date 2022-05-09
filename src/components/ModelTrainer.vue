<script lang="ts">

import DecisionTreeClassifier from '@/DecisionTreeClassifier'
import { IrisEvent } from '@/Events';
import { CategoricalFeature, Feature } from '@/Feature';

export default {
  data() {
    return {
      isTraining: false,
      isTrained: false
    }
  },
  methods: {
    // Trains downloaded model.
    async trainModel() {
          const dtc = new DecisionTreeClassifier();
          const decisionTree = dtc.train(await this.loadEvents());
          
          if (decisionTree) {
            (window as any).decisionTree = decisionTree;
            this.isTrained = true;
          }
    },
    // Download the iris dataset and converts it to the model.
    async loadEvents(): Promise<IrisEvent[]> {
      this.isTraining = true;
      // Source for the data set:
      // https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data
      const result = await fetch('/iris.data', {
        method: 'GET',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'text/html',
        },
        redirect: 'follow'
      })
      .then((response) => response.text())
      .then((text: string) => {
        if (text) {
          return text.split(/\n/).filter((line) => line && line.length > 0).map((line) => {
            let irisData = line.split(',').filter((value) => value && value.length > 0).map((value, index) => {
              if (index <= 3) {
                return IrisEvent.build(index, value);
              }
              
              return new CategoricalFeature<string>(value);
            });

            return new IrisEvent(irisData.slice(0, 4), irisData[4].value as string);
          });
        }
      })
      .catch((reason) => console.error(reason));

      this.isTraining = false;

      if (result) {
        return result;
      }

      return [];
    }
  },
}
</script>

<template>
    <h2 class="orange" v-if="!isTrained">Model not trained. Click the Train model button.</h2>
    <h2 class="green" v-else>Model trained.</h2>

    <button @click="trainModel">Train model</button>
    <progress v-if="isTraining" aria-label="Training model..." :aria-busy="isTraining"></progress>
</template>