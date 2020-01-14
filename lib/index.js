import React, { Component } from "react";
import * as Animatable from "react-native-animatable";

const defaultInOnNext = "fadeInLeft";
const defaultOutOnNext = "fadeOutRight";
const defaultInOnBack = "fadeInRight";
const defaultOutOnBack = "fadeOutLeft";

export class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      totalSteps: 0,
      userState: {},
      action: "fadeInLeft",
      animationFinished: false
    };
  }

  componentWillMount() {
    const { comeInOnNext = defaultInOnNext } = this.props;
    this.setState({ action: comeInOnNext });
  }

  componentDidMount() {
    const { steps = 0 } = this.props;
    this.setState({ totalSteps: steps.length - 1 });
  }

  next = () => {
    const { currentStep, totalSteps } = this.state;
    const { animate = true, OutOnNext = defaultOutOnNext } = this.props;
    if (currentStep !== totalSteps) {
      this.onNext();
      this.setState({ action: OutOnNext, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({ currentStep: currentStep + 1 });
        }, 500);
      }
    } else {
      this.finish();
    }
  };

  back = () => {
    const { currentStep } = this.state;
    const { animate = true, OutOnBack = defaultOutOnBack } = this.props;
    if (currentStep !== 0) {
      this.onBack();
      this.setState({ action: OutOnBack, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({ currentStep: currentStep - 1 });
        }, 500);
      }
    }
  };

  onNext = () => {
    const { onNext } = this.props;
    if (onNext) {
      if (typeof onNext != "function") {
        throw new Error("onNext parameter should be a function");
      }
      onNext();
    }
  };

  onBack = () => {
    const { onBack } = this.props;
    if (onBack) {
      if (typeof onBack != "function") {
        throw new Error("onBack parameter should be a function");
      }
      onBack();
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

  getCurrentStep = () => {
    const { currentStep } = this.state;
    return currentStep + 1;
  };

  getTotalSteps = () => {
    const { totalSteps } = this.state;
    return totalSteps + 1;
  };

  animationEnd = () => {
    const { action, animationFinished } = this.state;
    const {
      OutOnBack = defaultOutOnBack,
      comeInOnBack = defaultInOnBack,
      comeInOnNext = defaultInOnNext
    } = this.props;
    if (!animationFinished) {
      this.setState({
        action: action == OutOnBack ? comeInOnBack : comeInOnNext,
        animationFinished: true
      });
    }
  };

  render() {
    const { steps = 0 } = this.props;
    const { currentStep, action } = this.state;
    const Step = steps[currentStep].component;
    return (
      <Animatable.View
        ref={this.handleViewRef}
        animation={action}
        onAnimationEnd={this.animationEnd}
        style={{ flex: 1 }}
      >
        <Step
          next={this.next}
          back={this.back}
          saveState={this.saveState}
          getState={this.getState}
          getCurrentStep={this.getCurrentStep}
          getTotalSteps={this.getTotalSteps}
        />
      </Animatable.View>
    );
  }
}

export default Animatable.createAnimatableComponent(index);
