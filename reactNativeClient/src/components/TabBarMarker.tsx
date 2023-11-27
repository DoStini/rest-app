import React from "react";
import Animated from "react-native-reanimated";
import { TabBarMarkerProps } from "../types/types";
import styled from "styled-components/native";
import { SCREEN_WIDTH, TAB_COUNT } from "../types/constants";
import theme from "../theme";

const Container = styled(Animated.View)`
  height: 2px;
  background-color: ${theme.colors.textPrimary};
  width: ${SCREEN_WIDTH / TAB_COUNT}px;
  border-radius: 1px;
`;

const TabBarMarker = ({ animatedStyle }: TabBarMarkerProps) => (
  <Container style={animatedStyle} />
);

export default TabBarMarker;
