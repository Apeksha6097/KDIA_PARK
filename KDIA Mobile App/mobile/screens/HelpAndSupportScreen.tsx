import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
    navigation: NavigationProp;
}

export default function HelpAndSupportScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 64 + insets.bottom }}
        >
            <Text style={styles.headerTitle}>How can we help?</Text>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Self Service Help</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('EnergyUsageHelp')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                        <Text style={[styles.icon, { color: '#d97706' }]}>⚡</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Energy & Usage Help</Text>
                        <Text style={styles.cardDesc}>Learn how solar and grid power work</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('FAQ')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                        <Text style={[styles.icon, { color: '#0284c7' }]}>💰</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Billing & Credits Help</Text>
                        <Text style={styles.cardDesc}>How invoices, credits and payments work</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>

                <View style={styles.card}>
                    <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                        <Text style={[styles.icon, { color: '#16a34a' }]}>📡</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>System Status</Text>
                        <Text style={[styles.cardDesc, { color: '#16a34a', fontWeight: '600' }]}>✓ All systems operational</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('GettingStarted')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#f5f3ff' }]}>
                        <Text style={[styles.icon, { color: '#7c3aed' }]}>🚀</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Getting Started</Text>
                        <Text style={styles.cardDesc}>New user? Learn the basics of the portal</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Support Records</Text>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('SupportTickets')}
                >
                    <View style={styles.iconBox}>
                        <Text style={styles.icon}>🎫</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>My Tickets</Text>
                        <Text style={styles.cardDesc}>View status of your support requests</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('FAQ')}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                        <Text style={[styles.icon, { color: '#475569' }]}>❓</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>All FAQs</Text>
                        <Text style={styles.cardDesc}>Common questions and answers</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.didYouKnow}>
                <Text style={styles.didYouKnowTitle}>Did you know?</Text>
                <Text style={styles.didYouKnowText}>
                    Peak solar generation happens between 11 AM - 3 PM. Using heavy appliances then maximizes your savings.
                </Text>
            </View>

            <View style={styles.contactSection}>
                <Text style={styles.contactTitle}>Need more help?</Text>
                <Text style={styles.contactText}>
                    Contact our support team at support@kdia.com
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 24,
        marginTop: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
        color: '#16a34a',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748b',
    },
    arrow: {
        fontSize: 20,
        color: '#cbd5e1',
        fontWeight: 'bold',
    },
    contactSection: {
        marginTop: 32,
        alignItems: 'center',
        paddingBottom: 20,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
    },
    contactText: {
        fontSize: 13,
        color: '#94a3b8',
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    didYouKnow: {
        backgroundColor: '#f0fdfa',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#99f6e4',
        marginTop: 8,
    },
    didYouKnowTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0d9488',
        marginBottom: 8,
    },
    didYouKnowText: {
        fontSize: 13,
        color: '#134e4a',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});
