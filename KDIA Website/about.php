<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About & Renewable Energy | Kdia Re Park</title>
    <!-- Preconnect & Fonts Preload -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Preload Logo -->
    <link rel="preload" as="image" href="assets/images/logo.webp">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { green: '#8DC63F', dark: '#008244' },
                        charcoal: '#0e1111'
                    },
                    fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Outfit', 'sans-serif'] }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="assets/css/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js" defer></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    
    <!-- Language Switcher -->
    <script src="assets/js/translate.php?v=1.0.1" defer></script>
    <style>
        .category-card.active {
            border-color: #008244 !important;
            background-color: rgba(141, 198, 63, 0.05) !important;
            box-shadow: 0 20px 40px rgba(141, 198, 63, 0.1) !important;
        }
        .category-card.active i {
            color: #008244 !important;
        }
        .category-card.active span {
            color: #008244 !important;
        }
    </style>
</head>

<body class="bg-white text-slate-900 selection:bg-brand-green/30">

    <nav class="fixed w-full z-50 py-8 transition-all duration-500">
        <div class="container mx-auto px-6 flex justify-between items-center">
            <a href="index.php" class="flex items-center space-x-3">
                <img src="assets/images/logo.webp" alt="KDIA RE PARK" class="h-10 w-auto" width="150" height="40">
            </a>
            <div class="hidden md:flex items-center space-x-12 text-slate-600 font-medium">
                <a href="index.php" class="hover:text-brand-green transition-colors">Home</a>
                <a href="about.php"
                    class="text-brand-green underline decoration-brand-green decoration-2 underline-offset-8">Company &
                    Energy Solutions</a>

                <!-- Govt. Schemes & Policies Dropdown -->
                <div class="relative group">
                    <a href="govt-schemes.php"
                        class="flex items-center space-x-1 hover:text-brand-green transition-colors">
                        <span>Govt. Schemes & Policies</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
                    </a>
                    <div
                        class="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 py-2 z-50">
                        <a href="govt-schemes.php#policies"
                            class="block px-6 py-3 text-slate-600 hover:text-brand-green hover:bg-slate-50 transition-colors">Policies</a>
                        <a href="govt-schemes.php#schemes"
                            class="block px-6 py-3 text-slate-600 hover:text-brand-green hover:bg-slate-50 transition-colors">Schemes</a>
                        <a href="govt-schemes.php#guidelines"
                            class="block px-6 py-3 text-slate-600 hover:text-brand-green hover:bg-slate-50 transition-colors">Guidelines</a>
                        <a href="govt-schemes.php#tariff-orders"
                            class="block px-6 py-3 text-slate-600 hover:text-brand-green hover:bg-slate-50 transition-colors">Tariff
                            Orders</a>
                    </div>
                </div>

                <!-- Re-Culator Link (Highlighted) -->
                <a href="re-culator.php"
                    class="flex items-center space-x-2 text-brand-green font-bold transition-colors relative group">
                    <span class="relative">
                        Re-Culator
                        <span
                            class="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-green/30 group-hover:bg-brand-green transition-colors"></span>
                    </span>
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                </a>

                <a href="contact.php" class="hover:text-brand-green transition-colors">Contact Us</a>
            </div>
            <div class="flex items-center space-x-4">
                <!-- Language Toggle Button -->
                <button onclick="toggleLanguage()" class="lang-toggle-btn text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-green bg-white hover:text-brand-green transition-all shadow-sm flex items-center space-x-1">
                    <i data-lucide="globe" class="w-3.5 h-3.5 text-slate-500"></i>
                    <span class="lang-btn-text">हिन्दी</span>
                </button>
                
                <button id="menu-btn" class="md:hidden text-slate-900 transition-colors hover:text-brand-green">
                    <i data-lucide="menu"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu"
            class="hidden md:hidden absolute top-full left-0 w-full bg-white border-b border-brand-green/10 py-6 px-6 flex flex-col space-y-4 shadow-xl">
            <a href="index.php" class="text-lg">Home</a>
            <a href="about.php" class="text-lg">Company & Energy Solutions</a>
            <a href="govt-schemes.php" class="text-lg">Govt. Schemes & Policies</a>
            <a href="re-culator.php" class="text-lg font-bold text-brand-green">Re-Culator +</a>
            <a href="contact.php" class="text-lg text-brand-green font-bold">Contact Us</a>
        </div>
    </nav>

    <!-- Header Hero Section with Category Switcher -->
    <section class="pt-48 pb-16 bg-white relative">
        <div class="container mx-auto px-6 text-center max-w-4xl">
            <span class="text-brand-green font-bold uppercase tracking-wider text-sm">KDIA Portfolios</span>
            <h1 class="text-5xl md:text-6xl font-display font-bold text-slate-900 mt-2 mb-6">Company & Energy Solutions</h1>
            <p class="text-xl text-slate-500 font-light leading-relaxed mb-12">
                Explore our specialized renewable infrastructure portfolios. Select a category below to view our operations and solutions.
            </p>
            
            <!-- Category Switcher Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                <!-- Solar Button -->
                <button id="solar-cat-btn" class="category-card active flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-brand-green/20 bg-white hover:border-brand-green/60 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-40">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <i data-lucide="sun" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <span class="text-lg font-display font-bold text-slate-800 tracking-wide">SOLAR ENERGY</span>
                </button>

                <!-- EV Button -->
                <button id="ev-cat-btn" class="category-card flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-brand-green/20 bg-white hover:border-brand-green/60 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-40">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <i data-lucide="zap" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <span class="text-lg font-display font-bold text-slate-800 tracking-wide">EV CHARGING</span>
                </button>

                <!-- CBG Button -->
                <button id="cbg-cat-btn" class="category-card flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-brand-green/20 bg-white hover:border-brand-green/60 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-40">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <i data-lucide="sprout" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <span class="text-lg font-display font-bold text-slate-800 tracking-wide">CBG SOLUTIONS</span>
                </button>
            </div>
        </div>
    </section>

    <!-- SOLAR CONTENT CATEGORY -->
    <div id="solar-category-content" class="block">
        <!-- SECTION 1 – About KDIA RE Park -->
        <section class="py-24 relative bg-white border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal">
                        <h2 class="text-5xl font-display font-bold mb-8 tracking-tight text-slate-900">Our Vision: <span class="text-brand-green">Stability & Growth.</span></h2>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal" style="transition-delay: 150ms">
                            To be a <span class="text-slate-900 font-medium">trusted long-term owner</span> of renewable energy assets, supporting India’s clean energy transition and creating stable value for all stakeholders.
                        </p>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal mt-6" style="transition-delay: 200ms">
                            To enable affordable access to renewable energy for last-mile consumers across India.
                        </p>
                    </div>
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl" style="transition-delay: 300ms">
                        <img src="assets/images/solar4_opt.webp" alt="Solar Farm" class="w-full h-[400px] object-cover" width="1200" height="400" loading="lazy">
                    </div>
                </div>
            </div>
        </section>



        <!-- Mission Framework -->
        <section class="py-24 bg-slate-50/30 border-t border-slate-50">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-display font-bold text-center mb-24 reveal text-slate-900">Strategic <span class="text-brand-green">Framework</span></h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="target" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Asset Acquisition</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Identify and secure high-performance operational solar assets.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 150ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="layers" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Portfolio Development</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Build scalable and diversified renewable portfolios at regional levels.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 300ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="bar-chart-3" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Capital Investment</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Strategic, long-term capital deployment in high-yield energy assets.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 450ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="check-square" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Governance Standards</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Commitment to transparency, integrity, and strict regulatory compliance.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Detailed Solar Solutions -->
        <section class="py-24 bg-white relative border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal">
                        <h2 class="text-5xl font-display font-bold mb-8 text-slate-900 leading-tight">
                            Solar Asset <br>Infrastructure <span class="text-brand-green">Efficiency</span>
                        </h2>
                        <p class="text-xl text-slate-500 leading-relaxed font-light mb-12">
                            KDIA structures and operates utility-grade solar assets designed to maximize power generation. Our commitment to Tier-1 components and continuous performance auditing ensures long-term energy stability and commercial viability.
                        </p>
                        <div class="space-y-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Tier-1 Component Selection</span>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Real-time Performance Auditing</span>
                            </div>
                        </div>
                    </div>
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl relative group" style="transition-delay: 200ms">
                        <img src="assets/images/solar2_opt.webp" alt="Solar Panels" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width="1200" height="800" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>



        <!-- SECTION 2 – Renewable Energy Overview -->
        <section class="py-24 bg-white border-t border-slate-50" id="renewable-overview">
            <div class="container mx-auto px-6">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-display font-bold mb-6 reveal text-slate-900">
                            Understanding <span class="text-brand-green">Energy Models</span>
                        </h2>
                        <p class="text-xl text-slate-600 font-normal reveal">
                            Interactive guide to solar energy distribution systems (VNM, GNM, Captive)
                        </p>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="flex justify-center mb-12 reveal">
                        <div class="inline-flex bg-slate-50 rounded-full p-2 gap-2">
                            <button class="energy-tab active px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="vnm">VNM</button>
                            <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="gnm">GNM</button>
                            <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="captive">Captive</button>
                            <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="group-captive">Group Captive</button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container">
                        <!-- VNM Content -->
                        <div class="tab-content active" id="vnm">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Virtual Net Metering (VNM)</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        Energy is generated at a centralized solar park and virtually credited to your consumption point, regardless of physical distance.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Remote solar park facility</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Businesses without suitable rooftop space</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Energy Flow:</strong> Virtual credit adjustment via utility</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <!-- VNM: Top-down funnel flow (2 rows: source top, grid middle, credit + consumer bottom) -->
                                    <svg class="w-full h-64" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-vnm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#008244" />
                                            </marker>
                                        </defs>
                                        <!-- Row 1: Solar Power Plant (centred top) -->
                                        <rect x="120" y="10" width="160" height="55" fill="#8DC63F" opacity="0.15" rx="10" />
                                        <rect x="120" y="10" width="160" height="55" stroke="#008244" stroke-width="2" rx="10" fill="none" />
                                        <text x="200" y="37" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#008244">
                                            <tspan x="200" dy="-7" data-en="Solar Power Plant" data-hi="सौर ऊर्जा संयंत्र">Solar Power Plant</tspan>
                                        </text>
                                        <!-- Down arrow 1 -->
                                        <path d="M 200 65 L 200 90" stroke="#008244" stroke-width="2" marker-end="url(#arrow-vnm)" />
                                        <!-- Row 2: Electricity Grid (centred middle) -->
                                        <rect x="120" y="90" width="160" height="55" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="10" />
                                        <text x="200" y="117" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Electricity Grid" data-hi="बिजली ग्रिड">Electricity Grid</tspan>
                                        </text>
                                        <!-- Down-left arrow -->
                                        <path d="M 160 145 L 100 170" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-vnm)" />
                                        <!-- Down-right arrow -->
                                        <path d="M 240 145 L 300 170" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-vnm)" />
                                        <!-- Row 3 left: Virtual Credit Allocation -->
                                        <rect x="20" y="170" width="155" height="55" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="10" />
                                        <text x="97" y="197" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#334155">
                                            <tspan x="97" dy="-7" data-en="Virtual Credit" data-hi="वर्चुअल क्रेडिट">Virtual Credit</tspan>
                                            <tspan x="97" dy="16" data-en="Allocation" data-hi="आवंटन">Allocation</tspan>
                                        </text>
                                        <!-- Row 3 right: Individual Consumer -->
                                        <rect x="225" y="170" width="155" height="55" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="10" />
                                        <text x="302" y="197" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#334155">
                                            <tspan x="302" dy="-7" data-en="Individual" data-hi="व्यक्तिगत">Individual</tspan>
                                            <tspan x="302" dy="16" data-en="Consumer" data-hi="उपभोक्ता">Consumer</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- GNM Content -->
                        <div class="tab-content" id="gnm">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Group Net Metering (GNM)</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        A shared energy model where multiple connections within the same organization benefit from a single centralized solar installation.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Centralized solar park</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Multi-site organizations or campuses</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Energy Flow:</strong> Distributed across grouped connections</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <!-- GNM: Hub-and-spoke - Solar Plant at top, Group Net Meter centre, 3 consumer branches below -->
                                    <svg class="w-full h-64" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-gnm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#008244" />
                                            </marker>
                                        </defs>
                                        <!-- Solar Power Plant (top) -->
                                        <rect x="120" y="8" width="160" height="50" fill="#8DC63F" opacity="0.15" rx="10" />
                                        <rect x="120" y="8" width="160" height="50" stroke="#008244" stroke-width="2" rx="10" fill="none" />
                                        <text x="200" y="33" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#008244">
                                            <tspan data-en="Solar Power Plant" data-hi="सौर ऊर्जा संयंत्र">Solar Power Plant</tspan>
                                        </text>
                                        <!-- Arrow down -->
                                        <path d="M 200 58 L 200 83" stroke="#008244" stroke-width="2" marker-end="url(#arrow-gnm)" />
                                        <!-- Group Net Meter hub (centre) -->
                                        <rect x="120" y="83" width="160" height="50" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="10" />
                                        <text x="200" y="108" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#0369a1">
                                            <tspan data-en="Group Net Meter" data-hi="ग्रुप नेट मीटर">Group Net Meter</tspan>
                                        </text>
                                        <!-- 3 branch arrows down -->
                                        <path d="M 80 133 L 80 163" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-gnm)" />
                                        <path d="M 200 133 L 200 163" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-gnm)" />
                                        <path d="M 320 133 L 320 163" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-gnm)" />
                                        <!-- Lines from hub to branch tops -->
                                        <line x1="120" y1="133" x2="80" y2="133" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" />
                                        <line x1="120" y1="133" x2="320" y2="133" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3" />
                                        <!-- Consumer A -->
                                        <rect x="20" y="163" width="120" height="48" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="8" />
                                        <text x="80" y="187" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#334155">
                                            <tspan data-en="Consumer A" data-hi="उपभोक्ता A">Consumer A</tspan>
                                        </text>
                                        <!-- Consumer B -->
                                        <rect x="140" y="163" width="120" height="48" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="8" />
                                        <text x="200" y="187" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#334155">
                                            <tspan data-en="Consumer B" data-hi="उपभोक्ता B">Consumer B</tspan>
                                        </text>
                                        <!-- Consumer C -->
                                        <rect x="260" y="163" width="120" height="48" fill="#f1f5f9" stroke="#64748b" stroke-width="2" rx="8" />
                                        <text x="320" y="187" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#334155">
                                            <tspan data-en="Consumer C" data-hi="उपभोक्ता C">Consumer C</tspan>
                                        </text>
                                        <!-- Label: Shared Energy Distribution -->
                                        <text x="200" y="240" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">
                                            <tspan data-en="Shared Energy Distribution" data-hi="साझा ऊर्जा वितरण">Shared Energy Distribution</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Captive Model Content -->
                        <div class="tab-content" id="captive">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Captive Model</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        A dedicated solar power model where the consumer directly owns the solar asset and consumes the majority of the electricity produced.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Ownership:</strong> Minimum 26% equity</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Consumption:</strong> Minimum 51% by owner</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <!-- Captive: Bold direct 3-step pipeline -->
                                    <svg class="w-full h-64" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-captive" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#008244" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Captive Solar Plant -->
                                        <rect x="15" y="65" width="110" height="75" fill="#8DC63F" opacity="0.15" rx="12" />
                                        <rect x="15" y="65" width="110" height="75" stroke="#008244" stroke-width="2.5" rx="12" fill="none" />
                                        <text x="70" y="102" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#008244">
                                            <tspan x="70" dy="-9" data-en="Captive Solar" data-hi="कैप्टिव सौर">Captive Solar</tspan>
                                            <tspan x="70" dy="18" data-en="Plant" data-hi="संयंत्र">Plant</tspan>
                                        </text>
                                        <!-- Thick arrow 1 -->
                                        <path d="M 125 101 L 148 101" stroke="#008244" stroke-width="3" marker-end="url(#arrow-captive)" />
                                        <!-- Step 2: Dedicated Connection -->
                                        <rect x="148" y="65" width="110" height="75" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5" rx="12" />
                                        <text x="203" y="102" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#92400e">
                                            <tspan x="203" dy="-9" data-en="Dedicated" data-hi="समर्पित">Dedicated</tspan>
                                            <tspan x="203" dy="18" data-en="Connection" data-hi="कनेक्शन">Connection</tspan>
                                        </text>
                                        <!-- Thick arrow 2 -->
                                        <path d="M 258 101 L 280 101" stroke="#008244" stroke-width="3" marker-end="url(#arrow-captive)" />
                                        <!-- Step 3: Industrial / Business Consumer -->
                                        <rect x="280" y="65" width="110" height="75" fill="#f1f5f9" stroke="#334155" stroke-width="2.5" rx="12" />
                                        <text x="335" y="102" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="bold" fill="#334155">
                                            <tspan x="335" dy="-9" data-en="Industrial /" data-hi="औद्योगिक /">Industrial /</tspan>
                                            <tspan x="335" dy="18" data-en="Business" data-hi="व्यापार">Business</tspan>
                                        </text>
                                        <!-- Ownership badge -->
                                        <rect x="100" y="168" width="200" height="36" fill="#dcfce7" stroke="#008244" stroke-width="1.5" rx="8" />
                                        <text x="200" y="186" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534">
                                            <tspan data-en="Min. 26% Equity · Min. 51% Own Consumption" data-hi="न्यूनतम 26% इक्विटी · न्यूनतम 51% स्वयं खपत">Min. 26% Equity · Min. 51% Own Consumption</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Group Captive Model Content -->
                        <div class="tab-content" id="group-captive">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Group Captive Model</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        A collaborative ownership model where multiple consumers jointly invest in and benefit from a centralized solar power facility.
                                    </p>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <!-- Group Captive: Left-side plant fans out to 4 consumer circles on right -->
                                    <svg class="w-full h-64" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-gcap" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" />
                                            </marker>
                                        </defs>
                                        <!-- Solar Power Plant (left) -->
                                        <rect x="8" y="88" width="110" height="70" fill="#8DC63F" opacity="0.15" rx="12" />
                                        <rect x="8" y="88" width="110" height="70" stroke="#008244" stroke-width="2.5" rx="12" fill="none" />
                                        <text x="63" y="123" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10.5" font-weight="bold" fill="#008244">
                                            <tspan x="63" dy="-8" data-en="Solar Power" data-hi="सौर ऊर्जा">Solar Power</tspan>
                                            <tspan x="63" dy="17" data-en="Plant" data-hi="संयंत्र">Plant</tspan>
                                        </text>
                                        <!-- Shared Ownership circle (centre) -->
                                        <circle cx="215" cy="123" r="38" fill="#ede9fe" stroke="#7c3aed" stroke-width="2.5" />
                                        <text x="215" y="123" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="bold" fill="#5b21b6">
                                            <tspan x="215" dy="-8" data-en="Shared" data-hi="साझा">Shared</tspan>
                                            <tspan x="215" dy="17" data-en="Ownership" data-hi="स्वामित्व">Ownership</tspan>
                                        </text>
                                        <!-- Arrow: plant -> circle -->
                                        <path d="M 118 123 L 177 123" stroke="#008244" stroke-width="2" marker-end="url(#arrow-gcap)" />
                                        <!-- 4 fan arrows from circle to consumer boxes -->
                                        <path d="M 248 95 L 295 55" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-gcap)" />
                                        <path d="M 252 115 L 295 110" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-gcap)" />
                                        <path d="M 252 132 L 295 145" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-gcap)" />
                                        <path d="M 248 150 L 295 190" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrow-gcap)" />
                                        <!-- Consumer boxes (right column) -->
                                        <rect x="295" y="32" width="98" height="38" fill="#f1f5f9" stroke="#7c3aed" stroke-width="1.5" rx="8" />
                                        <text x="344" y="51" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="9.5" font-weight="bold" fill="#5b21b6" data-en="Group Consumer 1" data-hi="समूह उपभोक्ता 1">Group Consumer 1</text>
                                        <rect x="295" y="91" width="98" height="38" fill="#f1f5f9" stroke="#7c3aed" stroke-width="1.5" rx="8" />
                                        <text x="344" y="110" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="9.5" font-weight="bold" fill="#5b21b6" data-en="Group Consumer 2" data-hi="समूह उपभोक्ता 2">Group Consumer 2</text>
                                        <rect x="295" y="127" width="98" height="38" fill="#f1f5f9" stroke="#7c3aed" stroke-width="1.5" rx="8" />
                                        <text x="344" y="146" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="9.5" font-weight="bold" fill="#5b21b6" data-en="Group Consumer 3" data-hi="समूह उपभोक्ता 3">Group Consumer 3</text>
                                        <rect x="295" y="172" width="98" height="38" fill="#f1f5f9" stroke="#7c3aed" stroke-width="1.5" rx="8" />
                                        <text x="344" y="191" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="9.5" font-weight="bold" fill="#5b21b6" data-en="Group Consumer 4" data-hi="समूह उपभोक्ता 4">Group Consumer 4</text>
                                        <!-- Label -->
                                        <text x="200" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">
                                            <tspan data-en="Power Distribution to All Group Members" data-hi="सभी समूह सदस्यों को बिजली वितरण">Power Distribution to All Group Members</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Investment & Savings Logic Section (Moved from Home) -->
        <section class="py-24 bg-slate-50/50 relative overflow-hidden border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center mb-24">
                    <h2 class="text-5xl font-display font-bold mb-8 reveal text-slate-900">Investment & <span class="text-brand-green">Savings Logic</span></h2>
                    <p class="text-xl text-slate-600 font-normal reveal">Understanding the financial intelligence behind the renewable transition.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div class="flex gap-8 reveal">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">01</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Tariff Protection</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Savings grow as utility electricity tariffs increase over time, providing a natural hedge against rising costs.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 200ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">02</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Direct Offsets</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Energy generated by centralized solar assets directly offsets your consumption bills.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 400ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">03</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Ownership Stability</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Long-term energy asset ownership provides price predictability and stability.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 600ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">04</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Future-Ready</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Transitioning real estate assets into energy infrastructure ensures long-term valuation growth.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Video / Photo Reference Section (Moved from Home) -->
        <section class="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-50">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(141,198,63,0.1),transparent_50%)]"></div>
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-6">Explore Our <span class="text-brand-green">Infrastructure</span></h2>
                    <p class="text-lg text-slate-400 font-light">Watch our clean energy solutions in action and see how KDIA is powering tomorrow.</p>
                </div>
                
                <div class="max-w-4xl mx-auto">
                    <div class="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer" onclick="openVideoModal()">
                        <img src="assets/images/solar4_opt.webp" alt="KDIA Solar Park Infrastructure" class="w-full h-full object-cover opacity-80 transition-transform duration-750 group-hover:scale-105">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/30">
                            <div class="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                                <i data-lucide="play" class="w-8 h-8 fill-current ml-1"></i>
                            </div>
                        </div>
                        <div class="absolute bottom-6 left-8 text-left">
                            <span class="text-xs font-semibold uppercase tracking-wider text-brand-green px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">Overview Video</span>
                            <h3 class="text-2xl font-bold text-white mt-2">KDIA RE Park Infrastructure Walkthrough</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Video Modal -->
        <div id="video-modal" class="fixed inset-0 z-50 hidden bg-black/95 backdrop-blur-md items-center justify-center p-6">
            <div class="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <div class="absolute top-4 right-4 z-10">
                    <button onclick="closeVideoModal()" class="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="aspect-video w-full flex flex-col items-center justify-center text-center p-8">
                    <i data-lucide="video" class="w-16 h-16 text-brand-green mb-4"></i>
                    <h3 class="text-2xl font-bold text-white mb-2">KDIA RE Park Video Presentation</h3>
                    <p class="text-slate-400 max-w-md font-light mb-6">Here the KDIA project walkthrough or corporate video will be rendered.</p>
                    <div class="w-full max-w-lg bg-slate-900 border border-white/5 rounded-full px-6 py-3 flex items-center justify-between text-slate-300 text-sm">
                        <button class="hover:text-brand-green transition-colors"><i data-lucide="play" class="w-4 h-4"></i></button>
                        <div class="flex-1 mx-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div class="w-1/3 h-full bg-brand-green"></div>
                        </div>
                        <span>01:12 / 03:45</span>
                        <button class="ml-4 hover:text-brand-green transition-colors"><i data-lucide="volume-2" class="w-4 h-4"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <!-- JS Helper for Video Modal -->
        <script>
            function openVideoModal() {
                const modal = document.getElementById('video-modal');
                if (modal) {
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                }
            }
            function closeVideoModal() {
                const modal = document.getElementById('video-modal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    document.body.style.overflow = '';
                }
            }
        </script>

        <!-- Policy & Eligibility Section -->
        <section class="py-24 bg-white border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-4xl font-display font-bold mb-16 text-center reveal text-slate-900">Policy &amp; <span class="text-brand-green">Eligibility</span></h3>

                    <div class="space-y-6">
                        <div class="glass-card p-8 rounded-2xl reveal bg-white">
                            <h4 class="text-xl font-bold mb-3">Who can participate?</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Our models are designed for multiple consumer categories, ranging from residential complexes to large-scale utility and industrial sectors.</p>
                        </div>
                        <div class="glass-card p-8 rounded-2xl reveal bg-white" style="transition-delay: 150ms">
                            <h4 class="text-xl font-bold mb-3">Capacity Range</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Systems can vary significantly in scale, typically ranging from 1 kW installations up to utility-scale limits depending on the participation model.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>

    <!-- EV CONTENT CATEGORY -->
    <div id="ev-category-content" class="hidden">
        <style>
            .ev-tab {
                color: #64748b;
                background: transparent;
                cursor: pointer;
                border: none;
            }
            .ev-tab.active {
                background: white;
                color: #0f172a;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .ev-tab:hover:not(.active) {
                color: #8DC63F;
            }
            .ev-tab-content {
                display: none;
                opacity: 0;
            }
            .ev-tab-content.active {
                display: block;
                opacity: 1;
            }
        </style>

        <!-- SECTION 1 – EV Vision & Clean Mobility -->
        <section class="py-24 relative bg-white border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal">
                        <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Vision &amp; Clean Mobility</span>
                        <h2 class="text-5xl font-display font-bold mb-8 tracking-tight text-slate-900 mt-2">Our EV Vision: <span class="text-brand-green">Mobility &amp; Accessibility.</span></h2>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal" style="transition-delay: 150ms">
                            To be a <span class="text-slate-900 font-medium">pioneering host</span> of solar-integrated EV charging stations, accelerating India's transition to clean mobility and providing dependable charging access.
                        </p>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal mt-6" style="transition-delay: 200ms">
                            To create a seamless, high-power DC fast charging network that powers passenger vehicles, commercial fleets, and public transport alike.
                        </p>
                    </div>
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl" style="transition-delay: 300ms">
                        <img src="assets/images/ev_charging_station.png" alt="EV Charging Infrastructure" class="w-full h-[400px] object-cover" width="1200" height="400" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 2 – EV Strategic Framework -->
        <section class="py-24 bg-slate-50/30 border-t border-slate-50">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-display font-bold text-center mb-24 reveal text-slate-900">EV Strategic <span class="text-brand-green">Framework</span></h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="target" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Site Assessment</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Evaluate property locations for power grid capacity, vehicle access, and commercial viability.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 150ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="layers" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Infrastructure Scale</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Build scalable and grid-compliant fast charging hubs across key highways and zones.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 300ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="zap" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Solar Integration</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Directly integrate EV charging stations with solar microgrids for zero-emission energy.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 450ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="settings" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Operational Excellence</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">24/7 remote monitoring, maintenance support, and diagnostic checks to guarantee uptime.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 – Detailed EV Charging Solutions -->
        <section class="py-24 bg-white relative border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl relative group order-2 lg:order-1" style="transition-delay: 200ms">
                        <img src="assets/images/solar3_opt.webp" alt="EV Charging Station" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width="1200" height="800" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div class="reveal order-1 lg:order-2">
                        <h2 class="text-5xl font-display font-bold mb-8 text-slate-900 leading-tight">
                            EV Charging <br>Infrastructure <span class="text-brand-green">Excellence</span>
                        </h2>
                        <p class="text-xl text-slate-500 leading-relaxed font-light mb-12">
                            We power the transition to clean mobility. Our solar-integrated EV charging network provides reliable, zero-carbon fast charging systems. Landowners can host charging stations to generate guaranteed long-term rental income.
                        </p>
                        <div class="space-y-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Solar-Powered DC Fast Chargers</span>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">24/7 Smart Network Monitoring</span>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Zero-Carbon Charging Guarantee</span>
                            </div>
                        </div>
                        <div class="mt-12 flex items-center gap-6">
                            <a href="land-verification.php"
                                class="inline-block px-10 py-4 brand-gradient-bg text-white rounded-full font-bold text-lg hover:shadow-[0_20px_40px_rgba(251,191,36,0.2)] transition-all transform hover:-translate-y-1 shrink-0">
                                Apply Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 4 – EV Charging Models (Interactive tabs) -->
        <section class="py-24 bg-white border-t border-slate-50" id="ev-charging-models">
            <div class="container mx-auto px-6">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-display font-bold mb-6 reveal text-slate-900">
                            EV Charging <span class="text-brand-green">Models</span>
                        </h2>
                        <p class="text-xl text-slate-600 font-normal reveal">
                            Interactive guide to EV charging distribution systems (Public, Commercial, Residential, Fleet)
                        </p>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="flex justify-center mb-12 reveal">
                        <div class="inline-flex bg-slate-50 rounded-full p-2 gap-2 flex-wrap justify-center">
                            <button class="ev-tab active px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="ev-public">Public/Highway</button>
                            <button class="ev-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="ev-commercial">Commercial</button>
                            <button class="ev-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="ev-residential">Residential</button>
                            <button class="ev-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="ev-fleet">Fleet</button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container">
                        <!-- Public Charging -->
                        <div class="ev-tab-content active" id="ev-public">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Public &amp; Highway Charging</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        High-capacity DC fast chargers installed along main highways and public transit points for rapid transit charging.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Highway plazas and public transit hubs</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Long-distance commuters and public transit</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Capacity:</strong> 60 kW to 240 kW DC fast chargers</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-ev-public" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Input: Highway Power Grid -->
                                        <rect x="15" y="115" width="90" height="70" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="15" y="115" width="90" height="70" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="60" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9.5" font-weight="bold" fill="#008244">
                                            <tspan x="60" dy="-7" data-en="Highway Power" data-hi="राजमार्ग बिजली">Highway Power</tspan>
                                            <tspan x="60" dy="16" data-en="Grid" data-hi="ग्रिड">Grid</tspan>
                                        </text>

                                        <!-- Connector 1 -> Center -->
                                        <path d="M 105 150 L 145 150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-public)" />

                                        <!-- Center Hub: Public Charging Hub -->
                                        <rect x="145" y="115" width="110" height="70" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9.5" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Public Charging" data-hi="सार्वजनिक चार्जिंग">Public Charging</tspan>
                                            <tspan x="200" dy="16" data-en="Hub" data-hi="हब">Hub</tspan>
                                        </text>

                                        <!-- Connector Hub -> Top Right -->
                                        <path d="M 255 135 L 290 75" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-public)" />

                                        <!-- Spoke 1: Passenger EVs -->
                                        <rect x="290" y="30" width="100" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="340" y="60" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="340" dy="-7" data-en="EV" data-hi="ईवी">EV</tspan>
                                            <tspan x="340" dy="16" data-en="(Passenger Car)" data-hi="(यात्री कार)">(Passenger Car)</tspan>
                                        </text>

                                        <!-- Connector Hub -> Middle Right -->
                                        <path d="M 255 150 L 290 150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-public)" />

                                        <!-- Spoke 2: Commercial Trucks -->
                                        <rect x="290" y="120" width="100" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="340" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="340" dy="-7" data-en="EV" data-hi="ईवी">EV</tspan>
                                            <tspan x="340" dy="16" data-en="(Commercial Truck)" data-hi="(वाणिज्यिक ट्रक)">(Commercial Truck)</tspan>
                                        </text>

                                        <!-- Connector Hub -> Bottom Right -->
                                        <path d="M 255 165 L 290 225" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-public)" />

                                        <!-- Spoke 3: Public Buses -->
                                        <rect x="290" y="210" width="100" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="340" y="240" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="340" dy="-7" data-en="EV" data-hi="ईवी">EV</tspan>
                                            <tspan x="340" dy="16" data-en="(Public Bus)" data-hi="(सार्वजनिक बस)">(Public Bus)</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Commercial Charging -->
                        <div class="ev-tab-content" id="ev-commercial">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Commercial Charging</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        Smart AC and DC charging hubs deployed at retail malls, corporate offices, and workplace parking lots for employees and visitors.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Business parks, corporate spaces, and retail centers</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Employees, shoppers, and commercial visitors</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Integration:</strong> Building Management Systems (BMS) load sharing</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-ev-comm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Top Node: Commercial Power Grid -->
                                        <rect x="155" y="15" width="90" height="60" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="155" y="15" width="90" height="60" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="200" y="45" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="200" dy="-7" data-en="Commercial" data-hi="वाणिज्यिक">Commercial</tspan>
                                            <tspan x="200" dy="16" data-en="Power Grid" data-hi="बिजली ग्रिड">Power Grid</tspan>
                                        </text>

                                        <!-- Connector Top -> Center -->
                                        <path d="M 200 75 L 200 105" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-comm)" />

                                        <!-- Center Node: BMS Load Sharing -->
                                        <rect x="155" y="105" width="90" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="135" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="BMS Load" data-hi="बीएमएस लोड">BMS Load</tspan>
                                            <tspan x="200" dy="16" data-en="Sharing" data-hi="साझाकरण">Sharing</tspan>
                                        </text>

                                        <!-- Connector Center -> Bottom Left -->
                                        <path d="M 180 165 L 90 210" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-comm)" />

                                        <!-- Bottom Left: Office AC Chargers -->
                                        <rect x="20" y="210" width="100" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="70" y="242.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="70" dy="-7" data-en="Office AC" data-hi="कार्यालय एसी">Office AC</tspan>
                                            <tspan x="70" dy="16" data-en="Chargers" data-hi="चार्जर्स">Chargers</tspan>
                                        </text>

                                        <!-- Connector Center -> Bottom Middle -->
                                        <path d="M 200 165 L 200 210" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-comm)" />

                                        <!-- Bottom Middle: Visitor DC Chargers -->
                                        <rect x="150" y="210" width="100" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="242.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Visitor DC" data-hi="आगंतुक डीसी">Visitor DC</tspan>
                                            <tspan x="200" dy="16" data-en="Chargers" data-hi="चार्जर्स">Chargers</tspan>
                                        </text>

                                        <!-- Connector Center -> Bottom Right -->
                                        <path d="M 220 165 L 310 210" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-comm)" />

                                        <!-- Bottom Right: Retail Hub Chargers -->
                                        <rect x="280" y="210" width="100" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="330" y="242.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="330" dy="-7" data-en="Retail Hub" data-hi="खुदरा हब">Retail Hub</tspan>
                                            <tspan x="330" dy="16" data-en="Chargers" data-hi="चार्जर्स">Chargers</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Residential Charging -->
                        <div class="ev-tab-content" id="ev-residential">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Residential Charging</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        Home and apartment complex charging points designed for residential complexes, letting residents charge vehicles safely overnight.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Apartment garages and individual homes</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> EV owners seeking convenient overnight solutions</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-ev-res" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Solar Panel -->
                                        <rect x="150" y="15" width="100" height="50" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="150" y="15" width="100" height="50" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="200" y="40" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="200" dy="-7" data-en="Solar Rooftop" data-hi="सौर रूफटॉप">Solar Rooftop</tspan>
                                            <tspan x="200" dy="16" data-en="Panels" data-hi="पैनल">Panels</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 200 65 L 200 85" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-res)" />

                                        <!-- Step 2: Home Distribution Box -->
                                        <rect x="150" y="85" width="100" height="50" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="110" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Home Power" data-hi="घरेलू बिजली">Home Power</tspan>
                                            <tspan x="200" dy="16" data-en="Grid Box" data-hi="ग्रिड बॉक्स">Grid Box</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 -->
                                        <path d="M 200 135 L 200 155" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-res)" />

                                        <!-- Step 3: Smart AC Charger -->
                                        <rect x="150" y="155" width="100" height="50" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="180" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Smart AC" data-hi="स्मार्ट एसी">Smart AC</tspan>
                                            <tspan x="200" dy="16" data-en="Charger" data-hi="चार्जर">Charger</tspan>
                                        </text>

                                        <!-- Connector 3 -> 4 -->
                                        <path d="M 200 205 L 200 225" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-res)" />

                                        <!-- Step 4: Resident's EV -->
                                        <rect x="150" y="225" width="100" height="50" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="250" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Resident's" data-hi="निवासी की">Resident's</tspan>
                                            <tspan x="200" dy="16" data-en="Electric Vehicle" data-hi="इलेक्ट्रिक वाहन">Electric Vehicle</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Fleet Charging -->
                        <div class="ev-tab-content" id="ev-fleet">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Fleet Charging</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        High-volume charging hubs designed for logistics operators, delivery fleets, and commercial EV groups requiring high uptime.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Location:</strong> Logistics depots and corporate distribution hubs</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> E-commerce delivery vehicles, fleet cars, and buses</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-ev-fleet" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Central Power Station -->
                                        <rect x="20" y="112.5" width="90" height="75" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="20" y="112.5" width="90" height="75" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="65" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="65" dy="-7" data-en="Central Power" data-hi="केंद्रीय बिजली">Central Power</tspan>
                                            <tspan x="65" dy="16" data-en="Station" data-hi="स्टेशन">Station</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 110 150 L 150 150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-fleet)" />

                                        <!-- Step 2: Depot Management System -->
                                        <rect x="150" y="112.5" width="100" height="75" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Depot Management" data-hi="डेपो प्रबंधन">Depot Management</tspan>
                                            <tspan x="200" dy="16" data-en="System" data-hi="प्रणाली">System</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 (Top Right) -->
                                        <path d="M 250 135 L 285 85" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-fleet)" />

                                        <!-- Step 3: Fleet Charger A -->
                                        <rect x="285" y="40" width="95" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="332.5" y="72.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold" fill="#334155">
                                            <tspan x="332.5" dy="-7" data-en="Fleet Charger A" data-hi="बेड़ा चार्जर A">Fleet Charger A</tspan>
                                            <tspan x="332.5" dy="16" data-en="(150kW DC)" data-hi="(150kW DC)">(150kW DC)</tspan>
                                        </text>

                                        <!-- Connector 2 -> 4 (Bottom Right) -->
                                        <path d="M 250 165 L 285 215" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-ev-fleet)" />

                                        <!-- Step 4: Fleet Charger B -->
                                        <rect x="285" y="180" width="95" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="332.5" y="212.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold" fill="#334155">
                                            <tspan x="332.5" dy="-7" data-en="Fleet Charger B" data-hi="बेड़ा चार्जर B">Fleet Charger B</tspan>
                                            <tspan x="332.5" dy="16" data-en="(22kW AC)" data-hi="(22kW AC)">(22kW AC)</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 5 – Benefits of EV Charging -->
        <section class="py-24 bg-slate-50/50 relative overflow-hidden border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center mb-24">
                    <h2 class="text-5xl font-display font-bold mb-8 reveal text-slate-900">Benefits of <span class="text-brand-green">EV Charging</span></h2>
                    <p class="text-xl text-slate-600 font-normal reveal">Leading the shift towards a zero-emission transport network.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div class="flex gap-8 reveal">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">01</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Sustainable Mobility</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Encourage clean transport adoption by powering electric vehicles with renewable solar energy.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 200ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">02</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Reduced Emissions</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Displace fossil fuel consumption and significantly lower carbon emissions in urban areas.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 400ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">03</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Future-Ready Infrastructure</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Prepare real estate assets and commercial properties for the inevitable shift to full electrification.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 600ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">04</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Convenience &amp; Uptime</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Deliver reliable, automated charging access with 24/7 smart network monitoring and user support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 6 – EV Process: How It Works -->
        <section class="py-24 bg-white border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-4xl font-display font-bold mb-16 text-center reveal text-slate-900">EV Process: <span class="text-brand-green">How It Works</span></h3>

                    <div class="space-y-6">
                        <div class="glass-card p-8 rounded-2xl reveal bg-white">
                            <h4 class="text-xl font-bold mb-3">Planning &amp; Deployment</h4>
                            <p class="text-slate-500 font-light leading-relaxed">From site assessment and capacity planning to equipment selection, we handle the end-to-end station deployment process.</p>
                        </div>
                        <div class="glass-card p-8 rounded-2xl reveal bg-white" style="transition-delay: 150ms">
                            <h4 class="text-xl font-bold mb-3">Operation &amp; Support</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Continuous testing, activation, 24/7 smart network monitoring, and technical maintenance ensure maximum operational reliability.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- CBG CONTENT CATEGORY -->
    <div id="cbg-category-content" class="hidden">
        <style>
            .cbg-tab {
                color: #64748b;
                background: transparent;
                cursor: pointer;
                border: none;
            }
            .cbg-tab.active {
                background: white;
                color: #0f172a;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .cbg-tab:hover:not(.active) {
                color: #8DC63F;
            }
            .cbg-tab-content {
                display: none;
                opacity: 0;
            }
            .cbg-tab-content.active {
                display: block;
                opacity: 1;
            }
        </style>

        <!-- SECTION 1 – About CBG & Clean Bio-Energy -->
        <section class="py-24 relative bg-white border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal">
                        <span class="text-brand-green font-bold uppercase tracking-wider text-sm">About CBG</span>
                        <h2 class="text-5xl font-display font-bold mb-8 tracking-tight text-slate-900 mt-2">What is Compressed Bio Gas?</h2>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal" style="transition-delay: 150ms">
                            Compressed Bio Gas (CBG) is an eco-friendly renewable fuel produced from organic waste materials. KDIA RE Park is committed to building a circular energy economy by converting agricultural residues, animal manure, and municipal solid waste into high-quality green gas.
                        </p>
                        <p class="text-xl text-slate-500 leading-relaxed reveal font-normal mt-6" style="transition-delay: 200ms">
                            Our vision is to scale decentralized CBG production facilities that reduce landfill waste, lower greenhouse gas emissions, and supply clean, sustainable energy for vehicles, industries, and commercial applications.
                        </p>
                    </div>
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl" style="transition-delay: 300ms">
                        <img src="assets/images/cbg_plant.png" alt="Compressed Bio Gas Plant" class="w-full h-[400px] object-cover" width="1200" height="400" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 2 – CBG Strategic Framework -->
        <section class="py-24 bg-slate-50/30 border-t border-slate-50">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-display font-bold text-center mb-24 reveal text-slate-900">CBG Strategic <span class="text-brand-green">Framework</span></h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="target" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Feedstock Sourcing</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Assess and secure agricultural residue, organic waste, and biomass supplies from regional farms and municipalities.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 150ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="layers" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Advanced Processing</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Employ state-of-the-art anaerobic digestion and gas purification systems to achieve high-methane purity.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 300ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="zap" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Bottling &amp; Grid</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Establish high-pressure bottling and pipeline injection networks for reliable distribution to industrial and automotive clients.</p>
                    </div>
                    <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 450ms">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                            <i data-lucide="settings" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Circular Economy</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-base">Recover nutrient-rich organic bio-fertilizer as a valuable byproduct, promoting chemical-free farming and soil health.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 – Detailed CBG Solutions -->
        <section class="py-24 bg-white relative border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="grid lg:grid-cols-2 gap-20 items-center">
                    <div class="reveal rounded-3xl overflow-hidden shadow-2xl relative group order-2 lg:order-1" style="transition-delay: 200ms">
                        <img src="assets/images/cbg_bottling.png" alt="CBG Bottling Cascade" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" width="1200" height="800" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div class="reveal order-1 lg:order-2">
                        <h2 class="text-5xl font-display font-bold mb-8 text-slate-900 leading-tight">
                            CBG Solutions &amp; <br>Infrastructure <span class="text-brand-green">Excellence</span>
                        </h2>
                        <p class="text-xl text-slate-500 leading-relaxed font-light mb-12">
                            We power the transition to clean bio-energy. Our advanced CBG facilities offer waste-to-energy conversion systems that supply sustainable fuel while providing waste disposal solutions. Partners and landowners can lease locations for biogas plants or join our feedstock supply network to generate guaranteed long-term revenue.
                        </p>
                        <div class="space-y-6">
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">High-Purity Biomethane (Min. 90% Methane Content)</span>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Sustainable Waste Management Partnerships</span>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                    <i data-lucide="check" class="text-brand-green w-4 h-4"></i>
                                </div>
                                <span class="text-lg text-slate-700 font-medium">Premium Organic Bio-fertilizer Production</span>
                            </div>
                        </div>
                        <div class="mt-12 flex items-center gap-6">
                            <a href="contact.php"
                                class="inline-block px-10 py-4 brand-gradient-bg text-white rounded-full font-bold text-lg hover:shadow-[0_20px_40px_rgba(251,191,36,0.2)] transition-all transform hover:-translate-y-1 shrink-0">
                                Contact Our Experts
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 4 – CBG Applications (Interactive tabs) -->
        <section class="py-24 bg-white border-t border-slate-50" id="cbg-applications-section">
            <div class="container mx-auto px-6">
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-display font-bold mb-6 reveal text-slate-900">
                            CBG <span class="text-brand-green">Applications</span>
                        </h2>
                        <p class="text-xl text-slate-600 font-normal reveal">
                            Interactive guide to CBG utilization systems (Automotive, Industrial, Commercial, Agriculture)
                        </p>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="flex justify-center mb-12 reveal">
                        <div class="inline-flex bg-slate-50 rounded-full p-2 gap-2 flex-wrap justify-center">
                            <button class="cbg-tab active px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="cbg-automotive">Automotive</button>
                            <button class="cbg-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="cbg-industrial">Industrial Fuel</button>
                            <button class="cbg-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="cbg-commercial">Commercial Kitchens</button>
                            <button class="cbg-tab px-8 py-3 rounded-full font-medium transition-all duration-300" data-tab="cbg-agriculture">Agricultural Power</button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container">
                        <!-- Automotive -->
                        <div class="cbg-tab-content active" id="cbg-automotive">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Automotive (CNG Alternative)</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        CBG is compressed and purified to serve as a direct, zero-emission substitute for compressed natural gas (CNG) in commercial trucks, public buses, and passenger vehicles.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Use Case:</strong> Retail fuel outlets and public transit stations</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Heavy transport, fleet logistics, and city cabs</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Pressure:</strong> Compressed to 200 bar for vehicle dispensing</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-cbg-auto" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Organic Waste (Top Left) -->
                                        <rect x="30" y="30" width="110" height="60" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="30" y="30" width="110" height="60" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="85" y="60" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="85" dy="-7" data-en="Agricultural" data-hi="कृषि">Agricultural</tspan>
                                            <tspan x="85" dy="16" data-en="Waste Sourcing" data-hi="अपशिष्ट सोर्सिंग">Waste Sourcing</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 140 60 L 260 60" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-auto)" />

                                        <!-- Step 2: Biogas Digester (Top Right) -->
                                        <rect x="260" y="30" width="110" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="315" y="60" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="315" dy="-7" data-en="Biogas" data-hi="बायोगैस">Biogas</tspan>
                                            <tspan x="315" dy="16" data-en="Digester System" data-hi="डाइजेस्टर प्रणाली">Digester System</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 (Vertical Down) -->
                                        <path d="M 315 90 L 315 190" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-auto)" />

                                        <!-- Step 3: Gas Upgrading & Bottling (Bottom Right) -->
                                        <rect x="260" y="190" width="110" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="315" y="222.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="315" dy="-7" data-en="Gas Upgrading" data-hi="गैस अपग्रेडिंग">Gas Upgrading</tspan>
                                            <tspan x="315" dy="16" data-en="&amp; Bottling" data-hi="और बॉटलिंग">&amp; Bottling</tspan>
                                        </text>

                                        <!-- Connector 3 -> 4 (Horizontal Left) -->
                                        <path d="M 260 222.5 L 140 222.5" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-auto)" />

                                        <!-- Step 4: Bio-CNG Station (Bottom Left) -->
                                        <rect x="30" y="190" width="110" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="85" y="222.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="85" dy="-7" data-en="Bio-CNG Retail" data-hi="बायो-सीएनजी खुदरा">Bio-CNG Retail</tspan>
                                            <tspan x="85" dy="16" data-en="Fuel Outlet" data-hi="ईंधन आउटलेट">Fuel Outlet</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Industrial Fuel -->
                        <div class="cbg-tab-content" id="cbg-industrial">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Industrial Fuel</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        High-heat industries can replace LPG or coal with CBG for manufacturing processes, steam generation, and industrial heating, significantly lowering carbon footprints.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Use Case:</strong> Boilers, furnaces, and co-generation plants</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Metalworking, chemical, and manufacturing industries</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-cbg-ind" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Industrial Waste (Left) -->
                                        <rect x="20" y="112.5" width="90" height="75" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="20" y="112.5" width="90" height="75" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="65" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="65" dy="-7" data-en="Industrial" data-hi="औद्योगिक">Industrial</tspan>
                                            <tspan x="65" dy="16" data-en="Waste" data-hi="कचरा">कचरा</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 110 150 L 150 150" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-ind)" />

                                        <!-- Step 2: Biogas Digester (Center) -->
                                        <rect x="150" y="112.5" width="100" height="75" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Purification &amp;" data-hi="शुद्धिकरण और">Purification &amp;</tspan>
                                            <tspan x="200" dy="16" data-en="Processing" data-hi="प्रसंस्करण">Processing</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 (Top Right) -->
                                        <path d="M 250 135 L 285 85" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-ind)" />

                                        <!-- Step 3: Steam Boiler -->
                                        <rect x="285" y="40" width="95" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="332.5" y="72.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="332.5" dy="-7" data-en="Steam Boiler" data-hi="भाप बॉयलर">Steam Boiler</tspan>
                                            <tspan x="332.5" dy="16" data-en="Supply" data-hi="आपूर्ति">आपूर्ति</tspan>
                                        </text>

                                        <!-- Connector 2 -> 4 (Bottom Right) -->
                                        <path d="M 250 165 L 285 215" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-ind)" />

                                        <!-- Step 4: Cogeneration Plant -->
                                        <rect x="285" y="180" width="95" height="65" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="332.5" y="212.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="332.5" dy="-7" data-en="Cogeneration" data-hi="सह-उत्पादन">सह-उत्पादन</tspan>
                                            <tspan x="332.5" dy="16" data-en="Power Plant" data-hi="बिजली संयंत्र">Power Plant</tspan>
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Commercial Kitchens -->
                        <div class="cbg-tab-content" id="cbg-commercial">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Commercial Kitchens</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        Clean-burning gas supplied directly or via cylinders to hotels, restaurants, and institutional kitchens, offering cost savings and reducing indoor air pollution.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Use Case:</strong> Cooking gas networks and cylinder delivery</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Hospitality industry and corporate cafeterias</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-cbg-comm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Organic Feedstock (Top Left) -->
                                        <rect x="30" y="30" width="110" height="60" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="30" y="30" width="110" height="60" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="85" y="60" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="85" dy="-7" data-en="Organic Feedstock" data-hi="जैविक फीडस्टॉक">Organic Feedstock</tspan>
                                            <tspan x="85" dy="16" data-en="Sourcing" data-hi="सोर्सिंग">Sourcing</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 140 60 L 260 60" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-comm)" />

                                        <!-- Step 2: Biogas Production (Top Right) -->
                                        <rect x="260" y="30" width="110" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="315" y="60" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="315" dy="-7" data-en="Biogas Digestion" data-hi="बायोगैस पाचन">Biogas Digestion</tspan>
                                            <tspan x="315" dy="16" data-en="&amp; Processing" data-hi="और प्रसंस्करण">&amp; Processing</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 (Down) -->
                                        <path d="M 315 90 L 315 190" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-comm)" />

                                        <!-- Step 3: Compressed Storage (Bottom Right) -->
                                        <rect x="260" y="190" width="110" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="315" y="220" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="315" dy="-7" data-en="High-Pressure" data-hi="उच्च दबाव">High-Pressure</tspan>
                                            <tspan x="315" dy="16" data-en="Cylinder Storage" data-hi="सिलेंडर भंडारण">Cylinder Storage</tspan>
                                        </text>

                                        <!-- Connector 3 -> 4 (Left) -->
                                        <path d="M 260 220 L 140 220" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-comm)" />

                                        <!-- Step 4: Hotel Kitchens (Bottom Left) -->
                                        <rect x="30" y="190" width="110" height="60" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="85" y="220" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="85" dy="-7" data-en="Commercial" data-hi="वाणिज्यिक">Commercial</tspan>
                                            <tspan x="85" dy="16" data-en="Kitchen Network" data-hi="रसोई नेटवर्क">Kitchen Network</tspan>
                                        </text>

                                        <!-- Connector 4 -> 1 (Up) -->
                                        <path d="M 85 190 L 85 90" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-comm)" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Agricultural Power -->
                        <div class="cbg-tab-content" id="cbg-agriculture">
                            <div class="grid lg:grid-cols-2 gap-16 items-center">
                                <div>

                                    <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Agricultural Power</h3>
                                    <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                        Decentralized microgrids and farming machinery operated on bio-energy, making rural communities self-reliant and reducing dependence on diesel generator sets.
                                    </p>
                                    <div class="space-y-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Use Case:</strong> Irrigation pumps and decentralized farm grids</p>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                            <p class="text-slate-600"><strong>Best For:</strong> Farms, cooperative societies, and rural regions</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                    <svg class="w-full h-64" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <marker id="arrow-cbg-agri" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                        <!-- Step 1: Farms (Biomass) (Top) -->
                                        <rect x="150" y="15" width="100" height="55" fill="#8DC63F" opacity="0.1" rx="12" />
                                        <rect x="150" y="15" width="100" height="55" stroke="#008244" stroke-width="2" rx="12" fill="none" />
                                        <text x="200" y="42.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#008244">
                                            <tspan x="200" dy="-7" data-en="Farms" data-hi="खेत">Farms</tspan>
                                            <tspan x="200" dy="16" data-en="(Biomass Waste)" data-hi="(बायोमास कचरा)">(Biomass Waste)</tspan>
                                        </text>

                                        <!-- Connector 1 -> 2 -->
                                        <path d="M 220 70 L 270 110" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-agri)" />

                                        <!-- Step 2: Biogas Digester (Right) -->
                                        <rect x="270" y="110" width="100" height="55" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="320" y="137.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="320" dy="-7" data-en="Biogas Digester" data-hi="बायोगैस डाइजेस्टर">Biogas Digester</tspan>
                                            <tspan x="320" dy="16" data-en="System" data-hi="प्रणाली">System</tspan>
                                        </text>

                                        <!-- Connector 2 -> 3 -->
                                        <path d="M 270 160 L 220 210" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-agri)" />

                                        <!-- Step 3: Bio-Fertilizer (Bottom) -->
                                        <rect x="150" y="210" width="100" height="55" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="200" y="237.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="200" dy="-7" data-en="Organic" data-hi="जैविक">Organic</tspan>
                                            <tspan x="200" dy="16" data-en="Bio-Fertilizer" data-hi="बायो-उर्वरक">Bio-Fertilizer</tspan>
                                        </text>

                                        <!-- Connector 3 -> 4 -->
                                        <path d="M 180 210 L 130 160" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-agri)" />

                                        <!-- Step 4: Soil & Crops (Left) -->
                                        <rect x="30" y="110" width="100" height="55" fill="#f8fafc" stroke="#64748b" stroke-width="2" rx="12" />
                                        <text x="80" y="137.5" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#334155">
                                            <tspan x="80" dy="-7" data-en="Healthy Soil" data-hi="स्वस्थ मिट्टी">Healthy Soil</tspan>
                                            <tspan x="80" dy="16" data-en="&amp; Crops" data-hi="और फसलें">&amp; Crops</tspan>
                                        </text>

                                        <!-- Connector 4 -> 1 -->
                                        <path d="M 130 120 L 180 70" stroke="#fbbf24" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-cbg-agri)" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 5 – Benefits of CBG -->
        <section class="py-24 bg-slate-50/50 relative overflow-hidden border-t border-slate-50">
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-4xl mx-auto text-center mb-24">
                    <h2 class="text-5xl font-display font-bold mb-8 reveal text-slate-900">Benefits of <span class="text-brand-green">CBG</span></h2>
                    <p class="text-xl text-slate-600 font-normal reveal">Driving environmental sustainability and economic opportunities.</p>
                </div>

                <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div class="flex gap-8 reveal">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">01</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Sustainable Waste Management</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Diverts agricultural residues and municipal organic waste from landfills, eliminating open-air burning and methane release.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 200ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">02</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Environmental Benefits</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Reduces greenhouse gas emissions by up to 80% compared to fossil fuels, actively combating climate change and air pollution.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 400ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">03</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Business &amp; Energy Opportunities</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Creates recurring revenues for farmers from biomass waste, while offering cheaper, price-stable fuel to industries.</p>
                        </div>
                    </div>
                    <div class="flex gap-8 reveal" style="transition-delay: 600ms">
                        <div class="shrink-0 w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">04</div>
                        <div>
                            <h4 class="text-2xl font-bold mb-4">Energy Independence</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Boosts domestic renewable energy production, reducing reliance on imported crude oil and liquefied natural gas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 6 – CBG Process -->
        <section class="py-24 bg-white border-t border-slate-50">
            <div class="container mx-auto px-6">
                <div class="max-w-4xl mx-auto">
                    <h3 class="text-4xl font-display font-bold mb-16 text-center reveal text-slate-900">CBG Process: <span class="text-brand-green">How It Works</span></h3>

                    <div class="space-y-6">
                        <div class="glass-card p-8 rounded-2xl reveal bg-white">
                            <h4 class="text-xl font-bold mb-3">Anaerobic Digestion &amp; Purification</h4>
                            <p class="text-slate-500 font-light leading-relaxed">Organic feedstock undergoes biochemical decomposition in sealed digestors, followed by advanced scrubbing to remove CO2 and H2S to yield 90%+ methane.</p>
                        </div>
                        <div class="glass-card p-8 rounded-2xl reveal bg-white" style="transition-delay: 150ms">
                            <h4 class="text-xl font-bold mb-3">Bottling, Distribution &amp; Enrichment</h4>
                            <p class="text-slate-500 font-light leading-relaxed">The purified biomethane is compressed to 200-250 bar, bottled in cylinder cascades or piped to retail outlets, with residual slurry processed into organic fertilizer.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <footer class="py-16 bg-white border-t border-slate-100">
        <div class="container mx-auto px-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <!-- Column 1: Logo, Description -->
                <div>
                    <img src="assets/images/logo.webp" alt="KDIA RE PARK" class="h-10 w-auto mb-6" width="150" height="40" loading="lazy">
                    <p class="text-slate-500 font-light leading-relaxed text-sm max-w-sm">
                        KDIA Re Park is a renewable infrastructure platform focused on long-term solar energy ownership.
                    </p>
                </div>

                <!-- Column 2: Quick Links -->
                <div>
                    <h4 class="font-bold text-slate-900 mb-6 font-display text-sm uppercase tracking-wider">Quick Links</h4>
                    <ul class="space-y-3 text-slate-500 font-light text-sm">
                        <li><a href="index.php" class="hover:text-brand-green transition-colors">Home</a></li>
                        <li><a href="about.php" class="hover:text-brand-green transition-colors">Company &amp; Energy Solutions</a></li>
                        <li><a href="govt-schemes.php" class="hover:text-brand-green transition-colors">Govt. Schemes &amp; Policies</a></li>
                        <li><a href="re-culator.php" class="hover:text-brand-green transition-colors">Re-Culator</a></li>
                        <li><a href="contact.php" class="hover:text-brand-green transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Column 3: Customer Service -->
                <div>
                    <h4 class="font-bold text-slate-900 mb-6 font-display text-sm uppercase tracking-wider">Customer Service</h4>
                    <ul class="space-y-3 text-slate-500 font-light text-sm">
                        <li><a href="privacy-policy.php" class="hover:text-brand-green transition-colors">Privacy Policy</a></li>
                        <li><a href="terms-conditions.php" class="hover:text-brand-green transition-colors">Terms &amp; Conditions</a></li>
                    </ul>
                </div>

                <!-- Column 4: Contact Info -->
                <div>
                    <h4 class="font-bold text-slate-900 mb-6 font-display text-sm uppercase tracking-wider">Contact Info</h4>
                    <ul class="space-y-3 text-slate-500 font-light text-sm">
                        <li class="flex items-start space-x-3">
                            <i data-lucide="map-pin" class="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0"></i>
                            <span>Solar Plaza, Innovation Drive, Green Valley</span>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="mail" class="w-5 h-5 text-brand-green flex-shrink-0"></i>
                            <a href="mailto:info@kdiarepark.com" class="hover:text-brand-green transition-colors">info@kdiarepark.com</a>
                        </li>
                        <li class="flex items-center space-x-3">
                            <i data-lucide="phone" class="w-5 h-5 text-brand-green flex-shrink-0"></i>
                            <a href="tel:+1800534273" class="hover:text-brand-green transition-colors">+1 (800) KDIA-RE</a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Absolute Bottom Copyright -->
            <div class="border-t border-slate-100 pt-8 text-center">
                <p class="text-slate-400 text-xs tracking-wider uppercase">&copy; 2024 KDIA RE PARK. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>

    <!-- AI Assistant -->
    <div id="ai-chat-btn" class="chat-fab">
        <i data-lucide="message-circle" class="mr-2"></i>
        <span>Ask KDIA</span>
    </div>

    <div id="ai-chat-panel" class="chat-panel">
        <div class="chat-header">
            <div>
                <h4 class="font-bold text-lg">KDIA Assistant</h4>
                <p class="text-xs opacity-80">Solar & Renewable Expert</p>
            </div>
            <button id="close-chat" class="hover:rotate-90 transition-transform">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>
        <div id="chat-messages" class="chat-messages">
            <div class="message ai">
                Hello! I’m here to help you understand clean energy solutions and KDIA Re Park’s offerings. How can I
                assist you today?
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Ask about Net Metering, VNM..." class="chat-input">
            <button id="send-chat" class="chat-send">
                <i data-lucide="send" class="w-4 h-4"></i>
            </button>
        </div>
    </div>

    <!-- Scripts -->
    <script src="assets/js/scripts.php" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const solarBtn = document.getElementById('solar-cat-btn');
            const evBtn = document.getElementById('ev-cat-btn');
            const cbgBtn = document.getElementById('cbg-cat-btn');
            const solarContent = document.getElementById('solar-category-content');
            const evContent = document.getElementById('ev-category-content');
            const cbgContent = document.getElementById('cbg-category-content');

            function showCategory(activeBtn, activeContent, inactiveBtns, inactiveContents) {
                activeBtn.classList.add('active');
                inactiveBtns.forEach(btn => btn.classList.remove('active'));
                
                activeContent.classList.remove('hidden');
                activeContent.classList.add('block');
                inactiveContents.forEach(content => {
                    content.classList.add('hidden');
                    content.classList.remove('block');
                });
                
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }

            if (solarBtn && evBtn && cbgBtn && solarContent && evContent && cbgContent) {
                solarBtn.addEventListener('click', () => {
                    showCategory(solarBtn, solarContent, [evBtn, cbgBtn], [evContent, cbgContent]);
                });

                evBtn.addEventListener('click', () => {
                    showCategory(evBtn, evContent, [solarBtn, cbgBtn], [solarContent, cbgContent]);
                });

                cbgBtn.addEventListener('click', () => {
                    showCategory(cbgBtn, cbgContent, [solarBtn, evBtn], [solarContent, evContent]);
                });
            }

            // EV Tab switching logic
            const evTabs = document.querySelectorAll('.ev-tab');
            const evContents = document.querySelectorAll('.ev-tab-content');

            evTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.getAttribute('data-tab');
                    const targetContent = document.getElementById(targetId);
                    evTabs.forEach(t => t.classList.remove('active'));
                    evContents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    if (targetContent) {
                        targetContent.classList.add('active');
                        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                            gsap.fromTo(targetContent, 
                                { opacity: 0, y: 10 },
                                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                            );
                        } else {
                            targetContent.style.opacity = '1';
                            targetContent.style.transform = 'none';
                        }
                        if (typeof window.applyDiagramLang === 'function') window.applyDiagramLang();
                        if (typeof window.reapplyTranslation === 'function') window.reapplyTranslation();
                    }
                });
            });

            // CBG Tab switching logic
            const cbgTabs = document.querySelectorAll('.cbg-tab');
            const cbgContents = document.querySelectorAll('.cbg-tab-content');

            cbgTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.getAttribute('data-tab');
                    const targetContent = document.getElementById(targetId);
                    cbgTabs.forEach(t => t.classList.remove('active'));
                    cbgContents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    if (targetContent) {
                        targetContent.classList.add('active');
                        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                            gsap.fromTo(targetContent, 
                                { opacity: 0, y: 10 },
                                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                            );
                        } else {
                            targetContent.style.opacity = '1';
                            targetContent.style.transform = 'none';
                        }
                        if (typeof window.applyDiagramLang === 'function') window.applyDiagramLang();
                        if (typeof window.reapplyTranslation === 'function') window.reapplyTranslation();
                    }
                });
            });
        });
    </script>
</body>

</html>