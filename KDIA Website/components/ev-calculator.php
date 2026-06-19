<div class="max-w-6xl mx-auto mt-4">
    <!-- Heading -->
    <div class="text-center mb-8">
        <h2 class="text-5xl font-display font-bold mb-4 text-slate-900">
            EV <span class="text-brand-green">Station</span>
        </h2>
        <p class="text-xl text-slate-600 font-normal">
            Estimate your daily, monthly and yearly earnings from EV charging stations
        </p>
    </div>

    <!-- Redesigned Dashboard Grid -->
    <div class="grid lg:grid-cols-12 gap-8 items-stretch">
        <!-- Left Section (Inputs, Station & Land Cards, Profit Cards) -->
        <div class="lg:col-span-7 flex flex-col justify-between space-y-6 bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            
            <!-- Inputs Row -->
            <div class="space-y-4">
                <h3 class="text-xl font-display font-bold text-slate-900 border-b border-slate-200 pb-3">Calculator Inputs</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Charger Capacity -->
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            Charger Capacity
                        </label>
                        <select id="ev-charger-capacity"
                            class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all font-semibold text-slate-700 cursor-pointer">
                            <option value="60" selected>60 kW</option>
                            <option value="120">120 kW</option>
                            <option value="160">160 kW</option>
                            <option value="200">200 kW</option>
                        </select>
                    </div>

                    <!-- Units Sold Per Day -->
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            Units Sold Per Day
                        </label>
                        <div class="relative">
                            <input type="number" id="ev-units-per-day" value="32.7" min="0.1" step="0.1"
                                class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-none transition-all font-bold text-lg"
                                placeholder="e.g. 32.7">
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">Units</span>
                        </div>
                        <p id="ev-units-error" class="text-xs text-red-500 mt-1 hidden">Enter a positive number</p>
                    </div>
                </div>
            </div>

            <!-- Station & Land Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Card 1: Number of EV Stations -->
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm transition-all hover:border-brand-green/30 flex items-center space-x-4">
                    <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i data-lucide="zap" class="w-5 h-5 text-blue-500"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Number of EV Stations</p>
                        <div class="flex items-baseline space-x-1">
                            <span class="text-xl font-bold text-slate-900 ev-result-animate" id="ev-num-stations-display">1</span>
                            <span class="text-xs text-slate-400 font-medium">Nos</span>
                        </div>
                        <p class="text-[9px] text-slate-500 truncate mt-0.5">Auto-allocated based on charger capacity</p>
                    </div>
                </div>

                <!-- Card 2: Area of Land -->
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm transition-all hover:border-brand-green/30 flex items-center space-x-4">
                    <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i data-lucide="map" class="w-5 h-5 text-amber-500"></i>
                    </div>
                    <div class="flex-grow min-w-0">
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Area of Land</p>
                        <div class="flex items-baseline space-x-1">
                            <span class="text-xl font-bold text-slate-900 ev-result-animate" id="ev-area-land-display">500</span>
                            <span class="text-xs text-slate-400 font-medium">Sq Ft</span>
                        </div>
                        <p class="text-[9px] text-slate-500 truncate mt-0.5">Estimated space required for stations</p>
                    </div>
                </div>
            </div>

            <!-- Profit Cards -->
            <div class="grid grid-cols-3 gap-3">
                <!-- Daily Profit -->
                <div class="bg-gradient-to-br from-brand-green/15 to-brand-green/5 rounded-2xl p-4 border border-brand-green/20 shadow-sm hover:shadow-md transition-all">
                    <h4 class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Daily</h4>
                    <span class="text-lg sm:text-xl font-bold text-brand-green ev-result-animate block" id="ev-daily-profit">₹0</span>
                    <p class="text-[8px] text-slate-400 mt-1 font-medium truncate">Stations × Units × ₹10</p>
                </div>

                <!-- Monthly Profit -->
                <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-brand-green/30 hover:shadow-md transition-all">
                    <h4 class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Monthly</h4>
                    <span class="text-lg sm:text-xl font-bold text-slate-900 ev-result-animate block" id="ev-monthly-profit">₹0</span>
                    <p class="text-[8px] text-slate-400 mt-1 font-medium truncate">Daily × 30 days</p>
                </div>

                <!-- Yearly Profit -->
                <div class="bg-slate-900 rounded-2xl p-4 border border-transparent shadow-sm hover:shadow-lg transition-all text-white">
                    <h4 class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Yearly</h4>
                    <span class="text-lg sm:text-xl font-bold text-brand-green ev-result-animate block" id="ev-yearly-profit">₹0</span>
                    <p class="text-[8px] text-slate-500 mt-1 font-medium truncate">Daily × 365 days</p>
                </div>
            </div>
        </div>

        <!-- Right Side KPI Dashboard -->
        <div class="lg:col-span-5 flex flex-col justify-start">
            <!-- 2x2 KPI Cards Grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
                <!-- Total Project Cost -->
                <div class="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col space-y-1 group border border-emerald-800/30">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-bold tracking-wider text-emerald-300 uppercase">Total Project Cost</span>
                        <i data-lucide="indian-rupee" class="w-3.5 h-3.5 text-emerald-300"></i>
                    </div>
                    <div>
                        <span class="text-lg sm:text-xl font-bold block ev-result-animate" id="ev-project-cost-display">₹0</span>
                        <span class="text-[9px] text-emerald-300/80 block ev-result-animate mt-0.5" id="ev-charger-capacity-subtitle">60 kW Charger</span>
                    </div>
                </div>

                <!-- Loan Availed -->
                <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 text-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col space-y-1 group border border-slate-800/30">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Loan Availed</span>
                        <i data-lucide="landmark" class="w-3.5 h-3.5 text-slate-400"></i>
                    </div>
                    <div>
                        <span class="text-lg sm:text-xl font-bold block ev-result-animate" id="ev-loan-availed-display">₹0</span>
                        <span class="text-[9px] text-slate-400/80 block mt-0.5">80% of total</span>
                    </div>
                </div>

                <!-- Equity Invested -->
                <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 text-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col space-y-1 group border border-slate-800/30">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Equity Invested</span>
                        <i data-lucide="wallet" class="w-3.5 h-3.5 text-slate-400"></i>
                    </div>
                    <div>
                        <span class="text-lg sm:text-xl font-bold block ev-result-animate" id="ev-equity-invested-display">₹0</span>
                        <span class="text-[9px] text-slate-400/80 block mt-0.5">20% of total</span>
                    </div>
                </div>

                <!-- Year 1 ROI -->
                <div class="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col space-y-1 group border border-emerald-800/30">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-bold tracking-wider text-emerald-400 uppercase">Year 1 ROI</span>
                        <i data-lucide="trending-up" class="w-3.5 h-3.5 text-emerald-400"></i>
                    </div>
                    <div>
                        <span class="text-lg sm:text-xl font-bold block text-brand-green ev-result-animate" id="ev-roi-display">0%</span>
                        <span class="text-[9px] text-emerald-400/80 block mt-0.5">Return on Investment</span>
                    </div>
                </div>
            </div>

            <!-- Interest Information Block -->
            <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-5">
                <div class="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                    <div class="flex flex-col items-center justify-center px-1">
                        <span class="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Interest
                        </span>
                        <span class="text-sm font-bold text-slate-700">9%</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-1">
                        <span class="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Loan Term
                        </span>
                        <span class="text-sm font-bold text-slate-700">8 Years</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-1">
                        <span class="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Loan Percentage
                        </span>
                        <span class="text-sm font-bold text-slate-700">80%</span>
                    </div>
                </div>
            </div>

            <p class="text-[10px] text-slate-400 italic text-center leading-relaxed mt-3">
                *All values are indicative estimates. Actual profits depend on operational factors,
                electricity costs, and local market conditions.
            </p>
        </div>
    </div>
</div>

<style>
    .ev-result-animate {
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .ev-result-animate.updating {
        opacity: 0.5;
        transform: scale(0.97);
    }
</style>
