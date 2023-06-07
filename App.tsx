import { useState } from "react";
import routes from "./routes/routes";
import { Routes } from "./routes/availableRoutes";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";

import "react-native-gesture-handler";

import UserProvider from "./context/UserContext/UserProvider";
import TravelProvider from "./context/TravelContext/TravelProvider";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider setIsAuthenticated={setIsAuthenticated}>
      <TravelProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? Routes.Dashboard : Routes.Auth}
          >
            {isAuthenticated ? (
              routes
                .filter((route) => route.path !== Routes.Auth)
                .map((route) => (
                  <Stack.Screen
                    key={route.path}
                    name={route.path}
                    component={route.component}
                    options={{ headerShown: false }}
                  />
                ))
            ) : (
              <Stack.Screen
                key={Routes.Auth}
                name={Routes.Auth}
                component={AuthScreen}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </TravelProvider>
    </UserProvider>
  );
}
