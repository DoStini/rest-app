import styled from "styled-components/native";
import Text from "./Text";
import { OrderHistoryProps } from "../types/types";
import { MaterialIcons } from "@expo/vector-icons";

const ContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
`;
const IconContainer = styled.View`
  position: absolute;
  top: 50px;
  left: 10px;
  padding: 10px;
`;

const OrderHistory = ({ navigation }: OrderHistoryProps) => {
  const goToOrders = () => {
    navigation.navigate("Orders");
  };

  return (
    <ContentContainer>
      <IconContainer>
        <MaterialIcons
          name="arrow-back"
          size={30}
          color="black"
          onPress={goToOrders}
        />
      </IconContainer>
      <Text fontSize="heading" fontWeight="bold" shadow={true}>
        Order History
      </Text>
    </ContentContainer>
  );
};

export default OrderHistory;
