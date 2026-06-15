import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

/**
 * KDIA Portal Mobile App
 * 
 * Customer Portal for KDIA - Demo Mode Only
 * This app demonstrates the mobile experience for KDIA customers
 * using demo/mock data without connecting to a real backend.
 */
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
