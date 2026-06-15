import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { api } from '../services/api';
import { FAQItem } from '../types';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [expandedID, setExpandedID] = useState<string | null>(null);

    useEffect(() => {
        api.getFAQs().then(setFaqs);
    }, []);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedID(expandedID === id ? null : id);
    };

    const renderItem = ({ item }: { item: FAQItem }) => {
        const isExpanded = expandedID === item.id;
        return (
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.question, isExpanded && styles.questionActive]}>
                        {item.question}
                    </Text>
                    <Text style={styles.icon}>{isExpanded ? '−' : '+'}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.body}>
                        <Text style={styles.answer}>{item.answer}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={faqs}
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
        backgroundColor: '#f8f9fa',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    question: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1e293b',
        flex: 1,
        paddingRight: 16,
    },
    questionActive: {
        color: '#0d9488',
        fontWeight: '600',
    },
    icon: {
        fontSize: 20,
        color: '#94a3b8',
        fontWeight: '300',
    },
    body: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: '#fff',
    },
    answer: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
});
