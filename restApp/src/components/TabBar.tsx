import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import theme from "../theme";
import TabBarComponent from "./TabBarComponent";
import styled from "styled-components/native";

const TabBarContainer = styled.View`
  background-color: ${theme.colors.barColor};
  flex-direction: row;
  position: absolute;
  align-items: center;
  justify-content: space-between;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 100px;
  flex: 1;
`;

const TabBar = ({ state, navigation, descriptors }: BottomTabBarProps) => {
  return (
    <TabBarContainer>
      <TabBarComponent
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </TabBarContainer>
  );
};

export default TabBar;
