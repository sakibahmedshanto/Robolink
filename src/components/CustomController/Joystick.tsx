import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Gesture, GestureDetector, GestureTouchEvent } from "react-native-gesture-handler";

import { ViewProps } from "react-native";
export interface IReactNativeJoystickEvent {
  type: "move" | "stop" | "start";
  position: {
    x: number;
    y: number;
  };
  force: number;
  angle: {
    radian: number;
    degree: number;
  };
}

export interface IReactNativeJoystickProps extends ViewProps {
  onStart?: (e: IReactNativeJoystickEvent) => void;
  onMove?: (e: IReactNativeJoystickEvent) => void;
  onStop?: (e: IReactNativeJoystickEvent) => void;
  radius?: number;
  color?: string;
}

const calcDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 *
 * @param p1
 * @param p2
 * @returns Angle in degrees
 */
const calcAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const rawAngle = radiansToDegrees(Math.atan2(dy, dx));
  if (rawAngle < 0) return 180 - Math.abs(rawAngle);
  else return rawAngle + 180;
};

const degreesToRadians = (a: number) => {
  return a * (Math.PI / 180);
};

const radiansToDegrees = (a: number) => {
  return a * (180 / Math.PI);
};

const findCoord = (
  position: { x: number; y: number },
  distance: number,
  angle: number
) => {
  const b = { x: 0, y: 0 };
  angle = degreesToRadians(angle);
  b.x = position.x + distance * Math.cos(angle);
  b.y = position.y + distance * Math.sin(angle);
  if (b.y < 0) b.y += 150
  return b;
};

const utils = {
  calcDistance,
  calcAngle,
  degreesToRadians,
  radiansToDegrees,
  findCoord,
};

const ReactNativeJoystick = ({ onStart, onMove, onStop, color = "#000000", radius = 150, style, ...props }: IReactNativeJoystickProps) => {
  const wrapperRadius = radius;
  const nippleRadius = wrapperRadius / 3;

  const [x, setX] = useState(wrapperRadius - nippleRadius);
  const [y, setY] = useState(wrapperRadius - nippleRadius);

  const handleTouchMove = useCallback(
    (event: GestureTouchEvent) => {
      const e = event.changedTouches[0];
      const fingerX = e.x;
      const fingerY = Platform.OS === 'web' ? (wrapperRadius * 2 - e.y) : e.y;
      let coordinates = {
        x: fingerX - nippleRadius,
        y: fingerY - nippleRadius,
      };

      const angle = utils.calcAngle({ x: fingerX, y: fingerY }, { x: wrapperRadius, y: wrapperRadius });

      let dist = utils.calcDistance({ x: wrapperRadius, y: wrapperRadius }, { x: fingerX, y: fingerY });

      const force = dist / (nippleRadius * 2);

      dist = Math.min(dist, wrapperRadius);
      if (dist === wrapperRadius) {
        coordinates = utils.findCoord({ x: wrapperRadius, y: wrapperRadius }, dist, angle);
        coordinates = {
          x: coordinates.x - nippleRadius,
          y: coordinates.y - nippleRadius,
        };
      }
      setX(coordinates.x);
      setY(coordinates.y);

      onMove &&
        onMove({
          position: coordinates,
          angle: {
            radian: utils.degreesToRadians(angle),
            degree: angle,
          },
          force,
          type: "move",
        });
    },
    [nippleRadius, wrapperRadius]
  );

  const handleTouchEnd = () => {
    setX(wrapperRadius - nippleRadius);
    setY(wrapperRadius - nippleRadius);
    onStop &&
      onStop({
        force: 0,
        position: {
          x: 0,
          y: 0,
        },
        angle: {
          radian: 0,
          degree: 0,
        },
        type: "stop",
      });
  };

  const handleTouchStart = () => {
    onStart &&
      onStart({
        force: 0,
        position: {
          x: 0,
          y: 0,
        },
        angle: {
          radian: 0,
          degree: 0,
        },
        type: "start",
      });
  };

  const panGesture = Gesture.Pan().onStart(handleTouchStart).onEnd(handleTouchEnd).onTouchesMove(handleTouchMove);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          width: 2 * radius,
          height: 2 * radius,
          borderRadius: radius,
          backgroundColor: `${color}55`,
          transform: [{ rotateX: "180deg" }],
          ...(style && typeof style === "object" ? style : {}),
        },
        nipple: {
          height: 2 * nippleRadius,
          width: 2 * nippleRadius,
          borderRadius: nippleRadius,
          backgroundColor: `${color}bb`,
          position: "absolute",
          transform: [
            {
              translateX: x,
            },
            { translateY: y },
          ],
        },
      }),
    [radius, color, nippleRadius, x, y]
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.wrapper} {...props}>
        <View pointerEvents="none" style={styles.nipple}></View>
      </View>
    </GestureDetector>
  );
};


export default ReactNativeJoystick;