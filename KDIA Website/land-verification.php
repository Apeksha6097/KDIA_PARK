<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Land Verification Application | KDIA Re Park</title>
    <meta name="description" content="Submit your land details and supporting documents for EVI infrastructure development verification.">

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

    <!-- Preconnect & Fonts Preload -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Preload Logo -->
    <link rel="preload" as="image" href="assets/images/logo.webp">

    <!-- Leaflet.js for interactive Map Location Picker -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>

    <!-- CDNs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
    
    <!-- Language Switcher & Locations Dropdown -->
    <script src="assets/js/translate.php?v=1.0.1" defer></script>
    <script src="assets/js/india-locations.php" defer></script>
</head>

<body class="bg-slate-50 text-slate-900 selection:bg-brand-green/30">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 py-8 transition-all duration-500 bg-white shadow-sm border-b border-slate-100">
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
                    class="flex items-center space-x-2 hover:text-brand-green font-bold transition-colors relative group">
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

    <!-- Header Intro Section -->
    <section class="pt-48 pb-12 relative bg-gradient-to-br from-brand-green/5 to-white border-b border-slate-100">
        <div class="container mx-auto px-6 text-center">
            <h1 class="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight text-slate-900">
                Land Verification <span class="text-brand-green">Application</span>
            </h1>
            <p class="text-xl text-slate-500 font-light max-w-2xl mx-auto">
                Submit your land details and supporting documents for verification and approval for EVI infrastructure development.
            </p>
        </div>
    </section>

    <!-- Main Application Section -->
    <section class="py-16">
        <div class="container mx-auto px-6">
            <div class="max-w-4xl mx-auto">

                <!-- Application Form -->
                <form id="land-verification-form" class="space-y-10" onsubmit="event.preventDefault();">

                    <!-- SECTION 1: OWNER DETAILS -->
                    <div class="glass-card p-8 md:p-10 rounded-3xl border border-brand-green/10 bg-white shadow-sm">
                        <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center">
                                <i data-lucide="user" class="text-brand-green w-5 h-5"></i>
                            </div>
                            <h2 class="text-2xl font-display font-bold text-slate-900">Owner Information</h2>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Full Name <span class="text-red-500">*</span></label>
                                <input type="text" id="fullName" placeholder="Enter full name of primary owner"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                <p class="text-xs text-red-500 mt-1 hidden" id="err-fullName">Please enter your full name.</p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Mobile Number <span class="text-red-500">*</span></label>
                                <input type="tel" id="mobileNumber" maxlength="10" placeholder="10-digit mobile number"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                <p class="text-xs text-red-500 mt-1 hidden" id="err-mobileNumber">Please enter a valid 10-digit mobile number.</p>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Email Address <span class="text-red-500">*</span></label>
                                <input type="email" id="email" placeholder="owner@example.com"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                <p class="text-xs text-red-500 mt-1 hidden" id="err-email">Please enter a valid email address.</p>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Complete Address <span class="text-red-500">*</span></label>
                                <textarea id="completeAddress" rows="3" placeholder="Enter complete residential address"
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10"></textarea>
                                <p class="text-xs text-red-500 mt-1 hidden" id="err-completeAddress">Please enter your complete address.</p>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 2: LAND DETAILS -->
                    <div class="glass-card p-8 md:p-10 rounded-3xl border border-brand-green/10 bg-white shadow-sm">
                        <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center">
                                <i data-lucide="map-pin" class="text-brand-green w-5 h-5"></i>
                            </div>
                            <h2 class="text-2xl font-display font-bold text-slate-900">Land Information</h2>
                        </div>

                        <div class="space-y-6">
                            <div class="grid md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Number of Owners <span class="text-red-500">*</span></label>
                                    <input type="number" id="numOwners" min="1" max="100" value="1"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">State <span class="text-red-500">*</span></label>
                                    <select id="state"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                        <option value="">Select State</option>
                                    </select>
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-state">Please select a state.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">District <span class="text-red-500">*</span></label>
                                    <select id="district"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10" disabled>
                                        <option value="">Select District</option>
                                    </select>
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-district">Please select a district.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Tehsil <span class="text-red-500">*</span></label>
                                    <input type="text" id="tehsil" placeholder="Tehsil name"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-tehsil">Please enter the tehsil.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Village <span class="text-red-500">*</span></label>
                                    <input type="text" id="village" placeholder="Village name"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-village">Please enter the village.</p>
                                </div>
                            </div>

                            <hr class="border-slate-100 my-4">

                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Khata Number <span class="text-red-500">*</span></label>
                                    <input type="text" id="khataNumber" placeholder="Khata record number"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-khataNumber">Please enter the Khata number.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Khasra Number <span class="text-red-500">*</span></label>
                                    <input type="text" id="khasraNumber" placeholder="Khasra plot number"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-khasraNumber">Please enter the Khasra number.</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Area Unit <span class="text-red-500">*</span></label>
                                    <select id="areaUnit"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                        <option value="Sq Ft">Sq Ft</option>
                                        <option value="Acre" selected>Acre</option>
                                        <option value="Bigha">Bigha</option>
                                        <option value="Hectare">Hectare</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Land Area <span class="text-red-500">*</span></label>
                                    <input type="number" step="0.01" min="0.01" id="landArea" placeholder="Numerical area"
                                        class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10">
                                    <p class="text-xs text-red-500 mt-1 hidden" id="err-landArea">Please enter a valid area greater than 0.</p>
                                </div>
                            </div>

                            <hr class="border-slate-100 my-4">

                            <div>
                                <label class="block text-sm font-semibold mb-4 text-slate-700">Land Type <span class="text-red-500">*</span></label>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="landType" value="Agricultural" class="absolute opacity-0 peer" checked>
                                        <div class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-green transition-all bg-white text-slate-600 peer-checked:border-brand-green peer-checked:bg-brand-green/5 peer-checked:text-brand-dark">
                                            <i data-lucide="leaf" class="w-6 h-6"></i>
                                            <span class="font-bold text-sm">Agricultural</span>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="landType" value="Commercial" class="absolute opacity-0 peer">
                                        <div class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-green transition-all bg-white text-slate-600 peer-checked:border-brand-green peer-checked:bg-brand-green/5 peer-checked:text-brand-dark">
                                            <i data-lucide="building-2" class="w-6 h-6"></i>
                                            <span class="font-bold text-sm">Commercial</span>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="landType" value="Industrial" class="absolute opacity-0 peer">
                                        <div class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-green transition-all bg-white text-slate-600 peer-checked:border-brand-green peer-checked:bg-brand-green/5 peer-checked:text-brand-dark">
                                            <i data-lucide="factory" class="w-6 h-6"></i>
                                            <span class="font-bold text-sm">Industrial</span>
                                        </div>
                                    </label>
                                    <label class="relative cursor-pointer">
                                        <input type="radio" name="landType" value="Residential" class="absolute opacity-0 peer">
                                        <div class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-green transition-all bg-white text-slate-600 peer-checked:border-brand-green peer-checked:bg-brand-green/5 peer-checked:text-brand-dark">
                                            <i data-lucide="home" class="w-6 h-6"></i>
                                            <span class="font-bold text-sm">Residential</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <hr class="border-slate-100 my-4">

                            <!-- MAP PICKER SECTION -->
                            <div>
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Map Location <span class="text-red-500">*</span></label>
                                <p class="text-xs text-slate-400 mb-3">Click anywhere on the map to place a pin and capture land coordinates.</p>
                                
                                <div id="map" class="h-80 w-full rounded-2xl border border-slate-200 shadow-sm mb-4 z-10"></div>
                                
                                <div class="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Latitude (Read Only)</label>
                                        <input type="text" id="latitude" readonly placeholder="Select on map"
                                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-500 outline-none cursor-not-allowed">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Longitude (Read Only)</label>
                                        <input type="text" id="longitude" readonly placeholder="Select on map"
                                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-500 outline-none cursor-not-allowed">
                                    </div>
                                </div>
                                <p class="text-xs text-red-500 mt-2 hidden" id="err-map">Please place a marker on the map to select coordinates.</p>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 3: DOCUMENT UPLOADS -->
                    <div class="glass-card p-8 md:p-10 rounded-3xl border border-brand-green/10 bg-white shadow-sm">
                        <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center">
                                <i data-lucide="file-up" class="text-brand-green w-5 h-5"></i>
                            </div>
                            <h2 class="text-2xl font-display font-bold text-slate-900">Upload Supporting Documents</h2>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6" id="uploaders-grid">
                            
                            <!-- JAMABANDI COPY -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-jamabandi">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Jamabandi Copy <span class="text-red-500">*</span></label>
                                    <div id="dropzone-jamabandi" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-jamabandi" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-jamabandi" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-jamabandi"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-jamabandi">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-jamabandi"></div>
                                        </div>
                                    </div>
                                    <div id="preview-jamabandi" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-jamabandi"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-jamabandi"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-jamabandi"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="jamabandi" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="jamabandi" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-jamabandi">This document is required.</p>
                                </div>
                            </div>

                            <!-- REGISTRY / SALE DEED -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-registry">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Registry / Sale Deed <span class="text-red-500">*</span></label>
                                    <div id="dropzone-registry" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-registry" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-registry" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-registry"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-registry">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-registry"></div>
                                        </div>
                                    </div>
                                    <div id="preview-registry" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-registry"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-registry"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-registry"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="registry" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="registry" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-registry">This document is required.</p>
                                </div>
                            </div>

                            <!-- OWNERSHIP CERTIFICATE -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-ownership">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Ownership Certificate <span class="text-red-500">*</span></label>
                                    <div id="dropzone-ownership" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-ownership" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-ownership" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-ownership"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-ownership">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-ownership"></div>
                                        </div>
                                    </div>
                                    <div id="preview-ownership" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-ownership"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-ownership"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-ownership"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="ownership" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="ownership" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-ownership">This document is required.</p>
                                </div>
                            </div>

                            <!-- KHASRA MAP -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-khasraMap">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Khasra Map <span class="text-red-500">*</span></label>
                                    <div id="dropzone-khasraMap" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-khasraMap" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-khasraMap" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-khasraMap"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-khasraMap">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-khasraMap"></div>
                                        </div>
                                    </div>
                                    <div id="preview-khasraMap" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-khasraMap"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-khasraMap"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-khasraMap"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="khasraMap" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="khasraMap" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-khasraMap">This document is required.</p>
                                </div>
                            </div>

                            <!-- REVENUE RECORD -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-revenue">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Revenue Record <span class="text-red-500">*</span></label>
                                    <div id="dropzone-revenue" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-revenue" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-revenue" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-revenue"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-revenue">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-revenue"></div>
                                        </div>
                                    </div>
                                    <div id="preview-revenue" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-revenue"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-revenue"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-revenue"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="revenue" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="revenue" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-revenue">This document is required.</p>
                                </div>
                            </div>

                            <!-- AADHAAR CARD -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-aadhaar">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Aadhaar Card <span class="text-red-500">*</span></label>
                                    <div id="dropzone-aadhaar" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-aadhaar" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-aadhaar" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-aadhaar"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-aadhaar">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-aadhaar"></div>
                                        </div>
                                    </div>
                                    <div id="preview-aadhaar" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-aadhaar"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-aadhaar"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-aadhaar"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="aadhaar" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="aadhaar" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-aadhaar">This document is required.</p>
                                </div>
                            </div>

                            <!-- PAN CARD -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between" id="card-pan">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">PAN Card <span class="text-red-500">*</span></label>
                                    <div id="dropzone-pan" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-pan" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-pan" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-pan"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-pan">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-pan"></div>
                                        </div>
                                    </div>
                                    <div id="preview-pan" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-pan"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-pan"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-pan"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="pan" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="pan" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-pan">This document is required.</p>
                                </div>
                            </div>

                            <!-- CO-OWNER NOC (Conditional) -->
                            <div class="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hidden transform scale-95 transition-all duration-300" id="card-coOwnerNoc">
                                <div>
                                    <label class="block text-sm font-semibold mb-2 text-slate-700">Co-owner NOC <span class="text-red-500">*</span></label>
                                    <div id="dropzone-coOwnerNoc" class="dropzone border-2 border-dashed border-slate-200 hover:border-brand-green bg-slate-50/50 hover:bg-slate-50 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] transition-all">
                                        <input type="file" id="file-coOwnerNoc" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                        <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-green mb-2"></i>
                                        <p class="text-sm font-medium text-slate-600 mb-1">Drag & drop or <span class="text-brand-green font-bold">browse</span></p>
                                        <p class="text-xs text-slate-400">PDF, JPG, JPEG, PNG (Max 10MB)</p>
                                    </div>
                                    <div id="progress-coOwnerNoc" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-xs font-bold text-slate-500 truncate max-w-[200px]" id="filename-coOwnerNoc"></span>
                                            <span class="text-xs font-bold text-brand-green" id="percent-coOwnerNoc">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="bg-brand-green h-full w-0 transition-all duration-200" id="bar-coOwnerNoc"></div>
                                        </div>
                                    </div>
                                    <div id="preview-coOwnerNoc" class="hidden mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" id="icon-coOwnerNoc"></div>
                                            <div class="min-w-0">
                                                <p class="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-[200px]" id="name-coOwnerNoc"></p>
                                                <p class="text-xs text-slate-400 font-medium" id="size-coOwnerNoc"></p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="btn-replace p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-green text-slate-500 transition-colors shadow-sm" data-doc="coOwnerNoc" title="Replace file">
                                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                            </button>
                                            <button type="button" class="btn-delete p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors shadow-sm" data-doc="coOwnerNoc" title="Delete file">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-xs text-red-500 mt-2 font-semibold hidden" id="err-coOwnerNoc">This document is required as there are multiple owners.</p>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    <!-- SECTION 4: LAND DISPUTE DECLARATION -->
                    <div class="glass-card p-8 md:p-10 rounded-3xl border border-brand-green/10 bg-white shadow-sm">
                        <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center">
                                <i data-lucide="alert-triangle" class="text-brand-green w-5 h-5"></i>
                            </div>
                            <h2 class="text-2xl font-display font-bold text-slate-900">Land Dispute Declaration</h2>
                        </div>

                        <div class="space-y-6">
                            <!-- Question 1 -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <p class="text-base font-semibold text-slate-700">1. Is the land involved in any court case?</p>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="courtCase" value="Yes" class="w-5 h-5 text-brand-green focus:ring-brand-green" onchange="toggleRemarks()"> Yes
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="courtCase" value="No" class="w-5 h-5 text-brand-green focus:ring-brand-green" checked onchange="toggleRemarks()"> No
                                    </label>
                                </div>
                            </div>

                            <!-- Question 2 -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <p class="text-base font-semibold text-slate-700">2. Is there any ownership dispute?</p>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="ownershipDispute" value="Yes" class="w-5 h-5 text-brand-green focus:ring-brand-green" onchange="toggleRemarks()"> Yes
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="ownershipDispute" value="No" class="w-5 h-5 text-brand-green focus:ring-brand-green" checked onchange="toggleRemarks()"> No
                                    </label>
                                </div>
                            </div>

                            <!-- Question 3 -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <p class="text-base font-semibold text-slate-700">3. Is the land mortgaged or under any legal restriction?</p>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="mortgaged" value="Yes" class="w-5 h-5 text-brand-green focus:ring-brand-green" onchange="toggleRemarks()"> Yes
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer font-bold text-slate-600">
                                        <input type="radio" name="mortgaged" value="No" class="w-5 h-5 text-brand-green focus:ring-brand-green" checked onchange="toggleRemarks()"> No
                                    </label>
                                </div>
                            </div>

                            <!-- Conditional Remarks Textarea -->
                            <div class="hidden transform scale-95 transition-all duration-300" id="remarks-container">
                                <label class="block text-sm font-semibold mb-2 text-slate-700">Remarks <span class="text-red-500">*</span></label>
                                <textarea id="remarks" rows="4" placeholder="Please provide details regarding the legal issue, dispute, or restriction."
                                    class="w-full bg-white border border-brand-green/20 rounded-xl px-4 py-3.5 focus:border-brand-green outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800 focus:ring-2 focus:ring-brand-green/10"></textarea>
                                <p class="text-xs text-red-500 mt-1 hidden" id="err-remarks">Please provide details regarding the dispute/restriction.</p>
                            </div>
                        </div>
                    </div>

                    <!-- SECTION 5: APPLICANT DECLARATION -->
                    <div class="glass-card p-8 md:p-10 rounded-3xl border border-brand-green/10 bg-white shadow-sm">
                        <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div class="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center">
                                <i data-lucide="check-square" class="text-brand-green w-5 h-5"></i>
                            </div>
                            <h2 class="text-2xl font-display font-bold text-slate-900">Applicant Declaration</h2>
                        </div>

                        <div class="space-y-4">
                            <label class="flex items-start gap-4 cursor-pointer">
                                <input type="checkbox" id="declareAuthentic" class="mt-1 w-5 h-5 text-brand-green border-slate-300 rounded focus:ring-brand-green select-none">
                                <span class="text-sm font-medium text-slate-600">I hereby declare that the information provided is correct and all uploaded documents are genuine.</span>
                            </label>

                            <label class="flex items-start gap-4 cursor-pointer">
                                <input type="checkbox" id="declareNoDispute" class="mt-1 w-5 h-5 text-brand-green border-slate-300 rounded focus:ring-brand-green select-none">
                                <span class="text-sm font-medium text-slate-600">I declare that the land does not have any unresolved legal dispute and the information submitted is true to the best of my knowledge.</span>
                            </label>
                        </div>
                    </div>

                    <!-- SUBMIT SECTION -->
                    <div class="flex flex-col items-center justify-center pt-4">
                        <button type="button" id="submit-btn" disabled
                            class="px-12 py-5 bg-brand-green hover:bg-brand-dark text-white font-bold rounded-full text-lg shadow-lg hover:shadow-[0_20px_40px_rgba(141,198,63,0.3)] transition-all transform hover:-translate-y-1 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                            <span id="submit-text">Submit Application</span>
                            <div id="submit-spinner" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent hidden"></div>
                        </button>
                    </div>

                </form>

                <!-- SUCCESS STATE CARD (Hidden initially) -->
                <div id="success-card" class="hidden glass-card p-10 md:p-14 rounded-3xl border border-brand-green/20 bg-white shadow-xl text-center flex flex-col items-center max-w-2xl mx-auto transform scale-95 opacity-0 transition-all duration-500">
                    <div class="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                        <i data-lucide="check-circle-2" class="w-12 h-12 text-emerald-500"></i>
                    </div>

                    <h2 class="text-3xl font-display font-bold text-slate-900 mb-2">Application Submitted Successfully</h2>
                    
                    <div class="flex items-center gap-3 justify-center mb-6">
                        <div class="bg-slate-100 text-slate-600 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 border border-slate-200">
                            <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">App ID:</span>
                            <span id="display-app-id" class="text-slate-800"></span>
                        </div>
                        <div class="bg-emerald-50 text-emerald-700 font-bold px-4 py-1.5 rounded-full text-sm border border-emerald-100 flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Pending Verification
                        </div>
                    </div>

                    <p class="text-slate-500 font-light leading-relaxed mb-8 max-w-md">
                        Your land verification request has been submitted successfully. Our verification team will review the submitted information and documents. You will be contacted if additional clarification or documentation is required.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <button type="button" id="btn-download"
                            class="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <i data-lucide="download" class="w-4 h-4"></i> Download Acknowledgement
                        </button>
                        <button type="button" id="btn-reset"
                            class="px-8 py-4 border-2 border-brand-green text-brand-green hover:bg-brand-green/5 rounded-full font-bold transition-all transform hover:-translate-y-0.5">
                            Submit Another Application
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 border-t border-slate-100 bg-white">
        <div class="container mx-auto px-6 text-center">
            <div class="flex justify-center space-x-12 mb-10 text-slate-400 font-medium">
                <a href="about.php" class="hover:text-brand-green transition-colors">Company & Energy Solutions</a>
                <a href="contact.php" class="hover:text-brand-green transition-colors">Contact</a>
            </div>
            <p class="text-slate-400 text-sm tracking-widest uppercase">&copy; 2024 Kdia Re Park. Let's build a sustainable future together.</p>
        </div>
    </footer>

    <!-- Script logic -->
    <script>
        // Store upload files in-memory
        const uploadedFiles = {
            jamabandi: null,
            registry: null,
            ownership: null,
            khasraMap: null,
            revenue: null,
            aadhaar: null,
            pan: null,
            coOwnerNoc: null
        };

        const documentTypes = ['jamabandi', 'registry', 'ownership', 'khasraMap', 'revenue', 'aadhaar', 'pan', 'coOwnerNoc'];

        // Leaflet.js Map variables
        let map;
        let marker;

        document.addEventListener('DOMContentLoaded', () => {
            // Navbar Scroll Effect
            const nav = document.querySelector('nav');
            if (nav) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        nav.classList.add('py-4');
                        nav.classList.remove('py-8');
                    } else {
                        nav.classList.add('py-8');
                        nav.classList.remove('py-4');
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

            // Initialize Icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Initialize Map
            initMapPicker();

            // Setup Document Uploaders
            setupUploaders();

            // Set up form input listeners for real-time validation
            setupFormListeners();

            // Toggle NOC visible on loading if default is >1
            toggleCoOwnerNoc();
        });

        // Initialize Map Picker
        function initMapPicker() {
            // Center default around Rajasthan coordinates
            map = L.map('map').setView([26.9124, 75.7873], 6);

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Fetch auto geolocation on mount
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        map.setView([lat, lng], 13);
                        updateMapMarker(lat, lng);
                    },
                    (err) => {
                        console.log('User location access denied or failed. Default coordinates active.', err);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            }

            // Map click listener to set location
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                updateMapMarker(lat, lng);
            });
        }

        // Place marker and capture coordinates
        function updateMapMarker(lat, lng) {
            document.getElementById('latitude').value = lat.toFixed(6);
            document.getElementById('longitude').value = lng.toFixed(6);

            // Remove previous error
            document.getElementById('err-map').classList.add('hidden');

            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }

            validateForm();
        }

        // Setup listeners for number of owners, disputes, etc.
        function setupFormListeners() {
            const numOwners = document.getElementById('numOwners');
            numOwners.addEventListener('input', () => {
                toggleCoOwnerNoc();
                validateForm();
            });

            // Input and select fields
            const textFields = ['fullName', 'mobileNumber', 'email', 'completeAddress', 'state', 'district', 'tehsil', 'village', 'khataNumber', 'khasraNumber', 'landArea'];
            textFields.forEach(id => {
                const field = document.getElementById(id);
                const eventType = (field.tagName === 'SELECT') ? 'change' : 'input';
                field.addEventListener(eventType, () => {
                    validateField(id);
                    validateForm();
                });
            });

            // Declarations
            document.getElementById('declareAuthentic').addEventListener('change', validateForm);
            document.getElementById('declareNoDispute').addEventListener('change', validateForm);

            // Remarks
            document.getElementById('remarks').addEventListener('input', () => {
                validateField('remarks');
                validateForm();
            });

            // Submit Button
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.addEventListener('click', submitApplication);

            // Reset Button
            document.getElementById('btn-reset').addEventListener('click', resetForm);
        }

        // Toggle visibility of Co-owner NOC card
        function toggleCoOwnerNoc() {
            const numOwnersVal = parseInt(document.getElementById('numOwners').value) || 1;
            const coOwnerCard = document.getElementById('card-coOwnerNoc');
            if (numOwnersVal > 1) {
                coOwnerCard.classList.remove('hidden');
                setTimeout(() => coOwnerCard.classList.remove('scale-95', 'opacity-0'), 10);
            } else {
                coOwnerCard.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    coOwnerCard.classList.add('hidden');
                    // Reset coOwnerNoc state
                    deleteFile('coOwnerNoc');
                }, 300);
            }
        }

        // Toggle dispute remarks textarea
        function toggleRemarks() {
            const hasCourtCase = document.querySelector('input[name="courtCase"]:checked').value === 'Yes';
            const hasDispute = document.querySelector('input[name="ownershipDispute"]:checked').value === 'Yes';
            const isMortgaged = document.querySelector('input[name="mortgaged"]:checked').value === 'Yes';

            const container = document.getElementById('remarks-container');
            const remarksInput = document.getElementById('remarks');

            if (hasCourtCase || hasDispute || isMortgaged) {
                container.classList.remove('hidden');
                setTimeout(() => container.classList.remove('scale-95', 'opacity-0'), 10);
            } else {
                container.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    container.classList.add('hidden');
                    remarksInput.value = '';
                    document.getElementById('err-remarks').classList.add('hidden');
                }, 300);
            }
            validateForm();
        }

        // Setup drag & drop logic for all upload cards
        function setupUploaders() {
            documentTypes.forEach(type => {
                const dropzone = document.getElementById('dropzone-' + type);
                const fileInput = document.getElementById('file-' + type);

                if (!dropzone || !fileInput) return;

                // Click to browse
                dropzone.addEventListener('click', () => fileInput.click());

                // File input change
                fileInput.addEventListener('change', (e) => {
                    if (e.target.files.length > 0) {
                        handleFileSelection(type, e.target.files[0]);
                    }
                });

                // Drag and drop event listeners
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropzone.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        dropzone.classList.add('border-brand-green', 'bg-brand-green/10');
                    }, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropzone.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        dropzone.classList.remove('border-brand-green', 'bg-brand-green/10');
                    }, false);
                });

                dropzone.addEventListener('drop', (e) => {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    if (files.length > 0) {
                        handleFileSelection(type, files[0]);
                    }
                });

                // Replace action
                const btnReplace = document.querySelector(`.btn-replace[data-doc="${type}"]`);
                btnReplace?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    fileInput.click();
                });

                // Delete action
                const btnDelete = document.querySelector(`.btn-delete[data-doc="${type}"]`);
                btnDelete?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteFile(type);
                });
            });
        }

        // Handle selected file validation and loading
        function handleFileSelection(type, file) {
            const errEl = document.getElementById('err-' + type);
            errEl.classList.add('hidden');

            // Format validation
            const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                showUploadError(type, 'Unsupported format. Please upload PDF, JPG, JPEG, or PNG.');
                return;
            }

            // Size validation (10 MB = 10 * 1024 * 1024 bytes)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                showUploadError(type, 'File size exceeds 10MB limit.');
                return;
            }

            // Mock Upload Animation
            simulateUpload(type, file);
        }

        // Simulate progress bar increase
        function simulateUpload(type, file) {
            const dropzone = document.getElementById('dropzone-' + type);
            const progress = document.getElementById('progress-' + type);
            const filenameText = document.getElementById('filename-' + type);
            const bar = document.getElementById('bar-' + type);
            const percentText = document.getElementById('percent-' + type);

            dropzone.classList.add('hidden');
            progress.classList.remove('hidden');
            filenameText.textContent = file.name;
            bar.style.width = '0%';
            percentText.textContent = '0%';

            let percentage = 0;
            const uploadTimer = setInterval(() => {
                percentage += 10;
                bar.style.width = percentage + '%';
                percentText.textContent = percentage + '%';

                if (percentage >= 100) {
                    clearInterval(uploadTimer);
                    // Hide progress and show preview
                    progress.classList.add('hidden');
                    showPreview(type, file);
                }
            }, 80);
        }

        // Show uploaded file detail card
        function showPreview(type, file) {
            const preview = document.getElementById('preview-' + type);
            const previewName = document.getElementById('name-' + type);
            const previewSize = document.getElementById('size-' + type);
            const previewIcon = document.getElementById('icon-' + type);

            previewName.textContent = file.name;
            previewSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

            // Generate thumbnail for image files
            if (file.type.startsWith('image/')) {
                const imgUrl = URL.createObjectURL(file);
                previewIcon.innerHTML = `<img src="${imgUrl}" class="w-full h-full object-cover">`;
            } else {
                previewIcon.innerHTML = `<i data-lucide="file-text" class="w-5 h-5 text-brand-green"></i>`;
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            preview.classList.remove('hidden');
            uploadedFiles[type] = file;

            validateForm();
        }

        // Reset file state
        function deleteFile(type) {
            uploadedFiles[type] = null;
            document.getElementById('file-' + type).value = '';
            document.getElementById('progress-' + type).classList.add('hidden');
            document.getElementById('preview-' + type).classList.add('hidden');
            document.getElementById('dropzone-' + type).classList.remove('hidden');
            document.getElementById('err-' + type).classList.add('hidden');

            validateForm();
        }

        // Show validation error on upload box
        function showUploadError(type, message) {
            const errEl = document.getElementById('err-' + type);
            errEl.textContent = message;
            errEl.classList.remove('hidden');
            deleteFile(type);
        }

        // Individual field validator
        function validateField(id) {
            const field = document.getElementById(id);
            const errEl = document.getElementById('err-' + id);

            if (!field || !errEl) return false;

            let isValid = true;
            const value = field.value.trim();

            if (id === 'fullName') {
                isValid = value.length > 0;
            } else if (id === 'mobileNumber') {
                isValid = /^\d{10}$/.test(value);
            } else if (id === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            } else if (id === 'landArea') {
                const areaNum = parseFloat(value);
                isValid = !isNaN(areaNum) && areaNum > 0;
            } else if (id === 'remarks') {
                const requiresRemarks = document.getElementById('remarks-container').classList.contains('hidden') === false;
                isValid = !requiresRemarks || value.length > 0;
            } else {
                isValid = value.length > 0;
            }

            if (isValid) {
                errEl.classList.add('hidden');
                field.classList.remove('border-red-500');
                field.classList.add('border-brand-green/20');
            } else {
                errEl.classList.remove('hidden');
                field.classList.remove('border-brand-green/20');
                field.classList.add('border-red-500');
            }

            return isValid;
        }

        // Run full form validation to enable/disable submit button
        function validateForm() {
            let formIsValid = true;

            // Text fields validation
            const textFields = ['fullName', 'mobileNumber', 'email', 'completeAddress', 'state', 'district', 'tehsil', 'village', 'khataNumber', 'khasraNumber', 'landArea'];
            textFields.forEach(id => {
                const field = document.getElementById(id);
                const value = field.value.trim();

                if (id === 'mobileNumber') {
                    if (!/^\d{10}$/.test(value)) formIsValid = false;
                } else if (id === 'email') {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) formIsValid = false;
                } else if (id === 'landArea') {
                    const val = parseFloat(value);
                    if (isNaN(val) || val <= 0) formIsValid = false;
                } else {
                    if (value.length === 0) formIsValid = false;
                }
            });

            // Map check
            const lat = document.getElementById('latitude').value;
            const lng = document.getElementById('longitude').value;
            if (!lat || !lng) formIsValid = false;

            // Document uploads validation
            documentTypes.forEach(type => {
                if (type === 'coOwnerNoc') {
                    const numOwnersVal = parseInt(document.getElementById('numOwners').value) || 1;
                    if (numOwnersVal > 1 && !uploadedFiles.coOwnerNoc) {
                        formIsValid = false;
                    }
                } else {
                    if (!uploadedFiles[type]) {
                        formIsValid = false;
                    }
                }
            });

            // Remarks if dispute exists
            const hasRemarksActive = document.getElementById('remarks-container').classList.contains('hidden') === false;
            if (hasRemarksActive) {
                const remarksVal = document.getElementById('remarks').value.trim();
                if (remarksVal.length === 0) formIsValid = false;
            }

            // Declarations
            const dec1 = document.getElementById('declareAuthentic').checked;
            const dec2 = document.getElementById('declareNoDispute').checked;
            if (!dec1 || !dec2) formIsValid = false;

            // Button Control
            const submitBtn = document.getElementById('submit-btn');
            if (formIsValid) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'transform-none', 'shadow-none');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed', 'transform-none', 'shadow-none');
            }

            return formIsValid;
        }

        // Submits the application with spinner animation
        function submitApplication() {
            if (!validateForm()) return;

            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const spinner = document.getElementById('submit-spinner');

            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
            submitText.textContent = 'Submitting Application...';
            spinner.classList.remove('hidden');

            setTimeout(() => {
                // Generate sequential-like Application ID
                const randomId = Math.floor(1000 + Math.random() * 9000);
                const appId = `EVI-2026-${randomId}`;

                // Populate success card
                document.getElementById('display-app-id').textContent = appId;

                // Setup Download Acknowledgement Trigger
                const downloadBtn = document.getElementById('btn-download');
                // Remove existing listener if any
                const newDownloadBtn = downloadBtn.cloneNode(true);
                downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
                newDownloadBtn.addEventListener('click', () => triggerDownload(appId));

                // Smooth swap transition
                const formEl = document.getElementById('land-verification-form');
                const successCard = document.getElementById('success-card');

                // Fade out form
                formEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                formEl.style.opacity = '0';
                formEl.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    formEl.classList.add('hidden');
                    successCard.classList.remove('hidden');
                    // Scroll to top of section
                    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    setTimeout(() => {
                        successCard.classList.remove('scale-95', 'opacity-0');
                        successCard.classList.add('scale-100', 'opacity-100');
                    }, 50);
                }, 300);

            }, 1500);
        }

        // Generate text acknowledgment file and download it
        function triggerDownload(appId) {
            const formData = {
                numOwners: document.getElementById('numOwners').value,
                fullName: document.getElementById('fullName').value.trim(),
                mobile: document.getElementById('mobileNumber').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('completeAddress').value.trim(),
                state: document.getElementById('state').value.trim(),
                district: document.getElementById('district').value.trim(),
                tehsil: document.getElementById('tehsil').value.trim(),
                village: document.getElementById('village').value.trim(),
                khata: document.getElementById('khataNumber').value.trim(),
                khasra: document.getElementById('khasraNumber').value.trim(),
                area: document.getElementById('landArea').value.trim(),
                areaUnit: document.getElementById('areaUnit').value,
                landType: document.querySelector('input[name="landType"]:checked').value,
                latitude: document.getElementById('latitude').value,
                longitude: document.getElementById('longitude').value,
                courtCase: document.querySelector('input[name="courtCase"]:checked').value,
                ownershipDispute: document.querySelector('input[name="ownershipDispute"]:checked').value,
                mortgaged: document.querySelector('input[name="mortgaged"]:checked').value,
                remarks: document.getElementById('remarks').value.trim()
            };

            let content = `=================================================\n`;
            content += `        KDIA EVI LAND VERIFICATION RECEIPT\n`;
            content += `=================================================\n`;
            content += `Application ID   : ${appId}\n`;
            content += `Status           : Pending Verification\n`;
            content += `Submitted Date   : ${new Date().toLocaleDateString()}\n\n`;
            content += `-------------------------------------------------\n`;
            content += `1. OWNER INFORMATION\n`;
            content += `-------------------------------------------------\n`;
            content += `Number of Owners : ${formData.numOwners}\n`;
            content += `Primary Owner    : ${formData.fullName}\n`;
            content += `Mobile Number    : ${formData.mobile}\n`;
            content += `Email Address    : ${formData.email}\n`;
            content += `Address          : ${formData.address}\n\n`;
            content += `-------------------------------------------------\n`;
            content += `2. LAND INFORMATION\n`;
            content += `-------------------------------------------------\n`;
            content += `State / District : ${formData.state} / ${formData.district}\n`;
            content += `Tehsil / Village : ${formData.tehsil} / ${formData.village}\n`;
            content += `Khata / Khasra   : ${formData.khata} / ${formData.khasra}\n`;
            content += `Land Area        : ${formData.area} ${formData.areaUnit}\n`;
            content += `Land Type        : ${formData.landType}\n`;
            content += `Coordinates      : Lat ${formData.latitude}, Lng ${formData.longitude}\n\n`;
            content += `-------------------------------------------------\n`;
            content += `3. LEGAL DECLARATION\n`;
            content += `-------------------------------------------------\n`;
            content += `Court Case?      : ${formData.courtCase}\n`;
            content += `Ownership Dispute: ${formData.ownershipDispute}\n`;
            content += `Mortgaged?       : ${formData.mortgaged}\n`;
            if (formData.remarks) {
                content += `Remarks          : ${formData.remarks}\n`;
            }
            content += `\n=================================================\n`;
            content += `Your request has been registered and is under review. Our verification officer will inspect your plot shortly.\n`;
            content += `Thank you for partnering with KDIA Re Park.\n`;
            content += `=================================================\n`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `KDIA_Acknowledgement_${appId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Resets the entire form and displays it again
        function resetForm() {
            // Reset Text Inputs
            document.getElementById('land-verification-form').reset();

            // Reset district dropdown
            const districtSelect = document.getElementById('district');
            if (districtSelect) {
                districtSelect.innerHTML = '<option value="">Select District</option>';
                districtSelect.disabled = true;
            }
            toggleCoOwnerNoc();
            
            // Delete all uploaded files
            documentTypes.forEach(type => deleteFile(type));

            // Reset dispute radio states and hide remarks
            document.querySelectorAll('input[name="courtCase"]').forEach(el => el.checked = el.value === 'No');
            document.querySelectorAll('input[name="ownershipDispute"]').forEach(el => el.checked = el.value === 'No');
            document.querySelectorAll('input[name="mortgaged"]').forEach(el => el.checked = el.value === 'No');
            toggleRemarks();

            // Reset declarations
            document.getElementById('declareAuthentic').checked = false;
            document.getElementById('declareNoDispute').checked = false;

            // Reset Map Marker
            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';

            // Reset validation states styling
            const fields = ['fullName', 'mobileNumber', 'email', 'completeAddress', 'state', 'district', 'tehsil', 'village', 'khataNumber', 'khasraNumber', 'landArea', 'remarks'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove('border-red-500');
                    el.classList.add('border-brand-green/20');
                }
                const err = document.getElementById('err-' + id);
                if (err) err.classList.add('hidden');
            });

            // Disable submit button again
            validateForm();

            // Toggle form views
            const formEl = document.getElementById('land-verification-form');
            const successCard = document.getElementById('success-card');
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const spinner = document.getElementById('submit-spinner');

            // Reset submit button state
            submitBtn.disabled = true;
            submitBtn.classList.remove('opacity-80');
            submitText.textContent = 'Submit Application';
            spinner.classList.add('hidden');

            successCard.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                successCard.classList.add('hidden');
                formEl.classList.remove('hidden');
                
                setTimeout(() => {
                    formEl.style.opacity = '1';
                    formEl.style.transform = 'translateY(0)';
                    
                    // Refresh map view to ensure tiles load correctly after display toggle
                    if (map) {
                        map.invalidateSize();
                    }
                }, 50);
            }, 300);
        }
    </script>

</body>

</html>
