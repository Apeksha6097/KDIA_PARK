import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SupportTicket } from '../types';
import { api } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetails'>;

export default function TicketDetailsScreen({ route }: Props) {
    const { ticketId } = route.params;
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTicket();
    }, []);

    const loadTicket = async () => {
        try {
            // In a real app, you'd fetch by ID. 
            // Here we just grab all and find the one we need for demo purposes
            const tickets = await api.getSupportTickets();
            const found = tickets.find(t => t.id === ticketId);
            setTicket((found || null) as SupportTicket | null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

    if (!ticket) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Ticket not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.ticketId}>#{ticket.id}</Text>
                <View style={[
                    styles.statusBadge,
                    ticket.status === 'OPEN' ? styles.statusOpen : styles.statusClosed
                ]}>
                    <Text style={[
                        styles.statusText,
                        ticket.status === 'OPEN' ? styles.textOpen : styles.textClosed
                    ]}>{ticket.status}</Text>
                </View>
            </View>

            <Text style={styles.subject}>{ticket.subject}</Text>
            <Text style={styles.date}>Opened: {ticket.date}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Description</Text>
            <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{ticket.description}</Text>
            </View>

            <Text style={styles.sectionLabel}>Updates</Text>
            <View style={styles.emptyUpdate}>
                <Text style={styles.emptyUpdateText}>No recent updates on this ticket.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#ef4444',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ticketId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusOpen: {
        backgroundColor: '#ffedd5',
    },
    statusClosed: {
        backgroundColor: '#dcfce7',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    textOpen: {
        color: '#c2410c',
    },
    textClosed: {
        color: '#15803d',
    },
    subject: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 12,
    },
    descriptionBox: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    emptyUpdate: {
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    emptyUpdateText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
});
