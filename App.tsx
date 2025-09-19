/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ShiftListScreen from './src/screens/ShiftListScreen';
import ShiftDetailScreen from './src/screens/ShiftDetailScreen';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ShiftList">
          <Stack.Screen
            name="ShiftList"
            component={ShiftListScreen}
            options={{ title: 'Список смен' }}
          />
          <Stack.Screen
            name="ShiftDetail"
            component={ShiftDetailScreen}
            options={{ title: 'Детали смены' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
