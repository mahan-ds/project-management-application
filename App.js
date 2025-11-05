import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import NewProject from './screens/NewProject';
import ProjectDetail from './screens/ProjectDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Freelancer Manager" }} />
        <Stack.Screen name="NewProject" component={NewProject} options={{ title: "Add Project" }} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetail} options={{ title: "Project Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
