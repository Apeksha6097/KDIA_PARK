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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

interface Props {
    navigation: ResetPasswordScreenNavigationProp;
    route: ResetPasswordScreenRouteProp;
}

export default function ResetPasswordScreen({ navigation, route }: Props) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Required', 'Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Invalid Password', 'Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.successCard}>
                        <Text style={styles.successIcon}>🎉</Text>
                        <Text style={styles.successTitle}>Password Reset Success</Text>
                        <Text style={styles.successText}>
                            Your password has been reset successfully. You can now use your new password to sign in.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonText}>Back to Login</Text>
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
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Please enter and confirm your new password below.
                        </Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                🔒 Password must be at least 8 characters long and include numbers or symbols for better security.
                            </Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>New Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Min. 8 characters"
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Confirm New Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor={COLORS.textLight}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                editable={!loading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleResetPassword}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Update Password</Text>
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
        marginBottom: SPACING.xl,
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
        marginTop: SPACING.s,
    },
    infoBox: {
        backgroundColor: COLORS.infoBg || '#eff6ff',
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.infoBorder || '#bfdbfe',
    },
    infoText: {
        ...FONTS.bodySmall,
        color: COLORS.infoText || '#1e40af',
        lineHeight: 18,
    },
    inputContainer: {
        marginBottom: SPACING.l,
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
        marginTop: SPACING.m,
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
});
