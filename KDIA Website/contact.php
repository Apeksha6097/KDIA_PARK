<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us | Kdia Re Park</title>
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

                <a href="contact.php" class="text-brand-green font-bold">Contact Us</a>
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

    <section class="pt-64 pb-32 relative">
        <div class="container mx-auto px-6 relative z-10">
            <div class="grid lg:grid-cols-2 gap-20">
                <div class="reveal">
                    <h1
                        class="text-6xl md:text-8xl font-display font-bold text-center mb-8 reveal tracking-tight text-slate-900">
                        Get in <span class="text-brand-green">Touch.</span></h1>
                    <p class="text-2xl text-slate-600 text-center mb-24 font-normal max-w-4xl mx-auto reveal">Ready to
                        switch to clean energy? Our experts are here to help you design the perfect solar solution.</p>

                    <div class="space-y-8">
                        <div class="flex items-start space-x-6 group">
                            <div
                                class="w-12 h-12 bg-brand-green/10 group-hover:bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                <i data-lucide="mail" class="text-brand-green"></i>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold">Email Us</h4>
                                <p class="text-slate-500 font-light">info@kdiarepark.com</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-6 group">
                            <div
                                class="w-12 h-12 bg-brand-green/10 group-hover:bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                <i data-lucide="phone" class="text-brand-green"></i>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold">Call Us</h4>
                                <p class="text-slate-500 font-light">+1 (800) KDIA-RE</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-6 group">
                            <div
                                class="w-12 h-12 bg-brand-green/10 group-hover:bg-brand-green/20 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                <i data-lucide="map-pin" class="text-brand-green"></i>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold">Global Headquarters</h4>
                                <p class="text-slate-500 font-light">Solar Plaza, Innovation Drive, Green Valley</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-card p-10 rounded-3xl reveal border-brand-green/10" style="transition-delay: 200ms">
                    <form class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium mb-3 text-slate-600">Full Name</label>
                                <input type="text"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-4 focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                                    placeholder="John Doe">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-3 text-slate-600">Email Address</label>
                                <input type="email"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-4 focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                                    placeholder="john@example.com">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-3 text-slate-600">Project Type</label>
                            <input type="text"
                                class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-4 focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                                placeholder="Industrial Solar Farm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-3 text-slate-600">Inquiry Details</label>
                            <textarea rows="4"
                                class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-4 focus:border-brand-green outline-none transition-all placeholder:text-slate-300"
                                placeholder="How can we help power your future?"></textarea>
                        </div>
                        <button type="button"
                            class="w-full py-5 brand-gradient-bg text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(141,198,63,0.4)] transition-all">Submit
                            Inquiry</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Integration -->
    <section class="py-40 bg-slate-50/50">
        <div class="container mx-auto px-6">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-5xl font-display font-bold mb-6 reveal text-slate-900">
                        Our <span class="text-brand-green">Locations</span>
                    </h2>
                    <p class="text-xl text-slate-600 font-normal reveal">
                        Our solar parks operate across multiple regions, delivering clean energy infrastructure at scale
                    </p>
                </div>

                <div class="grid lg:grid-cols-3 gap-8 mb-12">
                    <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10">
                        <i data-lucide="map-pin" class="text-brand-green w-10 h-10 mb-4"></i>
                        <h4 class="text-xl font-bold mb-3">Regional Coverage</h4>
                        <p class="text-slate-600 font-light leading-relaxed">
                            Strategic solar park locations across key energy markets
                        </p>
                    </div>
                    <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10"
                        style="transition-delay: 100ms">
                        <i data-lucide="zap" class="text-brand-green w-10 h-10 mb-4"></i>
                        <h4 class="text-xl font-bold mb-3">Grid Connectivity</h4>
                        <p class="text-slate-600 font-light leading-relaxed">
                            Direct integration with utility infrastructure for reliable distribution
                        </p>
                    </div>
                    <div class="glass-card p-8 rounded-3xl reveal border-brand-green/10"
                        style="transition-delay: 200ms">
                        <i data-lucide="activity" class="text-brand-green w-10 h-10 mb-4"></i>
                        <h4 class="text-xl font-bold mb-3">24/7 Monitoring</h4>
                        <p class="text-slate-600 font-light leading-relaxed">
                            Real-time performance tracking across all operational sites
                        </p>
                    </div>
                </div>

                <!-- Embedded Map -->
                <div class="reveal rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                    <iframe
                        src="https://www.openstreetmap.org/export/embed.html?bbox=77.5%2C28.4%2C77.7%2C28.6&layer=mapnik"
                        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade" class="grayscale-[20%]">
                    </iframe>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-40 bg-white">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-5xl font-display font-bold mb-6 reveal text-slate-900">
                        Frequently Asked <span class="text-brand-green">Questions</span>
                    </h2>
                    <p class="text-xl text-slate-600 font-normal reveal">
                        Quick answers to common questions about solar energy models
                    </p>
                </div>

                <div class="space-y-4">
                    <!-- FAQ Item 1 -->
                    <div class="faq-item reveal">
                        <button class="faq-question">
                            <span>How does Virtual Net Metering (VNM) work?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                VNM allows you to own or lease a share of a remote solar park. The energy generated is
                                virtually credited to your electricity bill, regardless of the physical distance between
                                the solar park and your consumption point. This model is ideal for businesses without
                                suitable rooftop space or those seeking economies of scale.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 2 -->
                    <div class="faq-item reveal" style="transition-delay: 100ms">
                        <button class="faq-question">
                            <span>What is the difference between VNM and GNM?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                VNM (Virtual Net Metering) credits energy from a solar park to a single consumption
                                point, while GNM (Group Net Metering) distributes energy from one solar installation
                                across multiple grouped connections within the same organization. GNM is perfect for
                                multi-site businesses or campuses.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 3 -->
                    <div class="faq-item reveal" style="transition-delay: 200ms">
                        <button class="faq-question">
                            <span>Who is eligible for solar energy programs?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                Eligibility varies by region and utility provider. Generally, residential, commercial,
                                and industrial consumers with active electricity connections can participate. For VNM
                                and GNM, you'll need to be within the same utility distribution area as the solar park.
                                Contact us for a detailed eligibility assessment.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 4 -->
                    <div class="faq-item reveal" style="transition-delay: 300ms">
                        <button class="faq-question">
                            <span>Who handles maintenance and monitoring?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                KDIA Re Park manages all maintenance, monitoring, and operational responsibilities for
                                our solar parks. Our professional O&M team ensures maximum uptime through 24/7
                                monitoring, predictive maintenance, and rapid response protocols. You simply enjoy the
                                energy credits without any operational burden.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 5 -->
                    <div class="faq-item reveal" style="transition-delay: 400ms">
                        <button class="faq-question">
                            <span>What is the typical installation timeline?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                For VNM/GNM models, since you're connecting to an existing solar park, the timeline is
                                significantly shorter than traditional installations. After initial consultation and
                                agreement signing, energy credits typically begin within 4-8 weeks, subject to utility
                                approvals and grid connection procedures.
                            </p>
                        </div>
                    </div>

                    <!-- FAQ Item 6 -->
                    <div class="faq-item reveal" style="transition-delay: 500ms">
                        <button class="faq-question">
                            <span>How are savings calculated and verified?</span>
                            <i data-lucide="chevron-down" class="faq-icon w-5 h-5 text-brand-green"></i>
                        </button>
                        <div class="faq-answer">
                            <p class="text-slate-600 leading-relaxed">
                                Savings are calculated based on the energy generated by your allocated solar capacity
                                and credited against your utility consumption at the prevailing tariff rate. All energy
                                generation is metered and verified by utility-grade equipment, with transparent monthly
                                statements showing generation, credits, and net savings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

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
</body>

</html>