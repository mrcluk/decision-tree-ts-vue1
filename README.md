# Machine learning in browser using decision tree algorithm

__TLDR__ An example of using machine learning to predict a user's choice of a parameter in a web application.

## Introduction

Web applications may be used by very heterogeneous groups of users who have some distinctive behavioral patterns. Based on these, they choose certain parameters that fit their individual requirements. This causes however, that all users have to wade through parameters that they possibly don't need.

Machine learning, by analyzing different usage patterns, could be used to make an application easier to work with, by suggesting parameter choices depending on the individual's usage.
This project demonstrates the use of one of the simpler machine learning algorithms - decision tree.

An implementation using TypeScript allows the model to be trained directly in the browser, which may be required in certain situations.

Suppose that, for various reasons, the data needed to train the model should remain in the browser (e.g. in the local storage) or be downloaded on the fly on the client side.

This sample application, demonstrates this type of case, by downloading the well established sample data set: [the iris dataset](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data)and then training model to finally use it to make a parameter prediction. All actions are executed on the client side directly in browser.

## Algorithm

This example uses the [decision tree learning algorithm](https://en.wikipedia.org/wiki/Decision_tree_learning), recursively dividing the data set into subsets such that a given division maximizes the information gain. To reduce overfitting a minimum number of samples and maximal depth of tree are defined as training parameter. There is more methods to overcome this issue, but they are not included here.

## Most interesting components

| Component                                                                       | Description                              |
| ------------------------------------------------------------------------------- | ---------------------------------------- |
| [**DecisionTreeClassifier.ts**](https://github.com/)          | implements the decision tree learning           |
| [**Entropy.ts**](https://github.com/)     | calculates entropy           |
| [**Events.ts**](https://github.com/)     | defines the iris model but can be easly generalied           |
| [**Feature.ts**](https://github.com/)     | defines categorical and continous feature class, in this example all features are continous           |
| [**TreeNode.ts**](https://github.com/)     | binary tree, to be generated dynamically by the algorithm           |

## Tech-Stack

The only framework used for this project is [Vue.js](https://vuejs.org/). No other 3rd party libraries were used.

## How it works

There are four input fields in which the user can enter apropriete values. As soon as all values are filled in, the application tries to predict the type of plant by pre-selecting the option field. Visual representation of selected plant type is displayed as an image.

![](https://github.com/mrcluk/decision-tree-ts-vue1/blob/main/public/screencast1.gif)

This is obviously a very simplified use case, but it presents an interesting approach to facilitate the UI experience through machine learning. This alrgoritm allows one to easily expand features, regardless of whether they are continous or categorical. It can train very fast, reasonable decision trees that can outperform hard-coded solutions and easy autocomplete solutions, bases solely on frequency of use of some values, as it provides some logic to outcome prediction.
