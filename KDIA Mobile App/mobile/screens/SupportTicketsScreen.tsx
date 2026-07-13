import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SupportTicket } from '../types';
import { api } from '../services/api';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

type SupportTicketsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
    navigation: SupportTicketsNavigationProp;
}

export default function SupportTicketsScreen({ navigation }: Props) {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General Inquiry');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await api.getSupportTickets();
            setTickets(data as SupportTicket[]);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!subject.trim() || !description.trim()) {
            Alert.alert('Required Fields', 'Please enter both a subject and description.');
            return;
        }

        const newTicket: SupportTicket = {
            id: `TKT-2024-0${tickets.length + 3}`,
            subject: subject,
            status: 'OPEN',
            date: new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            description: description,
        };

        setTickets([newTicket, ...tickets]);
        setModalVisible(false);
        setSubject('');
        setDescription('');
        setCategory('General Inquiry');
        setPriority('Medium');
        Alert.alert('Success', 'Support ticket created successfully (Simulated)');
    };

    const renderTicket = ({ item }: { item: SupportTicket }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TicketDetails', { ticketId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.ticketId}>{item.id}</Text>
                <View style={[
                    styles.statusBadge,
                    item.status === 'OPEN' ? styles.statusOpen : styles.statusClosed
                ]}>
                    <Text style={[
                        styles.statusText,
                        item.status === 'OPEN' ? styles.textOpen : styles.textClosed
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.description} numberOfLines={2}>
                {item.description}
            </Text>
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
            <View style={styles.headerAction}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.createButtonText}>+ New Ticket</Text>
                </TouchableOpacity>
                <Text style={styles.demoNote}>Support actions simulated in demo mode</Text>
            </View>

            <FlatList
                data={tickets}
                renderItem={renderTicket}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No support tickets found</Text>
                    </View>
                }
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
                            <Text style={styles.modalTitle}>New Support Ticket</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer}>
                            <Text style={styles.fieldLabel}>Category</Text>
                            <View style={styles.pickerContainer}>
                                {['Billing', 'Technical', 'General Inquiry'].map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.chip, category === cat && styles.chipActive]}
                                        onPress={() => setCategory(cat)}
                                    >
                                        <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.fieldLabel}>Priority</Text>
                            <View style={styles.pickerContainer}>
                                {['Low', 'Medium', 'High'].map((prio) => (
                                    <TouchableOpacity
                                        key={prio}
                                        style={[styles.chip, priority === prio && styles.chipActive]}
                                        onPress={() => setPriority(prio)}
                                    >
                                        <Text style={[styles.chipText, priority === prio && styles.chipTextActive]}>{prio}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.fieldLabel}>Subject</Text>
                            <TextInput
                                style={styles.input}
                                value={subject}
                                onChangeText={setSubject}
                                placeholder="What's the issue about?"
                            />

                            <Text style={styles.fieldLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe your problem in detail..."
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Submit Ticket</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
    headerAction: {
        padding: 16,
        paddingBottom: 8,
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 8,
        width: '100%',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    demoNote: {
        color: COLORS.textLight,
        fontSize: 12,
        fontStyle: 'italic',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...SHADOWS.small,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ticketId: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusOpen: {
        backgroundColor: '#ffedd5',
    },
    statusClosed: {
        backgroundColor: COLORS.successBg,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    textOpen: {
        color: '#c2410c',
    },
    textClosed: {
        color: COLORS.success,
    },
    subject: {
        ...FONTS.h3,
        color: COLORS.secondary,
        marginBottom: 4,
    },
    date: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    description: {
        ...FONTS.body,
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textLight,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        ...FONTS.h2,
        color: COLORS.secondary,
    },
    closeButton: {
        fontSize: 20,
        color: COLORS.textSecondary,
        padding: 4,
    },
    formContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        ...FONTS.label,
        color: COLORS.secondary,
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...FONTS.body,
    },
    textArea: {
        minHeight: 100,
    },
    pickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    chipText: {
        ...FONTS.bodySmall,
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 32,
        ...SHADOWS.medium,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
