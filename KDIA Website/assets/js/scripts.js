/* assets/js/scripts.js */

// ========================================
// SEED DATA FOR GOVT. SCHEMES & POLICIES
// ========================================
const govtDocuments = [
    {
        id: 1,
        category: "Policies",
        title: "National Solar Mission Policy",
        description: "Official policy framework promoting large-scale solar energy deployment and grid-connected solar power projects across India.",
        url: "https://mnre.gov.in"
    },
    {
        id: 2,
        category: "Policies",
        title: "Renewable Purchase Obligation (RPO)",
        description: "Regulations mandating distribution companies to procure a minimum percentage of electricity from renewable energy sources.",
        url: "https://cercind.gov.in"
    },
    {
        id: 3,
        category: "Schemes",
        title: "PM Surya Ghar: Muft Bijli Yojana",
        description: "A flagship government scheme providing significant subsidies for residential rooftop solar installations up to 3kW.",
        url: "https://pmsuryaghar.gov.in"
    },
    {
        id: 4,
        category: "Schemes",
        title: "PM-KUSUM Scheme",
        description: "Scheme for individual farmers to set up solar power plants and solarize existing grid-connected agriculture pumps.",
        url: "https://mnre.gov.in"
    },
    {
        id: 5,
        category: "Guidelines",
        title: "Solar Park Development Guidelines",
        description: "Comprehensive guidelines for infrastructure, land allotment, and connectivity requirements for large-scale solar parks.",
        url: "https://mnre.gov.in"
    },
    {
        id: 6,
        category: "Tariff Orders",
        title: "Generic Tariff Order for RE Projects",
        description: "Official order determining the generic levellised tariff for renewable energy projects including solar and wind.",
        url: "https://cercind.gov.in"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('py-4', 'shadow-sm', 'bg-white/95', 'backdrop-blur-md');
                nav.classList.remove('py-8');
            } else {
                nav.classList.add('py-8');
                nav.classList.remove('py-4', 'shadow-sm', 'bg-white/95', 'backdrop-blur-md');
            }
        });
    }

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // GSAP Reveal Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.reveal').forEach((el) => {
            let delay = 0;
            const inlineDelay = el.style.transitionDelay;
            if (inlineDelay) {
                const val = parseFloat(inlineDelay);
                if (!isNaN(val)) {
                    // Cap max stagger delay at 200ms and convert to seconds
                    delay = Math.min(val, 200) / 1000;
                }
            }
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize particles for hero sun
    document.querySelectorAll('[id="sun-particles"]').forEach(el => {
        initParticles(el.id, 1.5);
    });

    // Initialize components
    initAIChat();
    initEnergyModelTabs();
    initSavingsCalculator();
    ApplicationModal.init();
    initGovtSchemes();
    initFAQAccordion();
    initHeroAnimation();
});

// Particle Background Initialization Helper
function initParticles(containerId, densityFactor = 1) {
    if (typeof tsParticles !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        const particleCount = (isMobile ? 50 : 150) * densityFactor;

        tsParticles.load(containerId, {
            fullScreen: { enable: false },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "attract" },
                    resize: true
                },
                modes: {
                    attract: { distance: 200, duration: 0.4, factor: 5, maxSpeed: 50, speed: 1, easing: "ease-out-quad" }
                }
            },
            particles: {
                number: { value: particleCount, density: { enable: false } },
                color: { value: ["#ffab5c", "#ff9a4d", "#fbbf24", "#f59e0b"] },
                shape: { type: "circle" },
                opacity: {
                    value: { min: 0.5, max: 0.9 },
                    animation: { enable: true, speed: 0.5, minimumValue: 0.4, sync: false }
                },
                size: { value: { min: 2, max: 6 } },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "bounce" },
                    attract: { enable: true, rotate: { x: 600, y: 1200 } }
                },
                shadow: { enable: true, color: "#ffab5c", blur: 18 }
            },
            detectRetina: true,
            smooth: true
        });
    }
}

