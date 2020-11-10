/**
 * MIT License
 *
 * Copyright (c) 2020 samad324
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React, { Component } from "react";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";

const defaultInOnNext = "fadeInLeft";
const defaultOutOnNext = "fadeOutRight";
const defaultInOnBack = "fadeInRight";
const defaultOutOnBack = "fadeOutLeft";

export class AnimatedMultistep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      totalSteps: 0,
      userState: props.defaultState || {},
      action: "fadeInLeft",
      animationFinished: false,
    };
  }

  componentDidMount() {
    const { steps = 0 } = this.props;
    const { comeInOnNext = defaultInOnNext } = this.props;
    this.setState({ action: comeInOnNext });
    this.setState({ totalSteps: steps.length - 1 });
  }

  next = () => {
    const { currentStep, totalSteps } = this.state;
    const {
      animate = true,
      OutOnNext = defaultOutOnNext,
      duration = 1000,
    } = this.props;
    if (currentStep !== totalSteps) {
      this.onNext();
      this.setState({ action: OutOnNext, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({ currentStep: currentStep + 1 });
        }, duration);
      }
    } else {
      this.finish();
    }
  };

  back = () => {
    const { currentStep } = this.state;
    const {
      animate = true,
      OutOnBack = defaultOutOnBack,
      duration = 1000,
    } = this.props;
    if (currentStep !== 0) {
      this.onBack();
      this.setState({ action: OutOnBack, animationFinished: false });
      if (animate) {
        setTimeout(() => {
          this.setState({ currentStep: currentStep - 1 });
        }, duration);
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

  saveState = (state) => {
    const { userState } = this.state;
    if (typeof state !== "object") {
      throw new Error("State must be an object");
    }
    this.setState({ userState: { ...userState, ...state } });
  };

  resetState = (state) => {
    this.setState({ userState: {} });
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
      comeInOnNext = defaultInOnNext,
    } = this.props;
    if (!animationFinished) {
      this.setState({
        action: action == OutOnBack ? comeInOnBack : comeInOnNext,
        animationFinished: true,
      });
    }
  };

  render() {
    const { steps = 0, duration = 1000 } = this.props;
    const { currentStep, action } = this.state;
    const Step = steps[currentStep].component;
    return (
      <Animatable.View
        ref={this.handleViewRef}
        animation={action}
        onAnimationEnd={this.animationEnd}
        style={{ flex: 1 }}
        duration={duration}
      >
        <Step
          next={this.next}
          back={this.back}
          saveState={this.saveState}
          resetState={this.resetState}
          getState={this.getState}
          getCurrentStep={this.getCurrentStep}
          getTotalSteps={this.getTotalSteps}
        />
      </Animatable.View>
    );
  }
}

AnimatedMultistep.propTypes = {
  steps: PropTypes.array,
  onFinish: PropTypes.func,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  comeInOnNext: PropTypes.string,
  OutOnNext: PropTypes.string,
  comeInOnBack: PropTypes.string,
  OutOnBack: PropTypes.string,
  duration: PropTypes.number,
  defaultState: PropTypes.object,
};

export default Animatable.createAnimatableComponent(AnimatedMultistep);
