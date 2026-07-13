import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>KDIA Re Park</Text>
                <Text style={styles.version}>Version 1.0.0 (Demo)</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.heading}>Our Mission</Text>
                <Text style={styles.paragraph}>
                    KDIA Re Park is dedicated to providing sustainable, renewable energy solutions to our community. We believe in a greener future where energy is clean, affordable, and accessible to everyone.
                </Text>

                <Text style={styles.heading}>Contact Us</Text>
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Headquarters</Text>
                        <Text style={styles.value}>123 Solar Way, Green City, GC 12345</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Support Email</Text>
                        <Text style={styles.value}>support@kdia.com</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>+1 (800) 123-SOLAR</Text>
                    </View>
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
        paddingHorizontal: SPACING.l,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.small,
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: SPACING.m,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    version: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
    },
    content: {
        padding: SPACING.l,
    },
    heading: {
        ...FONTS.h2,
        color: COLORS.primary,
        marginTop: SPACING.l,
        marginBottom: SPACING.s,
    },
    paragraph: {
        ...FONTS.body,
        lineHeight: 24,
        marginBottom: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderRadius: 24,
        ...SHADOWS.medium,
        marginTop: SPACING.s,
    },
    infoRow: {
        marginBottom: 0,
    },
    label: {
        ...FONTS.label,
        fontSize: 10,
        marginBottom: 4,
    },
    value: {
        ...FONTS.h3,
        fontSize: 15,
        color: COLORS.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: SPACING.m,
    },
});
