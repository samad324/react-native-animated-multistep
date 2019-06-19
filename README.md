# React Native Animated Multistep

## Preview

![GIF](previews/1.gif)
![GIF](previews/2.gif)

## installation

You can install this package with the following command:

`yarn add react-native-animated-multistep`

or

`npm install react-native-animated-multistep`

## How to use

you can also see this [example](https://github.com/samad324/react-native-multistep-example)

### In the top level component add

```
import AnimatedMultistep from 'react-native-animated-multistep'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'

/* Define the steps  */

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";

const allSteps = [
  { name: "step 1", component: Step1 },
  { name: "step 2", component: Step2 },
  { name: "step 3", component: Step3 },
  { name: "step 4", component: Step4 }
];

/* Define your class */
export default class App extends Component {

/* define the method to be called when you go on next step */

  onNext = () => {
    console.log("Next");
  };

  /* define the method to be called when you go on back step */

  onBack = () => {
    console.log("Back");
  };

/* define the method to be called when the wizard is finished */

  finish = finalState => {
    console.log(finalState);
  };

/* render MultiStep */
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedMultistep
          steps={allSteps}
          onFinish={this.finish}
          onBack={this.onBack}
          onNext={this.onNext}
          comeInOnNext="bounceInUp"
          OutOnNext="bounceOutDown"
          comeInOnBack="bounceInDown"
          OutOnBack="bounceOutUp"
        />
      </View>
    );
}
}
```

### In the step

```
import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import styles from "./styles";

class step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  nextStep = () => {
    const { next, saveState } = this.props;
    // Save state for use in other steps
    saveState({ name: "samad" });

    // Go to next step
    next();
  };

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  render() {
    return (
      <View style={[styles.container, styles.step1]}>
        <Text> Step 1 </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={this.nextStep}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default step1;

```

## API

### this.props.saveState({ key: value, key2: value2})

Use this to save state

### this.props.getState()

Use this to get all the values saved with saveState so far. Retuns an object

### this.props.next()

Use this to go to next step in the app.

### this.props.back()

Use this to go to previos step in the app.

### Props

| Props    | Type       | Notes                                                     | Required |
| -------- | ---------- | --------------------------------------------------------- | -------- |
| steps    | `Array`    | array containing steps                                    | ✔️       |
| onFinish | `function` | a function, which will run when all steps are finish      | ❌       |
| onNext   | `function` | a function, which will run when you go on next step       | ❌       |
| onBack   | `function` | a function, which will run when you go on back step       | ❌       |
| comeInOnNext  | `String`  | define you animation type when the component comes in on next, default is `bounceInLeft` | ❌       |
| OutOnNext  | `String`  | define you animation type when the component goes out on next, default is `bounceOutRight`  | ❌       |
| comeInOnBack  | `String`  | define you animation type when the component comes in on back, default is `bounceInRight` | ❌       |
| OutOnBack  | `String`  | define you animation type when the component goes out on next, default is `bounceOutLeft` | ❌       |

### Note: 
you can more animation and set-up animations by your self on [react-native-animatable](https://github.com/oblador/react-native-animatable#animatableexplorer-example)

### Methods

| Method Name   | Arguments | Notes                                                              |
| ------------- | --------- | ------------------------------------------------------------------ |
| `next()`      | `none`    | use this method to jump on next step                               |
| `back()`      | `none`    | use this method to go back on previos step                         |
| `saveState()` | `Object`  | use this method to save your state, in order to get in other steps |
| `getState()`  | `none`    | use this method to get you saved state by `saveState()` method     |
