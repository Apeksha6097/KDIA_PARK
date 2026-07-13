<div class="max-w-6xl mx-auto mt-12">
    <div class="text-center mb-16">
        <h2 class="text-5xl font-display font-bold mb-6 text-slate-900">
            Estimate Your <span class="text-brand-green">Savings & Investment</span>
        </h2>
        <p class="text-xl text-slate-600 font-normal">
            Indicative energy saving and financing estimator
        </p>
    </div>

    <div class="grid lg:grid-cols-12 gap-12">
        <!-- Calculator Inputs -->
        <div class="lg:col-span-8">
            <div class="bg-slate-50 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                <h3 class="text-2xl font-display font-bold mb-8 text-slate-900 border-b pb-4">Indicative Inputs</h3>

                <div class="mb-10 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <label class="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                        Estimate Based On
                    </label>
                    <select id="calculation-mode"
                        class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-medium">
                        <option value="bill" selected>Monthly Bill (₹)</option>
                        <option value="unit">Monthly Unit Consumption (kWh)</option>
                    </select>
                </div>

                <div id="kwh-allocation-wrapper">
                    <div class="grid md:grid-cols-2 gap-8 mb-10">
                        <!-- Connection Type -->
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                Connection Type
                            </label>
                            <select id="connection-type"
                                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-medium">
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>

                        <!-- kWh Allocation -->
                        <div id="kwh-allocation-container">
                            <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                kWh Allocation (Monthly)
                            </label>
                            <div class="relative">
                                <input type="number" id="kwh-allocation" value="1000" min="100" step="100"
                                    class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-bold text-lg">
                                <span
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kWh</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="bill-input-container">
                    <div class="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                Avg. Monthly Bill (Guidance)
                            </label>
                            <select id="bill-dropdown"
                                class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-medium">
                                <option value="">Select Range</option>
                                <option value="1000-2000">₹1,000 - ₹2,000</option>
                                <option value="2000-4000">₹2,000 - ₹4,000</option>
                                <option value="4000-6000">₹4,000 - ₹6,000</option>
                                <option value="6000-10000">₹6,000 - ₹10,000</option>
                                <option value="10000+">₹10,000+</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                Approx Monthly Bill
                            </label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input type="number" id="monthly-bill" value="9000"
                                    class="w-full bg-white border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-brand-green focus:outline-none transition-all font-bold text-lg">
                            </div>
                        </div>
                    </div>
                </div>

                <div id="unit-input-container" class="hidden">
                    <div class="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                Average Monthly Unit Consumption (kWh)
                            </label>
                            <div class="relative">
                                <input type="number" id="unit-consumption" placeholder="e.g., 800"
                                    class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-bold text-lg">
                                <span
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kWh</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 class="text-2xl font-display font-bold mb-8 text-slate-900 border-b pb-4">Financing
                    Details <span class="text-sm font-normal text-slate-500 ml-2">(Indicative)</span></h3>

                <div class="grid md:grid-cols-1 gap-10">
                    <!-- Approx Investment -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Approximate
                            Investment</label>
                        <div class="text-3xl font-display font-bold text-slate-900" id="approx-investment">₹0</div>
                        <p class="text-xs text-slate-400 mt-2 italic">*Based on kWh allocation required for your
                            consumption</p>
                    </div>

                    <div class="grid md:grid-cols-2 gap-10">
                        <!-- Loan Tenure -->
                        <div class="financing-slider-group">
                            <div class="flex justify-between items-center mb-4">
                                <label class="text-sm font-bold text-slate-700 uppercase tracking-wider">Loan
                                    Tenure</label>
                                <span class="text-xl font-bold text-brand-green" id="tenure-display">5 Years</span>
                            </div>
                            <input type="range" id="tenure-slider" min="3" max="10" step="1" value="5"
                                class="calculator-slider">
                            <div
                                class="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                                <span>3 Years</span>
                                <span>10 Years</span>
                            </div>
                        </div>

                        <!-- Interest Rate -->
                        <div class="financing-slider-group">
                            <div class="flex justify-between items-center mb-4">
                                <label class="text-sm font-bold text-slate-700 uppercase tracking-wider">Rate of
                                    Interest (p.a)</label>
                                <span class="text-xl font-bold text-brand-green" id="roi-display">9%</span>
                            </div>
                            <input type="range" id="roi-slider" min="7" max="14" step="0.5" value="9"
                                class="calculator-slider">
                            <div
                                class="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                                <span>7%</span>
                                <span>14%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Financial Breakdown -->
                <div class="mt-12 bg-slate-900 rounded-2xl p-8 text-white">
                    <h4
                        class="text-lg font-bold mb-6 text-brand-green uppercase tracking-widest border-b border-white/10 pb-4">
                        Financial Breakdown</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div class="breakdown-item">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Monthly EMI
                            </p>
                            <p class="text-2xl font-bold" id="monthly-emi">₹0</p>
                        </div>
                        <div class="breakdown-item">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Principal</p>
                            <p class="text-xl font-bold" id="principal-amount">₹0</p>
                        </div>
                        <div class="breakdown-item">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total
                                Interest</p>
                            <p class="text-xl font-bold text-amber-400" id="total-interest">₹0</p>
                        </div>
                        <div class="breakdown-item">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Payable
                            </p>
                            <p class="text-xl font-bold" id="total-payable">₹0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calculator Outputs / Summary -->
        <div class="lg:col-span-4" style="transition-delay: 200ms">
            <div class="sticky top-32 space-y-6">
                <!-- Annual Savings -->
                <div
                    class="bg-gradient-to-br from-brand-green/20 to-brand-green/5 rounded-3xl p-8 border-2 border-brand-green/20 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-brand-green/20 rounded-lg flex items-center justify-center mr-4">
                            <i data-lucide="trending-up" class="text-brand-green w-6 h-6"></i>
                        </div>
                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-widest">Estimated Annual Savings
                        </h4>
                    </div>
                    <div class="flex items-baseline">
                        <span class="text-5xl font-bold text-brand-green" id="savings-value">₹0</span>
                        <span class="text-lg text-slate-500 ml-2 font-medium">/year</span>
                    </div>
                </div>

                <!-- CO2 Reduction -->
                <div
                    class="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg group hover:border-amber-200 transition-all">
                    <div class="flex items-center mb-4">
                        <div
                            class="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-amber-100 transition-colors">
                            <i data-lucide="leaf" class="text-amber-600 w-6 h-6"></i>
                        </div>
                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-widest">CO₂ reduction</h4>
                    </div>
                    <div class="flex items-baseline">
                        <span class="text-4xl font-bold text-slate-900" id="co2-value">0</span>
                        <span class="text-lg text-slate-500 ml-2 font-medium">kg/year</span>
                    </div>
                    <div class="mt-6 pt-6 border-t border-slate-50 flex items-center gap-4">
                        <div class="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                            <i data-lucide="trees" class="text-emerald-600 w-6 h-6"></i>
                        </div>
                        <p class="text-sm text-slate-600">
                            Equivalent to planting <strong class="text-slate-900 text-lg" id="trees-value">0</strong>
                            trees annually
                        </p>
                    </div>
                </div>

                <!-- ROI Timeline -->
                <div
                    class="bg-slate-50 rounded-3xl p-8 border-2 border-transparent hover:border-slate-200 transition-all shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-4">
                            <i data-lucide="clock" class="text-slate-600 w-6 h-6"></i>
                        </div>
                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-widest">Typical ROI Period</h4>
                    </div>
                    <div class="flex items-baseline">
                        <span class="text-4xl font-bold text-slate-900" id="roi-value">0</span>
                        <span class="text-lg text-slate-500 ml-2 font-medium">years</span>
                    </div>
                </div>

                <p class="text-[10px] text-slate-400 p-4 italic text-center leading-relaxed">
                    *All calculations are indicative estimates and do not constitute a financial guarantee or official
                    offer. Actual values depend on site conditions and utility regulations.
                </p>
            </div>
        </div>
    </div>
</div>