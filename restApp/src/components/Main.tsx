import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBar from "./TabBar";
import Home from "./Home";
import Settings from "./Settings";
import Statistics from "./Statistics";
import View3 from "./History";

const BottomTab = createBottomTabNavigator();

const Main = () => {
  const renderTabBar = (props: BottomTabBarProps) => <TabBar {...props} />;

  return (
    <NavigationContainer>
      <BottomTab.Navigator
        tabBar={(props) => renderTabBar(props)}
        screenOptions={{
          headerShown: false,
        }}
      >
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen name="Statistics" component={Statistics} />
        <BottomTab.Screen name="View3" component={View3} />
        <BottomTab.Screen name="Settings" component={Settings} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
};

export default Main;