// AI Assistant Chat Logic
function initAIChat() {
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatPanel = document.getElementById('ai-chat-panel');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    if (chatBtn && chatPanel && closeChat) {
        chatBtn.addEventListener('click', () => {
            chatPanel.classList.add('active');
            chatBtn.style.opacity = '0';
            chatBtn.style.pointerEvents = 'none';
        });

        closeChat.addEventListener('click', () => {
            chatPanel.classList.remove('active');
            chatBtn.style.opacity = '1';
            chatBtn.style.pointerEvents = 'auto';
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.textContent = text;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const getMockResponse = (input) => {
            const query = input.toLowerCase();
            if (query.includes('vnm') || query.includes('virtual net metering')) return "Virtual Net Metering (VNM) allows you to own or lease a share of a remote solar park...";
            if (query.includes('gnm') || query.includes('group net metering')) return "Group Net Metering (GNM) enables multiple buildings to share energy produced by a single solar plant...";
            return "I'm here to help you understand KDIA's solar models. How can I assist?";
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                addMessage(text, 'user');
                chatInput.value = '';
                setTimeout(() => addMessage(getMockResponse(text), 'ai'), 600);
            }
        };

        sendChat?.addEventListener('click', handleSend);
        chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    }
}

// Energy Model Tab System
function initEnergyModelTabs() {
    const tabs = document.querySelectorAll('.energy-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            if (targetContent && typeof gsap !== 'undefined') {
                targetContent.classList.add('active');
                gsap.fromTo(targetContent, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
            }
        });
    });
}

// Savings Calculator (FULL VERSION)
function initSavingsCalculator() {
    const kwhAllocation = document.getElementById('kwh-allocation');
    const monthlyBill = document.getElementById('monthly-bill');
    const billDropdown = document.getElementById('bill-dropdown');
    const calculationMode = document.getElementById('calculation-mode');
    const billContainer = document.getElementById('bill-input-container');
    const unitContainer = document.getElementById('unit-input-container');
    const unitConsumption = document.getElementById('unit-consumption');
    const roiSlider = document.getElementById('roi-slider');
    const tenureSlider = document.getElementById('tenure-slider');

    // Display Elements
    const roiDisplay = document.getElementById('roi-display');
    const tenureDisplay = document.getElementById('tenure-display');
    const approxInvestmentDisplay = document.getElementById('approx-investment');
    const monthlyEmiDisplay = document.getElementById('monthly-emi');
    const principalDisplay = document.getElementById('principal-amount');
    const interestDisplay = document.getElementById('total-interest');
    const totalPayableDisplay = document.getElementById('total-payable');
    const savingsValue = document.getElementById('savings-value');
    const co2Value = document.getElementById('co2-value');
    const treesValue = document.getElementById('trees-value');
    const roiValue = document.getElementById('roi-value');

    if (!kwhAllocation) return;

    function resetUI() {
        [approxInvestmentDisplay, monthlyEmiDisplay, principalDisplay, interestDisplay, totalPayableDisplay, savingsValue, co2Value, treesValue].forEach(el => {
            if (el) el.textContent = '0';
        });
    }

    function updateCalculations() {
        const mode = calculationMode.value;
        const allocationKwhVal = parseFloat(kwhAllocation.value) || 0;
        let consumptionKwhVal = 0;

        if (mode === 'bill') {
            consumptionKwhVal = (parseFloat(monthlyBill.value) || 0) / 9;
            billContainer.classList.remove('hidden');
            unitContainer.classList.add('hidden');
        } else {
            consumptionKwhVal = parseFloat(unitConsumption.value) || 0;
            billContainer.classList.add('hidden');
            unitContainer.classList.remove('hidden');
        }

        if (allocationKwhVal <= 0 && consumptionKwhVal <= 0) {
            resetUI();
            return;
        }

        const roi = parseFloat(roiSlider.value);
        const tenureYears = parseInt(tenureSlider.value);
        const investment = (allocationKwhVal / 150) * 55000;
        const principal = Math.round(investment / 1000) * 1000;
        const annualSavings = consumptionKwhVal * 12 * 9 * 0.85;

        const r = (roi / 100) / 12;
        const n = tenureYears * 12;
        let emi = 0;
        if (principal > 0 && r > 0) emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        const totalPayable = emi * n;
        const totalInterest = totalPayable - principal;
        const co2Reduction = Math.round(consumptionKwhVal * 12 * 0.8);
        const trees = Math.round(co2Reduction / 60);

        // Update displays with basic numbering
        if (approxInvestmentDisplay) approxInvestmentDisplay.textContent = '₹' + Math.round(principal).toLocaleString('en-IN');
        if (monthlyEmiDisplay) monthlyEmiDisplay.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
        if (principalDisplay) principalDisplay.textContent = '₹' + Math.round(principal).toLocaleString('en-IN');
        if (interestDisplay) interestDisplay.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
        if (totalPayableDisplay) totalPayableDisplay.textContent = '₹' + Math.round(totalPayable).toLocaleString('en-IN');
        if (savingsValue) savingsValue.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
        if (co2Value) co2Value.textContent = co2Reduction.toLocaleString('en-IN');
        if (treesValue) treesValue.textContent = trees;

        if (annualSavings > 0 && principal > 0) {
            const payback = Math.round(principal / annualSavings);
            if (roiValue) roiValue.textContent = `${payback}-${payback + 2} Years`;
        }
    }

    [calculationMode, billDropdown, kwhAllocation, monthlyBill, unitConsumption, roiSlider, tenureSlider].forEach(el => {
        el?.addEventListener('change', updateCalculations);
        el?.addEventListener('input', updateCalculations);
    });

    billDropdown?.addEventListener('change', () => {
        const vals = { '1000-2000': 1500, '2000-4000': 3000, '4000-6000': 5000, '6000-10000': 8000, '10000+': 15000 };
        if (billDropdown.value) monthlyBill.value = vals[billDropdown.value];
        updateCalculations();
    });

    if (roiSlider) roiSlider.addEventListener('input', () => { if (roiDisplay) roiDisplay.textContent = roiSlider.value + '%'; });
    if (tenureSlider) tenureSlider.addEventListener('input', () => { if (tenureDisplay) tenureDisplay.textContent = tenureSlider.value + ' Years'; });

    updateCalculations();
}

