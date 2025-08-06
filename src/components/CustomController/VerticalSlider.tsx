import React from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  ViewStyle
} from "react-native";

interface VSliderProps {
  initialValue?: number;
  min?: number;
  max?: number;
  circleDiameter?: number;
  color?: string;
  backgroundColor?: string;
  barColor?: string;
  textColor?: string;
  barWidth?: number;
  containerStyle?: ViewStyle;
  onValueChange?: (value: number) => void;
}

type StateType = {
  barHeight: number | null;
  deltaValue: number;
  value: number;
};

export default class VerticalSlider extends React.Component<VSliderProps, StateType> {
  static defaultProps: VSliderProps = {
    initialValue: 0,
    min: 0,
    max: 100,
    circleDiameter: 15,
    color: '#ffffff',
    backgroundColor: '#000000',
    barColor: '#ffffff',
    textColor: '#ffffff',
    barWidth: 2,
  };

  constructor(props: VSliderProps) {
    super(props);
    this.state = {
      barHeight: null,
      deltaValue: 0,
      value: props.initialValue || 0
    };
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Return true if the gesture is a vertical drag,
      // and we want to take control.
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (_, gestureState) => this.onMove(gestureState),
    onPanResponderRelease: () => this.onEndMove(),
    onPanResponderTerminate: () => {}
  });


  onMove(gestureState: PanResponderGestureState) {
    const { barHeight } = this.state;
    const { min = 0, max = 100 } = this.props;
    const newDeltaValue = this.getValueFromBottomOffset(
      -gestureState.dy,
      barHeight,
      min,
      max
    );

    this.setState({
      deltaValue: newDeltaValue
    });
  }

  onEndMove() {
    const { value, deltaValue } = this.state;
    const newValue = value + deltaValue;
    this.setState({ value: newValue, deltaValue: 0 });
    
    if (this.props.onValueChange) {
      this.props.onValueChange(Math.floor(this.capValueWithinRange(newValue, [this.props.min || 0, this.props.max || 100])));
    }
  }

  onBarLayout = (event: LayoutChangeEvent) => {
    const { height: barHeight } = event.nativeEvent.layout;
    this.setState({ barHeight });
  };

  capValueWithinRange = (value: number, range: number[]) => {
    if (value < range[0]) return range[0];
    if (value > range[1]) return range[1];
    return value;
  };

  getValueFromBottomOffset = (
    offset: number,
    barHeight: number | null,
    rangeMin: number,
    rangeMax: number
  ) => {
    if (barHeight === null) return 0;
    return ((rangeMax - rangeMin) * offset) / barHeight;
  };

  getBottomOffsetFromValue = (
    value: number,
    rangeMin: number,
    rangeMax: number,
    barHeight: number | null
  ) => {
    if (barHeight === null) return 0;
    const valueOffset = value - rangeMin;
    const totalRange = rangeMax - rangeMin;
    const percentage = valueOffset / totalRange;
    return barHeight * percentage;
  };

  render() {
    const { value, deltaValue, barHeight } = this.state;
    const { 
      min = 0, 
      max = 100, 
      circleDiameter = 15,
      color = '#ffffff',
      backgroundColor = '#000000',
      barColor = '#ffffff',
      barWidth = 2,
      containerStyle
    } = this.props;

    const cappedValue = this.capValueWithinRange(value + deltaValue, [min, max]);
    const bottomOffset = this.getBottomOffsetFromValue(cappedValue, min, max, barHeight);

    const styles = StyleSheet.create({
      pageContainer: {
        backgroundColor: backgroundColor,
        flexGrow: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        ...containerStyle,
      },
      container: {
        flexGrow: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      barContainer: {
        width: circleDiameter/2,
        alignItems: 'center',
        paddingVertical: circleDiameter / 2,
        // marginHorizontal: 10,
      },
      bar: {
        width: barWidth,
        backgroundColor: barColor,
        flexGrow: 1,
      },
      circle: {
        borderRadius: circleDiameter / 2,
        width: circleDiameter,
        height: circleDiameter,
        backgroundColor: color,
        position: 'absolute',
        bottom: bottomOffset,
      },
    });

    return (
      <View style={styles.pageContainer}>
        <View style={styles.container}>
          <View style={styles.barContainer}>
            <View style={styles.bar} onLayout={this.onBarLayout} />
            <View
              style={styles.circle}
              {...this.panResponder.panHandlers}
            />
          </View>
        </View>
      </View>
    );
  }
}