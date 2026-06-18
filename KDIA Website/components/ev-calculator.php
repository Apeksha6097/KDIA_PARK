<div class="max-w-6xl mx-auto mt-4">
    <!-- Heading -->
    <div class="text-center mb-12">
        <h2 class="text-5xl font-display font-bold mb-4 text-slate-900">
            EV <span class="text-brand-green">Station</span>
        </h2>
        <p class="text-xl text-slate-600 font-normal">
            Estimate your daily, monthly and yearly earnings from EV charging stations
        </p>
    </div>

    <div class="grid lg:grid-cols-12 gap-12">

        <!-- LEFT SIDE: Station Details Card (inputs + profit cards inside) -->
        <div class="lg:col-span-7">
            <div class="bg-slate-50 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                <h3 class="text-2xl font-display font-bold mb-8 text-slate-900 border-b border-slate-200 pb-4">Station Details</h3>

                <!-- Charger Capacity -->
                <div class="mb-6">
                    <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Charger Capacity
                    </label>
                    <select id="ev-charger-capacity"
                        class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-medium text-slate-700 cursor-pointer">
                        <option value="60" selected>60 KW</option>
                        <option value="120">120 KW</option>
                        <option value="160">160 KW</option>
                        <option value="200">200 KW</option>
                    </select>
                </div>

                <!-- Units Sold Per Day -->
                <div class="mb-8">
                    <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                        Units Sold Per Day
                    </label>
                    <div class="relative">
                        <input type="number" id="ev-units-per-day" value="2" min="0.1" step="0.1"
                            class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-brand-green focus:outline-none transition-all font-bold text-lg"
                            placeholder="e.g. 2">
                        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">Units</span>
                    </div>
                    <p id="ev-units-error" class="text-xs text-red-500 mt-1 hidden">Enter a positive number</p>
                </div>

                <!-- Divider -->
                <div class="border-t border-slate-200 mb-8"></div>

                <!-- Profit Cards Row -->
                <div class="grid grid-cols-3 gap-4">

                    <!-- Daily Profit -->
                    <div class="bg-gradient-to-br from-brand-green/20 to-brand-green/5 rounded-2xl p-5 border-2 border-brand-green/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                        <h4 class="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-3">Daily Profit</h4>
                        <span class="text-2xl font-bold text-brand-green ev-result-animate block" id="ev-daily-profit">₹20</span>
                        <p class="text-[9px] text-slate-500 mt-2 font-medium leading-relaxed">Stations × Units × ₹10</p>
                    </div>

                    <!-- Monthly Profit -->
                    <div class="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm hover:border-brand-green/30 hover:shadow-md transition-all hover:-translate-y-0.5">
                        <h4 class="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-3">Monthly Profit</h4>
                        <span class="text-2xl font-bold text-slate-900 ev-result-animate block" id="ev-monthly-profit">₹600</span>
                        <p class="text-[9px] text-slate-400 mt-2 font-medium">Daily × 30 days</p>
                    </div>

                    <!-- Yearly Profit -->
                    <div class="bg-slate-900 rounded-2xl p-5 border-2 border-transparent shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                        <h4 class="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Yearly Profit</h4>
                        <span class="text-2xl font-bold text-brand-green ev-result-animate block" id="ev-yearly-profit">₹7,300</span>
                        <p class="text-[9px] text-slate-500 mt-2 font-medium">Daily × 365 days</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE: Station Info Cards -->
        <div class="lg:col-span-5">
            <div class="sticky top-32 space-y-5">

                <!-- Number of EV Stations -->
                <div class="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg transition-all hover:border-brand-green/30 hover:shadow-xl">
                    <div class="flex items-center mb-6">
                        <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-widest">Number of EV Stations</h4>
                    </div>
                    <div class="flex items-baseline">
                        <span class="text-6xl font-bold text-slate-900 ev-result-animate" id="ev-num-stations-display">1</span>
                        <span class="text-lg text-slate-400 ml-3 font-medium">Nos</span>
                    </div>
                    <p class="text-sm text-slate-500 mt-4">Auto-allocated based on charger capacity</p>
                </div>

                <!-- Area of Land -->
                <div class="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg transition-all hover:border-brand-green/30 hover:shadow-xl">
                    <div class="flex items-center mb-6">
                        <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h4 class="text-sm font-bold text-slate-700 uppercase tracking-widest">Area of Land</h4>
                    </div>
                    <div class="flex items-baseline">
                        <span class="text-6xl font-bold text-slate-900 ev-result-animate" id="ev-area-land-display">500</span>
                        <span class="text-lg text-slate-400 ml-3 font-medium">Sq Ft</span>
                    </div>
                    <p class="text-sm text-slate-500 mt-4">Estimated space required for stations</p>
                </div>

                <p class="text-[10px] text-slate-400 p-3 italic text-center leading-relaxed">
                    *All values are indicative estimates. Actual profits depend on operational factors,
                    electricity costs, and local market conditions.
                </p>
            </div>
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