// Govt. Schemes Logic (FIXED VISIBILITY)
function initGovtSchemes() {
    const tabs = document.querySelectorAll('.govt-tab');
    const container = document.getElementById('govt-cards-container');

    if (!tabs.length || !container) return;

    const renderCards = (category) => {
        const normalizedCategory = category.toLowerCase().replace(' ', '-');
        const filteredDocs = govtDocuments.filter(doc =>
            doc.category.toLowerCase().replace(' ', '-') === normalizedCategory
        );
        container.innerHTML = '';

        filteredDocs.forEach(doc => {
            const card = document.createElement('div');
            // REMOVED 'reveal' to avoid conflict with opacity 0 from CSS
            card.className = 'glass-card p-8 rounded-3xl border-slate-100 flex flex-col justify-between h-full bg-white shadow-sm hover:shadow-md transition-all group';
            card.innerHTML = `
                <div>
                    <h3 class="text-2xl font-bold mb-3 font-display text-slate-900">${doc.title}</h3>
                    <p class="text-slate-500 font-light leading-relaxed mb-8">${doc.description}</p>
                </div>
                <div class="mt-auto">
                    <a href="${doc.url}" target="_blank" class="inline-flex items-center space-x-2 text-brand-green font-bold hover:text-brand-dark transition-colors group">
                        <span>View Official Document</span>
                        <i data-lucide="external-link" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (typeof gsap !== 'undefined' && container.children.length > 0) {
            gsap.fromTo(container.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active', 'bg-brand-green', 'text-white'));
            tab.classList.add('active', 'bg-brand-green', 'text-white');
            renderCards(tab.getAttribute('data-category'));
        });
    });

    // Initial trigger for the active tab
    const activeTab = document.querySelector('.govt-tab.active');
    if (activeTab) {
        activeTab.classList.add('bg-brand-green', 'text-white');
        renderCards(activeTab.getAttribute('data-category'));
    }
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            answer.classList.toggle('active');
            icon?.classList.toggle('active');
        });
    });
}

// Application Modal (FULL VERSION)
const ApplicationModal = {
    formData: {},
    currentStep: 1,
    init() {
        this.modal = document.getElementById('application-modal');
        this.openBtns = document.querySelectorAll('#apply-modal-btn');
        this.closeBtn = document.getElementById('close-modal');
        this.closeSuccessBtn = document.getElementById('close-success-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.modalFooter = document.getElementById('modal-footer');

        if (!this.modal) return;
        this.bindEvents();
    },
    bindEvents() {
        this.openBtns.forEach(btn => btn.addEventListener('click', () => this.open()));
        this.closeBtn?.addEventListener('click', () => this.close());
        this.closeSuccessBtn?.addEventListener('click', () => this.close());
        this.nextBtn?.addEventListener('click', () => this.nextStep());
        this.prevBtn?.addEventListener('click', () => this.prevStep());

        // Vendor toggle
        const vendorRadios = document.querySelectorAll('input[name="vendor-preference"]');
        vendorRadios.forEach(radio => radio.addEventListener('change', () => {
            const vendorInp = document.getElementById('vendor-input-container');
            if (radio.value === 'have-vendor' && radio.checked) vendorInp?.classList.remove('hidden');
            else vendorInp?.classList.add('hidden');
        }));
    },
    open() { this.modal.classList.add('active'); document.body.style.overflow = 'hidden'; this.showStep(1); },
    close() { this.modal.classList.remove('active'); document.body.style.overflow = ''; },
    showStep(step) {
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`)?.classList.add('active');
        this.currentStep = step;
        if (this.prevBtn) this.prevBtn.disabled = step === 1;
        if (this.nextBtn) this.nextBtn.textContent = step === 3 ? 'Submit Application' : 'Next';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },
    nextStep() { if (this.currentStep < 3) this.showStep(this.currentStep + 1); else this.submit(); },
    prevStep() { if (this.currentStep > 1) this.showStep(this.currentStep - 1); },
    submit() {
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        document.querySelector('.form-step[data-step="success"]')?.classList.add('active');
        this.modalFooter?.classList.add('hidden');
    }
};

// Global Hash/Cross-page logic Helper
document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const url = new URL(link.href, window.location.origin);
        if (url.pathname === window.location.pathname || url.pathname.endsWith('index.html')) {
            const hash = url.hash.substring(1);
            if (hash.startsWith('govt-')) {
                const cat = hash.replace('govt-schemes-', '');
                const tab = document.querySelector(`.govt-tab[data-category="${cat}"]`);
                if (tab) {
                    e.preventDefault();
                    tab.click();
                    document.getElementById('govt-schemes')?.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, '#' + hash);
                }
            }
        }
    });
});

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('govt-')) {
        const cat = hash.replace('govt-schemes-', '');
        const tab = document.querySelector(`.govt-tab[data-category="${cat}"]`);
        if (tab) {
            tab.click();
            document.getElementById('govt-schemes')?.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Hero Sun Animation Logic
function initHeroAnimation() {
    if (typeof gsap !== 'undefined') {
        const heroSun = document.getElementById('hero-sun-container');
        if (heroSun) {
            // Reveal the sun container from opacity 0
            gsap.to(heroSun, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.2
            });

            // Breathing / Pulsing animation for the inner sun
            gsap.to('.solar-element-centered', {
                scale: 1.08,
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });

            // Stronger pulsing for the outer glow
            gsap.to('.radiating-glow-centered', {
                scale: 1.15,
                opacity: 0.5,
                duration: 4.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        }
    }
}
