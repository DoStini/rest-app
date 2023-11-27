import React from "react";
import { Pressable } from "react-native";
import { TabBarItemProps } from "../types/types";
import styled from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme";
import Text from "./Text";

const StyledPressable = styled(Pressable)`
  flex: 1;
  align-items: center;
  padding-left: 12px;
  padding-right: 12px;
`;
const TitleIconContainer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TabBarComponent = ({
  title,
  icon,
  isSelected,
  onPress,
}: TabBarItemProps) => (
  <StyledPressable onPress={onPress}>
    <TitleIconContainer>
      <Text fontSize="body" fontWeight={isSelected ? "bold" : "normal"}>
        {title}
      </Text>

      <MaterialIcons
        name={icon}
        size={isSelected ? 30 : 24}
        color={theme.colors.textPrimary}
      />
    </TitleIconContainer>
  </StyledPressable>
);

export default TabBarComponent;
