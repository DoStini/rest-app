import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";

const StyledView = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const Settings = () => {
  return (
    <StyledView>
      <Text>Settings!</Text>
    </StyledView>
  );
};

export default Settings;
