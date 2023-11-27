import styled from "styled-components/native";
import Text from "./Text";

const ContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-top: 50px;
`;

const Products = () => {
  return (
    <ContentContainer>
      <Text fontSize="heading" fontWeight="bold" shadow={true}>
        Products
      </Text>
    </ContentContainer>
  );
};

export default Products;
