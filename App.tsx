import * as React from "react";
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { SQLiteProvider } from "expo-sqlite/next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home";
import {useFonts} from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

const loadDataBase = async () => {
  const dbName = "nothingDB.db";
  const dbAsset = require("./assets/nothingDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    loadDataBase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  const[fontsLoaded,error]  = useFonts({
    "nothing": require("./assets/fonts/nothingfont.otf")
  })

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  if (!dbLoaded) return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator size={"large"} />
      <Text>Loading...</Text>
    </View>
  );

  return (
    <NavigationContainer>
      <React.Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
            <Text>Loading...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="nothingDB.db" useSuspense>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerLargeTitle: true,
                headerTitle: "💲Nothing Budget ",
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTitleStyle: {
                  fontFamily: 'nothing', 
                  fontSize: 30,
                },
                headerTintColor: 'white',
              }}
            />
          </Stack.Navigator>
        </SQLiteProvider>
      </React.Suspense>
    </NavigationContainer>
  );
}
