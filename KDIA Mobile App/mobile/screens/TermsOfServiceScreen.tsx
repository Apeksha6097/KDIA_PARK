import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

export default function TermsOfServiceScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <Text style={styles.heading}>KDIA Re Park Terms of Service</Text>
                <Text style={styles.lastUpdated}>Last Updated: March 21, 2026</Text>

                <View style={styles.card}>
                    <Text style={styles.paragraph}>
                        These terms govern the use of KDIA RE Park services. By accessing our platform, you agree to comply with all stated regulations regarding energy allocation and usage monitoring.
                    </Text>

                    <Text style={styles.subHeading}>1. User Obligations</Text>
                    <Text style={styles.paragraph}>
                        Users are responsible for providing accurate information during registration and for maintaining the security of their account credentials. Any unauthorized use of accounts should be reported immediately to our support team.
                    </Text>

                    <Text style={styles.subHeading}>2. Energy Allocation</Text>
                    <Text style={styles.paragraph}>
                        All solar energy allocations are subject to real-time grid availability and solar park generation capacity. KDIA Re Park reserves the right to adjust allocations based on maintenance schedules and environmental factors to ensure grid stability.
                    </Text>

                    <Text style={styles.subHeading}>3. Privacy & Data</Text>
                    <Text style={styles.paragraph}>
                        We value your privacy. Your energy consumption data is used solely for billing and system optimization. Personal information is protected under our separate Privacy Policy.
                    </Text>

                    <Text style={styles.subHeading}>4. Limitations of Liability</Text>
                    <Text style={styles.paragraph}>
                        Under no circumstances shall KDIA RE Park be liable for any direct, indirect, special, incidental or consequential damages resulting from the use or inability to use the platform.
                    </Text>
                </View>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.l,
    },
    heading: {
        ...FONTS.h1,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    lastUpdated: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        marginBottom: SPACING.l,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderRadius: 24,
        ...SHADOWS.small,
    },
    subHeading: {
        ...FONTS.h3,
        color: COLORS.text,
        marginTop: SPACING.m,
        marginBottom: SPACING.xs,
        fontWeight: 'bold',
    },
    paragraph: {
        ...FONTS.body,
        lineHeight: 22,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
});
