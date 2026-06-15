import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ContactSupportScreen() {
    const navigation = useNavigation<any>();

    const handleEmailPress = () => {
        Linking.openURL('mailto:support@kdia.in');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+91XXXXXXXXXX');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="help-buoy" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>Contact Support</Text>
                <Text style={styles.subtitle}>How can we help you today?</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                        <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                            <Ionicons name="mail" size={24} color="#2563eb" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Email Us</Text>
                            <Text style={styles.contactValue}>support@kdia.in</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
                        <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                            <Ionicons name="call" size={24} color="#16a34a" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Call Us</Text>
                            <Text style={styles.contactValue}>+91-XXXXXXXXXX</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, styles.actionCard]}>
                    <Text style={styles.actionTitle}>Need a specific solution?</Text>
                    <Text style={styles.actionDesc}>If you're facing a technical issue, raising a ticket is the fastest way to get help.</Text>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('SupportTickets' as any)}
                    >
                        <Text style={styles.actionButtonText}>Raise a Ticket</Text>
                        <Ionicons name="add-circle" size={20} color={COLORS.white} />
                    </TouchableOpacity>
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
    header: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.small,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0fdfa',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.text,
    },
    subtitle: {
        ...FONTS.body,
        color: COLORS.textLight,
        marginTop: 4,
    },
    content: {
        padding: SPACING.l,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: SPACING.m,
        ...SHADOWS.small,
        marginBottom: SPACING.l,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.s,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        ...FONTS.label,
        color: COLORS.textLight,
        fontSize: 10,
        marginBottom: 2,
    },
    contactValue: {
        ...FONTS.h3,
        color: COLORS.text,
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: SPACING.s,
        marginLeft: 64,
    },
    actionCard: {
        backgroundColor: '#0d9488',
        padding: SPACING.l,
    },
    actionTitle: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 4,
    },
    actionDesc: {
        ...FONTS.bodySmall,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 18,
        marginBottom: SPACING.l,
    },
    actionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    actionButtonText: {
        ...FONTS.h3,
        color: COLORS.white,
        fontSize: 15,
    },
});
