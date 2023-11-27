import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";

const StyledView = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const Statistics = () => {
  return (
    <StyledView>
      <Text>View2!</Text>
    </StyledView>
  );
};

export default Statistics;
