import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import theme from "../theme";
import { TabBarComponentProps } from "../types/types";

export const routes = {
  home: { name: "Home", icon: "home" },
  players: { name: "View2", icon: "user" },
  standings: { name: "View3", icon: "barschart" },
  settings: { name: "Settings", icon: "setting" },
};

const { width } = Dimensions.get("window");

const TAB_WIDTH = (width - 40 * 2) / 4;

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 40,
    backgroundColor: theme.colors.backgroundSecondary,
    zIndex: 0,
    position: "absolute",
    marginHorizontal: 20,
    borderRadius: 20,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  a: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

const TabBarComponent = ({
  state,
  navigation,
  descriptors,
}: TabBarComponentProps) => {
  const translateX = useSharedValue(0);
  const focusedTab = state.index;

  const handleAnimate = (index: number) => {
    "worklet";
    translateX.value = withTiming(index * TAB_WIDTH, {
      duration: 1000,
    });
  };

  useEffect(() => {
    runOnUI(handleAnimate)(focusedTab);
  }, [focusedTab]);

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <>
      <Animated.View style={[styles.container, rnStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({
              name: route.name,
              merge: true,
              params: {},
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const routeName = route.name.toLowerCase() as keyof typeof routes;
        const icon = routes[routeName]?.icon;
        return (
          <Pressable
            key={`route-${index}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
          >
            <View style={styles.a}>
              <AntDesign
                name={icon}
                size={24}
                color={isFocused ? "#A9A9A9" : "black"}
              />
              {isFocused && (
                <Text
                  style={{ color: "#A9A9A9", fontSize: 11, paddingLeft: 3 }}
                >
                  {label}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </>
  );
};

export default TabBarComponent;
