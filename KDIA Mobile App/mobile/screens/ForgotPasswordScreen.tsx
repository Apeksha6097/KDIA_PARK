import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface Props {
    navigation: ForgotPasswordScreenNavigationProp;
}

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSendResetLink = async () => {
        if (!email) {
            Alert.alert('Required', 'Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.successCard}>
                        <Text style={styles.successIcon}>📧</Text>
                        <Text style={styles.successTitle}>Check your email</Text>
                        <Text style={styles.successText}>
                            If this email is registered, a reset link has been sent to {email}.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonText}>Back to Login</Text>
                        </TouchableOpacity>

                        {/* Demo Link to Reset Screen */}
                        <TouchableOpacity
                            style={styles.demoLink}
                            onPress={() => navigation.navigate('ResetPassword', { email })}
                        >
                            <Text style={styles.demoLinkText}>[Demo] Go to Reset Password Screen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your registered email address and we'll send you a link to reset your password.
                        </Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSendResetLink}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xxl,
    },
    backButton: {
        marginBottom: SPACING.l,
    },
    backButtonText: {
        ...FONTS.body,
        color: COLORS.primary,
        fontWeight: '600',
    },
    title: {
        ...FONTS.h1,
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    subtitle: {
        ...FONTS.body,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    formSection: {
        marginTop: SPACING.m,
    },
    inputContainer: {
        marginBottom: SPACING.xl,
    },
    inputLabel: {
        ...FONTS.label,
        marginBottom: SPACING.s,
        marginLeft: SPACING.xs,
    },
    input: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text,
        ...SHADOWS.small,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.s,
        ...SHADOWS.medium,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...FONTS.button,
        letterSpacing: 0.5,
    },
    successCard: {
        backgroundColor: COLORS.white,
        padding: SPACING.xl,
        borderRadius: 24,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    successIcon: {
        fontSize: 48,
        marginBottom: SPACING.l,
    },
    successTitle: {
        ...FONTS.h2,
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    successText: {
        ...FONTS.body,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    demoLink: {
        marginTop: SPACING.xl,
        padding: SPACING.s,
    },
    demoLinkText: {
        ...FONTS.bodySmall,
        color: COLORS.primary,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
