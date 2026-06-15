// Scheme-Based Calculator Logic
// Supports Self Finance and RESCO (Renewable Energy Service Company) modes

function initSchemeCalculator() {
    // --- Input Elements ---
    const kwhAllocation = document.getElementById('scheme_kwh-allocation');
    const monthlyBill = document.getElementById('scheme_monthly-bill');
    const billDropdown = document.getElementById('scheme_bill-dropdown');
    const calculationMode = document.getElementById('scheme_calculation-mode');
    const billContainer = document.getElementById('scheme_bill-input-container');
    const unitContainer = document.getElementById('scheme_unit-input-container');
    const unitConsumption = document.getElementById('scheme_unit-consumption');
    const roiSlider = document.getElementById('scheme_roi-slider');
    const tenureSlider = document.getElementById('scheme_tenure-slider');
    const selectedModel = document.getElementById('scheme_selectedModel');

    // --- Financing Mode Elements ---
    const financingMode = document.getElementById('scheme_financing-mode');
    const rescoTariffWrapper = document.getElementById('scheme_resco-tariff-wrapper');
    const rescoTariffInput = document.getElementById('scheme_resco-tariff');
    const selfFinanceSection = document.getElementById('scheme_self-finance-section');
    const rescoResultsSection = document.getElementById('scheme_resco-results-section');
    const roiCardWrapper = document.getElementById('scheme_roi-card-wrapper');
    const rescoSavingsCard = document.getElementById('scheme_resco-savings-card');

    // --- Display Elements ---
    const roiDisplay = document.getElementById('scheme_roi-display');
    const tenureDisplay = document.getElementById('scheme_tenure-display');
    const approxInvestmentDisplay = document.getElementById('scheme_approx-investment');
    const monthlyEmiDisplay = document.getElementById('scheme_monthly-emi');
    const principalDisplay = document.getElementById('scheme_principal-amount');
    const interestDisplay = document.getElementById('scheme_total-interest');
    const totalPayableDisplay = document.getElementById('scheme_total-payable');
    const savingsValue = document.getElementById('scheme_savings-value');
    const co2Value = document.getElementById('scheme_co2-value');
    const treesValue = document.getElementById('scheme_trees-value');
    const roiValue = document.getElementById('scheme_roi-value');

    // --- RESCO Display Elements ---
    const rescoDiscomTariffDisplay = document.getElementById('scheme_resco-discom-tariff');
    const rescoAgreedTariffDisplay = document.getElementById('scheme_resco-agreed-tariff');
    const rescoAnnualSavingsDisplay = document.getElementById('scheme_resco-annual-savings');
    const rescoMonthlySavingsDisplay = document.getElementById('scheme_resco-monthly-savings');

    // --- Constants ---
    const CAPEX_PER_KW = 55000;
    const DISCOM_TARIFF = 7; // ₹/kWh average

    if (!kwhAllocation) {
        console.warn('Scheme calculator elements not found');
        return;
    }

    console.log('Initializing Scheme Calculator with Financing Mode support...');

    // -------------------------------------------------------
    // Toggle Financing Mode UI
    // -------------------------------------------------------
    function toggleFinancingMode() {
        const mode = financingMode ? financingMode.value : 'self_finance';

        if (mode === 'resco') {
            // Show RESCO-specific UI
            if (rescoTariffWrapper) rescoTariffWrapper.classList.remove('hidden');
            if (selfFinanceSection) selfFinanceSection.classList.add('hidden');
            if (rescoResultsSection) rescoResultsSection.classList.remove('hidden');
            if (roiCardWrapper) roiCardWrapper.classList.add('hidden');
            if (rescoSavingsCard) rescoSavingsCard.classList.remove('hidden');
        } else {
            // Show Self Finance UI (default)
            if (rescoTariffWrapper) rescoTariffWrapper.classList.add('hidden');
            if (selfFinanceSection) selfFinanceSection.classList.remove('hidden');
            if (rescoResultsSection) rescoResultsSection.classList.add('hidden');
            if (roiCardWrapper) roiCardWrapper.classList.remove('hidden');
            if (rescoSavingsCard) rescoSavingsCard.classList.add('hidden');
        }

        // Recalculate after mode switch
        updateCalculations();
    }

    // -------------------------------------------------------
    // Reset all display elements
    // -------------------------------------------------------
    function resetUI() {
        [approxInvestmentDisplay, monthlyEmiDisplay, principalDisplay,
            interestDisplay, totalPayableDisplay, savingsValue,
            co2Value, treesValue].forEach(el => {
                if (el) el.textContent = '0';
            });
        if (roiValue) roiValue.textContent = '0';
        if (rescoAnnualSavingsDisplay) rescoAnnualSavingsDisplay.textContent = '₹0';
        if (rescoMonthlySavingsDisplay) rescoMonthlySavingsDisplay.textContent = '₹0';
    }

    // -------------------------------------------------------
    // Derive monthly unit consumption from current inputs
    // -------------------------------------------------------
    function getMonthlyUnits() {
        const mode = calculationMode.value;
        if (mode === 'bill') {
            billContainer.classList.remove('hidden');
            unitContainer.classList.add('hidden');
            return (parseFloat(monthlyBill.value) || 0) / DISCOM_TARIFF;
        } else {
            billContainer.classList.add('hidden');
            unitContainer.classList.remove('hidden');
            return parseFloat(unitConsumption.value) || 0;
        }
    }

    // -------------------------------------------------------
    // Main Calculation Entry Point
    // -------------------------------------------------------
    function updateCalculations() {
        const allocationKwhVal = parseFloat(kwhAllocation.value) || 0;
        const consumptionKwhVal = getMonthlyUnits();

        if (allocationKwhVal <= 0 && consumptionKwhVal <= 0) {
            resetUI();
            return;
        }

        // Environmental impact (shared by both modes)
        const co2Reduction = Math.round(consumptionKwhVal * 12 * 0.8);
        const trees = Math.round(co2Reduction / 60);
        if (co2Value) co2Value.textContent = co2Reduction.toLocaleString('en-IN');
        if (treesValue) treesValue.textContent = trees;

        const fMode = financingMode ? financingMode.value : 'self_finance';

        if (fMode === 'resco') {
            calculateRESCO(consumptionKwhVal);
        } else {
            calculateSelfFinance(allocationKwhVal, consumptionKwhVal);
        }
    }

    // -------------------------------------------------------
    // Self Finance Calculations (original logic preserved)
    // -------------------------------------------------------
    function calculateSelfFinance(allocationKwhVal, consumptionKwhVal) {
        const roi = parseFloat(roiSlider.value);
        const tenureYears = parseInt(tenureSlider.value);
        const investment = (allocationKwhVal / 150) * CAPEX_PER_KW;
        const principal = Math.round(investment / 1000) * 1000;
        const annualSavings = consumptionKwhVal * 12 * DISCOM_TARIFF * 0.85;

        // EMI calculation
        const r = (roi / 100) / 12;
        const n = tenureYears * 12;
        let emi = 0;
        if (principal > 0 && r > 0) {
            emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayable = emi * n;
        const totalInterest = totalPayable - principal;

        // Update Self Finance displays
        if (approxInvestmentDisplay) approxInvestmentDisplay.textContent = '₹' + Math.round(principal).toLocaleString('en-IN');
        if (monthlyEmiDisplay) monthlyEmiDisplay.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
        if (principalDisplay) principalDisplay.textContent = '₹' + Math.round(principal).toLocaleString('en-IN');
        if (interestDisplay) interestDisplay.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
        if (totalPayableDisplay) totalPayableDisplay.textContent = '₹' + Math.round(totalPayable).toLocaleString('en-IN');
        if (savingsValue) savingsValue.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');

        // ROI period
        if (annualSavings > 0 && principal > 0) {
            let payback = Math.round(principal / annualSavings);
            if (payback < 1) payback = 1;
            if (roiValue) roiValue.textContent = `${payback}-${payback + 2} Years`;
        }
    }

    // -------------------------------------------------------
    // RESCO Calculations
    // -------------------------------------------------------
    function calculateRESCO(consumptionKwhVal) {
        const rescoTariff = parseFloat(rescoTariffInput.value) || 4.5;
        const tariffDiff = DISCOM_TARIFF - rescoTariff;
        const monthlySavings = tariffDiff * consumptionKwhVal;
        const annualSavings = monthlySavings * 12;

        // Update RESCO breakdown displays
        if (rescoDiscomTariffDisplay) rescoDiscomTariffDisplay.textContent = '₹' + DISCOM_TARIFF.toFixed(2) + '/kWh';
        if (rescoAgreedTariffDisplay) rescoAgreedTariffDisplay.textContent = '₹' + rescoTariff.toFixed(2) + '/kWh';
        if (rescoAnnualSavingsDisplay) rescoAnnualSavingsDisplay.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
        if (rescoMonthlySavingsDisplay) rescoMonthlySavingsDisplay.textContent = '₹' + Math.round(monthlySavings).toLocaleString('en-IN');

        // Update the main savings card in the sidebar
        if (savingsValue) savingsValue.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
    }

    // -------------------------------------------------------
    // Event Listeners
    // -------------------------------------------------------

    // Financing mode toggle
    financingMode?.addEventListener('change', toggleFinancingMode);

    // RESCO tariff input
    rescoTariffInput?.addEventListener('input', updateCalculations);
    rescoTariffInput?.addEventListener('change', updateCalculations);

    // Core inputs (reuse existing pattern)
    [calculationMode, billDropdown, kwhAllocation, monthlyBill,
        unitConsumption, roiSlider, tenureSlider, selectedModel].forEach(el => {
            el?.addEventListener('change', updateCalculations);
            el?.addEventListener('input', updateCalculations);
        });

    // Bill dropdown auto-fill
    billDropdown?.addEventListener('change', () => {
        const vals = {
            '1000-2000': 1500, '2000-4000': 3000, '4000-6000': 5000,
            '6000-10000': 8000, '10000+': 15000
        };
        if (billDropdown.value) monthlyBill.value = vals[billDropdown.value];
        updateCalculations();
    });

    // Slider display updates
    if (roiSlider) {
        roiSlider.addEventListener('input', () => {
            if (roiDisplay) roiDisplay.textContent = roiSlider.value + '%';
        });
    }
    if (tenureSlider) {
        tenureSlider.addEventListener('input', () => {
            if (tenureDisplay) tenureDisplay.textContent = tenureSlider.value + ' Years';
        });
    }

    // -------------------------------------------------------
    // Initial State
    // -------------------------------------------------------
    toggleFinancingMode();   // Set correct UI visibility
    updateCalculations();    // Run initial calculation
}
