/**
 * DISCOM Seed Data for Admin Dashboard Filtering
 *
 * Structure:
 *   DISCOM_SEED_DATA[discom].totals           → DISCOM-level stats
 *   DISCOM_SEED_DATA[discom].districts[key]   → district-level stats
 *   DISCOM_SEED_DATA[discom].parks[key]       → park-level stats
 *
 * Each stats object contains:
 *   totalCustomers, activeAllocations, totalEnergy,
 *   totalAvailable, totalAllocated,
 *   pendingApprovals, pendingAllocations, supportRequests,
 *   totalCapacityKwh, executedCapacityKwh, underExecutionKwh
 *
 * Capacity rule: executedCapacityKwh + underExecutionKwh <= totalCapacityKwh
 * Balance is computed dynamically: totalCapacityKwh - (executed + underExecution)
 *
 * Modular design: swap getCumulativeStats / getFilteredStats
 * with API calls for backend integration.
 */

export const DISCOM_SEED_DATA = {
    jaipur: {
        totals: {
            totalCustomers: 52,
            activeAllocations: 44,
            totalEnergy: 18750,
            totalAvailable: 22000,
            totalAllocated: 18750,
            pendingApprovals: 4,
            pendingAllocations: 8,
            supportRequests: 3,
            totalCapacityKwh: 22000,
            executedCapacityKwh: 15200,
            underExecutionKwh: 3550,
        },
        districts: {
            jaipur_district: {
                label: 'Jaipur District',
                totalCustomers: 28,
                activeAllocations: 24,
                totalEnergy: 10200,
                totalAvailable: 12000,
                totalAllocated: 10200,
                pendingApprovals: 2,
                pendingAllocations: 4,
                supportRequests: 1,
                totalCapacityKwh: 12000,
                executedCapacityKwh: 8400,
                underExecutionKwh: 1800,
            },
            sanganer: {
                label: 'Sanganer',
                totalCustomers: 14,
                activeAllocations: 12,
                totalEnergy: 5300,
                totalAvailable: 6500,
                totalAllocated: 5300,
                pendingApprovals: 1,
                pendingAllocations: 2,
                supportRequests: 1,
                totalCapacityKwh: 6500,
                executedCapacityKwh: 4300,
                underExecutionKwh: 1100,
            },
            chomu: {
                label: 'Chomu',
                totalCustomers: 10,
                activeAllocations: 8,
                totalEnergy: 3250,
                totalAvailable: 3500,
                totalAllocated: 3250,
                pendingApprovals: 1,
                pendingAllocations: 2,
                supportRequests: 1,
                totalCapacityKwh: 3500,
                executedCapacityKwh: 2500,
                underExecutionKwh: 650,
            },
        },
        parks: {
            park_a: {
                label: 'Park A',
                totalCustomers: 30,
                activeAllocations: 26,
                totalEnergy: 11400,
                totalAvailable: 13000,
                totalAllocated: 11400,
                pendingApprovals: 2,
                pendingAllocations: 4,
                supportRequests: 2,
                totalCapacityKwh: 13000,
                executedCapacityKwh: 9200,
                underExecutionKwh: 2200,
            },
            park_b: {
                label: 'Park B',
                totalCustomers: 22,
                activeAllocations: 18,
                totalEnergy: 7350,
                totalAvailable: 9000,
                totalAllocated: 7350,
                pendingApprovals: 2,
                pendingAllocations: 4,
                supportRequests: 1,
                totalCapacityKwh: 9000,
                executedCapacityKwh: 6000,
                underExecutionKwh: 1350,
            },
        },
    },

    jodhpur: {
        totals: {
            totalCustomers: 38,
            activeAllocations: 31,
            totalEnergy: 14200,
            totalAvailable: 17000,
            totalAllocated: 14200,
            pendingApprovals: 5,
            pendingAllocations: 7,
            supportRequests: 4,
            totalCapacityKwh: 17000,
            executedCapacityKwh: 11500,
            underExecutionKwh: 2700,
        },
        districts: {
            jodhpur_district: {
                label: 'Jodhpur District',
                totalCustomers: 24,
                activeAllocations: 20,
                totalEnergy: 9100,
                totalAvailable: 11000,
                totalAllocated: 9100,
                pendingApprovals: 3,
                pendingAllocations: 4,
                supportRequests: 2,
                totalCapacityKwh: 11000,
                executedCapacityKwh: 7400,
                underExecutionKwh: 1700,
            },
            phalodi: {
                label: 'Phalodi',
                totalCustomers: 14,
                activeAllocations: 11,
                totalEnergy: 5100,
                totalAvailable: 6000,
                totalAllocated: 5100,
                pendingApprovals: 2,
                pendingAllocations: 3,
                supportRequests: 2,
                totalCapacityKwh: 6000,
                executedCapacityKwh: 4100,
                underExecutionKwh: 1000,
            },
        },
        parks: {
            park_c: {
                label: 'Park C',
                totalCustomers: 20,
                activeAllocations: 17,
                totalEnergy: 7800,
                totalAvailable: 9000,
                totalAllocated: 7800,
                pendingApprovals: 3,
                pendingAllocations: 3,
                supportRequests: 2,
                totalCapacityKwh: 9000,
                executedCapacityKwh: 6300,
                underExecutionKwh: 1500,
            },
            park_d: {
                label: 'Park D',
                totalCustomers: 18,
                activeAllocations: 14,
                totalEnergy: 6400,
                totalAvailable: 8000,
                totalAllocated: 6400,
                pendingApprovals: 2,
                pendingAllocations: 4,
                supportRequests: 2,
                totalCapacityKwh: 8000,
                executedCapacityKwh: 5200,
                underExecutionKwh: 1200,
            },
        },
    },

    ajmer: {
        totals: {
            totalCustomers: 34,
            activeAllocations: 23,
            totalEnergy: 12050,
            totalAvailable: 15000,
            totalAllocated: 12050,
            pendingApprovals: 6,
            pendingAllocations: 11,
            supportRequests: 5,
            totalCapacityKwh: 15000,
            executedCapacityKwh: 9300,
            underExecutionKwh: 2750,
        },
        districts: {
            ajmer_district: {
                label: 'Ajmer District',
                totalCustomers: 21,
                activeAllocations: 15,
                totalEnergy: 7600,
                totalAvailable: 9500,
                totalAllocated: 7600,
                pendingApprovals: 4,
                pendingAllocations: 6,
                supportRequests: 3,
                totalCapacityKwh: 9500,
                executedCapacityKwh: 5900,
                underExecutionKwh: 1750,
            },
            kishangarh: {
                label: 'Kishangarh',
                totalCustomers: 13,
                activeAllocations: 8,
                totalEnergy: 4450,
                totalAvailable: 5500,
                totalAllocated: 4450,
                pendingApprovals: 2,
                pendingAllocations: 5,
                supportRequests: 2,
                totalCapacityKwh: 5500,
                executedCapacityKwh: 3400,
                underExecutionKwh: 1000,
            },
        },
        parks: {
            park_e: {
                label: 'Park E',
                totalCustomers: 19,
                activeAllocations: 13,
                totalEnergy: 6900,
                totalAvailable: 8500,
                totalAllocated: 6900,
                pendingApprovals: 3,
                pendingAllocations: 6,
                supportRequests: 3,
                totalCapacityKwh: 8500,
                executedCapacityKwh: 5400,
                underExecutionKwh: 1500,
            },
            park_f: {
                label: 'Park F',
                totalCustomers: 15,
                activeAllocations: 10,
                totalEnergy: 5150,
                totalAvailable: 6500,
                totalAllocated: 5150,
                pendingApprovals: 3,
                pendingAllocations: 5,
                supportRequests: 2,
                totalCapacityKwh: 6500,
                executedCapacityKwh: 3900,
                underExecutionKwh: 1250,
            },
        },
    },
};

