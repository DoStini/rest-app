import React from "react";
import { Text as NativeText, StyleSheet } from "react-native";
import theme from "../theme";
import {
  ColorType,
  FontSizeType,
  FontWeightType,
  TextProps,
} from "../types/types";

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal as FontWeightType,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontSizeHeading: {
    fontSize: theme.fontSizes.heading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold as FontWeightType,
  },
  textShadow: {
    textShadowColor: theme.colors.shadowColor,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

const Text: React.FC<TextProps> = ({
  color,
  fontSize,
  fontWeight,
  shadow,
  style,
  ...props
}) => {
  // Create a function to get color by key
  const getColor = (colorKey: ColorType) => theme.colors[colorKey];

  // Map fontSize and fontWeight to theme values
  const getFontSize = (sizeKey: FontSizeType) => theme.fontSizes[sizeKey];
  const getFontWeight = (weightKey: FontWeightType) =>
    theme.fontWeights[weightKey];

  const textStyle = [
    styles.text,
    color && { color: getColor(color) },
    fontSize && { fontSize: getFontSize(fontSize) },
    fontWeight && { fontWeight: getFontWeight(fontWeight) },
    shadow && styles.textShadow,
    style,
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
