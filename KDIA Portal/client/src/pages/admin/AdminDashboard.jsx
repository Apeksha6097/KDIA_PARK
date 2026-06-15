import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import OperationalAlerts from '../../components/OperationalAlerts';
import DashboardBanner from '../../components/DashboardBanner';
import PendingActions from '../../components/PendingActions';
import AllocationCapacity from '../../components/AllocationCapacity';
import RecentActivityFeed from '../../components/RecentActivityFeed';
import SystemHealthIndicators from '../../components/SystemHealthIndicators';
import DiscomFilter from '../../components/DiscomFilter';
import { getFilteredStats, getCumulativeStats } from '../../data/discomSeedData';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterState, setFilterState] = useState({ discom: '', locationType: 'district', subsection: '' });
    const [cardVisible, setCardVisible] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Fetch all required data in parallel
                const [statsRes, alertsRes, auditRes] = await Promise.all([
                    api.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/admin/alerts', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setStats(statsRes.data);
                setAlerts(alertsRes.data);
                setAuditLogs(auditRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError('Failed to fetch dashboard data. Please check your connection.');
                setLoading(false);
            }
        };
        if (token) fetchAllData();
    }, [token]);

    /**
     * Smooth fade transition when filter changes.
     * API-ready: swap getFilteredStats with an async call here.
     */
    const handleFilterChange = useCallback((newFilter) => {
        setCardVisible(false);
        setTimeout(() => {
            setFilterState(newFilter);
            setCardVisible(true);
        }, 180);
    }, []);

    /**
     * Derive the stats to display.
     * - No DISCOM selected → use cumulative seed stats (default)
     * - DISCOM selected    → use seed data via getFilteredStats
     */
    const getSeedStats = () => {
        if (!filterState.discom) return getCumulativeStats();
        return getFilteredStats(filterState.discom, filterState.locationType, filterState.subsection);
    };

    const seedStats = getSeedStats();

    // displayStats is what every card/component reads
    const displayStats = seedStats
        ? {
            // Map seed fields to the shape that existing components expect
            totalCustomers: seedStats.totalCustomers,
            activeCustomers: seedStats.activeAllocations,
            totalAllocatedEnergy: seedStats.totalEnergy,
            // Extra seed fields passed directly
            totalAvailable: seedStats.totalAvailable,
            pendingApprovals: seedStats.pendingApprovals,
            pendingAllocations: seedStats.pendingAllocations,
            supportRequests: seedStats.supportRequests,
            // Capacity card fields
            totalCapacityKwh: seedStats.totalCapacityKwh,
            executedCapacityKwh: seedStats.executedCapacityKwh,
            underExecutionKwh: seedStats.underExecutionKwh,
        }
        : stats; // ← original API stats (fallback if seed is null)

    // Derived alerts for PendingActions when a filter is active
    const displayAlerts = seedStats
        ? {
            pendingCustomerApprovals: seedStats.pendingApprovals,
            supportSLA: seedStats.supportRequests,
        }
        : alerts;

    // ── Capacity cards (dynamic balance) ──
    const totalCap = displayStats?.totalCapacityKwh || 0;
    const executed = displayStats?.executedCapacityKwh || 0;
    const underExec = displayStats?.underExecutionKwh || 0;
    const balanceCap = Math.max(0, totalCap - (executed + underExec));

    const capacityCards = [
        {
            label: 'Total Capacity',
            subtitle: 'Sanctioned project capacity',
            value: totalCap,
            accentColor: '#3182ce',
            bgTint: '#ebf8ff',
            borderAccent: '#bee3f8',
        },
        {
            label: 'Executed Capacity',
            subtitle: 'Allocated to customers',
            value: executed,
            accentColor: '#38a169',
            bgTint: '#f0fff4',
            borderAccent: '#c6f6d5',
        },
        {
            label: 'Under Execution',
            subtitle: 'Pending allocation pipeline',
            value: underExec,
            accentColor: '#dd6b20',
            bgTint: '#fffaf0',
            borderAccent: '#feebc8',
        },
        {
            label: 'Balance Capacity',
            subtitle: 'Available remaining capacity',
            value: balanceCap,
            accentColor: '#319795',
            bgTint: '#e6fffa',
            borderAccent: '#b2f5ea',
        },
    ];

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', minHeight: '400px', width: '100%', justifyContent: 'center' }}>
            <div style={{ fontWeight: '600', color: '#4a5568' }}>Loading Service Operations...</div>
        </div>
    );

    if (error) return (
        <div style={{ padding: '24px', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px', color: '#c53030', margin: '24px 0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System Connectivity Issue</div>
            <div style={{ fontSize: '0.9rem' }}>{error}</div>
            <button
                onClick={() => window.location.reload()}
                style={{ marginTop: '16px', padding: '8px 16px', background: '#c53030', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
                Retry Connection
            </button>
        </div>
    );

    const statCards = [
        { label: 'Total Customers', value: displayStats?.totalCustomers || 0, color: '#3182ce' },
        { label: 'Active Allocations', value: displayStats?.activeCustomers || 0, color: '#38a169' },
        { label: 'Total Energy (kWh)', value: displayStats?.totalAllocatedEnergy || 0, color: '#d69e2e' },
    ];

    return (
        <div style={{ paddingBottom: '64px' }}>
            <div style={{ marginBottom: '32px' }}>
                <DashboardBanner
                    title="Service Operations Dashboard"
                    text="Oversee approvals, allocations, and platform operations for KDIA Re Park."
                />
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '8px', fontSize: '2rem', fontWeight: '800', color: '#1a202c' }}>Service Operations</h1>
                <p style={{ color: '#718096', fontSize: '1.1rem' }}>Operational oversight for customer allocations and platform health</p>
            </div>

            {/* ── DISCOM Filter Bar ── */}
            <DiscomFilter onFilterChange={handleFilterChange} />

            {/* All filterable content — fades smoothly on filter change */}
            <div
                style={{
                    opacity: cardVisible ? 1 : 0,
                    transition: 'opacity 0.18s ease',
                }}
            >
                {/* ── 4 Capacity KPI Cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '36px' }}>
                    {capacityCards.map((card) => (
                        <div
                            key={card.label}
                            style={{
                                background: '#fff',
                                padding: '22px 20px',
                                borderRadius: '16px',
                                border: `1px solid ${card.borderAccent}`,
                                boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Subtle top accent bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: card.accentColor,
                            }} />

                            <div style={{
                                color: '#718096',
                                fontSize: '0.72rem',
                                fontWeight: '800',
                                marginBottom: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>
                                {card.label}
                            </div>
                            <div style={{
                                color: '#a0aec0',
                                fontSize: '0.68rem',
                                fontWeight: '500',
                                marginBottom: '14px',
                                lineHeight: 1.3,
                            }}>
                                {card.subtitle}
                            </div>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: '900',
                                color: card.accentColor,
                                lineHeight: 1,
                            }}>
                                {card.value.toLocaleString()}
                            </div>
                            <div style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                color: '#a0aec0',
                                marginTop: '4px',
                            }}>
                                kWh
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Existing Stats Row (Customers / Allocations / Energy) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                    {statCards.map((stat) => (
                        <div key={stat.label} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ color: '#718096', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {stat.label}
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#2d3748' }}>
                                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Critical Actions & Capacity Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
                    <PendingActions alerts={displayAlerts} stats={displayStats} />
                    <AllocationCapacity
                        totalAllocated={displayStats?.totalAllocatedEnergy}
                        totalAvailable={displayStats?.totalAvailable}
                    />
                </div>
            </div>

            {/* Operational Alerts Section — always shows live data */}
            <OperationalAlerts token={token} />

            {/* Activity & Health Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <RecentActivityFeed activities={auditLogs} />
                <SystemHealthIndicators />
            </div>

            {/* Legacy Info (Themed) */}
            <div style={{ marginTop: '48px', padding: '32px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: '700' }}>Admin Operations Portal</h3>
                <div style={{ display: 'flex', gap: '48px' }}>
                    <div style={{ flex: 2 }}>
                        <p style={{ color: '#4a5568', lineHeight: '1.7', fontSize: '0.95rem' }}>
                            This dashboard provides real-time visibility into the KDIA Clean Energy network.
                            Use the cards above to monitor allocation health and manage pending administrative tasks.
                            All actions are logged in the system audit trail.
                        </p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/admin/customers')}
                            style={{
                                padding: '12px',
                                background: '#2d3748',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#1a202c'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#2d3748'}
                        >
                            Manage Customers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