/**
 * Hierarchical structure for building dropdowns.
 * { discomKey: { label, districts: [{key, label}], parks: [{key, label}] } }
 */
export const DISCOM_STRUCTURE = {
    jaipur: {
        label: 'Jaipur',
        districts: [
            { key: 'jaipur_district', label: 'Jaipur District' },
            { key: 'sanganer', label: 'Sanganer' },
            { key: 'chomu', label: 'Chomu' },
        ],
        parks: [
            { key: 'park_a', label: 'Park A' },
            { key: 'park_b', label: 'Park B' },
        ],
    },
    jodhpur: {
        label: 'Jodhpur',
        districts: [
            { key: 'jodhpur_district', label: 'Jodhpur District' },
            { key: 'phalodi', label: 'Phalodi' },
        ],
        parks: [
            { key: 'park_c', label: 'Park C' },
            { key: 'park_d', label: 'Park D' },
        ],
    },
    ajmer: {
        label: 'Ajmer',
        districts: [
            { key: 'ajmer_district', label: 'Ajmer District' },
            { key: 'kishangarh', label: 'Kishangarh' },
        ],
        parks: [
            { key: 'park_e', label: 'Park E' },
            { key: 'park_f', label: 'Park F' },
        ],
    },
};

/**
 * Returns cumulative stats across all DISCOMs.
 * Used as the default "All DISCOMs" view.
 */
