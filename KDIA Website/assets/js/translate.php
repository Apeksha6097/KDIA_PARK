// <?php header('Content-Type: application/javascript'); ?>
/**
 * KDIA Website Translation Service using Devnagri Translation API
 */

(function() {
    let currentLang = 'en';
    let originalTextNodes = []; // stores { type: 'text'|'placeholder'|'title', node, original: string }
    let isInitialized = false;
    let observer = null;

    // Stub UI injections as they are no longer needed for static translations
    function injectUIElements() {}
    function showLoading(show) {}
    function showToastNotification(message, type = 'info') {}
    // Scans DOM recursively for translatable texts
    function getTranslatableNodes(root = document.body) {
        const nodes = [];
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    // Skip technical elements
                    if (tagName === 'script' || tagName === 'style' || tagName === 'code' || tagName === 'iframe' || tagName === 'noscript' || tagName === 'canvas') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip translation exclusions
                    if (node.classList.contains('no-translate') || node.getAttribute('translate') === 'no') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip icons
                    if (node.getAttribute('data-lucide') || tagName === 'i' || node.classList.contains('lucide')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
                
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue.trim();
                    // Don't translate pure whitespace, single characters, numbers or URLs
                    if (text && text.length > 1 && isNaN(text) && !text.match(/^https?:\/\//)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
                return NodeFilter.FILTER_SKIP;
            }
        });

        let currentNode;
        while (currentNode = walk.nextNode()) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                // Ensure parent element is not excluded
                const parent = currentNode.parentNode;
                if (parent) {
                    const parentTag = parent.tagName.toLowerCase();
                    if (parentTag !== 'script' && parentTag !== 'style' && parentTag !== 'i' && !parent.getAttribute('data-lucide')) {
                        nodes.push({
                            type: 'text',
                            node: currentNode,
                            original: currentNode.nodeValue
                        });
                    }
                }
            }
        }

        // Search for placeholder and title attributes in the root subtree
        const attributeSelector = 'input[placeholder], textarea[placeholder], [title]';
        const elements = root.querySelectorAll ? root.querySelectorAll(attributeSelector) : [];
        
        // If root matches selector itself
        if (root.matches && root.matches(attributeSelector)) {
            processAttributes(root, nodes);
        }
        
        elements.forEach(el => {
            processAttributes(el, nodes);
        });

        return nodes;
    }

    function processAttributes(el, nodes) {
        if (el.closest && (el.closest('.no-translate') || el.closest('[translate="no"]'))) return;
        
        if (el.hasAttribute('placeholder')) {
            const ph = el.getAttribute('placeholder');
            if (ph && ph.trim() && isNaN(ph.trim())) {
                nodes.push({
                    type: 'placeholder',
                    node: el,
                    original: ph
                });
            }
        }
        if (el.hasAttribute('title')) {
            const t = el.getAttribute('title');
            if (t && t.trim() && isNaN(t.trim())) {
                nodes.push({
                    type: 'title',
                    node: el,
                    original: t
                });
            }
        }
    }

    const STATIC_HINDI_TRANSLATIONS = {
        "VNM": "वर्चुअल नेट मीटरिंग",
        "GNM": "ग्रुप नेट मीटरिंग",
        "(Indicative)": "(सांकेतिक)",
        "*All calculations are indicative estimates and do not constitute a financial guarantee or official offer. Actual values depend on site conditions and utility regulations.": "*सभी गणनाएँ सांकेतिक अनुमान हैं और वित्तीय गारंटी या आधिकारिक प्रस्ताव का गठन नहीं करती हैं। वास्तविक मूल्य साइट की स्थितियों और उपयोगिता नियमों पर निर्भर करते हैं।",
        "*All calculations are indicative estimates and do not constitute a financial guarantee or official offer. Scheme benefits may vary based on state regulations.": "*सभी गणनाएँ सांकेतिक अनुमान हैं और वित्तीय गारंटी या आधिकारिक प्रस्ताव का गठन नहीं करती हैं। योजना के लाभ राज्य के नियमों के आधार पर भिन्न हो सकते हैं।",
        "*All values are indicative estimates. Actual profits depend on operational factors, electricity costs, and local market conditions.": "*सभी मूल्य सांकेतिक अनुमान हैं। वास्तविक लाभ परिचालन कारकों, बिजली की लागत और स्थानीय बाजार की स्थितियों पर निर्भर करते हैं।",
        "*Based on kWh allocation required for your consumption": "*आपके उपभोग के लिए आवश्यक kWh आवंटन पर आधारित",
        "*No capital expenditure required under RESCO model": "*RESCO मॉडल के तहत किसी पूंजीगत व्यय की आवश्यकता नहीं है",
        "*Tariff agreed with the RESCO provider for solar energy supply": "*सौर ऊर्जा आपूर्ति के लिए RESCO प्रदाता के साथ सहमत टैरिफ",
        "+1 (800) KDIA-RE": "+1 (800) KDIA-RE",
        "/ Manure": "/ खाद",
        "/ Rural Energy": "/ ग्रामीण ऊर्जा",
        "/kWh": "/kWh",
        "/month": "/माह",
        "/year": "/वर्ष",
        "0%": "0%",
        "01:12 / 03:45": "01:12 / 03:45",
        "1. Acceptance of Terms": "1. शर्तों की स्वीकृति",
        "1. Information We Collect": "1. जानकारी जो हम एकत्र करते हैं",
        "1. Is the land involved in any court case?": "1. क्या भूमि किसी अदालती मामले में शामिल है?",
        "10 Years": "10 वर्ष",
        "10-digit mobile number": "10-अंकों का मोबाइल नंबर",
        "10. Contact Information": "10. संपर्क जानकारी",
        "10. Contact and Queries": "10. संपर्क और प्रश्न",
        "120 kW": "120 किलोवाट",
        "14%": "14%",
        "160 kW": "160 किलोवाट",
        "2. How We Use Your Information": "2. हम आपकी जानकारी का उपयोग कैसे करते हैं",
        "2. Is there any ownership dispute?": "2. क्या कोई स्वामित्व विवाद है?",
        "2. Website Usage": "2. वेबसाइट का उपयोग",
        "20% of total": "कुल का 20%",
        "200 kW": "200 किलोवाट",
        "24/7 Monitoring": "24/7 मॉनिटरिंग",
        "24/7 Smart Network Monitoring": "24/7 स्मार्ट नेटवर्क मॉनिटरिंग",
        "24/7 remote monitoring, maintenance support, and diagnostic checks to guarantee uptime.": "अपटाइम की गारंटी के लिए 24/7 रिमोट मॉनिटरिंग, रखरखाव सहायता और नैदानिक जांच।",
        "3 Years": "3 वर्ष",
        "3. Information Sharing": "3. सूचना साझा करना",
        "3. Is the land mortgaged or under any legal restriction?": "3. क्या भूमि गिरवी रखी गई है या किसी कानूनी प्रतिबंध के अधीन है?",
        "3. Service Information": "3. सेवा संबंधी जानकारी",
        "4. Data Security": "4. डेटा सुरक्षा",
        "4. User Information and Submissions": "4. उपयोगकर्ता की जानकारी और प्रस्तुतियाँ",
        "5 Years": "5 वर्ष",
        "5. Data Storage and Retention": "5. डेटा भंडारण और प्रतिधारण",
        "5. Solar and EV Calculations": "5. सौर और ईवी गणना",
        "6-digit pincode": "6-अंकों का पिनकोड",
        "6. Cookies and Website Technologies": "6. कुकीज़ और वेबसाइट तकनीक",
        "6. Intellectual Property": "6. बौद्धिक संपदा",
        "60 kW": "60 किलोवाट",
        "60 kW Charger": "60 किलोवाट चार्जर",
        "60 kW to 240 kW DC fast chargers": "60 किलोवाट से 240 किलोवाट डीसी फास्ट चार्जर",
        "7%": "7%",
        "7. Third-Party Links and Services": "7. तृतीय-पक्ष लिंक और सेवाएं",
        "7. Third-Party Services": "7. तृतीय-पक्ष सेवाएं",
        "8 Years": "8 वर्ष",
        "8. Limitation of Liability": "8. दायित्व की सीमा",
        "8. User Rights": "8. उपयोगकर्ता अधिकार",
        "80%": "80%",
        "80% of total": "कुल का 80%",
        "9%": "9%",
        "9. Changes to Terms & Conditions": "9. नियम और शर्तों में परिवर्तन",
        "9. Changes to Terms &amp; Conditions": "9. नियम और शर्तों में परिवर्तन",
        "9. Changes to the Privacy Policy": "9. गोपनीयता नीति में परिवर्तन",
        "A KDIA Re Park representative will contact you soon to discuss your clean energy journey.": "आपकी स्वच्छ ऊर्जा यात्रा पर चर्चा करने के लिए जल्द ही एक केडीआईए आरई पार्क प्रतिनिधि आपसे संपर्क करेगा।",
        "A collaborative ownership model where multiple consumers jointly invest in and benefit from a centralized solar power facility.": "एक सहयोगी स्वामित्व मॉडल जहां कई उपभोक्ता संयुक्त रूप से निवेश करते हैं और एक केंद्रीकृत सौर ऊर्जा सुविधा से लाभान्वित होते हैं।",
        "A dedicated solar power model where the consumer directly owns the solar asset and consumes the majority of the electricity produced.": "एक समर्पित सौर ऊर्जा मॉडल जहां उपभोक्ता सीधे सौर संपत्ति का मालिक होता है और उत्पादित अधिकांश बिजली का उपभोग करता है।",
        "A flagship government scheme providing significant subsidies for residential rooftop solar installations up to 3kW.": "3 किलोवाट तक के आवासीय रूफटॉप सौर स्थापनाओं के लिए महत्वपूर्ण सब्सिडी प्रदान करने वाली एक प्रमुख सरकारी योजना।",
        "A shared energy model where multiple connections within the same organization benefit from a single centralized solar installation.": "एक साझा ऊर्जा मॉडल जहां एक ही संगठन के भीतर कई कनेक्शन एक केंद्रीकृत सौर स्थापना से लाभान्वित होते हैं।",
        "Aadhaar Card": "आधार कार्ड",
        "About & Renewable Energy | Kdia Re Park": "कंपनी और नवीकरणीय ऊर्जा | केडीआईए आरई पार्क",
        "About CBG": "सीबीजी के बारे में",
        "Acre": "एकड़",
        "Active": "सक्रिय",
        "Address": "पता",
        "Advanced AI dashboards provide real-time transparency into your portfolio's performance.": "उन्नत एआई डैशबोर्ड आपके पोर्टफोलियो के प्रदर्शन में वास्तविक समय पारदर्शिता प्रदान करते हैं।",
        "Advanced Processing": "उन्नत प्रसंस्करण",
        "Agreed Tariff (₹/kWh)": "सहमत टैरिफ (₹/kWh)",
        "Agricultural": "कृषि",
        "Agricultural Power": "कृषि शक्ति",
        "All calculator results, estimated profits, land requirements, savings, and other figures shown on the website are indicative estimates. Actual results may vary depending on local tariffs, climate, and real-world conditions.": "वेबसाइट पर दिखाए गए सभी कैलकुलेटर परिणाम, अनुमानित लाभ, भूमि की आवश्यकताएं, बचत और अन्य आंकड़े सांकेतिक अनुमान हैं। वास्तविक परिणाम स्थानीय टैरिफ, जलवायु और वास्तविक दुनिया की स्थितियों के आधार पर भिन्न हो सकते हैं।",
        "All website content, branding, logos, graphics, text, layout design, and other materials belong to KDIA RE Park unless otherwise stated and cannot be copied, distributed, or reused without our prior written permission.": "सभी वेबसाइट सामग्री, ब्रांडिंग, लोगो, ग्राफिक्स, टेक्स्ट, लेआउट डिज़ाइन और अन्य सामग्रियां अन्यथा बताए जाने तक केडीआईए आरई पार्क की हैं और हमारी पूर्व लिखित अनुमति के बिना कॉपी, वितरित या पुन: उपयोग नहीं की जा सकती हैं।",
        "Allocation": "आवंटन",
        "Already have an account?": "पहले से ही एक खाता है?",
        "Anaerobic": "अवायवीय",
        "Anaerobic Digestion & Purification": "अवायवीय पाचन और शुद्धिकरण",
        "Anaerobic Digestion &amp; Purification": "अवायवीय पाचन और शुद्धिकरण",
        "Andaman and Nicobar Islands": "अंडमान और निकोबार द्वीप समूह",
        "Andhra Pradesh": "आंध्र प्रदेश",
        "Annual Net Savings": "वार्षिक शुद्ध बचत",
        "Annual Net Savings under RESCO Model": "RESCO मॉडल के तहत वार्षिक शुद्ध बचत",
        "Apartment garages and individual homes": "अपार्टमेंट गैरेज और व्यक्तिगत घर",
        "App ID:": "ऐप आईडी:",
        "Applicant Declaration": "आवेदक की घोषणा",
        "Application": "आवेदन",
        "Application Submitted Successfully": "आवेदन सफलतापूर्वक जमा किया गया",
        "Application Submitted Successfully!": "आवेदन सफलतापूर्वक जमा किया गया!",
        "Applications": "आवेदन",
        "Apply Now": "अभी आवेदन करें",
        "Apply for Solar Subscription": "सौर सदस्यता के लिए आवेदन करें",
        "Approx Monthly Bill": "अनुमानित मासिक बिल",
        "Approximate Investment": "अनुमानित निवेश",
        "Area Unit": "क्षेत्रफल इकाई",
        "Area of Land": "भूमि का क्षेत्रफल",
        "Arunachal Pradesh": "अरुणाचल प्रदेश",
        "Ask KDIA": "केडीआईए से पूछें",
        "Ask about Net Metering, VNM...": "नेट मीटरिंग, वीएनएम के बारे में पूछें...",
        "Assess and secure agricultural residue, organic waste, and biomass supplies from regional farms and municipalities.": "क्षेत्रीय खेतों और नगर पालिकाओं से कृषि अवशेषों, जैविक कचरे और बायोमास की आपूर्ति का आकलन और सुरक्षित करना।",
        "Asset Acquisition": "संपत्ति अधिग्रहण",
        "Assign a vendor to me": "मुझे एक विक्रेता आवंटित करें",
        "Auto-allocated based on charger capacity": "चार्जर क्षमता के आधार पर स्वतः आवंटित",
        "Automotive": "ऑटोमोटिव",
        "Automotive (CNG Alternative)": "ऑटोमोटिव (सीएनजी विकल्प)",
        "Average Monthly Unit Consumption (kWh)": "औसत मासिक यूनिट खपत (kWh)",
        "Avg. Monthly Bill (Guidance)": "औसत मासिक बिल (मार्गदर्शन)",
        "BMS Load": "बीएमएस लोड",
        "Basic Info": "बुनियादी जानकारी",
        "Basic Information": "बुनियादी जानकारी",
        "Benefits of": "के लाभ",
        "Best For:": "इसके लिए सबसे अच्छा:",
        "Bigha": "बीघा",
        "Bihar": "बिहार",
        "Bio-Fertiliser": "जैव-उर्वरक",
        "Biogas": "बायोगैस",
        "Boilers, furnaces, and co-generation plants": "बॉयलर, भट्टियां, और सह-उत्पादन संयंत्र",
        "Boosts domestic renewable energy production, reducing reliance on imported crude oil and liquefied natural gas.": "घरेलू नवीकरणीय ऊर्जा उत्पादन को बढ़ावा देता है, जिससे आयातित कच्चे तेल और तरलीकृत प्राकृतिक गैस पर निर्भरता कम होती है।",
        "Bottling & Grid": "बॉटलिंग और ग्रिड",
        "Bottling &amp; Grid": "बॉटलिंग और ग्रिड",
        "Bottling, Distribution & Enrichment": "बॉटलिंग, वितरण और संवर्धन",
        "Bottling, Distribution &amp; Enrichment": "बॉटलिंग, वितरण और संवर्धन",
        "Build scalable and diversified renewable portfolios at regional levels.": "क्षेत्रीय स्तरों पर स्केलेबल और विविध नवीकरणीय पोर्टफोलियो का निर्माण करना।",
        "Build scalable and grid-compliant fast charging hubs across key highways and zones.": "प्रमुख राजमार्गों और क्षेत्रों में स्केलेबल और ग्रिड-अनुकूल फास्ट चार्जिंग हब बनाएं।",
        "Building Management Systems (BMS) load sharing": "बिल्डिंग मैनेजमेंट सिस्टम (बीएमएस) लोड शेयरिंग",
        "Buildings": "इमारतें",
        "Business": "व्यापार",
        "Business & Energy Opportunities": "व्यापार और ऊर्जा अवसर",
        "Business &amp; Energy Opportunities": "व्यापार और ऊर्जा अवसर",
        "Business parks, corporate spaces, and retail centers": "बिजनेस पार्क, कॉर्पोरेट स्थान और खुदरा केंद्र",
        "Businesses without suitable rooftop space": "उपयुक्त छत की जगह के बिना व्यवसाय",
        "By accessing and using the KDIA RE Park website, users agree to follow and be bound by these Terms & Conditions, as well as all applicable laws and regulations.": "केडीआईए आरई पार्क वेबसाइट तक पहुंच कर और उसका उपयोग करके, उपयोगकर्ता इन नियमों और शर्तों के साथ-साथ सभी लागू कानूनों और नियमों का पालन करने और उनसे बाध्य होने के लिए सहमत होते हैं।",
        "By accessing and using the KDIA RE Park website, users agree to follow and be bound by these Terms &amp; Conditions, as well as all applicable laws and regulations.": "केडीआईए आरई पार्क वेबसाइट तक पहुंच कर और उसका उपयोग करके, उपयोगकर्ता इन नियमों और शर्तों के साथ-साथ सभी लागू कानूनों और नियमों का पालन करने और उनसे बाध्य होने के लिए सहमत होते हैं।",
        "By creating accessible and future-ready clean energy infrastructure, KDIA is driving local economic resilience. This reflects our long-term commitment to innovation, sustainability, and responsible development, laying the groundwork for a cleaner, greener India for generations to come.": "सुलभ और भविष्य के लिए तैयार स्वच्छ ऊर्जा बुनियादी ढांचे का निर्माण करके, केडीआईए स्थानीय आर्थिक लचीलेपन को बढ़ावा दे रहा है। यह नवाचार, स्थिरता और जिम्मेदार विकास के प्रति हमारी दीर्घकालिक प्रतिबद्धता को दर्शाता है, जो आने वाली पीढ़ियों के लिए एक स्वच्छ, हरित भारत की नींव रखता है।",
        "CBG Process:": "सीबीजी प्रक्रिया:",
        "CBG SOLUTIONS": "सीबीजी समाधान",
        "CBG Solutions &": "सीबीजी समाधान और",
        "CBG Solutions &amp;": "सीबीजी समाधान और",
        "CBG Strategic": "सीबीजी रणनीतिक",
        "CBG is compressed and purified to serve as a direct, zero-emission substitute for compressed natural gas (CNG) in commercial trucks, public buses, and passenger vehicles.": "सीबीजी को संपीड़ित और शुद्ध किया जाता है ताकि यह वाणिज्यिक ट्रकों, सार्वजनिक बसों और यात्री वाहनों में संपीड़ित प्राकृतिक गैस (सीएनजी) के प्रत्यक्ष, शून्य-उत्सर्जन विकल्प के रूप में काम कर सके।",
        "CNG Dispensing": "सीएनजी वितरण",
        "CO₂ reduction": "CO₂ उत्सर्जन में कमी",
        "Calculate EV charging station requirements, land area, and expected earnings based on station capacity and usage.": "स्टेशन की क्षमता और उपयोग के आधार पर ईवी चार्जिंग स्टेशन आवश्यकताओं, भूमि क्षेत्र और अपेक्षित कमाई की गणना करें।",
        "Calculator Inputs": "कैलकुलेटर इनपुट",
        "Call Us": "हमें कॉल करें",
        "Capacity Range": "क्षमता सीमा",
        "Capacity:": "क्षमता:",
        "Capital Investment": "पूंजी निवेश",
        "Captive": "कैप्टिव",
        "Captive Model": "कैप्टिव मॉडल",
        "Captive Solar": "कैप्टिव सौर",
        "Center": "केंद्र",
        "Central Delhi": "मध्य दिल्ली",
        "Centralized Ops": "केंद्रीकृत संचालन",
        "Centralized solar park": "केंद्रीकृत सौर पार्क",
        "Charger": "चार्जर",
        "Charger Capacity": "चार्जर क्षमता",
        "Chargers": "चार्जर्स",
        "Charging": "चार्जिंग",
        "Charging Hub": "चार्जिंग हब",
        "Charkhi Dadri": "चरखी दादरी",
        "Chhota Udaipur": "छोटा उदयपुर",
        "Choose KDIA": "केडीआईए चुनें",
        "Circular Economy": "परिपत्र अर्थव्यवस्था",
        "City": "शहर",
        "Clean Energy": "स्वच्छ ऊर्जा",
        "Clean solar energy provides zero-emission power that protects your operations from rising utility tariffs. KDIA builds and manages optimized solar park systems to deliver immediate savings.": "स्वच्छ सौर ऊर्जा शून्य-उत्सर्जन बिजली प्रदान करती है जो आपके संचालन को बढ़ते बिजली शुल्कों से बचाती है। केडीआईए तत्काल बचत प्रदान करने के लिए अनुकूलित सौर पार्क प्रणालियों का निर्माण और प्रबंधन करता है।",
        "Clean-burning gas supplied directly or via cylinders to hotels, restaurants, and institutional kitchens, offering cost savings and reducing indoor air pollution.": "होटल, रेस्तरां और संस्थागत रसोईघरों को सीधे या सिलेंडरों के माध्यम से स्वच्छ-जलती हुई गैस की आपूर्ति, लागत बचत की पेशकश और इनडोर वायु प्रदूषण को कम करना।",
        "Click anywhere on the map to place a pin and capture land coordinates.": "मानचित्र पर पिन रखने और भूमि निर्देशांक प्राप्त करने के लिए कहीं भी क्लिक करें।",
        "Close": "बंद करें",
        "Co-owner NOC": "सह-मालिक एनओसी",
        "Coch Behar": "कूचबिहार",
        "Collected information may be used to process user inquiries, solar subscription applications, EV station requirements, land verification requests, and to improve overall website services and functionality.": "एकत्रित जानकारी का उपयोग उपयोगकर्ता की पूछताछ, सौर सदस्यता आवेदन, ईवी स्टेशन आवश्यकताओं, भूमि सत्यापन अनुरोधों को संसाधित करने और समग्र वेबसाइट सेवाओं और कार्यक्षमता में सुधार करने के लिए किया जा सकता है।",
        "Commercial": "वाणिज्यिक",
        "Commercial Charging": "वाणिज्यिक चार्जिंग",
        "Commercial Fleet": "वाणिज्यिक बेड़ा",
        "Commercial Kitchens": "वाणिज्यिक रसोई",
        "Commercial Waste": "वाणिज्यिक कचरा",
        "Commitment to transparency, integrity, and strict regulatory compliance.": "पारदर्शिता, अखंडता और सख्त नियामक अनुपालन के प्रति प्रतिबद्धता।",
        "Company & Energy Solutions": "कंपनी और ऊर्जा समाधान",
        "Company &amp; Energy Solutions": "कंपनी और ऊर्जा समाधान",
        "Compare VNM, GNM, Captive and Group Captive models with advanced financial analysis.": "उन्नत वित्तीय विश्लेषण के साथ वीएनएम, जीएनएम, कैप्टिव और ग्रुप कैप्टिव मॉडल की तुलना करें।",
        "Compare financial models across VNM, GNM, and Captive schemes": "वीएनएम, जीएनएम और कैप्टिव योजनाओं में वित्तीय मॉडलों की तुलना करें",
        "Complete Address": "पूरा पता",
        "Comprehensive guidelines for infrastructure, land allotment, and connectivity requirements for large-scale solar parks.": "बड़े पैमाने पर सौर पार्कों के लिए बुनियादी ढांचे, भूमि आवंटन और कनेक्टिविटी आवश्यकताओं के लिए व्यापक दिशा-निर्देश।",
        "Compressed": "संपीड़ित",
        "Compressed Bio Gas (CBG) is an eco-friendly renewable fuel produced from organic waste materials. KDIA RE Park is committed to building a circular energy economy by converting agricultural residues, animal manure, and municipal solid waste into high-quality green gas.": "संपीड़ित बायो गैस (सीबीजी) जैविक अपशिष्ट पदार्थों से उत्पादित एक पर्यावरण-अनुकूल नवीकरणीय ईंधन है। केडीआईए आरई पार्क कृषि अवशेषों, पशु खाद और नगरपालिका ठोस कचरे को उच्च गुणवत्ता वाली हरित गैस में बदलकर एक परिपत्र ऊर्जा अर्थव्यवस्था के निर्माण के लिए प्रतिबद्ध है।",
        "Compressed to 200 bar for vehicle dispensing": "वाहन वितरण के लिए 200 बार तक संपीड़ित",
        "Confirm Password": "पासवर्ड की पुष्टि करें",
        "Connection": "कनेक्शन",
        "Connection Type": "कनेक्शन का प्रकार",
        "Consumer": "उपभोक्ता",
        "Consumer A": "उपभोक्ता A",
        "Consumer B": "उपभोक्ता B",
        "Consumer C": "उपभोक्ता C",
        "Consumption:": "खपत:",
        "Contact": "संपर्क",
        "Contact Info": "संपर्क जानकारी",
        "Contact Our Experts": "हमारे विशेषज्ञों से संपर्क करें",
        "Contact Us": "संपर्क करें",
        "Contact Us | Kdia Re Park": "संपर्क करें | केडीआईए आरई पार्क",
        "Continuous testing, activation, 24/7 smart network monitoring, and technical maintenance ensure maximum operational reliability.": "निरंतर परीक्षण, सक्रियण, 24/7 स्मार्ट नेटवर्क मॉनिटरिंग और तकनीकी रखरखाव अधिकतम परिचालन विश्वसनीयता सुनिश्चित करते हैं।",
        "Convenience & Uptime": "सुविधा और अपटाइम",
        "Convenience &amp; Uptime": "सुविधा और अपटाइम",
        "Cooking gas networks and cylinder delivery": "रसोई गैस नेटवर्क और सिलेंडर वितरण",
        "Cost Performance": "लागत प्रदर्शन",
        "Creates recurring revenues for farmers from biomass waste, while offering cheaper, price-stable fuel to industries.": "किसानों के लिए बायोमास कचरे से आवर्ती राजस्व पैदा करता है, जबकि उद्योगों को सस्ता, मूल्य-स्थिर ईंधन प्रदान करता है।",
        "Customer Service": "ग्राहक सेवा",
        "DC Charger": "डीसी चार्जर",
        "DISCOM Tariff": "डिस्कॉम टैरिफ",
        "Dadra and Nagar Haveli": "दादरा और नगर हवेली",
        "Dadra and Nagar Haveli and Daman and Diu": "दादरा और नगर हवेली और दमन और दीव",
        "Daily": "दैनिक",
        "Daily × 30 days": "दैनिक × 30 दिन",
        "Daily × 365 days": "दैनिक × 365 दिन",
        "Dakshin Dinajpur": "दक्षिण दिनाजपुर",
        "Dakshina Kannada": "दक्षिण कन्नड़",
        "Date of Birth": "जन्म तिथि",
        "Decentralized microgrids and farming machinery operated on bio-energy, making rural communities self-reliant and reducing dependence on diesel generator sets.": "जैव-ऊर्जा पर संचालित विकेंद्रीकृत माइक्रोग्रिड और कृषि मशीनरी, ग्रामीण समुदायों को आत्मनिर्भर बनाना और डीजल जनरेटर सेटों पर निर्भरता कम करना।",
        "Decentralizing power generation to provide long-term grid independence.": "दीर्घकालिक ग्रिड स्वतंत्रता प्रदान करने के लिए बिजली उत्पादन का विकेंद्रीकरण करना।",
        "Dedicated": "समर्पित",
        "Delete file": "फ़ाइल हटाएं",
        "Delhi": "दिल्ली",
        "Deliver reliable, automated charging access with 24/7 smart network monitoring and user support.": "24/7 स्मार्ट नेटवर्क मॉनिटरिंग और उपयोगकर्ता सहायता के साथ विश्वसनीय, स्वचालित चार्जिंग पहुंच प्रदान करें।",
        "Details": "विवरण",
        "Devbhumi Dwarka": "देवभूमि द्वारका",
        "Dibang Valley": "दिबांग घाटी",
        "Digester": "डाइजेस्टर",
        "Digestion": "पाचन",
        "Dima Hasao": "दीमा हसाओ",
        "Direct Offsets": "प्रत्यक्ष ऑफसेट",
        "Direct Utility Savings": "प्रत्यक्ष उपयोगिता बचत",
        "Direct integration with utility infrastructure for reliable distribution": "विश्वसनीय वितरण के लिए उपयोगिता बुनियादी ढांचे के साथ सीधा एकीकरण",
        "Directly integrate EV charging stations with solar microgrids for zero-emission energy.": "शून्य-उत्सर्जन ऊर्जा के लिए ईवी चार्जिंग स्टेशनों को सीधे सौर माइक्रोग्रिड के साथ एकीकृत करें।",
        "Director's Vision": "निदेशक का दृष्टिकोण",
        "Displace fossil fuel consumption and significantly lower carbon emissions in urban areas.": "जीवाश्म ईंधन की खपत को कम करें और शहरी क्षेत्रों में कार्बन उत्सर्जन को काफी कम करें।",
        "Distributed across grouped connections": "समूहबद्ध कनेक्शनों में वितरित",
        "District": "जिला",
        "Diverts agricultural residues and municipal organic waste from landfills, eliminating open-air burning and methane release.": "कृषि अवशेषों और नगरपालिका जैविक कचरे को लैंडफिल से हटाता है, जिससे खुली हवा में जलने और मीथेन रिलीज को समाप्त किया जाता है।",
        "Don't have an account?": "खाता नहीं है?",
        "Download Acknowledgement": "पावती डाउनलोड करें",
        "Drag & drop or": "खींचे और छोड़ें या",
        "Driving environmental sustainability and economic opportunities.": "पर्यावरणीय स्थिरता और आर्थिक अवसरों को बढ़ावा देना।",
        "E-commerce delivery vehicles, fleet cars, and buses": "ई-कॉमर्स डिलीवरी वाहन, बेड़े की कारें और बसें",
        "EV CHARGING": "ईवी चार्जिंग",
        "EV Charging": "ईवी चार्जिंग",
        "EV Infrastructure": "ईवी बुनियादी ढांचा",
        "EV Process:": "ईवी प्रक्रिया:",
        "EV Station": "ईवी स्टेशन",
        "EV Strategic": "ईवी रणनीतिक",
        "EV owners seeking convenient overnight solutions": "ईवी मालिक जो सुविधाजनक रात भर के समाधान की तलाश में हैं",
        "East Champaran": "पूर्वी चंपारण",
        "East Delhi": "पूर्वी दिल्ली",
        "East Garo Hills": "पूर्वी गारो हिल्स",
        "East Godavari": "पूर्वी गोदावरी",
        "East Jaintia Hills": "पूर्वी जयंतिया हिल्स",
        "East Kameng": "पूर्वी कामेंग",
        "East Khasi Hills": "पूर्वी खासी हिल्स",
        "East Siang": "पूर्वी सियांग",
        "East Sikkim": "पूर्वी सिक्किम",
        "East Singhbhum": "पूर्वी सिंहभूम",
        "Economies of scale significantly reduce the per-watt cost of clean energy infrastructure.": "पैमाने की अर्थव्यवस्थाएं स्वच्छ ऊर्जा बुनियादी ढांचे की प्रति-वाट लागत को काफी कम करती हैं।",
        "Efficiency": "दक्षता",
        "Electric": "इलेक्ट्रिक",
        "Electricity Grid": "बिजली ग्रिड",
        "Eligibility": "पात्रता",
        "Eligibility varies by region and utility provider. Generally, residential, commercial, and industrial consumers with active electricity connections can participate. For VNM and GNM, you'll need to be within the same utility distribution area as the solar park. Contact us for a detailed eligibility assessment.": "पात्रता क्षेत्र और उपयोगिता प्रदाता के अनुसार भिन्न होती है। आम तौर पर, सक्रिय बिजली कनेक्शन वाले आवासीय, वाणिज्यिक और औद्योगिक उपभोक्ता भाग ले सकते हैं। वीएनएम और जीएनएम के लिए, आपको सौर पार्क के समान उपयोगिता वितरण क्षेत्र के भीतर होना चाहिए। विस्तृत पात्रता मूल्यांकन के लिए हमसे संपर्क करें।",
        "Email Address": "ईमेल पता",
        "Email Us": "हमें ईमेल करें",
        "Employ state-of-the-art anaerobic digestion and gas purification systems to achieve high-methane purity.": "अवायवीय पाचन और गैस शुद्धिकरण प्रणालियों को नियोजित करना ताकि उच्च मीथेन शुद्धता प्राप्त की जा सके।",
        "Employee /": "कर्मचारी /",
        "Employees, shoppers, and commercial visitors": "कर्मचारी, खरीदार और वाणिज्यिक आगंतुक",
        "Encourage clean transport adoption by powering electric vehicles with renewable solar energy.": "इलेक्ट्रिक वाहनों को नवीकरणीय सौर ऊर्जा से संचालित करके स्वच्छ परिवहन को बढ़ावा देना।",
        "Energy Flow:": "ऊर्जा प्रवाह:",
        "Energy Independence": "ऊर्जा स्वतंत्रता",
        "Energy Models": "ऊर्जा मॉडल",
        "Energy Transition": "ऊर्जा संक्रमण",
        "Energy generated by centralized solar assets directly offsets your consumption bills.": "केंद्रीकृत सौर संपत्तियों द्वारा उत्पन्न ऊर्जा सीधे आपके उपभोग बिलों की भरपाई करती है।",
        "Energy is generated at a centralized solar park and virtually credited to your consumption point, regardless of physical distance.": "ऊर्जा एक केंद्रीकृत सौर पार्क में उत्पन्न होती है और भौतिक दूरी की परवाह किए बिना आपके उपभोग बिंदु पर आभासी रूप से जमा की जाती है।",
        "Enter Vendor Name or Code": "विक्रेता का नाम या कोड दर्ज करें",
        "Enter a positive number": "एक धनात्मक संख्या दर्ज करें",
        "Enter complete address": "पूरा पता दर्ज करें",
        "Enter complete residential address": "पूरा आवासीय पता दर्ज करें",
        "Enter full name of primary owner": "प्राथमिक मालिक का पूरा नाम दर्ज करें",
        "Enter your full name": "अपना पूरा नाम दर्ज करें",
        "Enter your vendor's name or code below": "नीचे अपने विक्रेता का नाम या कोड दर्ज करें",
        "Environmental Benefits": "पर्यावरणीय लाभ",
        "Equity Invested": "इक्विटी निवेश",
        "Equivalent to planting": "पौधे लगाने के बराबर",
        "Establish high-pressure bottling and pipeline injection networks for reliable distribution to industrial and automotive clients.": "औद्योगिक और ऑटोमोटिव ग्राहकों को विश्वसनीय वितरण के लिए उच्च दबाव बॉटलर और पाइपलाइन इंजेक्शन नेटवर्क स्थापित करना।",
        "Estimate Based On": "अनुमान का आधार",
        "Estimate Your": "अनुमान लगाएं",
        "Estimate savings, investment, ROI and environmental impact based on your energy consumption and financing options.": "अपनी ऊर्जा खपत और वित्तपोषण विकल्पों के आधार पर बचत, निवेश, आरओआई और पर्यावरणीय प्रभाव का अनुमान लगाएं।",
        "Estimate your daily, monthly and yearly earnings from EV charging stations": "ईवी चार्जिंग स्टेशनों से अपनी दैनिक, मासिक और वार्षिक कमाई का अनुमान लगाएं",
        "Estimated Annual Savings": "अनुमानित वार्षिक बचत",
        "Estimated space required for stations": "स्टेशनों के लिए आवश्यक अनुमानित स्थान",
        "Evaluate property locations for power grid capacity, vehicle access, and commercial viability.": "बिजली ग्रिड क्षमता, वाहन पहुंच और व्यावसायिक व्यवहार्यता के लिए संपत्ति स्थानों का मूल्यांकन करें।",
        "Excellence": "उत्कृष्टता",
        "Explore Our": "हमारे खोजें",
        "Explore our specialized renewable infrastructure portfolios. Select a category below to view our operations and solutions.": "हमारे विशिष्ट नवीकरणीय बुनियादी ढांचा पोर्टफोलियो का अन्वेषण करें। हमारे संचालन और समाधानों को देखने के लिए नीचे एक श्रेणी चुनें।",
        "Farm Biomass": "कृषि बायोमास",
        "Farm Equipment": "कृषि उपकरण",
        "Farms, cooperative societies, and rural regions": "खेत, सहकारी समितियां, और ग्रामीण क्षेत्र",
        "Fatehgarh Sahib": "फतेहगढ़ साहिब",
        "Feedstock Sourcing": "कच्चा माल सोर्सिंग",
        "Female": "महिला",
        "Financial Analysis": "वित्तीय विश्लेषण",
        "Financial Breakdown": "वित्तीय विवरण",
        "Financing Details": "वित्तपोषण विवरण",
        "Fleet": "बेड़ा",
        "Fleet Charging": "बेड़ा चार्जिंग",
        "Fleet Logistics": "बेड़ा रसद",
        "Food /": "खाना /",
        "For VNM/GNM models, since you're connecting to an existing solar park, the timeline is significantly shorter than traditional installations. After initial consultation and agreement signing, energy credits typically begin within 4-8 weeks, subject to utility approvals and grid connection procedures.": "वीएनएम/जीएनएम मॉडलों के लिए, चूंकि आप एक मौजूदा सौर पार्क से जुड़ रहे हैं, इसलिए समय-सीमा पारंपरिक स्थापनाओं की तुलना में काफी कम है। प्रारंभिक परामर्श और समझौते पर हस्ताक्षर करने के बाद, ऊर्जा क्रेडिट आम तौर पर 4-8 सप्ताह के भीतर शुरू हो जाते हैं, जो उपयोगिता अनुमोदन और ग्रिड कनेक्शन प्रक्रियाओं के अधीन है।",
        "Forgot Password?": "पासवर्ड भूल गए?",
        "Founder & Director": "संस्थापक और निदेशक",
        "Founder &amp; Director": "संस्थापक और निदेशक",
        "Framework": "ढांचा",
        "Frequently Asked": "अक्सर पूछे जाने वाले",
        "From site assessment and capacity planning to equipment selection, we handle the end-to-end station deployment process.": "साइट मूल्यांकन और क्षमता योजना से लेकर उपकरण चयन तक, हम शुरू से अंत तक स्टेशन तैनाती प्रक्रिया को संभालते हैं।",
        "Full Name": "पूरा नाम",
        "Future-Ready": "भविष्य के लिए तैयार",
        "Future-Ready Infrastructure": "भविष्य के लिए तैयार बुनियादी ढांचा",
        "Gas": "गैस",
        "Gautam Buddha Nagar": "गौतम बुद्ध नगर",
        "Gender": "लिंग",
        "Generic Tariff Order for RE Projects": "नवीकरणीय ऊर्जा परियोजनाओं के लिए सामान्य टैरिफ आदेश",
        "Get in": "संपर्क में",
        "Gir Somnath": "गीर सोमनाथ",
        "Global Headquarters": "वैश्विक मुख्यालय",
        "Governance Standards": "शासन मानक",
        "Govt.": "सरकारी",
        "Govt. Schemes & Policies": "सरकारी योजनाएं और नीतियां",
        "Govt. Schemes & Policies | KDIA Re Park": "सरकारी योजनाएं और नीतियां | केडीआईए आरई पार्क",
        "Govt. Schemes &amp; Policies": "सरकारी योजनाएं और नीतियां",
        "Grid": "ग्रिड",
        "Grid Connectivity": "ग्रिड कनेक्टिविटी",
        "Group Captive": "ग्रुप कैप्टिव",
        "Group Captive Model": "ग्रुप कैप्टिव मॉडल",
        "Group Consumer 1": "समूह उपभोक्ता 1",
        "Group Consumer 2": "समूह उपभोक्ता 2",
        "Group Consumer 3": "समूह उपभोक्ता 3",
        "Group Consumer 4": "समूह उपभोक्ता 4",
        "Group Net Meter": "ग्रुप नेट मीटर",
        "Group Net Metering (GNM)": "ग्रुप नेट मीटरिंग (जीएनएम)",
        "Group Net Metering (GNM) enables multiple buildings to share energy produced by a single solar plant...": "ग्रुप नेट मीटरिंग (GNM) एक ही सौर संयंत्र द्वारा उत्पादित ऊर्जा को कई इमारतों में साझा करने में सक्षम बनाता है...",
        "Guaranteed Carbon Offsets": "गारंटीकृत कार्बन ऑफसेट",
        "Guidelines": "दिशा-निर्देश",
        "Gujarat": "गुजरात",
        "Haryana": "हरियाणा",
        "Heavy transport, fleet logistics, and city cabs": "भारी परिवहन, बेड़े रसद, और शहर कैब",
        "Hectare": "हेक्टेयर",
        "Hello! I'm here to help you understand clean energy solutions and KDIA Re Park's offerings. How can I assist you today?": "नमस्ते! मैं आपको स्वच्छ ऊर्जा समाधान और केडीआईए आरई पार्क की पेशकशों को समझने में मदद करने के लिए यहां हूं। मैं आज आपकी क्या सहायता कर सकता हूं?",
        "Hello! I’m here to help you understand clean energy solutions and KDIA Re Park’s offerings. How can I assist you today?": "नमस्ते! मैं आपको स्वच्छ ऊर्जा समाधान और केडीआईए आरई पार्क की पेशकशों को समझने में मदद करने के लिए यहां हूं। मैं आज आपकी क्या सहायता कर सकता हूं?",
        "Here the KDIA project walkthrough or corporate video will be rendered.": "यहाँ केडीआईए परियोजना का विवरण या कॉर्पोरेट वीडियो दिखाया जाएगा।",
        "High-Capacity": "उच्च-क्षमता",
        "High-Purity Biomethane (Min. 90% Methane Content)": "उच्च-शुद्धता बायोमीथेन (न्यूनतम 90% मीथेन सामग्री)",
        "High-Speed": "हाई-स्पीड",
        "High-capacity DC fast chargers installed along main highways and public transit points for rapid transit charging.": "त्वरित पारगमन चार्जिंग के लिए मुख्य राजमार्गों और सार्वजनिक पारगमन बिंदुओं के साथ स्थापित उच्च क्षमता वाले डीसी फास्ट चार्जर।",
        "High-heat industries can replace LPG or coal with CBG for manufacturing processes, steam generation, and industrial heating, significantly lowering carbon footprints.": "उच्च-गर्मी वाले उद्योग विनिर्माण प्रक्रियाओं, भाप उत्पादन और औद्योगिक हीटिंग के लिए सीबीजी के साथ एलपीजी या कोयले को बदल सकते हैं, जिससे कार्बन पदचिह्न काफी कम हो जाते हैं।",
        "High-volume charging hubs designed for logistics operators, delivery fleets, and commercial EV groups requiring high uptime.": "लॉजिस्टिक्स ऑपरेटरों, डिलीवरी बेड़े और वाणिज्यिक ईवी समूहों के लिए डिज़ाइन किए गए उच्च-मात्रा चार्जिंग हब जिन्हें उच्च अपटाइम की आवश्यकता होती है।",
        "Higher Energy Yield": "उच्च ऊर्जा उपज",
        "Highway Power": "राजमार्ग बिजली",
        "Highway plazas and public transit hubs": "राजमार्ग प्लाजा और सार्वजनिक पारगमन हब",
        "Himachal Pradesh": "हिमाचल प्रदेश",
        "His significant contribution to the organization is anchored in his commitment to quality, responsible decision-making, customer-centric development, and sustainable growth. Through transparent leadership and hands-on governance, he continues to shape KDIA RE Park as a reliable and future-ready energy partner.": "संगठन में उनका महत्वपूर्ण योगदान गुणवत्ता, जिम्मेदार निर्णय लेने, ग्राहक-केंद्रित विकास और सतत विकास के प्रति उनकी प्रतिबद्धता में निहित है। पारदर्शी नेतृत्व और व्यावहारिक शासन के माध्यम से, वह केडीआईए आरई पार्क को एक विश्वसनीय और भविष्य के लिए तैयार ऊर्जा भागीदार के रूप में आकार देना जारी रखे हुए हैं।",
        "Home": "होम",
        "Home and apartment complex charging points designed for residential complexes, letting residents charge vehicles safely overnight.": "आवासीय परिसरों के लिए डिज़ाइन किए गए घर और अपार्टमेंट कॉम्प्लेक्स चार्जिंग पॉइंट, जिससे निवासी रात भर सुरक्षित रूप से वाहनों को चार्ज कर सकें।",
        "Hospitality industry and corporate cafeterias": "आतिथ्य उद्योग और कॉर्पोरेट कैफेटेरिया",
        "How It Works": "यह कैसे काम करता है",
        "How are savings calculated and verified?": "बचत की गणना और सत्यापन कैसे किया जाता है?",
        "How can we help power your future?": "हम आपके भविष्य को शक्ति देने में कैसे मदद कर सकते हैं?",
        "How does Virtual Net Metering (VNM) work?": "वर्चुअल नेट मीटरिंग (वीएनएम) कैसे काम करता है?",
        "I agree to be contacted by KDIA Re Park via call, SMS, or email.": "मैं केडीआईए आरई पार्क द्वारा कॉल, एसएमएस या ईमेल के माध्यम से संपर्क किए जाने के लिए सहमत हूं।",
        "I declare that the land does not have any unresolved legal dispute and the information submitted is true to the best of my knowledge.": "मैं घोषणा करता हूं कि भूमि पर कोई अनसुलझा कानूनी विवाद नहीं है और प्रस्तुत की गई जानकारी मेरी जानकारी के अनुसार सत्य है।",
        "I have a KDIA Re Park vendor": "मेरे पास केडीआईए आरई पार्क विक्रेता है",
        "I hereby declare that the information provided is correct and all uploaded documents are genuine.": "मैं एतद्द्वारा घोषणा करता हूं कि प्रदान की गई जानकारी सही है और अपलोड किए गए सभी दस्तावेज वास्तविक हैं।",
        "I'm here to help you understand KDIA's solar models. How can I assist?": "मैं केडीआईए के सौर मॉडलों को समझने में आपकी सहायता के लिए यहां हूं। मैं आपकी कैसे मदद कर सकता हूं?",
        "Identify and secure high-performance operational solar assets.": "उच्च प्रदर्शन वाले परिचालन सौर संपत्तियों की पहचान करना और उन्हें सुरक्षित करना।",
        "Imphal East": "इम्फाल पूर्व",
        "Imphal West": "इम्फाल पश्चिम",
        "Indicative Inputs": "सांकेतिक इनपुट",
        "Indicative energy saving and financing estimator": "सांकेतिक ऊर्जा बचत और वित्तपोषण अनुमानक",
        "Individual": "व्यक्तिगत",
        "Industrial": "औद्योगिक",
        "Industrial /": "औद्योगिक /",
        "Industrial Fuel": "औद्योगिक ईंधन",
        "Industrial Solar Farm": "औद्योगिक सौर फार्म",
        "Information about solar subscriptions, EV stations, renewable energy solutions, government schemes, and other services on our platform is provided for general informational purposes only.": "हमारे प्लेटफॉर्म पर सौर सदस्यता, ईवी स्टेशनों, नवीकरणीय ऊर्जा समाधानों, सरकारी योजनाओं और अन्य सेवाओं के बारे में जानकारी केवल सामान्य सूचनात्मक उद्देश्यों के लिए प्रदान की जाती है।",
        "Infrastructure": "बुनियादी ढांचा",
        "Infrastructure Scale": "बुनियादी ढांचा पैमाना",
        "Infrastructure-grade distribution ensures a stable and resilient energy flow to all connections.": "बुनियादी ढांचा-ग्रेड वितरण सभी कनेक्शनों के लिए एक स्थिर और लचीला ऊर्जा प्रवाह सुनिश्चित करता।",
        "Inquiry Details": "पूछताछ विवरण",
        "Integrating solar power grids directly into electric vehicle charging systems.": "बिजली ग्रिड में सौर ऊर्जा को सीधे ईवी चार्जिंग प्रणालियों में एकीकृत करना।",
        "Integration:": "एकीकरण:",
        "Interactive guide to CBG utilization systems (Automotive, Industrial, Commercial, Agriculture)": "सीबीजी उपयोग प्रणालियों के लिए इंटरैक्टिव गाइड (ऑटोमोटिव, औद्योगिक, व्यावसायिक, कृषि)",
        "Interactive guide to EV charging distribution systems (Public, Commercial, Residential, Fleet)": "ईवी चार्जिंग वितरण प्रणालियों के लिए इंटरैक्टिव गाइड (सार्वजनिक, वाणिज्यिक, आवासीय, बेड़ा)",
        "Interactive guide to solar energy distribution systems (VNM, GNM, Captive)": "सौर ऊर्जा वितरण प्रणालियों के लिए इंटरैक्टिव गाइड (वीएनएम, जीएनएम, कैप्टिव)",
        "Interest": "ब्याज",
        "Investment &": "निवेश और",
        "Irrigation pumps and decentralized farm grids": "सिंचाई पंप और विकेंद्रीकृत कृषि ग्रिड",
        "Jamabandi Copy": "जमाबंदी प्रति",
        "Jammu and Kashmir": "जम्मू और कश्मीर",
        "Jayashankar Bhupalpally": "जयशंकर भूपालपल्ली",
        "Jogulamba Gadwal": "जोगुलम्बा गदवाल",
        "John Doe": "जॉन डो",
        "Join the clean energy revolution": "स्वच्छ ऊर्जा क्रांति में शामिल हों",
        "KDIA Assistant": "केडीआईए सहायक",
        "KDIA Portfolios": "केडीआईए पोर्टफोलियो",
        "KDIA RE PARK": "केडीआईए आरई पार्क",
        "KDIA RE Park Infrastructure Walkthrough": "केडीआईए आरई पार्क बुनियादी ढांचा विवरण",
        "KDIA RE Park Video Presentation": "केडीआईए आरई पार्क वीडियो प्रस्तुति",
        "KDIA RE Park is not liable for any losses or damages resulting from reliance on website estimates, temporary website unavailability, technical malfunctions, or third-party integrations.": "केडीआईए आरई पार्क वेबसाइट के अनुमानों, अस्थायी वेबसाइट अनुपलब्धता, तकनीकी खराबी, या तृतीय-पक्ष एकीकरणों पर निर्भरता से होने वाले किसी भी नुकसान या क्षति के लिए उत्तरदायी नहीं है।",
        "KDIA RE Park may collect personal information such as your name, email address, phone number, physical address, property details, land details, and any other information submitted through forms on our website.": "केडीआईए आरई पार्क आपकी व्यक्तिगत जानकारी जैसे आपका नाम, ईमेल पता, फोन नंबर, भौतिक पता, संपत्ति का विवरण, भूमि विवरण और हमारी वेबसाइट पर फॉर्म के माध्यम से प्रस्तुत कोई भी अन्य जानकारी एकत्र कर सकता है।",
        "KDIA RE Park may provide links to third-party websites or services for convenience. We are not responsible for their content, availability, security, or privacy policies.": "केडीआईए आरई पार्क सुविधा के लिए तृतीय-पक्ष वेबसाइटों या सेवाओं के लिंक प्रदान कर सकता है। हम उनकी सामग्री, उपलब्धता, सुरक्षा या गोपनीयता नीतियों के लिए ज़िम्मेदार नहीं हैं।",
        "KDIA RE Park may update the Privacy Policy when required. Users are encouraged to review this page periodically to stay informed of any changes.": "केडीआईए आरई पार्क आवश्यकता पड़ने पर गोपनीयता नीति को अपडेट कर सकता है। उपयोगकर्ताओं को किसी भी बदलाव के बारे में सूचित रहने के लिए समय-समय पर इस पृष्ठ की समीक्षा करने के लिए प्रोत्साहित किया जाता है।",
        "KDIA RE Park reserves the right to modify these Terms & Conditions when required. Continued usage of the website indicates user acceptance of the updated terms.": "केडीआईए आरई पार्क आवश्यकता पड़ने पर इन नियमों और शर्तों को संशोधित करने का अधिकार सुरक्षित रखता है। वेबसाइट का निरंतर उपयोग अद्यतन शर्तों की उपयोगकर्ता स्वीकृति को इंगित करता है।",
        "KDIA RE Park reserves the right to modify these Terms &amp; Conditions when required. Continued usage of the website indicates user acceptance of the updated terms.": "केडीआईए आरई पार्क आवश्यकता पड़ने पर इन नियमों और शर्तों को संशोधित करने का अधिकार सुरक्षित रखता है। वेबसाइट का निरंतर उपयोग अद्यतन शर्तों की उपयोगकर्ता स्वीकृति को इंगित करता है।",
        "KDIA Re Park is a renewable infrastructure platform focused on long-term solar energy ownership.": "केडीआईए आरई पार्क एक नवीकरणीय बुनियादी ढांचा मंच है जो दीर्घकालिक सौर ऊर्जा स्वामित्व पर केंद्रित है।",
        "KDIA Re Park manages all maintenance, monitoring, and operational responsibilities for our solar parks. Our professional O&M team ensures maximum uptime through 24/7 monitoring, predictive maintenance, and rapid response protocols. You simply enjoy the energy credits without any operational burden.": "केडीआईए आरई पार्क हमारे सौर पार्कों के लिए सभी रखरखाव, निगरानी और परिचालन जिम्मेदारियों का प्रबंधन करता है। हमारी पेशेवर ओएंडएम टीम 24/7 निगरानी, पूर्वानुमानित रखरखाव और त्वरित प्रतिक्रिया प्रोटोकॉल के माध्यम से अधिकतम अपटाइम सुनिश्चित करती है। आप बिना किसी परिचालन बोझ के बस ऊर्जा क्रेडिट का आनंद लेते हैं।",
        "KDIA Re Park will assign a qualified vendor to assist you": "केडीआईए आरई पार्क आपकी सहायता के लिए एक योग्य विक्रेता नियुक्त करेगा",
        "KDIA structures and operates utility-grade solar assets designed to maximize power generation. Our commitment to Tier-1 components and continuous performance auditing ensures long-term energy stability and commercial viability.": "केडीआईए बिजली उत्पादन को अधिकतम करने के लिए डिज़ाइन की गई उपयोगिता-ग्रेड सौर संपत्तियों की संरचना और संचालन करता है। टियर-1 घटकों और निरंतर प्रदर्शन ऑडिटिंग के प्रति हमारी प्रतिबद्धता दीर्घकालिक ऊर्जा स्थिरता और व्यावसायिक व्यवहार्यता सुनिश्चित करती है।",
        "Kamrup Metropolitan": "कामरूप मेट्रोपॉलिटन",
        "Kanpur Dehat": "कानपुर देहात",
        "Kanpur Nagar": "कानपुर नगर",
        "Karbi Anglong": "कर्बी आंगलोंग",
        "Kdia Re Park | Sustainable Solar Solutions": "केडीआईए आरई पार्क | सतत सौर समाधान",
        "Key differentiators that set our solar-park infrastructure apart.": "प्रमुख अंतर जो हमारे सौर-पार्क बुनियादी ढांचे को अलग करते हैं।",
        "Khasra Map": "खसरा नक्शा",
        "Khasra Number": "खसरा संख्या",
        "Khasra plot number": "खसरा प्लॉट संख्या",
        "Khata Number": "खाता संख्या",
        "Khata record number": "खाता रिकॉर्ड संख्या",
        "Kra Daadi": "क्रा दादी",
        "Kumuram Bheem Asifabad": "कुमुराम भीम आसिफाबाद",
        "Kurung Kumey": "कुरुंग कुमे",
        "Lahaul and Spiti": "लाहौल और स्पीति",
        "Land Area": "भूमि क्षेत्र",
        "Land Dispute Declaration": "भूमि विवाद घोषणा",
        "Land Information": "भूमि की जानकारी",
        "Land Owner Login": "भूमि मालिक लॉगिन",
        "Land Owner Registration": "भूमि मालिक पंजीकरण",
        "Land Type": "भूमि का प्रकार",
        "Land Verification": "भूमि सत्यापन",
        "Land Verification Application | KDIA Re Park": "भूमि सत्यापन आवेदन | केडीआईए आरई पार्क",
        "Latitude (Read Only)": "अक्षांश (केवल पढ़ने के लिए)",
        "Launching Soon": "जल्द ही शुरू हो रहा है",
        "Leading the shift towards a zero-emission transport network.": "शून्य-उत्सर्जन परिवहन नेटवर्क की ओर बदलाव का नेतृत्व करना।",
        "Legal & Compliance": "कानूनी और अनुपालन",
        "Live Monitoring": "लाइव मॉनिटरिंग",
        "Loan Availed": "लिया गया ऋण",
        "Loan Percentage": "ऋण प्रतिशत",
        "Loan Tenure": "ऋण अवधि",
        "Loan Term": "ऋण की अवधि",
        "Location:": "स्थान:",
        "Locations": "स्थान",
        "Login": "लॉगिन",
        "Login failed.": "लॉगिन विफल रहा।",
        "Login instead": "इसके बजाय लॉगिन करें",
        "Logistics depots and corporate distribution hubs": "रसद डिपो और कॉर्पोरेट वितरण केंद्र",
        "Long-distance commuters and public transit": "लंबी दूरी के यात्री और सार्वजनिक पारगमन",
        "Long-term energy asset ownership provides price predictability and stability.": "दीर्घकालिक ऊर्जा परिसंपत्ति स्वामित्व मूल्य पूर्वानुमान और स्थिरता प्रदान करता है।",
        "Longitude (Read Only)": "रेखांश (केवल पढ़ने के लिए)",
        "Lower Dibang Valley": "निचली दिबांग घाटी",
        "Lower Siang": "निचला सियांग",
        "Lower Subansiri": "निचला सुबनसिरी",
        "Madhya Pradesh": "मध्य प्रदेश",
        "Maharashtra": "महाराष्ट्र",
        "Male": "पुरुष",
        "Map Location": "मानचित्र पर स्थान",
        "Metalworking, chemical, and manufacturing industries": "धातु कर्म, रासायनिक और विनिर्माण उद्योग",
        "Min. 26% Equity · Min. 51% Own Consumption": "न्यूनतम 26% इक्विटी · न्यूनतम 51% स्वयं की खपत",
        "Minimum 26% equity": "न्यूनतम 26% इक्विटी",
        "Minimum 51% by owner": "मालिक द्वारा न्यूनतम 51%",
        "Mobile Number": "मोबाइल नंबर",
        "Mobile Number / Email": "मोबाइल नंबर / ईमेल",
        "Mobility & Accessibility.": "गतिशीलता और सुगमता।",
        "Mobility &amp; Accessibility.": "गतिशीलता और सुगमता।",
        "Mode of Execution / Financing": "निष्पादन का तरीका / वित्तपोषण",
        "Model Comparison Mode": "모델 비교 모드",
        "Models": "मॉडल",
        "Monthly": "मासिक",
        "Monthly Bill (₹)": "मासिक बिल (₹)",
        "Monthly EMI": "मासिक ईएमआई",
        "Monthly Savings": "मासिक बचत",
        "Monthly Unit Consumption (kWh)": "मासिक यूनिट खपत (kWh)",
        "Mr. Nitin Kedia": "श्री नितिन केडिया",
        "Mr. Nitin Kedia is an accomplished entrepreneur with extensive business experience in leading large-scale industrial projects. Throughout his professional experience and leadership journey, he has successfully steered multiple infrastructure ventures, achieving remarkable growth and establishing a culture of excellence.": "श्री नितिन केडिया एक कुशल उद्यमी हैं, जिन्हें बड़े पैमाने पर औद्योगिक परियोजनाओं का नेतृत्व करने का व्यापक व्यावसायिक अनुभव है। अपने पेशेवर अनुभव और नेतृत्व यात्रा के दौरान, उन्होंने सफलतापूर्वक कई बुनियादी ढांचागत उद्यमों का संचालन किया है, उल्लेखनीय वृद्धि हासिल की है और उत्कृष्टता की संस्कृति स्थापित की है।",
        "Multi-site organizations or campuses": "मल्टी-साइट संगठन या परिसर",
        "Mumbai City": "मुंबई शहर",
        "Mumbai Suburban": "मुंबई उपनगर",
        "National Solar Mission Policy": "राष्ट्रीय सौर मिशन नीति",
        "Network error. Please try again.": "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
        "New Delhi": "नई दिल्ली",
        "Next": "अगला",
        "No": "नहीं",
        "North 24 Parganas": "उत्तर 24 परगना",
        "North Delhi": "उत्तरी दिल्ली",
        "North East Delhi": "उत्तर पूर्वी दिल्ली",
        "North Garo Hills": "उत्तर गारो हिल्स",
        "North Goa": "उत्तरी गोवा",
        "North Sikkim": "उत्तरी सिक्किम",
        "North Tripura": "उत्तरी त्रिपुरा",
        "North West Delhi": "उत्तर पश्चिमी दिल्ली",
        "North and Middle Andaman": "उत्तर और मध्य अंडमान",
        "Nos": "संख्या",
        "Number of EV Stations": "ईवी स्टेशनों की संख्या",
        "Number of Owners": "मालिकों की संख्या",
        "Numerical area": "संख्यात्मक क्षेत्रफल",
        "Official order determining the generic levellised tariff for renewable energy projects including solar and wind.": "सौर और पवन सहित नवीकरणीय ऊर्जा परियोजनाओं के लिए सामान्य समतुल्य टैरिफ का निर्धारण करने वाला आधिकारिक आदेश।",
        "Official policies, schemes, guidelines, and tariff orders relevant to KDIA RE Park.": "केडीआईए आरई पार्क से संबंधित आधिकारिक नीतियां, योजनाएं, दिशा-निर्देश और टैरिफ आदेश।",
        "Official policy framework promoting large-scale solar energy deployment and grid-connected solar power projects across India.": "भारत भर में बड़े पैमाने पर सौर ऊर्जा की तैनाती और ग्रिड-कनेक्टेड सौर ऊर्जा परियोजनाओं को बढ़ावा देने वाला आधिकारिक नीतिगत ढांचा।",
        "On-Farm": "खेत पर",
        "Open Calculator": "कैलकुलेटर खोलें",
        "Operation & Support": "संचालन और सहायता",
        "Operation &amp; Support": "संचालन और सहायता",
        "Operational Excellence": "परिचालन उत्कृष्टता",
        "Optimized positioning and industrial-grade hardware drive superior generation capacity.": "अनुकूलित स्थिति और औद्योगिक-ग्रेड हार्डवेयर बेहतर उत्पादन क्षमता को बढ़ावा देते हैं।",
        "Organic": "जैविक",
        "Organic feedstock undergoes biochemical decomposition in sealed digestors, followed by advanced scrubbing to remove CO2 and H2S to yield 90%+ methane.": "जैविक फीडस्टॉक सील डाइजेस्टर्स में जैव रासायनिक अपघटन से गुजरता है, जिसके बाद 90%+ मीथेन प्राप्त करने के लिए CO2 और H2S को हटाने के लिए उन्नत स्क्रबिंग की जाती है।",
        "Other": "अन्य",
        "Our": "हमारे",
        "Our Advantage": "हमारा लाभ",
        "Our EV Vision:": "हमारा ईवी विज़न:",
        "Our Focus": "हमारा ध्यान",
        "Our Vision:": "हमारा दृष्टिकोण:",
        "Our models are designed for multiple consumer categories, ranging from residential complexes to large-scale utility and industrial sectors.": "हमारे मॉडल कई उपभोक्ता श्रेणियों के लिए डिज़ाइन किए गए हैं, जिनमें आवासीय परिसरों से लेकर बड़े पैमाने पर उपयोगिता और औद्योगिक क्षेत्र शामिल हैं।",
        "Our solar parks operate across multiple regions, delivering clean energy infrastructure at scale": "हमारे सौर पार्क कई क्षेत्रों में काम करते हैं, जो बड़े पैमाने पर स्वच्छ ऊर्जा बुनियादी ढांचा प्रदान करते हैं",
        "Our vision is to scale decentralized CBG production facilities that reduce landfill waste, lower greenhouse gas emissions, and supply clean, sustainable energy for vehicles, industries, and commercial applications.": "हमारा दृष्टिकोण विकेंद्रीकृत सीबीजी उत्पादन सुविधाओं को बढ़ाना है जो लैंडफिल कचरे को कम करती हैं, ग्रीनहाउस गैस उत्सर्जन को कम करती हैं, और वाहनों, उद्योगों और वाणिज्यिक अनुप्रयोगों के लिए स्वच्छ, टिकाऊ ऊर्जा की आपूर्ति करती हैं।",
        "Overnight": "रात भर",
        "Overview Video": "सिंहावलोकन वीडियो",
        "Owner Information": "मालिक की जानकारी",
        "Ownership": "स्वामित्व",
        "Ownership Certificate": "स्वामित्व प्रमाणपत्र",
        "Ownership Stability": "स्वामित्व स्थिरता",
        "Ownership:": "स्वामित्व:",
        "PAN Card": "पैन कार्ड",
        "PDF, JPG, JPEG, PNG (Max 10MB)": "PDF, JPG, JPEG, PNG (अधिकतम 10MB)",
        "PM Surya Ghar: Muft Bijli Yojana": "पीएम सूर्य घर: मुफ्त बिजली योजना",
        "PM-KUSUM Scheme": "पीएम-कुसुम योजना",
        "Papum Pare": "पपुम पारे",
        "Paschim Bardhaman": "पश्चिम बर्धमान",
        "Paschim Medinipur": "पश्चिम मेदिनीपुर",
        "Password": "पासवर्ड",
        "Password must be at least 8 characters.": "पासवर्ड कम से कम 8 वर्णों का होना चाहिए।",
        "Passwords do not match.": "पासवर्ड मेल नहीं खाते।",
        "Pauri Garhwal": "पौड़ी गढ़वाल",
        "Pending Verification": "सत्यापन लंबित",
        "Personal & Referral Details": "व्यक्तिगत और रेफ़रल विवरण",
        "Personal information is not sold or traded. It may only be shared with authorized service providers or partners when strictly required for service delivery and operational execution.": "व्यक्तिगत जानकारी बेची या व्यापार नहीं की जाती है। इसे केवल अधिकृत सेवा प्रदाताओं या भागीदारों के साथ साझा किया जा सकता है जब सेवा वितरण और परिचालन निष्पादन के लिए सख्ती से आवश्यक हो।",
        "Pincode": "पिनकोड",
        "Planning & Deployment": "योजना और तैनाती",
        "Planning &amp; Deployment": "योजना और तैनाती",
        "Plant": "संयंत्र",
        "Please enter a valid 10-digit mobile number.": "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।",
        "Please enter a valid area greater than 0.": "कृपया 0 से अधिक एक मान्य क्षेत्रफल दर्ज करें।",
        "Please enter a valid email address.": "कृपया एक मान्य ईमेल पता दर्ज करें।",
        "Please enter the Khasra number.": "कृपया खसरा नंबर दर्ज करें।",
        "Please enter the Khata number.": "कृपया खाता नंबर दर्ज करें।",
        "Please enter the tehsil.": "कृपया तहसील का नाम दर्ज करें।",
        "Please enter the village.": "कृपया गांव का नाम दर्ज करें।",
        "Please enter your complete address.": "कृपया अपना पूरा पता दर्ज करें।",
        "Please enter your full name.": "कृपया अपना पूरा नाम दर्ज करें।",
        "Please place a marker on the map to select coordinates.": "कृपया निर्देशांक चुनने के लिए मानचित्र पर एक मार्कर रखें।",
        "Please provide details regarding the dispute/restriction.": "कृपया विवाद/प्रतिबंध के संबंध में विवरण प्रदान करें।",
        "Please provide details regarding the legal issue, dispute, or restriction.": "कृपया कानूनी मुद्दे, विवाद या प्रतिबंध के संबंध में विवरण प्रदान करें।",
        "Please select a district.": "कृपया एक जिला चुनें।",
        "Please select a state.": "कृपया एक राज्य चुनें।",
        "Policies": "नीतियां",
        "Policy &": "नीति और",
        "Policy &amp;": "नीति और",
        "Portfolio Development": "पोर्टफोलियो विकास",
        "Power Distribution to All Group Members": "सभी समूह सदस्यों को बिजली वितरण",
        "Power Grid": "बिजली ग्रिड",
        "Powering Tomorrow": "कल को ऊर्जा देना",
        "Premium Organic Bio-fertilizer Production": "प्रीमियम जैविक बायो-उर्वरक उत्पादन",
        "Prepare real estate assets and commercial properties for the inevitable shift to full electrification.": "पूर्ण विद्युतीकरण की दिशा में अपरिहार्य बदलाव के लिए रियल एस्टेट संपत्तियों और वाणिज्यिक संपत्तियों को तैयार करें।",
        "Pressure:": "दबाव:",
        "Previous": "पिछला",
        "Price Security": "मूल्य सुरक्षा",
        "Principal": "मूलधन",
        "Privacy Policy": "गोपनीयता नीति",
        "Privacy Policy | Kdia Re Park": "गोपनीयता नीति | केडीआईए आरई पार्क",
        "Process Heat": "प्रक्रिया ताप",
        "Production": "उत्पादन",
        "Professional, round-the-clock maintenance ensures maximum uptime and performance monitoring.": "पेशेवर, चौबीसों घंटे रखरखाव अधिकतम अपटाइम और प्रदर्शन निगरानी सुनिश्चित करता है।",
        "Project Type": "परियोजना का प्रकार",
        "Property": "संपत्ति",
        "Property Details": "संपत्ति का विवरण",
        "Property Type": "संपत्ति का प्रकार",
        "Public & Highway Charging": "सार्वजनिक और राजमार्ग चार्जिंग",
        "Public &amp; Highway Charging": "सार्वजनिक और राजमार्ग चार्जिंग",
        "Public Charging": "सार्वजनिक चार्जिंग",
        "Public/Highway": "सार्वजनिक/राजमार्ग",
        "Punjab": "पंजाब",
        "Purba Bardhaman": "पूर्व बर्धमान",
        "Purba Medinipur": "पूर्व मेदिनीपुर",
        "Questions": "सवाल",
        "Quick Links": "त्वरित लिंक",
        "Quick answers to common questions about solar energy models": "सौर ऊर्जा मॉडल के बारे में सामान्य प्रश्नों के त्वरित उत्तर",
        "RE PARK": "आरई पार्क",
        "RESCO Model Summary": "RESCO मॉडल सारांश",
        "RESCO Tariff": "RESCO टैरिफ",
        "Rajanna Sircilla": "राजन्ना सिरसिल्ला",
        "Rajasthan": "राजस्थान",
        "Rate of Interest (p.a)": "ब्याज दर (वार्षिक)",
        "Re-Culator": "री-क्यूलेटर",
        "Re-Culator +": "री-क्यूलेटर +",
        "Re-Culator | KDIA Re Park": "री-क्यूलेटर | केडीआईए आरई पार्क",
        "Ready to switch to clean energy? Our experts are here to help you design the perfect solar solution.": "स्वच्छ ऊर्जा पर स्विच करने के लिए तैयार हैं? सही सौर समाधान डिजाइन करने में हमारे विशेषज्ञ आपकी मदद के लिए तैयार हैं।",
        "Real-time Performance Auditing": "वास्तविक समय प्रदर्शन ऑडिटिंग",
        "Real-time performance tracking across all operational sites": "सभी परिचालन स्थलों पर वास्तविक समय प्रदर्शन ट्रैकिंग",
        "Reasonable technical and organizational security measures are implemented to protect user information from unauthorized access, misuse, loss, or alteration.": "उपयोगकर्ता की जानकारी को अनधिकृत पहुंच, दुरुपयोग, हानि या परिवर्तन से बचाने के लिए उचित तकनीकी और संगठनात्मक सुरक्षा उपाय लागू किए गए हैं।",
        "Recover nutrient-rich organic bio-fertilizer as a valuable byproduct, promoting chemical-free farming and soil health.": "पोषक तत्वों से भरपूर जैविक बायो-उर्वरक को एक मूल्यवान सह-उत्पाद के रूप में प्राप्त करना, रासायनिक मुक्त खेती और मिट्टी के स्वास्थ्य को बढ़ावा देना।",
        "Reduced Emissions": "कम उत्सर्जन",
        "Reduces greenhouse gas emissions by up to 80% compared to fossil fuels, actively combating climate change and air pollution.": "जीवाश्म ईंधन की तुलना में ग्रीनहाउस गैस उत्सर्जन को 80% तक कम करता है, सक्रिय रूप से जलवायु परिवर्तन और वायु प्रदूषण से मुकाबला करता है।",
        "Regional Coverage": "क्षेत्रीय कवरेज",
        "Register": "पंजीकरण करें",
        "Registration failed.": "पंजीकरण विफल रहा।",
        "Registration successful! Redirecting to login...": "पंजीकरण सफल! लॉगिन पर पुनर्निर्देशित किया जा रहा है...",
        "Registry / Sale Deed": "रजिस्ट्री / बिक्री विलेख",
        "Regulations mandating distribution companies to procure a minimum percentage of electricity from renewable energy sources.": "बिजली वितरण कंपनियों को नवीकरणीय ऊर्जा स्रोतों से न्यूनतम प्रतिशत बिजली खरीदने का आदेश देने वाले नियम।",
        "Reliable Supply": "विश्वसनीय आपूर्ति",
        "Remarks": "टिप्पणी",
        "Remember Me": "मुझे याद रखें",
        "Remote solar park facility": "रिमोट सौर पार्क सुविधा",
        "Renewable Future": "नवीकरणीय भविष्य",
        "Renewable Solar Solutions": "नवीकरणीय सौर समाधान",
        "Replace file": "फ़ाइल बदलें",
        "Resident": "निवासी",
        "Residential": "आवासीय",
        "Residential Charging": "आवासीय चार्जिंग",
        "Retail fuel outlets and public transit stations": "खुदरा ईंधन आउटलेट और सार्वजनिक पारगमन स्टेशन",
        "Return on Investment": "निवेश पर प्रतिफल",
        "Revenue Record": "राजस्व रिकॉर्ड",
        "Ri Bhoi": "री भोई",
        "SOLAR ENERGY": "सौर ऊर्जा",
        "Sahibzada Ajit Singh Nagar": "साहिबजादा अजीत सिंह नगर",
        "Sant Kabir Nagar": "संत कबीर नगर",
        "Savings & Investment": "बचत और निवेश",
        "Savings & ROI Calculator": "बचत और आरओआई कैलकुलेटर",
        "Savings &amp; ROI Calculator": "बचत और आरओआई कैलकुलेटर",
        "Savings Logic": "बचत का तर्क",
        "Savings are calculated based on the energy generated by your allocated solar capacity and credited against your utility consumption at the prevailing tariff rate. All energy generation is metered and verified by utility-grade equipment, with transparent monthly statements showing generation, credits, and net savings.": "बचत की गणना आपकी आवंटित सौर क्षमता द्वारा उत्पन्न ऊर्जा के आधार पर की जाती है और प्रचलित टैरिफ दर पर आपकी उपयोगिता खपत के विरुद्ध जमा की जाती है। सभी ऊर्जा उत्पादन को उपयोगिता-ग्रेड उपकरणों द्वारा मापा और सत्यापित किया जाता है, जिसमें पारदर्शी मासिक विवरण शामिल होते हैं जो उत्पादन, क्रेडिट और शुद्ध बचत दिखाते हैं।",
        "Savings grow as utility electricity tariffs increase over time, providing a natural hedge against rising costs.": "बचत तब बढ़ती है जब उपयोगिता बिजली शुल्क समय के साथ बढ़ता है, जो बढ़ती लागतों के खिलाफ एक प्राकृतिक बचाव प्रदान करता है।",
        "Sawai Madhopur": "सवाई माधोपुर",
        "Scaling high-efficiency solar arrays to offset fossil reliance entirely.": "जीवाश्म निर्भरता को पूरी तरह से ऑफसेट करने के लिए उच्च दक्षता वाले सौर सरणियों को बढ़ाना।",
        "Scheme for individual farmers to set up solar power plants and solarize existing grid-connected agriculture pumps.": "व्यक्तिगत किसानों के लिए सौर ऊर्जा संयंत्र स्थापित करने और मौजूदा ग्रिड-कनेक्टेड कृषि पंपों का सौरकरण करने की योजना।",
        "Scheme-Based": "योजना-आधारित",
        "Scheme-Based Calculator": "योजना-आधारित कैलकुलेटर",
        "Schemes": "योजनाएं",
        "Schemes & Policies": "योजनाएं और नीतियां",
        "Secure long-term energy pricing, protecting your organization from utility tariff inflation.": "सुरक्षित दीर्घकालिक ऊर्जा मूल्य निर्धारण, आपकी संस्था को उपयोगिता शुल्क मुद्रास्फीति से बचाता है।",
        "Select District": "जिला चुनें",
        "Select Energy Model": "ऊर्जा मॉडल चुनें",
        "Select Gender": "लिंग चुनें",
        "Select Range": "सीमा चुनें",
        "Select State": "राज्य चुनें",
        "Select on map": "मानचित्र पर चुनें",
        "Self Finance": "स्वयं वित्तपोषण",
        "Seraikela Kharsawan": "सरायकेला खरसावां",
        "Shahid Bhagat Singh Nagar": "शहीद भगत सिंह नगर",
        "Shared": "साझा",
        "Shared Energy Distribution": "साझा ऊर्जा वितरण",
        "Sharing": "साझाकरण",
        "Site Assessment": "साइट मूल्यांकन",
        "Smart AC": "स्मार्ट एसी",
        "Smart AC and DC charging hubs deployed at retail malls, corporate offices, and workplace parking lots for employees and visitors.": "कर्मचारियों और आगंतुकों के लिए खुदरा मॉल, कॉर्पोरेट कार्यालयों और कार्यस्थल पार्किंग लॉट में तैनात स्मार्ट एसी और डीसी चार्जिंग हब।",
        "Smart AC/DC": "स्मार्ट एसी/डीसी",
        "Smart Renewable Energy Financial Modelling Tool": "स्मार्ट नवीकरणीय ऊर्जा वित्तीय मॉडलिंग उपकरण",
        "Solar & Renewable Expert": "सौर और नवीकरणीय विशेषज्ञ",
        "Solar Asset": "सौर संपत्ति",
        "Solar Integration": "सौर एकीकरण",
        "Solar Park Development Guidelines": "सौर पार्क विकास दिशा-निर्देश",
        "Solar Plaza, Innovation Drive, Green Valley": "सौर प्लाजा, इनोवेशन ड्राइव, ग्रीन वैली",
        "Solar Power": "सौर ऊर्जा",
        "Solar Power Plant": "सौर ऊर्जा संयंत्र",
        "Solar-Powered DC Fast Chargers": "सौर-संचालित डीसी फास्ट चार्जर",
        "Some website features may use third-party services. KDIA RE Park is not responsible for the privacy practices, content, or terms of external websites or services.": "वेबसाइट की कुछ विशेषताएं तृतीय-पक्ष सेवाओं का उपयोग कर सकती हैं। केडीआईए आरई पार्क बाहरी वेबसाइटों या सेवाओं की गोपनीयता प्रथाओं, सामग्री या शर्तों के लिए ज़िम्मेदार नहीं है।",
        "South 24 Parganas": "दक्षिण 24 परगना",
        "South Andaman": "दक्षिण अंडमान",
        "South Delhi": "दक्षिणी दिल्ली",
        "South East Delhi": "दक्षिण पूर्वी दिल्ली",
        "South Garo Hills": "दक्षिण गारो हिल्स",
        "South Goa": "दक्षिणी गोवा",
        "South Salmara-Mankachar": "दक्षिण सालमारा-मानकाचार",
        "South Sikkim": "दक्षिण सिक्किम",
        "South Tripura": "दक्षिण त्रिपुरा",
        "South West Delhi": "दक्षिण पश्चिमी दिल्ली",
        "South West Garo Hills": "दक्षिण पश्चिम गारो हिल्स",
        "South West Khasi Hills": "दक्षिण पश्चिम खासी हिल्स",
        "Sq Ft": "वर्ग फुट",
        "Sri Ganganagar": "श्री गंगानगर",
        "Sri Muktsar Sahib": "श्री मुक्तसर साहिब",
        "Sri Potti Sriramulu Nellore": "श्री पोट्टि श्रीरामुलु नेल्लूर",
        "Stability & Growth.": "स्थिरता और विकास।",
        "Start Your Clean Energy Journey": "अपनी स्वच्छ ऊर्जा यात्रा शुरू करें",
        "State": "राज्य",
        "Station": "स्टेशन",
        "Stations × Units × ₹10": "स्टेशन × यूनिट × ₹10",
        "Strategic": "रणनीतिक",
        "Strategic solar park locations across key energy markets": "प्रमुख ऊर्जा बाजारों में रणनीतिक सौर पार्क स्थान",
        "Strategic, long-term capital deployment in high-yield energy assets.": "उच्च उपज वाली ऊर्जा संपत्तियों में रणनीतिक, दीर्घकालिक पूंजी नियोजन।",
        "Submit Another Application": "दूसरा आवेदन जमा करें",
        "Submit Application": "आवेदन जमा करें",
        "Submit Inquiry": "पूछताछ जमा करें",
        "Submit your land details and supporting documents for verification and approval for EVI infrastructure development.": "ईवीआई बुनियादी ढांचा विकास के सत्यापन और अनुमोदन के लिए अपनी भूमि का विवरण और सहायक दस्तावेज जमा करें।",
        "Subscribe to a shared solar park or allocate EV charging infrastructure on your property today.": "आज ही एक साझा सौर पार्क की सदस्यता लें या अपनी संपत्ति पर ईवी चार्जिंग बुनियादी ढांचा आवंटित करें।",
        "Subscribe with KDIA Re Park and unlock sustainable energy benefits.": "केडीआईए आरई पार्क के साथ सदस्यता लें और स्थायी ऊर्जा लाभों को अनलॉक करें।",
        "Sustainable Mobility": "सतत गतिशीलता",
        "Sustainable Waste Management": "सतत अपशिष्ट प्रबंधन",
        "Sustainable Waste Management Partnerships": "सतत अपशिष्ट प्रबंधन भागीदारी",
        "Systems can vary significantly in scale, typically ranging from 1 kW installations up to utility-scale limits depending on the participation model.": "भागीदारी मॉडल के आधार पर सिस्टम पैमाने में काफी भिन्न हो सकते हैं, आमतौर पर 1 किलोवाट इंस्टॉलेशन से लेकर उपयोगिता-पैमाने की सीमा तक।",
        "Tamil Nadu": "तमिलनाडु",
        "Tariff Orders": "टैरिफ आदेश",
        "Tariff Protection": "टैरिफ संरक्षण",
        "Tarn Taran": "तरन तारन",
        "Tehri Garhwal": "टिहरी गढ़वाल",
        "Tehsil": "तहसील",
        "Tehsil name": "तहसील का नाम",
        "Terms & Conditions": "नियम और शर्तें",
        "Terms & Conditions | Kdia Re Park": "नियम और शर्तें | केडीआईए आरई पार्क",
        "Terms &amp; Conditions": "नियम और शर्तें",
        "Thank you for your interest in KDIA Re Park's solar subscription program.": "केडीआईए आरई पार्क के सौर सदस्यता कार्यक्रम में आपकी रुचि के लिए धन्यवाद।",
        "The Director's Vision for KDIA RE Park is anchored in accelerating the global transition to renewable and clean energy. He envisions a future where clean energy solutions are accessible, reliable, and integrated seamlessly into regional power grids, industrial hubs, and transport networks.": "केडीआईए आरई पार्क के लिए निदेशक का दृष्टिकोण नवीकरणीय और स्वच्छ ऊर्जा के वैश्विक संक्रमण को तेज करने में निहित है। वह एक ऐसे भविष्य की कल्पना करते हैं जहां स्वच्छ ऊर्जा समाधान सुलभ, विश्वसनीय और क्षेत्रीय बिजली ग्रिड, औद्योगिक केंद्रों और परिवहन नेटवर्क में सहजता से एकीकृत हों।",
        "The purified biomethane is compressed to 200-250 bar, bottled in cylinder cascades or piped to retail outlets, with residual slurry processed into organic fertilizer.": "शुद्ध बायोमीथेन को 200-250 बार तक संपीड़ित किया जाता है, सिलेंडर कैस्केड में बोतलबंद किया जाता है या खुदरा दुकानों में पाइप किया जाता है, जिसमें अवशिष्ट स्लरी को जैविक उर्वरक में संसाधित किया जाता है।",
        "The website may use cookies or similar technologies to improve website performance, understand user interaction, and enhance the overall user experience.": "वेबसाइट प्रदर्शन को बेहतर बनाने, उपयोगकर्ता संपर्क को समझने और समग्र उपयोगकर्ता अनुभव को बढ़ाने के लिए वेबसाइट कुकीज़ या समान तकनीकों का उपयोग कर सकती है।",
        "This calculator will allow scheme-level comparisons and financial modelling across VNM, GNM, Captive, and Group Captive models.": "यह कैलकुलेटर वीएनएम, जीएनएम, कैप्टिव और ग्रुप कैप्टिव मॉडल में योजना-स्तरीय तुलना और वित्तीय मॉडलिंग की अनुमति देगा।",
        "This document is required as there are multiple owners.": "यह दस्तावेज़ आवश्यक है क्योंकि कई मालिक हैं।",
        "This document is required.": "यह दस्तावेज़ आवश्यक है।",
        "This website must only be used for lawful purposes. Users are strictly prohibited from misusing, damaging, or interfering with any of the website's functionalities, servers, or connected networks.": "इस वेबसाइट का उपयोग केवल वैध उद्देश्यों के लिए किया जाना चाहिए। उपयोगकर्ताओं को वेबसाइट की किसी भी कार्यक्षमता, सर्वर या जुड़े नेटवर्क का दुरुपयोग करने, नुकसान पहुंचाने या हस्तक्षेप करने से सख्त वर्जित है।",
        "Through RESCO (Renewable Energy Service Company)": "RESCO (नवीकरणीय ऊर्जा सेवा कंपनी) के माध्यम से",
        "Tier-1 Component Selection": "टियर-1 घटक चयन",
        "To be a": "एक बनने के लिए",
        "To create a seamless, high-power DC fast charging network that powers passenger vehicles, commercial fleets, and public transport alike.": "एक निर्बाध, उच्च-शक्ति डीसी फास्ट चार्जिंग नेटवर्क बनाने के लिए जो यात्री वाहनों, वाणिज्यिक बेड़े और सार्वजनिक परिवहन को समान रूप से शक्ति प्रदान करता है।",
        "To enable affordable access to renewable energy for last-mile consumers across India.": "पूरे भारत में अंतिम मील के उपभोक्ताओं के लिए नवीकरणीय ऊर्जा तक किफायती पहुंच सक्षम करना।",
        "To realize this vision, our strategic strategy targets the scaling of solar energy infrastructure alongside the development of high-speed EV charging infrastructure on key corridors. We are also spearheading the adoption of CBG and sustainable energy solutions, converting agricultural and municipal waste into clean energy.": "इस दृष्टिकोण को साकार करने के लिए, हमारी रणनीतिक रणनीति प्रमुख गलियारों पर हाई-स्पीड ईवी चार्जिंग बुनियादी ढांचे के विकास के साथ-साथ सौर ऊर्जा बुनियादी ढांचे को बढ़ाने का लक्ष्य रखती है। हम सीबीजी और टिकाऊ ऊर्जा समाधानों को अपनाने का भी नेतृत्व कर रहे हैं, कृषि और नगरपालिका कचरे को स्वच्छ ऊर्जा में परिवर्तित कर रहे हैं।",
        "Total Interest": "कुल ब्याज",
        "Total Payable": "कुल देय",
        "Total Project Cost": "कुल परियोजना लागत",
        "Touch.": "संपर्क।",
        "Transitioning real estate assets into energy infrastructure ensures long-term valuation growth.": "रियल एस्टेट संपत्तियों को ऊर्जा बुनियादी ढांचे में परिवर्तित करना दीर्घकालिक मूल्यांकन वृद्धि सुनिश्चित करता है।",
        "Typical ROI Period": "सामान्य आरओआई अवधि",
        "Udham Singh Nagar": "ऊधम सिंह नगर",
        "Under his guidance, the organization prioritizes team mentoring, performance-driven growth, and customer-centric development. His key achievements include building long-term trust with stakeholders and delivery partners, ensuring safety and high engineering standards remain at the forefront.": "उनके मार्गदर्शन में, संगठन टीम मेंटरिंग, प्रदर्शन-संचालित विकास और ग्राहक-केंद्रित विकास को प्राथमिकता देता है। उनकी प्रमुख उपलब्धियों में हितधारकों और वितरण भागीदारों के साथ दीर्घकालिक विश्वास का निर्माण करना शामिल है, जिससे सुरक्षा और उच्च इंजीनियरिंग मानकों को अग्रिम मोर्चे पर रखा जा सके।",
        "Understanding": "समझना",
        "Understanding the financial intelligence behind the renewable transition.": "नवीकरणीय संक्रमण के पीछे वित्तीय बुद्धिमत्ता को समझना।",
        "Units": "यूनिट",
        "Units Sold Per Day": "प्रति दिन बेची गई यूनिट",
        "Upgrading": "अपग्रेडिंग",
        "Upload Supporting Documents": "सहायक दस्तावेज अपलोड करें",
        "Upper Siang": "ऊपरी सियांग",
        "Upper Subansiri": "ऊपरी सुबनसिरी",
        "Use Case:": "उपयोग का मामला:",
        "User information may be retained only for as long as required for business operations, service delivery, and compliance with applicable legal requirements.": "उपयोगकर्ता की जानकारी केवल तब तक रखी जा सकती है जब तक व्यावसायिक संचालन, सेवा वितरण और लागू कानूनी आवश्यकताओं के अनुपालन के लिए आवश्यक हो।",
        "Users are entirely responsible for providing accurate, current, and complete information when submitting forms, applications, property verifications, or other inquiries.": "उपयोगकर्ता फॉर्म, आवेदन, संपत्ति सत्यापन, या अन्य पूछताछ जमा करते समय सटीक, वर्तमान और पूर्ण जानकारी प्रदान करने के लिए पूरी तरह से जिम्मेदार हैं।",
        "Users can contact KDIA RE Park for privacy-related questions, concerns, or requests through the official contact information available on our website.": "उपयोगकर्ता गोपनीयता से संबंधित प्रश्नों, चिंताओं या अनुरोधों के लिए हमारी वेबसाइट पर उपलब्ध आधिकारिक संपर्क जानकारी के माध्यम से केडीआईए आरई पार्क से संपर्क कर सकते हैं।",
        "Users may contact KDIA RE Park through the official website contact details for any questions or clarifications regarding these Terms & Conditions.": "उपयोगकर्ता इन नियमों और शर्तों के संबंध में किसी भी प्रश्न या स्पष्टीकरण के लिए आधिकारिक वेबसाइट संपर्क विवरण के माध्यम से केडीआईए आरई पार्क से संपर्क कर सकते हैं।",
        "Users may contact KDIA RE Park through the official website contact details for any questions or clarifications regarding these Terms &amp; Conditions.": "उपयोगकर्ता इन नियमों और शर्तों के संबंध में किसी भी प्रश्न या स्पष्टीकरण के लिए आधिकारिक वेबसाइट संपर्क विवरण के माध्यम से केडीआईए आरई पार्क से संपर्क कर सकते हैं।",
        "Users may request access, correction, or deletion of their personal information by contacting KDIA RE Park through the designated support channels.": "उपयोगकर्ता निर्दिष्ट सहायता चैनलों के माध्यम से केडीआईए आरई पार्क से संपर्क करके अपनी व्यक्तिगत जानकारी तक पहुंच, सुधार या हटाने का अनुरोध कर सकते हैं।",
        "Uttar Dinajpur": "उत्तर दिनाजपुर",
        "Uttar Pradesh": "उत्तर प्रदेश",
        "Uttara Kannada": "उत्तर कन्नड़",
        "VNM (Virtual Net Metering) credits energy from a solar park to a single consumption point, while GNM (Group Net Metering) distributes energy from one solar installation across multiple grouped connections within the same organization. GNM is perfect for multi-site businesses or campuses.": "वीएनएम (वर्चुअल नेट मीटरिंग) एक सौर पार्क से एकल उपभोग बिंदु पर ऊर्जा क्रेडिट करता है, जबकि जीएनएम (ग्रुप नेट मीटरिंग) एक ही संगठन के भीतर कई समूहबद्ध कनेक्शनों में एक सौर स्थापना से ऊर्जा वितरित करता है। जीएनएम बहु-साइट व्यवसायों या परिसरों के लिए एकदम सही है।",
        "VNM allows you to own or lease a share of a remote solar park. The energy generated is virtually credited to your electricity bill, regardless of the physical distance between the solar park and your consumption point. This model is ideal for businesses without suitable rooftop space or those seeking economies of scale.": "वीएनएम आपको रिमोट सौर पार्क का हिस्सा स्वामित्व में लेने या पट्टे पर लेने की अनुमति देता है। उत्पन्न ऊर्जा को आपके बिजली बिल में आभासी रूप से जमा किया जाता है, चाहे सौर पार्क और आपके उपभोग बिंदु के बीच भौतिक दूरी कुछ भी हो। यह मॉडल उन व्यवसायों के लिए आदर्श है जिनके पास उपयुक्त छत की जगह नहीं है या जो पैमाने की अर्थव्यवस्थाओं की तलाश कर रहे हैं।",
        "Vehicle": "वाहन",
        "Vehicles": "वाहन",
        "Vendor Preference": "विक्रेता प्राथमिकता",
        "View Official Document": "आधिकारिक दस्तावेज़ देखें",
        "Village": "गांव",
        "Village name": "गांव का नाम",
        "Virtual Credit": "वर्चुअल क्रेडिट",
        "Virtual Net Metering (VNM)": "वर्चुअल नेट मीटरिंग (वीएनएम)",
        "Virtual Net Metering (VNM) allows you to own or lease a share of a remote solar park...": "वर्चुअल नेट मीटरिंग (VNM) आपको एक दूरस्थ सौर पार्क का हिस्सा स्वामित्व में लेने या पट्टे पर लेने की अनुमति देता है...",
        "Virtual credit adjustment via utility": "उपयोगिता के माध्यम से वर्चुअल क्रेडिट समायोजन",
        "Vision & Clean Mobility": "दृष्टिकोण और स्वच्छ गतिशीलता",
        "Vision & Future Strategy": "दृष्टिकोण और भविष्य की रणनीति",
        "Vision &amp; Clean Mobility": "दृष्टिकोण और स्वच्छ गतिशीलता",
        "Vision &amp; Future Strategy": "दृष्टिकोण और भविष्य की रणनीति",
        "Vision for Solar": "सौर ऊर्जा के लिए दृष्टिकोण",
        "Visitor EVs": "आगंतुक ईवी",
        "Warangal Rural": "वरंगल ग्रामीण",
        "Warangal Urban": "वरंगल शहरी",
        "Waste": "कचरा",
        "Watch our clean energy solutions in action and see how KDIA is powering tomorrow.": "हमारे स्वच्छ ऊर्जा समाधानों को क्रियान्वित होते देखें और देखें कि कैसे केडीआईए कल को ऊर्जा दे रहा है।",
        "We power the transition to clean bio-energy. Our advanced CBG facilities offer waste-to-energy conversion systems that supply sustainable fuel while providing waste disposal solutions. Partners and landowners can lease locations for biogas plants or join our feedstock supply network to generate guaranteed long-term revenue.": "हम स्वच्छ जैव-ऊर्जा में संक्रमण को शक्ति प्रदान करते हैं। हमारी उन्नत सीबीजी सुविधाएं अपशिष्ट-से-ऊर्जा रूपांतरण प्रणालियों की पेशकश करती हैं जो अपशिष्ट निपटान समाधान प्रदान करते हुए टिकाऊ ईंधन की आपूर्ति करती हैं। भागीदार और जमींदार बायोगैस संयंत्रों के लिए स्थानों को पट्टे पर दे सकते हैं या गारंटीकृत दीर्घकालिक राजस्व उत्पन्न करने के लिए हमारे फीडस्टॉक आपूर्ति नेटवर्क में शामिल हो सकते हैं।",
        "We power the transition to clean mobility. Our solar-integrated EV charging network provides reliable, zero-carbon fast charging systems. Landowners can host charging stations to generate guaranteed long-term rental income.": "हम स्वच्छ गतिशीलता के संक्रमण को शक्ति देते हैं। हमारा सौर-एकीकृत ईवी चार्जिंग नेटवर्क विश्वसनीय, शून्य-कार्बन फास्ट चार्जिंग सिस्टम प्रदान करता है। मकान मालिक गारंटीकृत दीर्घकालिक किराया आय उत्पन्न करने के लिए चार्जिंग स्टेशनों की मेजबानी कर सकते हैं।",
        "Welcome to the KDIA RE Park website. By accessing and using our platform, online calculators, and registration services, you agree to follow and be bound by these Terms & Conditions.": "केडीआईए आरई पार्क वेबसाइट पर आपका स्वागत है। हमारे प्लेटफॉर्म, ऑनलाइन कैलकुलेटर और पंजीकरण सेवाओं तक पहुंच कर और उनका उपयोग करके, आप इन नियमों और शर्तों का पालन करने और उनसे बाध्य होने के लिए सहमत होते हैं।",
        "Welcome to the KDIA RE Park website. By accessing and using our platform, online calculators, and registration services, you agree to follow and be bound by these Terms &amp; Conditions.": "केडीआईए आरई पार्क वेबसाइट पर आपका स्वागत है। हमारे प्लेटफॉर्म, ऑनलाइन कैलकुलेटर और पंजीकरण सेवाओं तक पहुंच कर और उनका उपयोग करके, आप इन नियमों और शर्तों का पालन करने और उनसे बाध्य होने के लिए सहमत होते हैं।",
        "West Bengal": "पश्चिम बंगाल",
        "West Champaran": "पश्चिम चंपारण",
        "West Delhi": "पश्चिमी दिल्ली",
        "West Garo Hills": "पश्चिम गारो हिल्स",
        "West Godavari": "पश्चिम गोदावरी",
        "West Jaintia Hills": "पश्चिम जयंतिया हिल्स",
        "West Kameng": "पश्चिम कामेंग",
        "West Karbi Anglong": "पश्चिम कर्बी आंगलोंग",
        "West Khasi Hills": "पश्चिम खासी हिल्स",
        "West Siang": "पश्चिम सियांग",
        "West Sikkim": "पश्चिम सिक्किम",
        "West Singhbhum": "पश्चिम सिंहभूम",
        "West Tripura": "पश्चिम त्रिपुरा",
        "What is Compressed Bio Gas?": "संपीड़ित बायो गैस (सीबीजी) क्या है?",
        "What is the difference between VNM and GNM?": "वीएनएम और जीएनएम में क्या अंतर है?",
        "What is the typical installation timeline?": "सामान्य स्थापना समय-सीमा क्या है?",
        "Who can participate?": "कौन भाग ले सकता है?",
        "Who handles maintenance and monitoring?": "रखरखाव और निगरानी कौन संभालता है?",
        "Who is eligible for solar energy programs?": "सौर ऊर्जा कार्यक्रमों के लिए कौन पात्र है?",
        "Why": "क्यों",
        "YSR Kadapa": "वाईएसआर कड़पा",
        "Yadadri Bhuvanagiri": "यादाद्री भुवनगिरी",
        "Year 1 ROI": "प्रथम वर्ष का आरओआई",
        "Yearly": "वार्षिक",
        "Yes": "हां",
        "Your Upfront Investment": "आपका अग्रिम निवेश",
        "Your land verification request has been submitted successfully. Our verification team will review the submitted information and documents. You will be contacted if additional clarification or documentation is required.": "आपका भूमि सत्यापन अनुरोध सफलतापूर्वक सबमिट कर दिया गया है। हमारी सत्यापन टीम प्रस्तुत जानकारी और दस्तावेजों की समीक्षा करेगी। अतिरिक्त स्पष्टीकरण या दस्तावेजों की आवश्यकता होने पर आपसे संपर्क किया जाएगा।",
        "Your privacy is important to us. This Privacy Policy details how KDIA RE Park collects, uses, and safeguards your information in connection with our clean energy platform and website operations.": "आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह गोपनीयता नीति विवरण देती है कि केडीआईए आरई पार्क हमारे स्वच्छ ऊर्जा मंच और वेबसाइट संचालन के संबंध में आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करता है।",
        "Zero-Carbon Charging Guarantee": "शून्य-कार्बन चार्जिंग गारंटी",
        "assign-vendor": "विक्रेता आवंटित करें",
        "browse": "चुनें",
        "group net metering": "ग्रुप नेट मीटरिंग",
        "have-vendor": "मेरे पास विक्रेता है",
        "info@kdiarepark.com": "info@kdiarepark.com",
        "john@example.com": "john@example.com",
        "of renewable energy assets, supporting India’s clean energy transition and creating stable value for all stakeholders.": "नवीकरणीय ऊर्जा संपत्तियों के दीर्घकालिक स्वामित्व, भारत के स्वच्छ ऊर्जा परिवर्तन का समर्थन करने और सभी हितधारकों के लिए स्थिर मूल्य बनाने में।",
        "of solar-integrated EV charging stations, accelerating India's transition to clean mobility and providing dependable charging access.": "सौर-एकीकृत ईवी चार्जिंग स्टेशनों के निर्माण, भारत के स्वच्छ परिवहन की दिशा में बदलाव को तेज करने और विश्वसनीय चार्जिंग पहुंच प्रदान करने में।",
        "owner@example.com": "owner@example.com",
        "pioneering host": "अग्रणी मेजबान",
        "trusted long-term owner": "विश्वसनीय दीर्घकालिक मालिक",
        "virtual net metering": "वर्चुअल net metering",
        "with Clean Energy": "स्वच्छ ऊर्जा के साथ",
        "years": "वर्ष",
        "your.email@example.com": "your.email@example.com",
        "हिन्दी": "हिन्दी",
        "₹0": "₹0",
        "₹1,000 - ₹2,000": "₹1,000 - ₹2,000",
        "₹10,000+": "₹10,000+",
        "₹2,000 - ₹4,000": "₹2,000 - ₹4,000",
        "₹4,000 - ₹6,000": "₹4,000 - ₹6,000",
        "₹4.50/kWh": "₹4.50/kWh",
        "₹6,000 - ₹10,000": "₹6,000 - ₹10,000",
        "₹7.00/kWh": "₹7.00/kWh"
    };

    // Updates language toggle buttons styles and texts to reflect active language
    function updateSwitcherUI(lang) {
        const buttons = document.querySelectorAll('.lang-toggle-btn');
        buttons.forEach(btn => {
            const textSpan = btn.querySelector('.lang-btn-text');
            if (textSpan) {
                textSpan.textContent = lang === 'en' ? 'हिन्दी' : 'English';
            }
            
            // Premium design toggle visual switch
            if (lang === 'hi') {
                btn.classList.add('bg-brand-green', 'text-white', 'border-brand-green');
                btn.classList.remove('bg-white', 'text-slate-900', 'border-slate-200');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.remove('text-slate-500');
                    icon.classList.add('text-white');
                }
            } else {
                btn.classList.remove('bg-brand-green', 'text-white', 'border-brand-green');
                btn.classList.add('bg-white', 'text-slate-900', 'border-slate-200');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.remove('text-white');
                    icon.classList.add('text-slate-500');
                }
            }
        });
    }

    // Dynamic numeric prefix/suffix translation logic for sliding ranges and units
    function translateFallback(text, targetLang) {
        if (targetLang !== 'hi') return text;
        
        // 1. X-Y Years / X-Y years -> X-Y वर्ष
        if (/^(\d+)-(\d+)\s*Years$/i.test(text)) {
            return text.replace(/^(\d+)-(\d+)\s*Years$/i, '$1-$2 वर्ष');
        }
        if (/^(\d+)-(\d+)\s*years$/i.test(text)) {
            return text.replace(/^(\d+)-(\d+)\s*years$/i, '$1-$2 वर्ष');
        }
        
        // 2. X Years / X years -> X वर्ष
        if (/^(\d+)\s*Years$/i.test(text)) {
            return text.replace(/^(\d+)\s*Years$/i, '$1 वर्ष');
        }
        if (/^(\d+)\s*years$/i.test(text)) {
            return text.replace(/^(\d+)\s*years$/i, '$1 वर्ष');
        }
        
        // 3. X MB -> X MB
        if (/^(\d+(?:\.\d+)?)\s*MB$/i.test(text)) {
            return text;
        }

        // 4. X kW / X.Y kW -> X kW
        if (/^(\d+(?:\.\d+)?)\s*kW$/i.test(text)) {
            return text;
        }

        // 5. X.Y% -> X.Y%
        if (/^(\d+(?:\.\d+)?)\s*%$/i.test(text)) {
            return text;
        }

        return null;
    }

    // Applies translations to the DOM
    function applyTranslations(targetLang, callback) {
        document.documentElement.setAttribute('lang', targetLang);
        updateSwitcherUI(targetLang);

        originalTextNodes.forEach(item => {
            if (targetLang === 'en') {
                if (item.type === 'text') {
                    item.node.nodeValue = item.original;
                } else if (item.type === 'placeholder') {
                    item.node.setAttribute('placeholder', item.original);
                } else if (item.type === 'title') {
                    item.node.setAttribute('title', item.original);
                }
            } else if (targetLang === 'hi') {
                const cleanText = item.original.trim();
                const normalizedText = cleanText.replace(/\s+/g, ' ');
                
                // First try static lookup
                let translated = STATIC_HINDI_TRANSLATIONS[cleanText] || STATIC_HINDI_TRANSLATIONS[normalizedText];
                
                // Second try regex fallback
                if (!translated) {
                    translated = translateFallback(normalizedText, 'hi');
                }
                
                if (translated) {
                    const leadingSpace = item.original.match(/^\s*/)[0];
                    const trailingSpace = item.original.match(/\s*$/)[0];

                    if (item.type === 'text') {
                        item.node.nodeValue = leadingSpace + translated + trailingSpace;
                    } else if (item.type === 'placeholder') {
                        item.node.setAttribute('placeholder', translated);
                    } else if (item.type === 'title') {
                        item.node.setAttribute('title', translated);
                    }
                }
            }
        });

        if (callback) callback();
    }

    function applyDiagramLang(lang) {
        const targetLang = lang || currentLang;
        const elems = document.querySelectorAll('[data-en],[data-hi]');
        elems.forEach(el => {
            const enText = el.getAttribute('data-en');
            const hiText = el.getAttribute('data-hi');
            if (!enText && !hiText) return;
            if (targetLang === 'hi' && hiText) {
                el.textContent = hiText;
            } else if (enText) {
                el.textContent = enText;
            }
        });
    }

    // Expose applyDiagramLang globally
    window.applyDiagramLang = applyDiagramLang;

    // Centralized translation function
    window.applyLanguage = function(selectedLanguage) {
        currentLang = selectedLanguage || 'en';
        localStorage.setItem('preferredLanguage', currentLang);
        
        // Scan the DOM to pick up any new untranslated nodes
        const newItems = getTranslatableNodes(document.body);
        newItems.forEach(item => {
            const exists = originalTextNodes.some(existing => 
                existing.node === item.node && existing.type === item.type
            );
            if (!exists) {
                originalTextNodes.push(item);
            }
        });

        applyTranslations(currentLang);
        applyDiagramLang(currentLang);
    };

    // Toggle language trigger
    window.toggleLanguage = function() {
        const nextLang = currentLang === 'en' ? 'hi' : 'en';
        window.applyLanguage(nextLang);
    };

    // Reapply translations
    window.reapplyTranslation = function() {
        window.applyLanguage(currentLang);
    };

    // MutationObserver to watch for dynamic changes and auto-translate
    function initMutationObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            // Disconnect temporarily to avoid infinite loops during DOM mutations
            observer.disconnect();

            let needsTranslation = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        const targetNode = node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode;
                        if (!targetNode) return;
                        
                        const newItems = getTranslatableNodes(targetNode);
                        newItems.forEach(item => {
                            // Deduplicate
                            const exists = originalTextNodes.some(existing => 
                                existing.node === item.node && existing.type === item.type
                            );
                            if (!exists) {
                                originalTextNodes.push(item);
                                if (currentLang === 'hi') {
                                    needsTranslation = true;
                                }
                            }
                        });
                    }
                });
            });

            if (needsTranslation && currentLang === 'hi') {
                applyTranslations('hi', () => {
                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
                });
            } else {
                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Initial load handler
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        // Scan DOM for all text and cache original English content
        originalTextNodes = getTranslatableNodes(document.body);

        // Load stored preference
        const preferred = localStorage.getItem('preferredLanguage');
        if (preferred === 'hi') {
            currentLang = 'hi';
            applyLanguage('hi');
        } else {
            currentLang = 'en';
            applyLanguage('en');
        }

        // Start watching for dynamic element injections
        initMutationObserver();
    }

    // Run on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
