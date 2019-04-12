import React, { Component } from "react";
import { Animated, View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      totalSteps: 0,
      userState: {}
    };
    this.moveAnimation = new Animated.ValueXY({ x: 0, y: 0 });
  }

  componentDidMount() {
    const { steps = 0 } = this.props;
    this.setState({ totalSteps: steps.length - 1 });
  }

  _move = (x = 0, y = 0) => {
    Animated.spring(this.moveAnimation, {
      toValue: { x, y },
      delay: 2000
    }).start();
  };

  next = () => {
    const { currentStep, totalSteps } = this.state;
    const { animate = true } = this.props;
    if (currentStep !== totalSteps) {
      if (animate) {
        this._move(-width, 0);
      }
      this.setState({ currentStep: currentStep + 1 });
      if (animate) {
        setTimeout(() => {
          this._move(0, 0);
        }, 2300);
      }
    } else {
      this.finish();
    }
  };

  back = () => {
    const { currentStep } = this.state;
    const { animate = true } = this.props;
    if (currentStep !== 0) {
      if (animate) {
        this._move(width, 0);
      }
      this.setState({ currentStep: currentStep - 1 });
      if (animate) {
        setTimeout(() => {
          this._move(0, 0);
        }, 2300);
      }
    }
  };

  finish = () => {
    const { onFinish } = this.props;
    const { userState } = this.state;
    if (onFinish) {
      onFinish(userState);
    }
  };

  saveState = state => {
    const { userState } = this.state;
    if (typeof state !== "object") {
      throw new Error("state must be an object");
    }
    this.setState({ userState: { ...userState, ...state } });
  };

  getState = () => {
    return this.state.userState;
  };

  render() {
    const { steps = 0 } = this.props;
    const { currentStep } = this.state;
    const Step = steps[currentStep].component;
    return (
      <Animated.View style={[{ flex: 1 }, this.moveAnimation.getLayout()]}>
        <Step
          next={this.next}
          back={this.back}
          saveState={this.saveState}
          getState={this.getState}
        />
      </Animated.View>
    );
  }
}

export default index;
