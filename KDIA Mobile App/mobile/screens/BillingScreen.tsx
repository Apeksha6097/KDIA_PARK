import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { api } from '../services/api';
import { Invoice } from '../types';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';


export default function BillingScreen() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const data = await api.getInvoices();
            setInvoices(data as Invoice[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvoicePress = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setModalVisible(true);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Billing Summary</Text>
            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Due</Text>
                    <Text style={styles.summaryValue}>₹2,450</Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryBorder]}>
                    <Text style={styles.summaryLabel}>Last Payment</Text>
                    <Text style={styles.summaryValueSub}>Jan 15, 2026</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Next Due</Text>
                    <Text style={styles.summaryValueSub}>Feb 15, 2026</Text>
                </View>
            </View>
            <Text style={styles.sectionTitle}>Invoice History</Text>
        </View>
    );

    const renderItem = ({ item }: { item: Invoice }) => (
        <TouchableOpacity
            style={[
                styles.card,
                item.status === 'PENDING' || item.status === 'OVERDUE' ? styles.cardHighlight : null
            ]}
            onPress={() => handleInvoicePress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.row}>
                <View style={styles.leftContent}>
                    <Text style={styles.invoiceId}>{item.id}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                    <View style={styles.contextRow}>
                        <Text style={styles.contextText}>
                            {item.status === 'PAID' ? 'Solar units credited this month' : 'Includes grid backup charges'}
                        </Text>
                    </View>
                    {item.status === 'PAID' && (
                        <View style={styles.creditBadge}>
                            <Text style={styles.creditBadgeText}>✨ Solar Credit Applied</Text>
                        </View>
                    )}
                </View>
                <View style={styles.rightSide}>
                    <Text style={styles.amount}>₹{item.amount.toLocaleString('en-IN')}</Text>
                    <View style={[
                        styles.badge,
                        item.status === 'PAID' ? styles.badgeSuccess :
                            item.status === 'PENDING' ? styles.badgeWarning : styles.badgeError
                    ]}>
                        <Text style={[
                            styles.badgeText,
                            item.status === 'PAID' ? styles.textSuccess :
                                item.status === 'PENDING' ? styles.textWarning : styles.textError
                        ]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={invoices}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Invoice Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedInvoice && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Invoice ID</Text>
                                    <Text style={styles.detailValue}>{selectedInvoice.id}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Billing Period</Text>
                                    <Text style={styles.detailValue}>Jan 1 - Jan 31, 2026</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Status</Text>
                                    <Text style={[
                                        styles.statusText,
                                        selectedInvoice.status === 'PAID' ? styles.textSuccess :
                                            selectedInvoice.status === 'PENDING' ? styles.textWarning : styles.textError
                                    ]}>
                                        {selectedInvoice.status}
                                    </Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Units Consumed</Text>
                                    <Text style={styles.detailValue}>450 kWh</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Solar Units Credited</Text>
                                    <Text style={[styles.detailValue, { color: COLORS.success }]}>-120 kWh</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Net Usage</Text>
                                    <Text style={styles.detailValue}>330 kWh</Text>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.detailRow}>
                                    <Text style={styles.totalLabel}>Amount Payable</Text>
                                    <Text style={styles.totalValue}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</Text>
                                </View>

                                <View style={styles.infoBox}>
                                    <Text style={styles.infoText}>
                                        This is a read-only detailed view. All data shown is for demonstration purposes.
                                    </Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
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
    },
    listContent: {
        paddingBottom: SPACING.xl,
    },
    headerContainer: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.l,
    },
    sectionTitle: {
        ...FONTS.h3,
        fontSize: 16,
        marginBottom: SPACING.m,
        color: COLORS.text,
    },
    summaryCard: {
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
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.border,
    },
    summaryLabel: {
        ...FONTS.bodySmall,
        fontSize: 10,
        color: COLORS.textLight,
        marginBottom: 4,
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    summaryValue: {
        ...FONTS.h2,
        fontSize: 18,
        color: COLORS.primaryDark,
    },
    summaryValueSub: {
        ...FONTS.body,
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.m,
        marginHorizontal: SPACING.l,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHighlight: {
        borderColor: COLORS.warning,
        borderWidth: 1,
        backgroundColor: '#fffbeb', // Light amber
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftContent: {
        flex: 1,
    },
    invoiceId: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    date: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    contextRow: {
        marginBottom: 8,
    },
    contextText: {
        ...FONTS.bodySmall,
        fontSize: 11,
        color: COLORS.textLight,
        fontStyle: 'italic',
    },
    creditBadge: {
        backgroundColor: COLORS.successBg,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    creditBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    rightSide: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeSuccess: { backgroundColor: COLORS.successBg },
    badgeWarning: { backgroundColor: COLORS.warningBg },
    badgeError: { backgroundColor: COLORS.errorBg },
    badgeText: { fontSize: 11, fontWeight: 'bold' },
    textSuccess: { color: COLORS.success },
    textWarning: { color: '#b45309' },
    textError: { color: COLORS.error },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        paddingTop: SPACING.l,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.l,
    },
    modalTitle: {
        ...FONTS.h2,
        fontSize: 20,
    },
    closeButton: {
        fontSize: 24,
        color: COLORS.textLight,
        fontWeight: '300',
    },
    modalBody: {
        paddingHorizontal: SPACING.xl,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLabel: {
        ...FONTS.body,
        color: COLORS.textSecondary,
    },
    detailValue: {
        ...FONTS.body,
        fontWeight: '700',
        color: COLORS.text,
    },
    statusText: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },
    totalLabel: {
        ...FONTS.h3,
        fontSize: 16,
    },
    totalValue: {
        ...FONTS.h1,
        fontSize: 22,
        color: COLORS.primaryDark,
    },
    infoBox: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.background,
        padding: SPACING.m,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xxl,
    },
    infoText: {
        ...FONTS.bodySmall,
        textAlign: 'center',
        color: COLORS.textLight,
        lineHeight: 18,
    },
});
