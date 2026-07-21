<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms & Conditions | Kdia Re Park</title>
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

                <!-- Re-Culator Link -->
                <a href="re-culator.php"
                    class="flex items-center space-x-2 hover:text-brand-green transition-colors relative group">
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

    <!-- Main Content Section -->
    <section class="pt-48 pb-32 relative bg-gradient-to-br from-slate-50 to-white">
        <div class="container mx-auto px-6 relative z-10 max-w-4xl">
            <div class="reveal">
                <span class="text-brand-green font-bold uppercase tracking-wider text-sm">Legal & Compliance</span>
                <h1 class="text-5xl md:text-6xl font-display font-bold text-slate-900 mt-2 mb-8">Terms &amp; Conditions</h1>
                <p class="text-xl text-slate-600 font-light leading-relaxed mb-12">
                    Welcome to the KDIA RE Park website. By accessing and using our platform, online calculators, and registration services, you agree to follow and be bound by these Terms &amp; Conditions.
                </p>
            </div>

            <div class="space-y-10 reveal" style="transition-delay: 150ms">
                <!-- Section 1 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">1. Acceptance of Terms</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        By accessing and using the KDIA RE Park website, users agree to follow and be bound by these Terms &amp; Conditions, as well as all applicable laws and regulations.
                    </p>
                </div>

                <!-- Section 2 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">2. Website Usage</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        This website must only be used for lawful purposes. Users are strictly prohibited from misusing, damaging, or interfering with any of the website's functionalities, servers, or connected networks.
                    </p>
                </div>

                <!-- Section 3 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">3. Service Information</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        Information about solar subscriptions, EV stations, renewable energy solutions, government schemes, and other services on our platform is provided for general informational purposes only.
                    </p>
                </div>

                <!-- Section 4 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">4. User Information and Submissions</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        Users are entirely responsible for providing accurate, current, and complete information when submitting forms, applications, property verifications, or other inquiries.
                    </p>
                </div>

                <!-- Section 5 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">5. Solar and EV Calculations</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        All calculator results, estimated profits, land requirements, savings, and other figures shown on the website are indicative estimates. Actual results may vary depending on local tariffs, climate, and real-world conditions.
                    </p>
                </div>

                <!-- Section 6 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">6. Intellectual Property</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        All website content, branding, logos, graphics, text, layout design, and other materials belong to KDIA RE Park unless otherwise stated and cannot be copied, distributed, or reused without our prior written permission.
                    </p>
                </div>

                <!-- Section 7 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">7. Third-Party Links and Services</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        KDIA RE Park may provide links to third-party websites or services for convenience. We are not responsible for their content, availability, security, or privacy policies.
                    </p>
                </div>

                <!-- Section 8 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">8. Limitation of Liability</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        KDIA RE Park is not liable for any losses or damages resulting from reliance on website estimates, temporary website unavailability, technical malfunctions, or third-party integrations.
                    </p>
                </div>

                <!-- Section 9 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">9. Changes to Terms &amp; Conditions</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        KDIA RE Park reserves the right to modify these Terms &amp; Conditions when required. Continued usage of the website indicates user acceptance of the updated terms.
                    </p>
                </div>

                <!-- Section 10 -->
                <div>
                    <h3 class="text-2xl font-bold font-display text-slate-900 mb-4">10. Contact and Queries</h3>
                    <p class="text-slate-500 font-light leading-relaxed">
                        Users may contact KDIA RE Park through the official website contact details for any questions or clarifications regarding these Terms &amp; Conditions.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
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
                Hello! I’m here to help you understand clean energy solutions and KDIA Re Park’s offerings. How can I assist you today?
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
