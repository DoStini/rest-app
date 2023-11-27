import React from "react";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBarMarker from "./TabBarMarker";
import TabBarComponent from "./TabBarComponent";
import { ScreenTitle } from "../types/types";
import { getTitleForRoute, getIconForRoute } from "../types/utils";
import { BottomTabBarProps } from "../types/types";
import styled from "styled-components/native";
import { SCREEN_WIDTH, TAB_COUNT } from "../types/constants";

const TabBarContainer = styled.View`
  flex-direction: row;
`;

const TabBar = ({
  state: { routeNames, index: selectedTab },
  navigation,
}: BottomTabBarProps) => {
  const tabWidth = SCREEN_WIDTH / TAB_COUNT;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(tabWidth * selectedTab) }],
  }));
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <TabBarMarker animatedStyle={animatedStyle} />
      <TabBarContainer style={{ paddingBottom: bottom }}>
        {routeNames.map((routeName, idx) => (
          <TabBarComponent
            key={routeName}
            title={getTitleForRoute(routeName as ScreenTitle)}
            icon={getIconForRoute(routeName as ScreenTitle)}
            isSelected={selectedTab === idx}
            onPress={() => navigation.navigate(routeName)}
          />
        ))}
      </TabBarContainer>
    </>
  );
};

export default TabBar;
