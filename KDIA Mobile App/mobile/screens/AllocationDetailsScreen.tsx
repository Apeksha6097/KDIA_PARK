import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';
import { api } from '../services/api';
import { UsageStats } from '../types';

const { width } = Dimensions.get('window');

export default function AllocationDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [stats, setStats] = useState<UsageStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getUsageStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching usage stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!stats) return null;

    return (
        <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 64 + insets.bottom }}
        >
            {/* 1. Solar Subscription Value Card */}
            <View style={styles.headerSection}>
                <View style={[styles.mainCard, styles.premiumCard]}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.planName}>Solar Premium Tier 1</Text>
                            <Text style={styles.planSubtitle}>Active Subscription</Text>
                        </View>
                        <View style={styles.coverageBadge}>
                            <Text style={styles.coverageText}>{stats.cleanEnergyPercentage}% Covered</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Allocation</Text>
                            <Text style={styles.statValue}>450 kWh</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Est. Savings</Text>
                            <Text style={[styles.statValue, { color: COLORS.success }]}>₹{stats.estimatedSavings}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 2. Financial Impact Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Financial Impact</Text>
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Monthly Savings</Text>
                        <Text style={styles.metricValue}>₹{stats.estimatedSavings.toLocaleString()}</Text>
                        <Text style={styles.metricNote}>vs Grid-only cost</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Effective Cost</Text>
                        <Text style={styles.metricValue}>₹4.20 / kWh</Text>
                        <Text style={styles.metricNote}>Blended rate</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Annual Savings</Text>
                        <Text style={[styles.metricValue, { color: COLORS.success }]}>₹{(stats.estimatedSavings * 12).toLocaleString()}</Text>
                        <Text style={styles.metricNote}>Projected</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>ROI Impact</Text>
                        <Text style={styles.metricValue}>High</Text>
                        <Text style={styles.metricNote}>Tier 1 Efficiency</Text>
                    </View>
                </View>
            </View>

            {/* 3. Lifetime Solar Impact */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lifetime Solar Impact</Text>
                <View style={styles.lifetimeCard}>
                    <View style={styles.impactRow}>
                        <View style={styles.impactIconContainer}>
                            <Text style={styles.impactEmoji}>💰</Text>
                        </View>
                        <View style={styles.impactData}>
                            <Text style={styles.impactLabel}>Lifetime Savings</Text>
                            <Text style={styles.impactValue}>₹{(stats.estimatedSavings * 14).toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={styles.impactRow}>
                        <View style={styles.impactIconContainer}>
                            <Text style={styles.impactEmoji}>⚡</Text>
                        </View>
                        <View style={styles.impactData}>
                            <Text style={styles.impactLabel}>Total Solar Offset</Text>
                            <Text style={styles.impactValue}>6,300 kWh</Text>
                        </View>
                    </View>
                    <View style={styles.impactRow}>
                        <View style={styles.impactIconContainer}>
                            <Text style={styles.impactEmoji}>🌱</Text>
                        </View>
                        <View style={styles.impactData}>
                            <Text style={styles.impactLabel}>CO₂ Reduction</Text>
                            <Text style={styles.impactValue}>{(stats.co2Saved * 12).toLocaleString()} kg</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 4. Billing Summary */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Billing Summary</Text>
                <View style={styles.billingCard}>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Plan Name</Text>
                        <Text style={styles.billingValue}>Premium Tier 1</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Subscription Fee</Text>
                        <Text style={styles.billingValue}>₹2,500 / mo</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Solar Credit Value</Text>
                        <Text style={[styles.billingValue, { color: COLORS.success }]}>- ₹3,280</Text>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Billing')}
                        >
                            <Text style={styles.actionButtonText}>View Billing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary }]}
                            onPress={() => navigation.navigate('Billing')}
                        >
                            <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>Invoice</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 5. Smart Insights */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Insights</Text>
                <View style={styles.insightBox}>
                    <Text style={styles.insightText}>
                        Your solar subscription currently offsets {stats.cleanEnergyPercentage}% of your electricity usage.
                    </Text>
                </View>
                <View style={styles.insightBox}>
                    <Text style={styles.insightText}>
                        Increasing your allocation by 100 kWh could significantly increase your solar coverage and monthly ROI.
                    </Text>
                </View>
            </View>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    headerSection: {
        padding: SPACING.l,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.small,
    },
    mainCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    premiumCard: {
        backgroundColor: '#f8fafc',
        ...SHADOWS.medium,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    planSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    coverageBadge: {
        backgroundColor: COLORS.successBg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    coverageText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: SPACING.l,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    section: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    metricCard: {
        width: (width - SPACING.l * 2 - 16) / 2,
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 20,
        marginBottom: 16,
        ...SHADOWS.small,
    },
    metricLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    metricNote: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 4,
    },
    lifetimeCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        ...SHADOWS.small,
    },
    impactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    impactIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    impactEmoji: {
        fontSize: 20,
    },
    impactData: {
        flex: 1,
    },
    impactLabel: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    impactValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    billingCard: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.l,
        ...SHADOWS.small,
    },
    billingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    billingLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    billingValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.m,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 44,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    insightBox: {
        backgroundColor: '#eff6ff',
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    insightText: {
        fontSize: 13,
        color: '#1e40af',
        lineHeight: 18,
    },
});
