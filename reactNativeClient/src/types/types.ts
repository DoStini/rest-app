import type { BottomTabBarProps as ReactNavigationBottomTabBarProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import {
  TextProps as NativeTextProps,
  StyleProp,
  ViewStyle,
} from "react-native";

export type ColorType = keyof typeof theme.colors;
export type FontSizeType = keyof typeof theme.fontSizes;
export type FontWeightType = keyof typeof theme.fontWeights;

export interface TextProps extends NativeTextProps {
  color?: ColorType;
  fontSize?: FontSizeType;
  fontWeight?: FontWeightType;
  shadow?: boolean;
  style?: NativeTextProps["style"];
}

export const Screen = {
  Statistics: { name: "STATISTICS", icon: "bar-chart" },
  Orders: { name: "ORDERS", icon: "food-bank" },
  Products: { name: "PRODUCTS", icon: "local-pizza" },
  Settings: { name: "SETTINGS", icon: "settings" },
} as const;

export type ScreenTitle = (typeof Screen)[keyof typeof Screen]["name"];
export type ScreenIcon = (typeof Screen)[keyof typeof Screen]["icon"];

export type BottomTabBarProps = ReactNavigationBottomTabBarProps;

export type TabBarItemProps = {
  title: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
};

export type TabBarMarkerProps = {
  animatedStyle: StyleProp<ViewStyle>;
};
