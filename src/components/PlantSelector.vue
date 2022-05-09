<script lang="ts">
import DecisionTreeClassifier from "@/DecisionTreeClassifier";
import { IrisEvent } from "@/Events";

export default {
  data() {
    return {
      msg: {
        type: String,
        default: '',
      },
      sepal_length: {
        type: Number,
        default: 0,
      },
      sepal_width: {
        type: Number,
        default: 0,
      },
      petal_length: {
        type: Number,
        default: 0,
      },
      petal_width: {
        type: Number,
        default: 0,
      },
      selected_plant_type: 0,
      plant_types: [
        { name: '-', id: 0},
        { name: 'Iris Setosa', id: 1 },
        { name: 'Iris Versicolour', id: 2 },
        { name: 'Iris Virginica', id: 3 },
      ]
    }
  },
  computed: {
    flowerImageSrc() {
      switch (this.selected_plant_type) {
        case 1:
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Iris_setosa_2.jpg/847px-Iris_setosa_2.jpg';
        case 2:
          return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Northern_Blue_Flag_(Iris_versicolor)_-_Cape_St._Mary's_Ecological_Reserve%2C_Newfoundland_2019-08-10_(01).jpg/480px-Northern_Blue_Flag_(Iris_versicolor)_-_Cape_St._Mary's_Ecological_Reserve%2C_Newfoundland_2019-08-10_(01).jpg";
        case 3:
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Southern_Blue_Flag_Iris_(iris_virginica)_-_Flickr_-_Andrea_Westmoreland.jpg/1280px-Southern_Blue_Flag_Iris_(iris_virginica)_-_Flickr_-_Andrea_Westmoreland.jpg';
        default:
          return 'https://via.placeholder.com/468x120?text=Set+parameters+to+trigger+plant+type+prediction';
      }
    }
  },
  watch: {
    sepal_length: function () {
      this.predict();
    },
    sepal_width: function() {
      this.predict();
    },
    petal_length: function() {
      this.predict();
    },
    petal_width: function() {
      this.predict();
    },
  },
  methods: {
    // Makes prediction based on the user input and trained decision tree.
    // Decision tree is loaded from the window object, but could be also loaded from the local storage or from any other persistence layer.
    predict() {
      if (this.sepal_length > 0 && this.sepal_width > 0 && this.petal_length > 0 && this.petal_width > 0) {
        const dt = (window as any).decisionTree;
        if (dt) {
          const event = new IrisEvent([IrisEvent.build(0, `${this.sepal_length}`),
                                      IrisEvent.build(1, `${this.sepal_width}`),
                                      IrisEvent.build(2, `${this.petal_length}`),
                                      IrisEvent.build(3, `${this.petal_width}`)], '');
          const dtc = new DecisionTreeClassifier();
          const prediction = dtc.classify(event, dt);
          if (prediction) {
            let typeId = 0;
            switch (prediction) {
              case "Iris-setosa":
                typeId = 1;
                break;
              case "Iris-versicolor":
                typeId = 2;
                break;
              case "Iris-virginica":
                typeId = 3;
                break;
              default:
                break;
            }
            this.selected_plant_type = typeId;
          }
        }
      }
    }
  },
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg.default }}</h1>

    <label>Sepal length
      <input type="number" v-model="sepal_length" placeholder="Sepal length"/>
    </label>

    <label>Sepal width
      <input type="number" v-model="sepal_width" placeholder="Sepal width"/>
    </label>

    <label>Petal length
      <input type="number" v-model="petal_length" placeholder="Petal length"/>
    </label>

    <label>Petal width
      <input type="number" v-model="petal_width" placeholder="Petal width"/>
    </label>

    <label>Plant type
      <select v-model="selected_plant_type">
        <option v-for="ptype in plant_types" :value="ptype.id">
          {{ ptype.name }}
        </option>
      </select>
    </label>
  </div>
  <div class="photo">
    <img :src="flowerImageSrc" :alt="selected_plant_type">
    <p><small>Source <em><a :href="flowerImageSrc" target="__blank">{{flowerImageSrc}}</a></em></small></p>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

input, select {
  display: block;
}

label {
  display: block;
  margin: 1em 0 0 0;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.photo {
  margin: 1rem auto;
}

.photo img {
  max-width: 1024;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
