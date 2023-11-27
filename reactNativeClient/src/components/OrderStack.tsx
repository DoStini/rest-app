import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Orders from "./Orders";
import OrderHistory from "./OrderHistory";
const OrderStack = createStackNavigator();

const OrderStackScreen: React.FC = () => {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
      <OrderStack.Screen name="Orders" component={Orders} />
      <OrderStack.Screen name="OrderHistory" component={OrderHistory} />
    </OrderStack.Navigator>
  );
};

export default OrderStackScreen;