export const getCumulativeStats = () => {
    const discoms = Object.values(DISCOM_SEED_DATA);
    return discoms.reduce(
        (acc, d) => ({
            totalCustomers: acc.totalCustomers + d.totals.totalCustomers,
            activeAllocations: acc.activeAllocations + d.totals.activeAllocations,
            totalEnergy: acc.totalEnergy + d.totals.totalEnergy,
            totalAvailable: acc.totalAvailable + d.totals.totalAvailable,
            totalAllocated: acc.totalAllocated + d.totals.totalAllocated,
            pendingApprovals: acc.pendingApprovals + d.totals.pendingApprovals,
            pendingAllocations: acc.pendingAllocations + d.totals.pendingAllocations,
            supportRequests: acc.supportRequests + d.totals.supportRequests,
            totalCapacityKwh: acc.totalCapacityKwh + d.totals.totalCapacityKwh,
            executedCapacityKwh: acc.executedCapacityKwh + d.totals.executedCapacityKwh,
            underExecutionKwh: acc.underExecutionKwh + d.totals.underExecutionKwh,
        }),
        {
            totalCustomers: 0,
            activeAllocations: 0,
            totalEnergy: 0,
            totalAvailable: 0,
            totalAllocated: 0,
            pendingApprovals: 0,
            pendingAllocations: 0,
            supportRequests: 0,
            totalCapacityKwh: 0,
            executedCapacityKwh: 0,
            underExecutionKwh: 0,
        }
    );
};

/**
 * Returns filtered stats based on current filter selections.
 *
 * @param {string} discom        - e.g. 'jaipur'
 * @param {string} locationType  - 'district' | 'park'
 * @param {string} subsection    - e.g. 'sanganer' | 'park_a' | '' for DISCOM totals
 * @returns {object} stats object
 *
 * Ready for API integration: replace the body with an async fetch call.
 */
export const getFilteredStats = (discom, locationType, subsection) => {
    if (!discom || !DISCOM_SEED_DATA[discom]) return null;

    const discomData = DISCOM_SEED_DATA[discom];

    if (!subsection) {
        // DISCOM-level totals
        return { ...discomData.totals };
    }

    if (locationType === 'district') {
        return discomData.districts[subsection]
            ? { ...discomData.districts[subsection] }
            : null;
    }

    if (locationType === 'park') {
        return discomData.parks[subsection]
            ? { ...discomData.parks[subsection] }
            : null;
    }

    return null;
};
