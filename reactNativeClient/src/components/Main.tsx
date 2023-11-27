import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Screen } from "../types/types";
import TabBar from "./TabBar";
import Statistics from "./Statistics";
import Orders from "./Orders";
import Products from "./Products";
import Settings from "./Settings";

const BottomTab = createBottomTabNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <BottomTab.Screen
          name={Screen.Statistics.name}
          component={Statistics}
        />
        <BottomTab.Screen name={Screen.Orders.name} component={Orders} />
        <BottomTab.Screen name={Screen.Products.name} component={Products} />
        <BottomTab.Screen name={Screen.Settings.name} component={Settings} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default Main;
