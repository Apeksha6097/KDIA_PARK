import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import EnergyUsageHelpScreen from '../screens/EnergyUsageHelpScreen';
import GettingStartedScreen from '../screens/GettingStartedScreen';
import MainTabNavigator from './MainTabNavigator';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import SupportTicketsScreen from '../screens/SupportTicketsScreen';
import FAQScreen from '../screens/FAQScreen';
import AboutScreen from '../screens/AboutScreen';
import AllocationDetailsScreen from '../screens/AllocationDetailsScreen';
import BillingScreen from '../screens/BillingScreen';
import UpdatesScreen from '../screens/UpdatesScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0d9488',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MainRoot"
                component={MainTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="TicketDetails"
                component={TicketDetailsScreen}
                options={{
                    title: 'Ticket Details',
                }}
            />
            <Stack.Screen
                name="SupportTickets"
                component={SupportTicketsScreen}
                options={{
                    title: 'Support Tickets',
                }}
            />
            <Stack.Screen
                name="FAQ"
                component={FAQScreen}
                options={{
                    title: 'Frequently Asked Questions',
                }}
            />
            <Stack.Screen
                name="Billing"
                component={BillingScreen}
                options={{ title: 'Billing History' }}
            />
            <Stack.Screen
                name="AllocationDetails"
                component={AllocationDetailsScreen}
                options={{ title: 'Allocation Details' }}
            />
            <Stack.Screen
                name="Updates"
                component={UpdatesScreen}
                options={{ title: 'System Updates' }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'About KDIA' }}
            />
            <Stack.Screen
                name="EnergyUsageHelp"
                component={EnergyUsageHelpScreen}
                options={{ title: 'Energy & Usage Help' }}
            />
            <Stack.Screen
                name="GettingStarted"
                component={GettingStartedScreen}
                options={{ title: 'Getting Started' }}
            />
            <Stack.Screen
                name="TermsOfService"
                component={TermsOfServiceScreen}
                options={{ title: 'Terms of Service' }}
            />
            <Stack.Screen
                name="ContactSupport"
                component={ContactSupportScreen}
                options={{ title: 'Contact Support' }}
            />
        </Stack.Navigator>
    );
}
