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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EnergyUsageHelp'>;

interface Props {
    navigation: NavigationProp;
}

export default function EnergyUsageHelpScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Energy & Usage Help</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Solar Generation</Text>
                    <Text style={styles.bodyText}>
                        Your solar panels generate electricity during daylight hours. Peak generation typically occurs between 11 AM and 3 PM when the sun is highest.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Grid Backup</Text>
                    <Text style={styles.bodyText}>
                        When your energy consumption exceeds your solar generation (e.g., at night or during heavy appliance use), your home automatically draws power from the grid. This ensures you always have a steady supply of electricity.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Solar Credits</Text>
                    <Text style={styles.bodyText}>
                        Any excess solar energy your system generates that you don't use is fed back into the KDIA RE Park network. This generates "Solar Credits" which are applied to your monthly bill to reduce your grid backup charges.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How Calculations Work</Text>
                    <View style={styles.formulaBox}>
                        <Text style={styles.formulaLabel}>Net Payable Amount =</Text>
                        <Text style={styles.formulaValue}>(Grid Units × Rate) - Solar Credits</Text>
                    </View>
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        💡 Tip: Shifting high-energy tasks like laundry or dishwasher to peak solar hours (11AM - 3PM) can significantly reduce your grid dependence.
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
    formulaBox: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: SPACING.s,
    },
    formulaLabel: {
        ...FONTS.bodySmall,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    formulaValue: {
        ...FONTS.body,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    infoBox: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.primaryLight,
        padding: SPACING.m,
        borderRadius: 12,
    },
    infoText: {
        ...FONTS.body,
        color: COLORS.primaryDark,
        fontStyle: 'italic',
    },
});
