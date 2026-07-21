<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kdia Re Park | Sustainable Solar Solutions</title>
    <meta name="description" content="Sustainable, clean, and futuristic solar energy infrastructure by Kdia Re Park.">

    <!-- Preconnect & Fonts Preload -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Preload Logo -->
    <link rel="preload" as="image" href="assets/images/logo.webp">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            green: '#8DC63F',
                            dark: '#008244',
                        },
                        charcoal: '#0e1111',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Custom Styles -->
    <link rel="stylesheet" href="assets/css/styles.css">

    <!-- CDNs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js" defer></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    
    <!-- Language Switcher -->
    <script src="assets/js/translate.php?v=1.0.1" defer></script>
</head>

<body class="bg-white text-slate-900 selection:bg-brand-green/30">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 py-8 transition-all duration-500">
        <div class="container mx-auto px-6 flex justify-between items-center">
            <a href="index.php" class="flex items-center space-x-3">
                <img src="assets/images/logo.webp" alt="KDIA RE PARK" class="h-10 w-auto" width="150" height="40">
            </a>
            <div class="hidden md:flex items-center space-x-12 text-slate-600 font-medium">
                <a href="index.php" class="text-brand-green">Home</a>
                <a href="about.php" class="hover:text-brand-green transition-colors">Company & Energy Solutions</a>

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

    <section class="relative flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden bg-white">
        <!-- Global atmospheric particles (very low density) -->
        <div id="tsparticles" class="absolute inset-0 pointer-events-none opacity-20"></div>

        <div class="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <!-- Headline above sun -->
            <div class="max-w-4xl mx-auto mt-10 md:mt-12">
                <h1
                    class="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight text-slate-900 mb-4 opacity-1">
                    Powering Tomorrow
                </h1>
                <p class="text-2xl md:text-3xl text-slate-500 font-light opacity-1">with Clean Energy</p>
            </div>

            <!-- Centered Sun & Localized Particles -->
            <div class="relative w-[700px] h-[700px] flex items-center justify-center opacity-0"
                id="hero-sun-container">
                <!-- Localized particles container - extended left and right -->
                <div id="sun-particles" class="absolute -left-20 -right-20 inset-y-0 md:-left-36 md:-right-36 pointer-events-none z-0"></div>

                <!-- Solar sun anchor -->
                <div class="solar-element-centered"></div>
                <div class="radiating-glow-centered"></div>
            </div>

            <!-- Support text -->
            <div class="max-w-2xl mx-auto mt-16">
                <p class="text-xl md:text-2xl text-slate-500 leading-relaxed reveal font-normal mb-8">
                    KDIA Re Park is a renewable infrastructure platform focused on long-term solar energy ownership.
                </p>

                <div class="flex flex-wrap justify-center gap-5">
                    <button id="apply-modal-btn" class="px-8 py-3.5 brand-gradient-bg text-white rounded-full font-bold text-lg shadow-lg hover:shadow-[0_20px_40px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-0.5">
                        Apply for Solar Subscription
                    </button>
                    <a href="about.php#solutions" class="px-8 py-3.5 bg-white text-brand-green border-2 border-brand-green rounded-full font-bold text-lg hover:shadow-[0_20px_40px_rgba(141,198,63,0.2)] transition-all transform hover:-translate-y-0.5">
                        Explore Our Solutions
                    </a>
                </div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <!--<div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 animate-bounce">-->
        <!--    <span class="text-sm text-slate-500 mb-2 font-medium">Scroll to explore</span>-->
        <!--    <i data-lucide="chevron-down" class="text-slate-400 w-6 h-6"></i>-->
        <!--</div>-->
    </section>

    <!-- Infrastructure Banner Section -->
    <section class="relative h-[540px] md:h-[620px] overflow-hidden bg-slate-900 flex items-center justify-center">
        <div class="absolute inset-0 z-0">
            <img src="assets/images/solar1_opt.webp" alt="Solar Infrastructure" class="w-full h-full object-cover object-center" width="1920" height="800" loading="lazy">
            <div class="absolute inset-0 bg-slate-900/20"></div>
        </div>
        <div class="container mx-auto px-6 relative z-10 text-center">
            <h2 class="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
                Infrastructure Excellence for <br class="hidden sm:inline">
                <span class="text-brand-green">Long-Term Reliability.</span>
            </h2>
        </div>
    </section>

    <!-- Mr. Nitin Kedia Section -->
    <section class="pt-16 pb-8 bg-white relative">
        <div class="container mx-auto px-6">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                <!-- Text Left -->
                <div class="reveal flex flex-col justify-center">
                    <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Founder &amp; Director</span>
                    <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mt-2 mb-6 border-l-4 border-brand-green pl-4">Mr. Nitin Kedia</h2>
                    <p class="text-lg md:text-xl text-slate-600 font-light leading-relaxed text-left mb-6">
                        Mr. Nitin Kedia is an accomplished entrepreneur with extensive business experience in leading large-scale industrial projects. Throughout his professional experience and leadership journey, he has successfully steered multiple infrastructure ventures, achieving remarkable growth and establishing a culture of excellence.
                    </p>
                    <p class="text-lg md:text-xl text-slate-600 font-light leading-relaxed text-left">
                        His significant contribution to the organization is anchored in his commitment to quality, responsible decision-making, customer-centric development, and sustainable growth. Through transparent leadership and hands-on governance, he continues to shape KDIA RE Park as a reliable and future-ready energy partner.
                    </p>
                </div>
                <!-- Portrait Image Right -->
                <div class="reveal flex justify-center items-center">
                    <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 max-w-[420px] w-full h-[450px] bg-amber-400/10">
                        <img src="assets/images/nitin_kedia1.jpg" alt="Mr. Nitin Kedia" class="w-full h-full object-cover object-top block" width="420" height="450" loading="lazy">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mr. Nitin Kedia – Solar Vision Section -->
    <section class="pt-8 pb-16 bg-slate-50 relative overflow-hidden">
        <div class="container mx-auto px-6 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                <!-- Portrait Image Left -->
                <div class="reveal flex justify-center items-center order-2 lg:order-1">
                    <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 max-w-[420px] w-full h-[450px]">
                        <img src="assets/images/nitin_kedia2.jpg" alt="Mr. Nitin Kedia – Solar Vision" class="w-full h-full object-cover object-top block" width="420" height="450" loading="lazy">
                    </div>
                </div>
                <!-- Text Right -->
                <div class="reveal order-1 lg:order-2 flex flex-col justify-center">
                    <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Vision &amp; Future Strategy</span>
                    <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mt-2 mb-6 border-l-4 border-brand-green pl-4">Director's Vision</h2>
                    <p class="text-lg md:text-xl text-slate-600 font-light leading-relaxed text-left mb-6">
                        The Director's Vision for KDIA RE Park is anchored in accelerating the global transition to renewable and clean energy. He envisions a future where clean energy solutions are accessible, reliable, and integrated seamlessly into regional power grids, industrial hubs, and transport networks.
                    </p>
                    <p class="text-lg md:text-xl text-slate-600 font-light leading-relaxed text-left">
                        By creating accessible and future-ready clean energy infrastructure, KDIA is driving local economic resilience. This reflects our long-term commitment to innovation, sustainability, and responsible development, laying the groundwork for a cleaner, greener India for generations to come.
                    </p>
                </div>
            </div>
        </div>
    </section>


    <!-- Vision for Solar Section -->
    <section class="py-24 bg-slate-50 relative overflow-hidden">
        <div class="container mx-auto px-6 relative z-10">
            <div class="max-w-4xl mx-auto text-center mb-16">
                <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Our Focus</span>
                <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mt-2">Vision for Solar</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <!-- Clean Energy -->
                <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10 bg-white">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="sun" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-display">Clean Energy</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Scaling high-efficiency solar arrays to offset fossil reliance entirely.</p>
                </div>
                <!-- EV Infrastructure -->
                <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 150ms">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="zap" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-display">EV Infrastructure</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Integrating solar power grids directly into electric vehicle charging systems.</p>
                </div>
                <!-- Renewable Future -->
                <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10 bg-white" style="transition-delay: 300ms">
                    <div class="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="leaf" class="text-brand-green w-6 h-6"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-3 font-display">Renewable Future</h3>
                    <p class="text-slate-500 font-light leading-relaxed">Decentralizing power generation to provide long-term grid independence.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Short Renewable Energy Section -->
    <section class="py-24 bg-white relative">
        <div class="container mx-auto px-6">
            <div class="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
                <div class="reveal">
                    <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Energy Transition</span>
                    <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mt-2 mb-6">Renewable Solar Solutions</h2>
                    <p class="text-lg text-slate-500 font-light leading-relaxed mb-8">
                        Clean solar energy provides zero-emission power that protects your operations from rising utility tariffs. KDIA builds and manages optimized solar park systems to deliver immediate savings.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="shield-check" class="text-brand-green w-5 h-5 shrink-0"></i>
                            <span class="text-slate-700 font-medium">Guaranteed Carbon Offsets</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i data-lucide="trending-down" class="text-brand-green w-5 h-5 shrink-0"></i>
                            <span class="text-slate-700 font-medium">Direct Utility Savings</span>
                        </div>
                    </div>
                </div>
                <div class="reveal rounded-3xl overflow-hidden shadow-2xl relative group" style="transition-delay: 200ms">
                    <img src="assets/images/solar2_opt.webp" alt="Solar Panels" class="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-105" width="600" height="320" loading="lazy">
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose KDIA Section -->
    <section class="py-24 bg-slate-50 relative" id="why-kdia">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto text-center mb-16">
                <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Our Advantage</span>
                <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mt-2 mb-4">Why <span class="text-brand-green">Choose KDIA</span></h2>
                <p class="text-xl text-slate-500 font-light leading-relaxed">Key differentiators that set our solar-park infrastructure apart.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="zap" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Higher Energy Yield</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Optimized positioning and industrial-grade hardware drive superior generation capacity.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10" style="transition-delay: 100ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="coins" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Cost Performance</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Economies of scale significantly reduce the per-watt cost of clean energy infrastructure.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10" style="transition-delay: 200ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="settings" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Centralized Ops</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Professional, round-the-clock maintenance ensures maximum uptime and performance monitoring.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10" style="transition-delay: 300ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="activity" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Reliable Supply</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Infrastructure-grade distribution ensures a stable and resilient energy flow to all connections.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10" style="transition-delay: 400ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="lock" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Price Security</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Secure long-term energy pricing, protecting your organization from utility tariff inflation.</p>
                </div>
                <div class="reveal flex flex-col items-center text-center glass-card p-8 rounded-3xl bg-white border border-brand-green/10" style="transition-delay: 500ms">
                    <div class="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6">
                        <i data-lucide="monitor" class="text-brand-green w-7 h-7"></i>
                    </div>
                    <h4 class="text-xl font-bold mb-3 font-display">Live Monitoring</h4>
                    <p class="text-slate-500 font-light leading-relaxed">Advanced AI dashboards provide real-time transparency into your portfolio's performance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-white relative">
        <div class="container mx-auto px-6 text-center">
            <div class="max-w-3xl mx-auto">
                <h2 class="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Start Your Clean Energy Journey</h2>
                <p class="text-xl text-slate-500 font-light leading-relaxed mb-10">
                    Subscribe to a shared solar park or allocate EV charging infrastructure on your property today.
                </p>
                <div class="flex flex-wrap justify-center gap-6">
                    <button id="apply-modal-btn" class="px-8 py-3.5 brand-gradient-bg text-white rounded-full font-bold shadow-lg hover:shadow-[0_20px_40px_rgba(251,191,36,0.2)] transition-all transform hover:-translate-y-0.5">
                        Apply for Solar Subscription
                    </button>
                    <a href="contact.php" class="px-8 py-3.5 bg-white text-brand-green border-2 border-brand-green rounded-full font-bold hover:shadow-[0_20px_40px_rgba(141,198,63,0.2)] transition-all transform hover:-translate-y-0.5">
                        Contact Our Experts
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Minimal Footer -->

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

    <!-- Application Modal -->
    <div id="application-modal" class="modal-overlay">
        <div class="modal-container">
            <!-- Modal Header -->
            <div class="modal-header">
                <div>
                    <h3 class="text-2xl font-display font-bold text-slate-900">Apply for Solar Subscription</h3>
                    <p class="text-sm text-slate-500 mt-1">Join the clean energy revolution</p>
                </div>
                <button id="close-modal" class="modal-close-btn">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <!-- Progress Indicator -->
            <div class="modal-progress">
                <div class="progress-step active" data-step="1">
                    <div class="progress-circle">1</div>
                    <span class="progress-label">Basic Info</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step" data-step="2">
                    <div class="progress-circle">2</div>
                    <span class="progress-label">Property</span>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step" data-step="3">
                    <div class="progress-circle">3</div>
                    <span class="progress-label">Details</span>
                </div>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">
                <!-- Step 1: Basic Information -->
                <div class="form-step active" data-step="1">
                    <h4 class="text-xl font-bold text-slate-900 mb-6">Basic Information</h4>

                    <div class="form-group">
                        <label for="full-name" class="form-label">Full Name <span class="text-red-500">*</span></label>
                        <input type="text" id="full-name" class="form-input" placeholder="Enter your full name"
                            required>
                        <span class="error-message" id="full-name-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="mobile" class="form-label">Mobile Number <span class="text-red-500">*</span></label>
                        <input type="tel" id="mobile" class="form-input" placeholder="10-digit mobile number"
                            maxlength="10" required>
                        <span class="error-message" id="mobile-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Email Address <span class="text-red-500">*</span></label>
                        <input type="email" id="email" class="form-input" placeholder="your.email@example.com" required>
                        <span class="error-message" id="email-error"></span>
                    </div>
                </div>

                <!-- Step 2: Property Details -->
                <div class="form-step" data-step="2">
                    <h4 class="text-xl font-bold text-slate-900 mb-6">Property Details</h4>

                    <div class="form-group">
                        <label class="form-label">Property Type <span class="text-red-500">*</span></label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="property-type" value="Residential" required>
                                <span class="radio-label">
                                    <i data-lucide="home" class="w-5 h-5"></i>
                                    Residential
                                </span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="property-type" value="Commercial" required>
                                <span class="radio-label">
                                    <i data-lucide="building-2" class="w-5 h-5"></i>
                                    Commercial
                                </span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="property-type" value="Industrial" required>
                                <span class="radio-label">
                                    <i data-lucide="factory" class="w-5 h-5"></i>
                                    Industrial
                                </span>
                            </label>
                        </div>
                        <span class="error-message" id="property-type-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="address" class="form-label">Address <span class="text-red-500">*</span></label>
                        <textarea id="address" class="form-input" rows="3" placeholder="Enter complete address"
                            required></textarea>
                        <span class="error-message" id="address-error"></span>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="city" class="form-label">City <span class="text-red-500">*</span></label>
                            <input type="text" id="city" class="form-input" placeholder="City" required>
                            <span class="error-message" id="city-error"></span>
                        </div>
                        <div class="form-group">
                            <label for="state" class="form-label">State <span class="text-red-500">*</span></label>
                            <input type="text" id="state" class="form-input" placeholder="State" required>
                            <span class="error-message" id="state-error"></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pincode" class="form-label">Pincode <span class="text-red-500">*</span></label>
                        <input type="text" id="pincode" class="form-input" placeholder="6-digit pincode" maxlength="6"
                            required>
                        <span class="error-message" id="pincode-error"></span>
                    </div>
                </div>

                <!-- Step 3: Personal & Referral Details -->
                <div class="form-step" data-step="3">
                    <h4 class="text-xl font-bold text-slate-900 mb-6">Personal & Referral Details</h4>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="dob" class="form-label">Date of Birth <span
                                    class="text-red-500">*</span></label>
                            <input type="date" id="dob" class="form-input" required>
                            <span class="error-message" id="dob-error"></span>
                        </div>
                        <div class="form-group">
                            <label for="gender" class="form-label">Gender</label>
                            <select id="gender" class="form-input">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Vendor Preference <span class="text-red-500">*</span></label>
                        <div class="radio-group-vertical">
                            <label class="radio-option-vertical">
                                <input type="radio" name="vendor-preference" value="have-vendor" required>
                                <span class="radio-label-vertical">
                                    <strong>I have a KDIA Re Park vendor</strong>
                                    <small class="text-slate-500">Enter your vendor's name or code below</small>
                                </span>
                            </label>
                            <div id="vendor-input-container" class="vendor-input-container hidden">
                                <input type="text" id="vendor-code" class="form-input"
                                    placeholder="Enter Vendor Name or Code">
                                <span class="error-message" id="vendor-code-error"></span>
                            </div>

                            <label class="radio-option-vertical">
                                <input type="radio" name="vendor-preference" value="assign-vendor" required>
                                <span class="radio-label-vertical">
                                    <strong>Assign a vendor to me</strong>
                                    <small class="text-slate-500">KDIA Re Park will assign a qualified vendor to assist
                                        you</small>
                                </span>
                            </label>
                        </div>
                        <span class="error-message" id="vendor-preference-error"></span>
                    </div>

                    <div class="form-group">
                        <label class="consent-checkbox">
                            <input type="checkbox" id="consent" required>
                            <span class="consent-text">
                                I agree to be contacted by KDIA Re Park via call, SMS, or email. <span
                                    class="text-red-500">*</span>
                            </span>
                        </label>
                        <span class="error-message" id="consent-error"></span>
                    </div>
                </div>

                <!-- Success State -->
                <div class="form-step success-state" data-step="success">
                    <div class="success-icon">
                        <i data-lucide="check-circle" class="w-20 h-20 text-brand-green"></i>
                    </div>
                    <h4 class="text-2xl font-bold text-slate-900 mb-4">Application Submitted Successfully!</h4>
                    <p class="text-lg text-slate-600 mb-6">
                        Thank you for your interest in KDIA Re Park's solar subscription program.
                    </p>
                    <p class="text-slate-500">
                        A KDIA Re Park representative will contact you soon to discuss your clean energy journey.
                    </p>
                    <button id="close-success-btn" class="btn-primary mt-8">
                        Close
                    </button>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer" id="modal-footer">
                <button type="button" id="prev-btn" class="btn-secondary" disabled>
                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    Previous
                </button>
                <button type="button" id="next-btn" class="btn-primary">
                    Next
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    </div>

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
</body>

</html>