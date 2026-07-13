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
    Image,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { api } from '../services/api';
import { COLORS, SPACING, SHADOWS, FONTS } from '../constants/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
    navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Required', 'Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const result = await api.login({ email, password });

            if (result.success) {
                await AsyncStorage.setItem('user', JSON.stringify(result.user));
                await AsyncStorage.setItem('token', result.token);
                navigation.replace('MainRoot');
            } else {
                Alert.alert('Login Failed', result.message || 'Please try again');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.content}>
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        {/* Title removed as logo contains text, if purely icon, keep text */}
                        {/* <Text style={styles.title}>KDIA Re Park</Text> */}
                        <Text style={styles.subtitle}>Customer Portal</Text>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === 'email' && styles.inputFocused
                                ]}
                                placeholder="name@example.com"
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    focusedInput === 'password' && styles.inputFocused
                                ]}
                                placeholder="Enter your password"
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                editable={!loading}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.forgotButton}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2026 KDIA Re Park. All rights reserved.
                        </Text>
                    </View>
                </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.l,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logo: {
        width: 200, // Adjusted width for full logo (text included)
        height: 80,
        marginBottom: SPACING.s,
    },
    title: {
        ...FONTS.h1,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...FONTS.h3,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    formSection: {
        marginBottom: SPACING.l,
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
        borderRadius: 12, // Slightly more rounded
        fontSize: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text,
        ...SHADOWS.small,
    },
    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: '#f8fafc', // Very clear subtle shift
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
    forgotButton: {
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    forgotText: {
        ...FONTS.bodySmall,
        color: COLORS.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: SPACING.l,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        ...FONTS.bodySmall,
        color: COLORS.textLight,
    },
});
