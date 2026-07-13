import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONTS } from '../constants/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GettingStarted'>;

interface Props {
    navigation: NavigationProp;
}

export default function GettingStartedScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Getting Started</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Welcome to KDIA RE Park</Text>
                    <Text style={styles.bodyText}>
                        Welcome to a cleaner, smarter way to power your home. This portal is your central hub for managing your solar energy allocation and understanding your usage.
                    </Text>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Monitor Your Usage</Text>
                        <Text style={styles.stepDesc}>
                            Use the Dashboard to see your current allocation status and real-time energy insights.
                        </Text>
                    </View>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Manage Invoices</Text>
                        <Text style={styles.stepDesc}>
                            The Billing section tracks your monthly statements, credits applied, and net payments.
                        </Text>
                    </View>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Stay Informed</Text>
                        <Text style={styles.stepDesc}>
                            Check System Updates for maintenance alerts and community announcements.
                        </Text>
                    </View>
                </View>

                <View style={styles.step}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>4</Text>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Support</Text>
                        <Text style={styles.stepDesc}>
                            If you ever have questions, the Help center (where you are now!) has FAQs and ticket management.
                        </Text>
                    </View>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>
                        Ready to dive in? Head back to the Home screen to see your system in action.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: SPACING.l,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: SPACING.m,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.text,
    },
    scrollContent: {
        padding: SPACING.l,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        ...FONTS.h3,
        color: COLORS.primaryDark,
        marginBottom: SPACING.s,
    },
    bodyText: {
        ...FONTS.body,
        color: COLORS.text,
        lineHeight: 22,
    },
    step: {
        flexDirection: 'row',
        marginBottom: SPACING.l,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    stepNumberText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        ...FONTS.h3,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 4,
    },
    stepDesc: {
        ...FONTS.body,
        color: COLORS.textSecondary,
    },
    footerInfo: {
        marginTop: SPACING.xl,
        padding: SPACING.l,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        alignItems: 'center',
    },
    footerText: {
        ...FONTS.body,
        textAlign: 'center',
        color: COLORS.text,
        fontWeight: '500',
    },
});
