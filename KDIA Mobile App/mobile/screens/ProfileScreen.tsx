import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, User } from '../types';
import { api } from '../services/api';
import { SHADOWS } from '../constants/theme';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
    navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [profileDetails, setProfileDetails] = useState<any>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            }

            const data = await api.getProfile();
            setProfileDetails(data);
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            navigation.replace('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 64 + insets.bottom }}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user?.fullName?.charAt(0) || 'U'}
                    </Text>
                </View>
                <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Plan Details</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Current Plan</Text>
                        <Text style={styles.value}>{profileDetails?.planName}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Member Since</Text>
                        <Text style={styles.value}>{profileDetails?.memberSince}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Status</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{profileDetails?.status}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Info</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{profileDetails?.email}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{profileDetails?.phone}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Preferences</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Notifications</Text>
                        <Text style={styles.value}>{profileDetails?.notificationPreferences}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Language</Text>
                        <Text style={styles.value}>{profileDetails?.language}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Time Zone</Text>
                        <Text style={styles.value}>{profileDetails?.timeZone}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Energy Connection Info</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Consumer ID</Text>
                        <Text style={styles.value}>{profileDetails?.consumerId}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Connection</Text>
                        <Text style={styles.value}>{profileDetails?.connectionLocation}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Meter Type</Text>
                        <Text style={styles.value}>{profileDetails?.meterType}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security & Access</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Last Login</Text>
                        <Text style={styles.value}>{profileDetails?.lastLogin}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Device Type</Text>
                        <Text style={styles.value}>{profileDetails?.deviceType}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support & Legal</Text>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('TermsOfService')}>
                        <Text style={styles.actionLabel}>Terms of Service</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('ContactSupport')}>
                        <Text style={styles.actionLabel}>Contact Support</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>KDIA Portal Mobile v1.0.0 (Demo)</Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccfbf1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0f766e',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    actionLabel: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '600',
    },
    chevron: {
        fontSize: 20,
        color: '#cbd5e1',
        fontWeight: '300',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#166534',
    },
    logoutButton: {
        margin: 24,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fee2e2',
        ...SHADOWS.small,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        color: '#cbd5e1',
        fontSize: 12,
        marginBottom: 12,
    },
});
