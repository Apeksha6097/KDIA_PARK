import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    RefreshControl,
    Image,
    SafeAreaView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, DashboardData } from '../types';
import { api } from '../services/api';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
    navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('Customer');
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        allocationName: '',
        totalSubscribed: 0,
        allocationStatus: '',
        totalConsumed: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                setUserName(user.fullName || user.email);
            }

            const data = await api.getDashboard();
            setDashboardData(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const TARIFF_PER_KWH = 6.5; // Assumed ₹6.5 saved per kWh
    const CO2_PER_KWH = 0.82; // Assumed 0.82 kg CO2 saved per kWh

    // Calculate metrics
    const consumptionPercentage = dashboardData.totalSubscribed > 0
        ? Math.min(((dashboardData.totalConsumed || 0) / dashboardData.totalSubscribed) * 100, 100)
        : 0;

    const monthlySavings = Math.round((dashboardData.totalConsumed || 0) * TARIFF_PER_KWH);
    const co2Saved = ((dashboardData.totalConsumed || 0) * CO2_PER_KWH).toFixed(1);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.headerLogo}
                        resizeMode="contain"
                    />
                    {/* Placeholder for notification/settings icon if needed */}
                </View>
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeLabel}>Welcome back,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.contextualLine}>
                        Your solar subscription is covering {Math.round(consumptionPercentage)}% of your electricity needs this month.
                    </Text>
                </View>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.contentContainer, { paddingBottom: 64 + insets.bottom }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {/* Main Allocation Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>Current Allocation</Text>
                            <Text style={styles.cardSubTitle}>Monthly Allocation</Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            dashboardData.allocationStatus === 'ACTIVE'
                                ? styles.statusActive : styles.statusInactive
                        ]}>
                            <Text style={[
                                styles.statusText,
                                dashboardData.allocationStatus === 'ACTIVE'
                                    ? styles.statusActiveText : styles.statusInactiveText
                            ]}>
                                {dashboardData.allocationStatus}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.planName}>{dashboardData.allocationName}</Text>

                    <View style={styles.progressSection}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Solar Contribution</Text>
                            <Text style={styles.progressValue}>
                                {Math.round(consumptionPercentage)}%
                            </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${consumptionPercentage}%`, backgroundColor: COLORS.success }
                                    ]}
                                />
                            </View>
                        </View>

                        {/* New Impact Metrics */}
                        <View style={styles.impactMetricsRow}>
                            <View style={styles.impactMetric}>
                                <Text style={styles.impactLabel}>Monthly Savings</Text>
                                <Text style={styles.impactValuePrimary}>₹{monthlySavings.toLocaleString()}</Text>
                            </View>
                            <View style={styles.impactDivider} />
                            <View style={styles.impactMetric}>
                                <Text style={styles.impactLabel}>Carbon Impact</Text>
                                <Text style={styles.impactValueSuccess}>{co2Saved} kg CO₂</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Impact Insights */}
                <Text style={styles.sectionTitle}>Your Solar Impact</Text>
                <View style={styles.grid}>
                    {/* Estimated Savings */}
                    <View style={styles.gridItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                            <Text style={styles.icon}>💰</Text>
                        </View>
                        <Text style={styles.gridLabel}>₹{monthlySavings.toLocaleString()}</Text>
                        <Text style={styles.gridSubLabel}>Est. Monthly Savings</Text>
                    </View>

                    {/* Lifetime Savings */}
                    <View style={styles.gridItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                            <Text style={styles.icon}>📈</Text>
                        </View>
                        <Text style={styles.gridLabel}>₹{(monthlySavings * 14).toLocaleString()}</Text>
                        <Text style={styles.gridSubLabel}>Lifetime Savings</Text>
                    </View>

                    {/* CO2 Reduction */}
                    <View style={styles.gridItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#fff7ed' }]}>
                            <Text style={styles.icon}>☁️</Text>
                        </View>
                        <Text style={styles.gridLabel}>{co2Saved} kg</Text>
                        <Text style={styles.gridSubLabel}>CO₂ Reduction</Text>
                    </View>

                    {/* Equivalent Trees */}
                    <View style={styles.gridItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#f3f4f6' }]}>
                            <Text style={styles.icon}>🌳</Text>
                        </View>
                        <Text style={styles.gridLabel}>{Math.round(parseFloat(co2Saved) / 21)}</Text>
                        <Text style={styles.gridSubLabel}>Equivalent Trees</Text>
                    </View>
                </View>

                {/* Today's Energy Snapshot */}
                <Text style={styles.sectionTitle}>Today's Energy Snapshot</Text>
                <View style={styles.snapshotCard}>
                    <View style={styles.snapshotItem}>
                        <Text style={styles.snapshotValue}>12.4</Text>
                        <Text style={styles.snapshotLabel}>Today (kWh)</Text>
                    </View>
                    <View style={[styles.snapshotItem, styles.snapshotBorder]}>
                        <Text style={[styles.snapshotValue, { color: COLORS.success }]}>85%</Text>
                        <Text style={styles.snapshotLabel}>Solar Contribution</Text>
                    </View>
                    <View style={styles.snapshotItem}>
                        <Text style={styles.snapshotValue}>15%</Text>
                        <Text style={styles.snapshotLabel}>Grid Backup</Text>
                    </View>
                </View>

                {/* Insights / Tips Card */}
                <View style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Text style={styles.insightTitle}>💡 Smart Insight</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Peak solar generation occurs between 11 AM – 3 PM. Shifting your laundry or heavy appliance use to these hours maximizes your clean energy usage.
                    </Text>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: SPACING.l,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.m,
        paddingTop: Platform.OS === 'android' ? 40 : SPACING.s,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        ...SHADOWS.small,
    },
    headerTop: {
        marginBottom: SPACING.m,
        alignItems: 'flex-start',
    },
    headerLogo: {
        width: 120,
        height: 40,
    },
    welcomeSection: {
        // 
    },
    welcomeLabel: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    userName: {
        ...FONTS.h1,
        fontSize: 22,
        marginTop: 2,
    },
    contextualLine: {
        ...FONTS.bodySmall,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        ...SHADOWS.medium,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.m,
    },
    cardTitle: {
        ...FONTS.h3,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    cardSubTitle: {
        ...FONTS.bodySmall,
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    planName: {
        ...FONTS.h2,
        color: COLORS.primaryDark,
        marginBottom: SPACING.l,
    },
    statusBadge: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusActive: {
        backgroundColor: COLORS.successBg,
    },
    statusInactive: {
        backgroundColor: COLORS.errorBg,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    statusActiveText: {
        color: COLORS.success,
    },
    statusInactiveText: {
        color: COLORS.error,
    },
    progressSection: {
        marginTop: SPACING.s,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    progressLabel: {
        ...FONTS.body,
        fontSize: 13,
        fontWeight: '600',
    },
    progressValue: {
        ...FONTS.body,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    progressBarContainer: {
        marginBottom: SPACING.m,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: '#e2e8f0', // Lighter slate
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 6,
    },
    progressMarkers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        marginTop: -12,
        height: 12,
    },
    marker: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
    },
    statsTextMain: {
        ...FONTS.body,
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    statsTextSub: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    impactMetricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.m,
        paddingTop: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    impactMetric: {
        flex: 1,
        alignItems: 'center',
    },
    impactDivider: {
        width: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.m,
    },
    impactLabel: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        marginBottom: 4,
        fontWeight: '500',
    },
    impactValuePrimary: {
        ...FONTS.body,
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    impactValueSuccess: {
        ...FONTS.body,
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    remainingBadge: {
        marginTop: SPACING.m,
        backgroundColor: COLORS.primaryLight,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    remainingText: {
        ...FONTS.bodySmall,
        color: COLORS.primaryDark,
        fontWeight: '700',
        fontSize: 11,
    },
    sectionTitle: {
        ...FONTS.h3,
        fontSize: 16,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    gridItem: {
        width: '48%',
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: SPACING.m,
        alignItems: 'center',
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    icon: {
        fontSize: 22,
    },
    gridLabel: {
        ...FONTS.body,
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    gridSubLabel: {
        ...FONTS.bodySmall,
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 2,
    },
    snapshotCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    snapshotItem: {
        flex: 1,
        alignItems: 'center',
    },
    snapshotBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.border,
    },
    snapshotValue: {
        ...FONTS.h2,
        fontSize: 18,
        color: COLORS.text,
    },
    snapshotLabel: {
        ...FONTS.bodySmall,
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 4,
        textAlign: 'center',
    },
    insightCard: {
        backgroundColor: '#fffbeb',
        borderRadius: 12,
        padding: SPACING.m,
        borderWidth: 1,
        borderColor: '#fcd34d',
        marginBottom: SPACING.l,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    insightTitle: {
        ...FONTS.h3,
        fontSize: 14,
        color: '#b45309',
    },
    insightText: {
        ...FONTS.body,
        fontSize: 13,
        color: '#92400e',
        lineHeight: 20,
    },
});
