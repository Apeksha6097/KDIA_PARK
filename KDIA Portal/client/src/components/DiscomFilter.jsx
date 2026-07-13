import React, { useState } from 'react';
import { DISCOM_STRUCTURE } from '../data/discomSeedData';

/**
 * DiscomFilter — cascading filter bar for Admin Dashboard.
 *
 * Props:
 *   onFilterChange({ discom, locationType, subsection })
 *
 * Emits a filter update whenever any dropdown or toggle changes.
 * Fully self-contained; no internal state is stored in the parent.
 */
const DiscomFilter = ({ onFilterChange }) => {
    const [selectedDiscom, setSelectedDiscom] = useState('');
    const [locationType, setLocationType] = useState('district');
    const [selectedSubsection, setSelectedSubsection] = useState('');

    const dropdownBase = {
        padding: '8px 14px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        color: '#2d3748',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        minWidth: '160px',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23718096' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '32px',
    };

    const dropdownDisabled = {
        ...dropdownBase,
        background: '#f7fafc',
        color: '#a0aec0',
        cursor: 'not-allowed',
        borderColor: '#edf2f7',
        boxShadow: 'none',
    };

    const toggleBtnBase = {
        padding: '6px 14px',
        fontSize: '0.78rem',
        fontWeight: '700',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
    };

    const handleDiscomChange = (e) => {
        const val = e.target.value;
        setSelectedDiscom(val);
        setSelectedSubsection('');
        setLocationType('district');
        onFilterChange({ discom: val, locationType: 'district', subsection: '' });
    };

    const handleLocationTypeChange = (type) => {
        setLocationType(type);
        setSelectedSubsection('');
        onFilterChange({ discom: selectedDiscom, locationType: type, subsection: '' });
    };

    const handleSubsectionChange = (e) => {
        const val = e.target.value;
        setSelectedSubsection(val);
        onFilterChange({ discom: selectedDiscom, locationType, subsection: val });
    };

    const currentDiscomData = selectedDiscom ? DISCOM_STRUCTURE[selectedDiscom] : null;
    const subsectionOptions =
        currentDiscomData
            ? locationType === 'district'
                ? currentDiscomData.districts
                : currentDiscomData.parks
            : [];

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 24px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
            {/* Label */}
            <div style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                color: '#a0aec0',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '14px',
            }}>
                View statistics by DISCOM and location
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>

                {/* ── Dropdown 1: DISCOM ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        DISCOM
                    </label>
                    <select
                        value={selectedDiscom}
                        onChange={handleDiscomChange}
                        style={dropdownBase}
                    >
                        <option value="">All DISCOMs</option>
                        {Object.entries(DISCOM_STRUCTURE).map(([key, data]) => (
                            <option key={key} value={key}>{data.label}</option>
                        ))}
                    </select>
                </div>

                {/* Divider */}
                {selectedDiscom && (
                    <div style={{ height: '36px', width: '1px', background: '#e2e8f0', alignSelf: 'flex-end', marginBottom: '2px' }} />
                )}

                {/* ── Location Type Toggle ── */}
                {selectedDiscom && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Location Type
                        </label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['district', 'park'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleLocationTypeChange(type)}
                                    style={{
                                        ...toggleBtnBase,
                                        background: locationType === type ? '#2d3748' : '#f7fafc',
                                        color: locationType === type ? '#fff' : '#4a5568',
                                        borderColor: locationType === type ? '#2d3748' : '#e2e8f0',
                                    }}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Dropdown 2: Subsection ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: selectedDiscom ? '#718096' : '#cbd5e0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {selectedDiscom
                            ? locationType === 'district' ? 'District' : 'Park'
                            : 'Subsection'}
                    </label>
                    <select
                        value={selectedSubsection}
                        onChange={handleSubsectionChange}
                        disabled={!selectedDiscom}
                        style={selectedDiscom ? dropdownBase : dropdownDisabled}
                    >
                        <option value="">
                            {selectedDiscom
                                ? `All ${locationType === 'district' ? 'Districts' : 'Parks'}`
                                : '— Select DISCOM first —'}
                        </option>
                        {subsectionOptions.map((opt) => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* ── Active Filter Pill ── */}
                {selectedDiscom && (
                    <div style={{ alignSelf: 'flex-end', marginBottom: '2px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '5px 12px',
                            background: '#ebf8ff',
                            border: '1px solid #bee3f8',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#2b6cb0',
                        }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3182ce', display: 'inline-block' }} />
                            {currentDiscomData?.label}
                            {selectedSubsection && ` › ${subsectionOptions.find(o => o.key === selectedSubsection)?.label}`}
                            <button
                                onClick={() => {
                                    setSelectedDiscom('');
                                    setSelectedSubsection('');
                                    setLocationType('district');
                                    onFilterChange({ discom: '', locationType: 'district', subsection: '' });
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#4299e1',
                                    fontSize: '0.9rem',
                                    lineHeight: 1,
                                    padding: '0 0 0 2px',
                                    fontWeight: '800',
                                }}
                                title="Clear filter"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscomFilter;
