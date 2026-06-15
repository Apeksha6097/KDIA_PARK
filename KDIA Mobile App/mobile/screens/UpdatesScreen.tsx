import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { api } from '../services/api';
import { SystemUpdate } from '../types';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';

export default function UpdatesScreen() {
    const [updates, setUpdates] = useState<SystemUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUpdates();
    }, []);

    const loadUpdates = async () => {
        try {
            const data = await api.getUpdates();
            setUpdates(data as SystemUpdate[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: SystemUpdate }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.content}>{item.content}</Text>
        </View>
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
                data={updates}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
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
        padding: SPACING.l,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    date: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    content: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});
