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
                    <span class="lang-btn-text">αñ╣αñ┐αñ¿αÑìαñªαÑÇ</span>
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

    <!-- SECTION 1 ΓÇô About KDIA RE Park -->
    <section class="pt-64 pb-32 relative">
        <div class="container mx-auto px-6 relative z-10">
            <div class="grid lg:grid-cols-2 gap-20 items-center">
                <div class="reveal">
                    <h1 class="text-6xl font-display font-bold mb-8 tracking-tight text-slate-900">Our
                        Vision: <span class="text-brand-green">Stability & Growth.</span></h1>
                    <p class="text-2xl text-slate-500 leading-relaxed reveal font-normal"
                        style="transition-delay: 150ms">
                        To be a <span class="text-slate-900 font-medium">trusted long-term owner</span> of renewable
                        energy
                        assets, supporting IndiaΓÇÖs clean energy transition and creating stable value for all
                        stakeholders.
                    </p>
                    <p class="text-2xl text-slate-500 leading-relaxed reveal font-normal mt-6"
                        style="transition-delay: 200ms">
                        To enable affordable access to renewable energy for last-mile consumers across India.
                    </p>
                </div>
                <div class="reveal rounded-3xl overflow-hidden shadow-2xl" style="transition-delay: 300ms">
                    <img src="assets/images/solar4_opt.webp"
                        alt="Solar Farm" class="w-full h-[500px] object-cover" width="1200" height="500" loading="lazy">
                </div>
            </div>
        </div>
    </section>

    <!-- The Platform Section -->
    <section class="py-40 border-t border-slate-50">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-24 items-center">
                <div class="reveal">
                    <h2 class="text-5xl font-display font-bold mb-10 tracking-tight text-slate-900">The Platform</h2>
                    <p class="text-slate-500 mb-8 leading-relaxed text-xl font-light">
                        <span class="text-slate-900 font-medium">KDIA Re Park Pvt. Ltd.</span> is a renewable
                        infrastructure platform focused on owning and operating solar power assets. Backed by decades of
                        experience in asset development and management, we are leading the shift from traditional real
                        estate to future-ready energy infrastructure.
                    </p>
                    <p class="text-slate-500 leading-relaxed text-xl font-light">
                        We identify, secure, and manage operational solar assets to build scalable portfolios that drive
                        the clean energy transition across India.
                    </p>
                </div>
                <div class="relative reveal" style="transition-delay: 200ms">
                    <div
                        class="aspect-square bg-amber-400 rounded-full opacity-5 absolute -top-10 -left-10 w-full h-full blur-3xl">
                    </div>
                    <div
                        class="glass-card aspect-video rounded-3xl flex items-center justify-center p-0 border border-slate-100 relative z-10 overflow-hidden">
                        <div class="absolute inset-0 brand-gradient-bg opacity-5"></div>
                        <img src="assets/images/solar4.webp" alt="Kdia Re Park Logo"
                            class="h-auto" width="600" height="400" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission Framework -->
    <section class="py-40 bg-slate-50/30">
        <div class="container mx-auto px-6">
            <h2 class="text-5xl font-display font-bold text-center mb-24 reveal text-slate-900">Strategic <span
                    class="text-brand-green">Framework</span></h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="target" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Asset Acquisition</h3>
                    <p class="text-slate-500 font-light leading-relaxed text-base">Identify and secure high-performance
                        operational solar assets.</p>
                </div>
                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 150ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="layers" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Portfolio Development</h3>
                    <p class="text-slate-500 font-light leading-relaxed text-base">Build scalable and diversified
                        renewable portfolios at regional levels.</p>
                </div>
                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 300ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="bar-chart-3" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Capital Investment</h3>
                    <p class="text-slate-500 font-light leading-relaxed text-base">Strategic, long-term capital
                        deployment in high-yield energy assets.</p>
                </div>
                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 450ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="check-square" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4 font-display text-slate-900">Governance Standards</h3>
                    <p class="text-slate-500 font-light leading-relaxed text-base">Commitment to transparency,
                        integrity, and strict regulatory compliance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Energy Delivery Models Section -->
    <section class="py-40 bg-white">
        <div class="container mx-auto px-6">
            <h2 class="text-5xl font-display font-bold text-center mb-24 reveal text-slate-900">Energy <span
                    class="text-brand-green">Delivery Models</span></h2>
            <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <!-- Virtual Net Metering -->
                <div class="glass-card rounded-3xl overflow-hidden reveal border-brand-green/10 flex flex-col">
                    <div class="p-8 border-b border-slate-50 bg-slate-50/30">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                            <i data-lucide="map" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Virtual Net Metering (VNM)</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-sm">Energy generated at a centralized
                            solar-park site and adjusted against consumption at a distant secondary location.</p>
                    </div>
                </div>

                <!-- Group Net Metering -->
                <div class="glass-card rounded-3xl overflow-hidden reveal border-brand-green/10 flex flex-col"
                    style="transition-delay: 150ms">
                    <div class="p-8 border-b border-slate-50 bg-slate-50/30">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                            <i data-lucide="users" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Group Net Metering (GNM)</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-sm">A shared energy model where
                            generation
                            from a single solar asset is adjusted across multiple grouped connections.</p>
                    </div>
                </div>

                <!-- Captive Model -->
                <div class="glass-card rounded-3xl overflow-hidden reveal border-brand-green/10 flex flex-col"
                    style="transition-delay: 300ms">
                    <div class="p-8 border-b border-slate-50 bg-slate-50/30">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                            <i data-lucide="zap" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Captive Model</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-sm">A solar power model where the
                            consumer
                            holds equity ownership in the generating asset and directly consumes its output.</p>
                    </div>
                </div>

                <!-- Group Captive Model -->
                <div class="glass-card rounded-3xl overflow-hidden reveal border-brand-green/10 flex flex-col"
                    style="transition-delay: 450ms">
                    <div class="p-8 border-b border-slate-50 bg-slate-50/30">
                        <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                            <i data-lucide="shield" class="text-brand-green w-7 h-7"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Group Captive Model</h3>
                        <p class="text-slate-500 font-light leading-relaxed text-sm">A shared ownership model where
                            multiple
                            consumers jointly own a solar asset and collectively consume its generated power.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 2 ΓÇô Renewable Energy Overview -->
    <section class="py-40 bg-white" id="renewable-overview">
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
                        <button class="energy-tab active px-8 py-3 rounded-full font-medium transition-all duration-300"
                            data-tab="vnm">
                            VNM
                        </button>
                        <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300"
                            data-tab="gnm">
                            GNM
                        </button>
                        <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300"
                            data-tab="captive">
                            Captive
                        </button>
                        <button class="energy-tab px-8 py-3 rounded-full font-medium transition-all duration-300"
                            data-tab="group-captive">
                            Group Captive
                        </button>
                    </div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content-container">
                    <!-- VNM Content -->
                    <div class="tab-content active" id="vnm">
                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div
                                    class="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                                    <i data-lucide="map" class="text-brand-green w-10 h-10"></i>
                                </div>
                                <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Virtual Net Metering
                                    (VNM)</h3>
                                <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                    Energy is generated at a centralized solar park and virtually credited to your
                                    consumption
                                    point, regardless of physical distance.
                                </p>
                                <div class="space-y-4">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Location:</strong> Remote solar park facility
                                        </p>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Best For:</strong> Businesses without suitable
                                            rooftop space</p>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Energy Flow:</strong> Virtual credit
                                            adjustment via utility</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                <svg class="w-full h-64" viewBox="0 0 400 300" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="30" y="100" width="100" height="80" fill="#8DC63F" opacity="0.3"
                                        stroke="#008244" stroke-width="2" />
                                    <text x="80" y="150" text-anchor="middle" class="text-xs" fill="#008244">Solar
                                        Park</text>
                                    <rect x="270" y="100" width="100" height="80" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <text x="320" y="150" text-anchor="middle" class="text-xs" fill="#64748b">Your
                                        Building</text>
                                    <path d="M130 140 L270 140" stroke="#fbbf24" stroke-width="2"
                                        stroke-dasharray="5,5" />
                                    <text x="200" y="130" text-anchor="middle" class="text-xs" fill="#fbbf24">Virtual
                                        Credit</text>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- GNM Content -->
                    <div class="tab-content" id="gnm">
                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div
                                    class="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                                    <i data-lucide="users" class="text-brand-green w-10 h-10"></i>
                                </div>
                                <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Group Net Metering (GNM)
                                </h3>
                                <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                    A shared energy model where multiple connections within the same organization
                                    benefit
                                    from a single centralized solar installation.
                                </p>
                                <div class="space-y-4">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Location:</strong> Centralized solar park</p>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Best For:</strong> Multi-site organizations or
                                            campuses</p>
                                    </div>
                                    <div class="flex items-start space-x-3">
                                        <div class="w-2 h-2 rounded-full bg-brand-green mt-2"></div>
                                        <p class="text-slate-600"><strong>Energy Flow:</strong> Distributed across
                                            grouped connections</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                <svg class="w-full h-64" viewBox="0 0 400 300" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="30" y="120" width="80" height="60" fill="#8DC63F" opacity="0.3"
                                        stroke="#008244" stroke-width="2" />
                                    <text x="70" y="155" text-anchor="middle" class="text-xs" fill="#008244">Solar
                                        Park</text>
                                    <rect x="200" y="50" width="60" height="50" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <rect x="200" y="125" width="60" height="50" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <rect x="200" y="200" width="60" height="50" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <path d="M110 150 L200 75" stroke="#fbbf24" stroke-width="2" />
                                    <path d="M110 150 L200 150" stroke="#fbbf24" stroke-width="2" />
                                    <path d="M110 150 L200 225" stroke="#fbbf24" stroke-width="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Captive Model Content -->
                    <div class="tab-content" id="captive">
                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div
                                    class="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                                    <i data-lucide="zap" class="text-brand-green w-10 h-10"></i>
                                </div>
                                <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Captive Model</h3>
                                <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                    A dedicated solar power model where the consumer directly owns the solar asset and
                                    consumes the majority of the electricity produced.
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
                                <svg class="w-full h-64" viewBox="0 0 400 300" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="50" y="80" width="120" height="100" fill="#8DC63F" opacity="0.3"
                                        stroke="#008244" stroke-width="2" />
                                    <rect x="250" y="80" width="100" height="100" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <path d="M170 130 L250 130" stroke="#fbbf24" stroke-width="4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Group Captive Model Content -->
                    <div class="tab-content" id="group-captive">
                        <div class="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div
                                    class="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                                    <i data-lucide="shield" class="text-brand-green w-10 h-10"></i>
                                </div>
                                <h3 class="text-4xl font-display font-bold mb-6 text-slate-900">Group Captive Model</h3>
                                <p class="text-lg text-slate-600 leading-relaxed mb-6">
                                    A collaborative ownership model where multiple consumers jointly invest in and
                                    benefit from a centralized solar power facility.
                                </p>
                            </div>
                            <div class="bg-slate-50 rounded-3xl p-12 flex items-center justify-center">
                                <svg class="w-full h-64" viewBox="0 0 400 300" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect x="50" y="100" width="100" height="80" fill="#8DC63F" opacity="0.3"
                                        stroke="#008244" stroke-width="2" />
                                    <rect x="250" y="50" width="60" height="40" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <rect x="250" y="120" width="60" height="40" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <rect x="250" y="190" width="60" height="40" fill="#f1f5f9" stroke="#64748b"
                                        stroke-width="2" />
                                    <path d="M150 140 L250 70" stroke="#fbbf24" stroke-width="2" />
                                    <path d="M150 140 L250 140" stroke="#fbbf24" stroke-width="2" />
                                    <path d="M150 140 L250 210" stroke="#fbbf24" stroke-width="2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 3 ΓÇô Our Renewable Solutions -->
    <section class="py-40 bg-slate-50/50" id="renewable-solutions">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto text-center mb-24">
                <h2 class="text-5xl font-display font-bold mb-8 reveal text-slate-900">Our <span
                        class="text-brand-green">Renewable Solutions</span></h2>
                <p class="text-xl text-slate-600 font-normal reveal">Specialized infrastructure for a sustainable
                    future.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="leaf" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Sustainable Future</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Renewable solar energy is a truly sustainable
                        source that reduces greenhouse gas emissions and improves global air quality.</p>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 100ms">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="shield-check" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Energy Security</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Enhance national and local energy security by
                        reducing dependence on external fuels and localized production.</p>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 200ms">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="trending-down" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Cost Effective</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Solar energy is increasingly cost-effective,
                        providing long-term reduction in electrical expenditure for all sectors.</p>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 300ms">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="heart" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Public Health</h3>
                    <p class="text-slate-500 font-light leading-relaxed">By choosing clean energy, we contribute to
                        better air quality and improved public health outcomes globally.</p>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 400ms">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="briefcase" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Job Creation</h3>
                    <p class="text-slate-500 font-light leading-relaxed">The renewable transition creates thousands of
                        specialized jobs in development, management, and maintenance.</p>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 500ms">
                    <div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-8">
                        <i data-lucide="cpu" class="text-brand-green w-8 h-8"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4 font-display text-slate-900">Operational Excellence</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Our advanced monitoring systems ensure peak
                        performance and minimal maintenance throughout the asset lifecycle.</p>
                </div>
            </div>

            <!-- Policy & Eligibility Sub-section -->
            <div class="max-w-4xl mx-auto mt-32">
                <h3 class="text-4xl font-display font-bold mb-16 text-center reveal text-slate-900">Policy & <span
                        class="text-brand-green">Eligibility</span></h3>

                <div class="space-y-6">
                    <div class="glass-card p-8 rounded-2xl reveal">
                        <h4 class="text-xl font-bold mb-3">Who can participate?</h4>
                        <p class="text-slate-500 font-light leading-relaxed">Our models are designed for multiple
                            consumer categories, ranging from residential complexes to large-scale utility and
                            industrial sectors.</p>
                    </div>
                    <div class="glass-card p-8 rounded-2xl reveal" style="transition-delay: 150ms">
                        <h4 class="text-xl font-bold mb-3">Capacity Range</h4>
                        <p class="text-slate-500 font-light leading-relaxed">Systems can vary significantly in scale,
                            typically ranging from 1 kW installations up to utility-scale limits depending on the
                            participation model.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 4 ΓÇô Why Choose KDIA -->
    <section class="py-40 bg-white" id="why-kdia">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto text-center mb-24">
                <h2 class="text-5xl font-display font-bold mb-8 reveal text-slate-900">Why <span
                        class="text-brand-green">Choose KDIA</span></h2>
                <p class="text-xl text-slate-600 font-normal reveal">Key differentiators that set our solar-park
                    infrastructure apart.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                <div class="reveal flex flex-col items-center text-center">
                    <i data-lucide="zap" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Higher Energy Yield</h4>
                    <p class="text-slate-500 font-light">Optimized positioning and industrial-grade hardware drive
                        superior generation capacity.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center" style="transition-delay: 100ms">
                    <i data-lucide="coins" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Cost Performance</h4>
                    <p class="text-slate-500 font-light">Economies of scale significantly reduce the per-watt cost of
                        clean energy infrastructure.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center" style="transition-delay: 200ms">
                    <i data-lucide="settings" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Centralized Ops</h4>
                    <p class="text-slate-500 font-light">Professional, round-the-clock maintenance ensures maximum
                        uptime and performance monitoring.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center" style="transition-delay: 300ms">
                    <i data-lucide="activity" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Reliable Supply</h4>
                    <p class="text-slate-500 font-light">Infrastructure-grade distribution ensures a stable and
                        resilient energy flow to all connections.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center" style="transition-delay: 400ms">
                    <i data-lucide="lock" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Price Security</h4>
                    <p class="text-slate-500 font-light">Secure long-term energy pricing, protecting your organization
                        from utility tariff inflation.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center" style="transition-delay: 500ms">
                    <i data-lucide="monitor" class="text-brand-green w-10 h-10 mb-6"></i>
                    <h4 class="text-xl font-bold mb-4">Live Monitoring</h4>
                    <p class="text-slate-500 font-light">Advanced AI dashboards provide real-time transparency into your
                        portfolio's performance.</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="py-20 border-t border-slate-50">
        <div class="container mx-auto px-6 text-center">
            <div class="flex justify-center space-x-12 mb-10 text-slate-400 font-medium">
                <a href="about.php" class="hover:text-brand-green transition-colors">Company & Energy Solutions</a>
                <a href="contact.php" class="hover:text-brand-green transition-colors">Contact</a>
            </div>
            <p class="text-slate-400 text-sm tracking-widest uppercase">&copy; 2024 Kdia Re Park. All rights reserved.
            </p>
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
                Hello! IΓÇÖm here to help you understand clean energy solutions and KDIA Re ParkΓÇÖs offerings. How can I
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
</body>

</html>
