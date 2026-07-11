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
        // Navigation & General
        "Home": "होम",
        "Company & Energy Solutions": "कंपनी और ऊर्जा समाधान",
        "Govt. Schemes & Policies": "सरकारी योजनाएं और नीतियां",
        "Re-Culator +": "री-क्यूलेटर +",
        "Re-Culator": "री-क्यूलेटर",
        "Contact Us": "संपर्क करें",
        "Contact": "संपर्क",
        "English": "English",
        "हिन्दी": "हिन्दी",

        // About / Solutions Page
        "KDIA Portfolios": "केडीआईए पोर्टफोलियो",
        "Explore our specialized renewable infrastructure portfolios. Select a category below to view our operations and solutions.": "हमारे विशिष्ट नवीकरणीय बुनियादी ढांचा पोर्टफोलियो का अन्वेषण करें। हमारे संचालन और समाधानों को देखने के लिए नीचे एक श्रेणी चुनें।",
        "SOLAR ENERGY": "सौर ऊर्जा",
        "EV CHARGING": "ईवी चार्जिंग",
        "CBG SOLUTIONS": "सीबीजी समाधान",
        
        // Solar Energy Section
        "Our Vision: Stability & Growth.": "हमारा दृष्टिकोण: स्थिरता और विकास।",
        "To be a trusted long-term owner of renewable energy assets, supporting India’s clean energy transition and creating stable value for all stakeholders.": "सभी हितधारकों के लिए स्थिर मूल्य बनाने और भारत के स्वच्छ ऊर्जा परिवर्तन का समर्थन करते हुए नवीकरणीय ऊर्जा संपत्तियों का एक विश्वसनीय दीर्घकालिक मालिक बनना।",
        "To enable affordable access to renewable energy for last-mile consumers across India.": "पूरे भारत में अंतिम मील के उपभोक्ताओं के लिए नवीकरणीय ऊर्जा तक किफायती पहुंच सक्षम करना।",
        "Strategic Framework": "रणनीतिक ढांचा",
        "Asset Acquisition": "संपत्ति अधिग्रहण",
        "Identify and secure high-performance operational solar assets.": "उच्च प्रदर्शन वाले परिचालन सौर संपत्तियों की पहचान करना और उन्हें सुरक्षित करना।",
        "Portfolio Development": "पोर्टफोलियो विकास",
        "Build scalable and diversified renewable portfolios at regional levels.": "क्षेत्रीय स्तरों पर स्केलेबल और विविध नवीकरणीय पोर्टफोलियो का निर्माण करना।",
        "Capital Investment": "पूंजी निवेश",
        "Strategic, long-term capital deployment in high-yield energy assets.": "उच्च उपज वाली ऊर्जा संपत्तियों में रणनीतिक, दीर्घकालिक पूंजी नियोजन।",
        "Governance Standards": "शासन मानक",
        "Commitment to transparency, integrity, and strict regulatory compliance.": "पारदर्शिता, अखंडता और सख्त नियामक अनुपालन के प्रति प्रतिबद्धता।",
        "Solar Asset Infrastructure Efficiency": "सौर संपत्ति बुनियादी ढांचा दक्षता",
        "KDIA structures and operates utility-grade solar assets designed to maximize power generation. Our commitment to Tier-1 components and continuous performance auditing ensures long-term energy stability and commercial viability.": "केडीआईए बिजली उत्पादन को अधिकतम करने के लिए डिज़ाइन की गई उपयोगिता-ग्रेड सौर संपत्तियों की संरचना और संचालन करता है। टियर-1 घटकों और निरंतर प्रदर्शन ऑडिटिंग के प्रति हमारी प्रतिबद्धता दीर्घकालिक ऊर्जा स्थिरता और व्यावसायिक व्यवहार्यता सुनिश्चित करती है।",
        "Tier-1 Component Selection": "टियर-1 घटक चयन",
        "Real-time Performance Auditing": "वास्तविक समय प्रदर्शन ऑडिटिंग",
        "Understanding Energy Models": "ऊर्जा मॉडल को समझना",
        "Interactive guide to solar energy distribution systems (VNM, GNM, Captive)": "सौर ऊर्जा वितरण प्रणालियों के लिए इंटरैक्टिव गाइड (वीएनएम, जीएनएम, कैप्टिव)",
        "Virtual Net Metering (VNM)": "वर्चुअल नेट मीटरिंग (वीएनएम)",
        "Energy is generated at a centralized solar park and virtually credited to your consumption point, regardless of physical distance.": "ऊर्जा एक केंद्रीकृत सौर पार्क में उत्पन्न होती है और भौतिक दूरी की परवाह किए बिना आपके उपभोग बिंदु पर आभासी रूप से जमा की जाती है।",
        "Location:": "स्थान:",
        "Remote solar park facility": "रिमोट सौर पार्क सुविधा",
        "Best For:": "इसके लिए सबसे अच्छा:",
        "Businesses without suitable rooftop space": "उपयुक्त छत की जगह के बिना व्यवसाय",
        "Energy Flow:": "ऊर्जा प्रवाह:",
        "Virtual credit adjustment via utility": "उपयोगिता के माध्यम से वर्चुअल क्रेडिट समायोजन",
        "Group Net Metering (GNM)": "ग्रुप नेट मीटरिंग (जीएनएम)",
        "A shared energy model where multiple connections within the same organization benefit from a single centralized solar installation.": "एक साझा ऊर्जा मॉडल जहां एक ही संगठन के भीतर कई कनेक्शन एक केंद्रीकृत सौर स्थापना से लाभान्वित होते हैं।",
        "Centralized solar park": "केंद्रीकृत सौर पार्क",
        "Multi-site organizations or campuses": "मल्टी-साइट संगठन या परिसर",
        "Distributed across grouped connections": "समूहबद्ध कनेक्शनों में वितरित",
        "Captive Model": "कैप्टिव मॉडल",
        "A dedicated solar power model where the consumer directly owns the solar asset and consumes the majority of the electricity produced.": "एक समर्पित सौर ऊर्जा मॉडल जहां उपभोक्ता सीधे सौर संपत्ति का मालिक होता है और उत्पादित अधिकांश बिजली का उपभोग करता है।",
        "On-site or dedicated off-site solar facility": "ऑन-साइट या समर्पित ऑफ-साइट सौर सुविधा",
        "High-energy industrial & commercial consumers": "उच्च-ऊर्जा औद्योगिक और वाणिज्यिक उपभोक्ता",
        "Direct consumption with 100% credit": "100% क्रेडिट के साथ प्रत्यक्ष खपत",
        "Group Captive Model": "ग्रुप कैप्टिव मॉडल",
        "A collaborative ownership model where multiple consumers jointly invest in and benefit from a centralized solar power facility.": "एक सहयोगी स्वामित्व मॉडल जहां कई उपभोक्ता संयुक्त रूप से निवेश करते हैं और एक केंद्रीकृत सौर ऊर्जा सुविधा से लाभान्वित होते हैं।",
        "Centralized regional solar facility": "केंद्रीकृत क्षेत्रीय सौर सुविधा",
        "Groups of medium to large commercial consumers": "मध्यम से बड़े वाणिज्यिक उपभोक्ताओं के समूह",
        "Ownership:": "स्वामित्व:",
        "Minimum 26% equity": "न्यूनतम 26% इक्विटी",
        "Consumption:": "खपत:",
        "Minimum 51% by owner": "मालिक द्वारा न्यूनतम 51%",
        "Investment & Savings Logic": "निवेश और बचत तर्क",
        "Understanding the financial intelligence behind the renewable transition.": "नवीकरणीय संक्रमण के पीछे वित्तीय बुद्धिमत्ता को समझना।",
        "Tariff Protection": "टैरिफ संरक्षण",
        "Savings grow as utility electricity tariffs increase over time, providing a natural hedge against rising costs.": "बचत तब बढ़ती है जब उपयोगिता बिजली शुल्क समय के साथ बढ़ता है, जो बढ़ती लागतों के खिलाफ एक प्राकृतिक बचाव प्रदान करता है।",
        "Direct Offsets": "प्रत्यक्ष ऑफसेट",
        "Energy generated by centralized solar assets directly offsets your consumption bills.": "केंद्रीकृत सौर संपत्तियों द्वारा उत्पन्न ऊर्जा सीधे आपके उपभोग बिलों की भरपाई करती है।",
        "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
        "What is Virtual Net Metering?": "वर्चुअल नेट मीटरिंग क्या है?",
        "It allows consumers to offset their energy bills with power generated from a remote solar facility.": "यह उपभोक्ताओं को दूरस्थ सौर सुविधा से उत्पन्न बिजली के साथ अपने ऊर्जा बिलों की भरपाई करने की अनुमति देता है।",
        "Who is eligible for Group Captive?": "ग्रुप कैप्टिव के लिए कौन पात्र है?",
        "Any group of industrial or commercial consumers consuming more than 51% of generated power.": "उत्पन्न बिजली के 51% से अधिक का उपभोग करने वाले औद्योगिक या वाणिज्यिक उपभोक्ताओं का कोई भी समूह।",

        // EV Charging Section
        "EV Vision: Clean Mobility.": "ईवी विज़न: स्वच्छ गतिशीलता।",
        "Empowering India's clean transit switch by owning and operating zero-emission charging corridors.": "शून्य-उत्सर्जन चार्जिंग कॉरिडोर के स्वामित्व और संचालन द्वारा भारत के स्वच्छ पारगमन स्विच को सशक्त बनाना।",
        "Deploying dynamic power structures to accelerate clean transport loops.": "स्वच्छ परिवहन लूप को गति देने के लिए गतिशील बिजली संरचनाओं को तैनात करना।",
        "EV Charging Infrastructure Excellence": "ईवी चार्जिंग इंफ्रास्ट्रक्चर उत्कृष्टता",
        "We power the transition to clean mobility. Our solar-integrated EV charging network provides reliable, zero-carbon fast charging systems. Landowners can host charging stations to generate guaranteed long-term rental income.": "हम स्वच्छ गतिशीलता के संक्रमण को शक्ति देते हैं। हमारा सौर-एकीकृत ईवी चार्जिंग नेटवर्क विश्वसनीय, शून्य-कार्बन फास्ट चार्जिंग सिस्टम प्रदान करता है। मकान मालिक गारंटीकृत दीर्घकालिक किराया आय उत्पन्न करने के लिए चार्जिंग स्टेशनों की मेजबानी कर सकते हैं।",
        "Solar-Powered DC Fast Chargers": "सौर-संचालित डीसी फास्ट चार्जर",
        "24/7 Smart Network Monitoring": "24/7 स्मार्ट नेटवर्क मॉनिटरिंग",
        "Zero-Carbon Charging Guarantee": "शून्य-कार्बन चार्जिंग गारंटी",
        "Apply Now": "अभी आवेदन करें",
        "EV Charging Models": "ईवी चार्जिंग मॉडल",
        "Interactive guide to EV charging distribution systems (Public, Commercial, Residential, Fleet)": "ईवी चार्जिंग वितरण प्रणालियों के लिए इंटरैक्टिव गाइड (सार्वजनिक, वाणिज्यिक, आवासीय, बेड़ा)",
        "Public/Highway": "सार्वजनिक/राजमार्ग",
        "Commercial": "वाणिज्यिक",
        "Residential": "आवासीय",
        "Fleet": "बेड़ा",
        "Public & Highway Charging": "सार्वजनिक और राजमार्ग चार्जिंग",
        "High-capacity DC fast chargers installed along main highways and public transit points for rapid transit charging.": "त्वरित पारगमन चार्जिंग के लिए मुख्य राजमार्गों और सार्वजनिक पारगमन बिंदुओं के साथ स्थापित उच्च क्षमता वाले डीसी फास्ट चार्जर।",
        "Highway plazas and public transit hubs": "राजमार्ग प्लाजा और सार्वजनिक पारगमन हब",
        "Long-distance commuters and public transit": "लंबी दूरी के यात्री और सार्वजनिक पारगमन",
        "Capacity:": "क्षमता:",
        "60 kW to 240 kW DC fast chargers": "60 किलोवाट से 240 किलोवाट डीसी फास्ट चार्जर",
        "Smart AC and DC charging hubs deployed at retail malls, corporate offices, and workplace parking lots for employees and visitors.": "कर्मचारियों और आगंतुकों के लिए खुदरा मॉल, कॉर्पोरेट कार्यालयों और कार्यस्थल पार्किंग लॉट में तैनात स्मार्ट एसी और डीसी चार्जिंग हब।",
        "Business parks, corporate spaces, and retail centers": "बिजनेस पार्क, कॉर्पोरेट स्थान और खुदरा केंद्र",
        "Employees, shoppers, and commercial visitors": "कर्मचारी, खरीदार और वाणिज्यिक आगंतुक",
        "Integration:": "एकीकरण:",
        "Building Management Systems (BMS) load sharing": "बिल्डिंग मैनेजमेंट सिस्टम (बीएमएस) लोड शेयरिंग",
        "Home and apartment complex charging points designed for residential complexes, letting residents charge vehicles safely overnight.": "आवासीय परिसरों के लिए डिज़ाइन किए गए घर और अपार्टमेंट कॉम्प्लेक्स चार्जिंग पॉइंट, जिससे निवासी रात भर सुरक्षित रूप से वाहनों को चार्ज कर सकें।",
        "Apartment garages and individual homes": "अपार्टमेंट गैरेज और व्यक्तिगत घर",
        "EV owners seeking convenient overnight solutions": "ईवी मालिक जो सुविधाजनक रात भर के समाधान की तलाश में हैं",
        "High-volume charging hubs designed for logistics operators, delivery fleets, and commercial EV groups requiring high uptime.": "लॉजिस्टिक्स ऑपरेटरों, डिलीवरी बेड़े और वाणिज्यिक ईवी समूहों के लिए डिज़ाइन किए गए उच्च-मात्रा चार्जिंग हब जिन्हें उच्च अपटाइम की आवश्यकता होती है।",
        "Logistics depots and corporate distribution hubs": "रसद डिपो और कॉर्पोरेट वितरण केंद्र",
        "E-commerce delivery vehicles, fleet cars, and buses": "ई-कॉमर्स डिलीवरी वाहन, बेड़े की कारें और बसें",
        "EV Infrastructure Framework": "ईवी बुनियादी ढांचा ढांचा",
        "Understanding the operational logistics of our charging network.": "हमारे चार्जिंग नेटवर्क के परिचालन रसद को समझना।",
        "Grid Management": "ग्रिड प्रबंधन",
        "Smart power routing ensures charging stations do not overload local electricity grids during peak operational hours.": "स्मार्ट power routing यह सुनिश्चित करती है कि चार्जिंग स्टेशन व्यस्त समय के दौरान स्थानीय बिजली ग्रिड को ओवरलोड न करें।",
        "Fast Charging Loops": "फास्ट चार्जिंग लूप",
        "High-efficiency DC connections provide rapid vehicle turnaround, reducing waiting times and improving station throughput.": "उच्च दक्षता वाले डीसी कनेक्शन तेजी से वाहन टर्नअराउंड प्रदान करते हैं, प्रतीक्षा समय को कम करते हैं और स्टेशन थ्रूपुट में सुधार करते हैं।",
        "EV Infrastructure FAQ": "ईवी इन्फ्रास्ट्रक्चर अक्सर पूछे जाने वाले प्रश्न",
        "What chargers do you install?": "आप कौन से चार्जर स्थापित करते हैं?",
        "We deploy CCS2 standard DC fast chargers from 60kW to 240kW, and Type 2 smart AC chargers for commercial use.": "हम 60 किलोवाट से 240 किलोवाट तक सीसीएस2 मानक डीसी फास्ट चार्जर और वाणिज्यिक उपयोग के लिए टाइप 2 स्मार्ट एसी चार्जर तैनात करते हैं।",
        "How is billing handled?": "बिलिंग कैसे संभाली जाती है?",
        "Billing is fully automated via the KDIA Clean Transit mobile app, supporting wallets, cards, and UPI.": "बिलिंग पूरी तरह से केडीआईए क्लीन ट्रांजिट मोबाइल ऐप के माध्यम से स्वचालित है, जो वॉलेट, कार्ड और यूपीआई का समर्थन करती है।",

        // CBG Section
        "CBG Vision: Waste to Wealth.": "सीबीजी विज़न: कचरे से कंचन।",
        "Driving circular economy loops by converting agricultural and municipal waste into clean biofuel.": "कृषि और नगरपालिका कचरे को स्वच्छ जैव ईंधन में बदलकर परिपत्र अर्थव्यवस्था लूप चलाना।",
        "Supporting decarbonization in heavy transport and industrial heating.": "भारी परिवहन और औद्योगिक हीटिंग में डीकार्बोनाइजेशन का समर्थन करना।",
        "What is Compressed Bio Gas?": "संपीड़ित बायो गैस (सीबीजी) क्या है?",
        "Compressed Bio Gas (CBG) is an eco-friendly renewable fuel produced from organic waste materials. KDIA RE Park is committed to building a circular energy economy by converting agricultural residues, animal manure, and municipal solid waste into high-quality green gas.": "संपीड़ित बायो गैस (सीबीजी) जैविक अपशिष्ट पदार्थों से उत्पादित एक पर्यावरण-अनुकूल नवीकरणीय ईंधन है। केडीआईए आरई पार्क कृषि अवशेषों, पशु खाद और नगरपालिका ठोस कचरे को उच्च गुणवत्ता वाली हरित गैस में बदलकर एक परिपत्र ऊर्जा अर्थव्यवस्था के निर्माण के लिए प्रतिबद्ध है।",
        "Our vision is to scale decentralized CBG production facilities that reduce landfill waste, lower greenhouse gas emissions, and supply clean, sustainable energy for vehicles, industries, and commercial applications.": "हमारा दृष्टिकोण विकेंद्रीकृत सीबीजी उत्पादन सुविधाओं को बढ़ाना है जो लैंडफिल कचरे को कम करती हैं, ग्रीनहाउस गैस उत्सर्जन को कम करती हैं, और वाहनों, उद्योगों और वाणिज्यिक अनुप्रयोगों के लिए स्वच्छ, टिकाऊ ऊर्जा की आपूर्ति करती हैं।",
        "CBG Strategic Framework": "सीबीजी रणनीतिक ढांचा",
        "Feedstock Sourcing": "कच्चा माल सोर्सिंग",
        "Assess and secure agricultural residue, organic waste, and biomass supplies from regional farms and municipalities.": "क्षेत्रीय खेतों और नगर पालिकाओं से कृषि अवशेषों, जैविक कचरे और बायोमास की आपूर्ति का आकलन और सुरक्षित करना।",
        "Advanced Processing": "उन्नत प्रसंस्करण",
        "Employ state-of-the-art anaerobic digestion and gas purification systems to achieve high-methane purity.": "अवायवीय पाचन और गैस शुद्धिकरण प्रणालियों को नियोजित करना ताकि उच्च मीथेन शुद्धता प्राप्त की जा सके।",
        "Bottling & Grid": "बॉटलिंग और ग्रिड",
        "Establish high-pressure bottling and pipeline injection networks for reliable distribution to industrial and automotive clients.": "औद्योगिक और ऑटोमोटिव ग्राहकों को विश्वसनीय वितरण के लिए उच्च दबाव बॉटलर और पाइपलाइन इंजेक्शन नेटवर्क स्थापित करना।",
        "Circular Economy": "परिपत्र अर्थव्यवस्था",
        "Recover nutrient-rich organic bio-fertilizer as a valuable byproduct, promoting chemical-free farming and soil health.": "पोषक तत्वों से भरपूर जैविक बायो-उर्वरक को एक मूल्यवान सह-उत्पाद के रूप में प्राप्त करना, रासायनिक मुक्त खेती और मिट्टी के स्वास्थ्य को बढ़ावा देना।",
        "CBG Solutions & Infrastructure Excellence": "सीबीजी समाधान और बुनियादी ढांचा उत्कृष्टता",
        "We power the transition to clean bio-energy. Our advanced CBG facilities offer waste-to-energy conversion systems that supply sustainable fuel while providing waste disposal solutions. Partners and landowners can lease locations for biogas plants or join our feedstock supply network to generate guaranteed long-term revenue.": "हम स्वच्छ जैव-ऊर्जा में संक्रमण को शक्ति प्रदान करते हैं। हमारी उन्नत सीबीजी सुविधाएं अपशिष्ट-से-ऊर्जा रूपांतरण प्रणालियों की पेशकश करती हैं जो अपशिष्ट निपटान समाधान प्रदान करते हुए टिकाऊ ईंधन की आपूर्ति करती हैं। भागीदार और जमींदार बायोगैस संयंत्रों के लिए स्थानों को पट्टे पर दे सकते हैं या गारंटीकृत दीर्घकालिक राजस्व उत्पन्न करने के लिए हमारे फीडस्टॉक आपूर्ति नेटवर्क में शामिल हो सकते हैं।",
        "High-Purity Biomethane (Min. 90% Methane Content)": "उच्च-शुद्धता बायोमीथेन (न्यूनतम 90% मीथेन सामग्री)",
        "Sustainable Waste Management Partnerships": "सतत अपशिष्ट प्रबंधन भागीदारी",
        "Premium Organic Bio-fertilizer Production": "प्रीमियम जैविक बायो-उर्वरक उत्पादन",
        "Contact Our Experts": "हमारे विशेषज्ञों से संपर्क करें",
        "CBG Applications": "सीबीजी अनुप्रयोग",
        "Interactive guide to CBG utilization systems (Automotive, Industrial, Commercial, Agriculture)": "सीबीजी उपयोग प्रणालियों के लिए इंटरैक्टिव गाइड (ऑटोमोटिव, औद्योगिक, व्यावसायिक, कृषि)",
        "Automotive": "ऑटोमोटिव",
        "Industrial Fuel": "औद्योगिक ईंधन",
        "Commercial Kitchens": "वाणिज्यिक रसोई",
        "Agricultural Power": "कृषि शक्ति",
        "Automotive (CNG Alternative)": "ऑटोमोटिव (सीएनजी विकल्प)",
        "CBG is compressed and purified to serve as a direct, zero-emission substitute for compressed natural gas (CNG) in commercial trucks, public buses, and passenger vehicles.": "सीबीजी को संपीड़ित और शुद्ध किया जाता है ताकि यह वाणिज्यिक ट्रकों, सार्वजनिक बसों और यात्री वाहनों में संपीड़ित प्राकृतिक गैस (सीएनजी) के प्रत्यक्ष, शून्य-उत्सर्जन विकल्प के रूप में काम कर सके।",
        "Use Case:": "उपयोग का मामला:",
        "Retail fuel outlets and public transit stations": "खुदरा ईंधन आउटलेट और सार्वजनिक पारगमन स्टेशन",
        "Heavy transport, fleet logistics, and city cabs": "भारी परिवहन, बेड़े रसद, और शहर कैब",
        "Pressure:": "दबाव:",
        "Compressed to 200 bar for vehicle dispensing": "वाहन वितरण के लिए 200 बार तक संपीड़ित",
        "High-heat industries can replace LPG or coal with CBG for manufacturing processes, steam generation, and industrial heating, significantly lowering carbon footprints.": "उच्च-गर्मी वाले उद्योग विनिर्माण प्रक्रियाओं, भाप उत्पादन और औद्योगिक हीटिंग के लिए सीबीजी के साथ एलपीजी या कोयले को बदल सकते हैं, जिससे कार्बन पदचिह्न काफी कम हो जाते हैं।",
        "Boilers, furnaces, and co-generation plants": "बॉयलर, भट्टियां, और सह-उत्पादन संयंत्र",
        "Metalworking, chemical, and manufacturing industries": "धातु कर्म, रासायनिक और विनिर्माण उद्योग",
        "Clean-burning gas supplied directly or via cylinders to hotels, restaurants, and institutional kitchens, offering cost savings and reducing indoor air pollution.": "होटल, रेस्तरां और संस्थागत रसोईघरों को सीधे या सिलेंडरों के माध्यम से स्वच्छ-जलती हुई गैस की आपूर्ति, लागत बचत की पेशकश और इनडोर वायु प्रदूषण को कम करना।",
        "Cooking gas networks and cylinder delivery": "रसोई गैस नेटवर्क और सिलेंडर वितरण",
        "Hospitality industry and corporate cafeterias": "आतिथ्य उद्योग और कॉर्पोरेट कैफेटेरिया",
        "Decentralized microgrids and farming machinery operated on bio-energy, making rural communities self-reliant and reducing dependence on diesel generator sets.": "जैव-ऊर्जा पर संचालित विकेंद्रीकृत माइक्रोग्रिड और कृषि मशीनरी, ग्रामीण समुदायों को आत्मनिर्भर बनाना और डीजल जनरेटर सेटों पर निर्भरता कम करना।",
        "Irrigation pumps and decentralized farm grids": "सिंचाई पंप और विकेंद्रीकृत कृषि ग्रिड",
        "Farms, cooperative societies, and rural regions": "खेत, सहकारी समितियां, और ग्रामीण क्षेत्र",
        "Benefits of CBG": "सीबीजी के लाभ",
        "Understanding the environmental and operational benefits of Compressed Bio Gas.": "संपीड़ित बायो गैस के पर्यावरणीय और परिचालन लाभों को समझना।",
        "Sustainable Waste Management": "सतत अपशिष्ट प्रबंधन",
        "Diverts agricultural residues and municipal organic waste from landfills, eliminating open-air burning and methane release.": "कृषि अवशेषों और नगरपालिका जैविक कचरे को लैंडफिल से हटाता है, जिससे खुली हवा में जलने और मीथेन रिलीज को समाप्त किया जाता है।",
        "Environmental Benefits": "पर्यावरणीय लाभ",
        "Reduces CO2 emissions by up to 90% compared to fossil fuels, delivering clean air and lowering carbon footprints.": "जीवाश्म ईंधन की तुलना में CO2 उत्सर्जन को 90% तक कम करता है, स्वच्छ हवा प्रदान करता है और कार्बन पदचिह्न को कम करता है।",
        "Business & Energy Opportunities": "व्यापार और ऊर्जा अवसर",
        "Provides high-yield circular revenue from organic fertilizers and bio-CNG sales to local industrial consumers.": "स्थानीय औद्योगिक उपभोक्ताओं को जैविक उर्वरकों और बायो-सीएनजी बिक्री से उच्च उपज परिपत्र राजस्व प्रदान करता है।",
        "Energy Independence": "ऊर्जा स्वतंत्रता",
        "Reduces import dependence on LNG and petroleum by leveraging local agricultural and municipal waste streams.": "स्थानीय कृषि और नगरपालिका अपशिष्ट धाराओं का लाभ उठाकर एलएनजी और पेट्रोलियम पर आयात निर्भरता को कम करता है।",
        "CBG Process: How It Works": "सीबीजी प्रक्रिया: यह कैसे काम करती है",
        "Biochemical Digestion & Purification": "जैव रासायनिक पाचन और शुद्धिकरण",
        "Organic feedstocks undergo anaerobic digestion, followed by amine scrubbing to enrich methane content to over 90%.": "जैविक फीडस्टॉक्स का अवायवीय पाचन होता है, जिसके बाद मीथेन सामग्री को 90% से अधिक समृद्ध करने के लिए अमीन स्क्रबिंग होती है।",
        "Cylinder Bottling & Distribution": "सिलेंडर बॉटलिंग और वितरण",
        "Purified bio-CNG is compressed to 200 bar and filled into cylinder cascades for logistics delivery.": "शुद्ध बायो-सीएनजी को 200 बार तक संपीड़ित किया जाता है और रसद वितरण के लिए सिलेंडर कैस्केड में भरा जाता है।",

        // Founder / Director Section (Home Page)
        "Mr. Nitin Kedia is an accomplished entrepreneur with extensive business experience in leading large-scale industrial projects. Throughout his professional experience and leadership journey, he has successfully steered multiple infrastructure ventures, achieving remarkable growth and establishing a culture of excellence.": "श्री नितिन केडिया एक कुशल उद्यमी हैं, जिन्हें बड़े पैमाने पर औद्योगिक परियोजनाओं का नेतृत्व करने का व्यापक व्यावसायिक अनुभव है। अपने पेशेवर अनुभव और नेतृत्व यात्रा के दौरान, उन्होंने सफलतापूर्वक कई बुनियादी ढांचागत उद्यमों का संचालन किया है, उल्लेखनीय वृद्धि हासिल की है और उत्कृष्टता की संस्कृति स्थापित की है।",
        "Under his guidance, the organization prioritizes team mentoring, performance-driven growth, and customer-centric development. His key achievements include building long-term trust with stakeholders and delivery partners, ensuring safety and high engineering standards remain at the forefront.": "उनके मार्गदर्शन में, संगठन टीम मेंटरिंग, प्रदर्शन-संचालित विकास और ग्राहक-केंद्रित विकास को प्राथमिकता देता है। उनकी प्रमुख उपलब्धियों में हितधारकों और वितरण भागीदारों के साथ दीर्घकालिक विश्वास का निर्माण करना शामिल है, जिससे सुरक्षा और उच्च इंजीनियरिंग मानकों को अग्रिम मोर्चे पर रखा जा सके।",
        "His significant contribution to the organization is anchored in his commitment to quality, responsible decision-making, customer-centric development, and sustainable growth. Through transparent leadership and hands-on governance, he continues to shape KDIA RE Park as a reliable and future-ready energy partner.": "संगठन में उनका महत्वपूर्ण योगदान गुणवत्ता, जिम्मेदार निर्णय लेने, ग्राहक-केंद्रित विकास और सतत विकास के प्रति उनकी प्रतिबद्धता में निहित है। पारदर्शी नेतृत्व और व्यावहारिक शासन के माध्यम से, वह केडीआईए आरई पार्क को एक विश्वसनीय और भविष्य के लिए तैयार ऊर्जा भागीदार के रूप में आकार देना जारी रखे हुए हैं।",
        "Vision & Future Strategy": "दृष्टिकोण और भविष्य की रणनीति",
        "Director's Vision": "निदेशक का दृष्टिकोण",
        "The Director's Vision for KDIA RE Park is anchored in accelerating the global transition to renewable and clean energy. He envisions a future where clean energy solutions are accessible, reliable, and integrated seamlessly into regional power grids, industrial hubs, and transport networks.": "केडीआईए आरई पार्क के लिए निदेशक का दृष्टिकोण नवीकरणीय और स्वच्छ ऊर्जा के वैश्विक संक्रमण को तेज करने में निहित है। वह एक ऐसे भविष्य की कल्पना करते हैं जहां स्वच्छ ऊर्जा समाधान सुलभ, विश्वसनीय और क्षेत्रीय बिजली ग्रिड, औद्योगिक केंद्रों और परिवहन नेटवर्क में सहजता से एकीकृत हों।",
        "To realize this vision, our strategic strategy targets the scaling of solar energy infrastructure alongside the development of high-speed EV charging infrastructure on key corridors. We are also spearheading the adoption of CBG and sustainable energy solutions, converting agricultural and municipal waste into clean energy.": "इस दृष्टिकोण को साकार करने के लिए, हमारी रणनीतिक रणनीति प्रमुख गलियारों पर हाई-स्पीड ईवी चार्जिंग बुनियादी ढांचे के विकास के साथ-साथ सौर ऊर्जा बुनियादी ढांचे को बढ़ाने का लक्ष्य रखती है। हम सीबीजी और टिकाऊ ऊर्जा समाधानों को अपनाने का भी नेतृत्व कर रहे हैं, कृषि और नगरपालिका कचरे को स्वच्छ ऊर्जा में परिवर्तित कर रहे हैं।",
        "By creating accessible and future-ready clean energy infrastructure, KDIA is driving local economic resilience. This reflects our long-term commitment to innovation, sustainability, and responsible development for communities nationwide.": "सुलभ और भविष्य के लिए तैयार स्वच्छ ऊर्जा बुनियादी ढांचे का निर्माण करके, केडीआईए स्थानीय आर्थिक लचीलेपन को चला रहा है। यह राष्ट्रव्यापी समुदायों के लिए नवाचार, स्थिरता और जिम्मेदार विकास के प्रति हमारी दीर्घकालिक प्रतिबद्धता को दर्शाता है।",

        // Solar Tab Diagram Labels
        "Solar Power": "सौर ऊर्जा",
        "Plant": "संयंत्र",
        "Grid": "ग्रिड",
        "Virtual Energy": "वर्चुअल ऊर्जा",
        "Allocation": "आवंटन",
        "Multiple": "एकाधिक",
        "Consumers": "उपभोक्ता",
        "Group Net": "ग्रुप नेट",
        "Meter": "मीटर",
        "Participating": "भाग लेने वाले",
        "Captive Solar": "कैप्टिव सौर",
        "Dedicated Power": "समर्पित बिजली",
        "Supply": "आपूर्ति",
        "Business /": "व्यापार /",
        "Industrial": "औद्योगिक",
        "Shared": "साझा",
        "Ownership": "स्वामित्व",
        "Power": "बिजली",
        "Distribution": "वितरण",
        "Multiple Group": "एकाधिक समूह",

        // EV Tab Diagram Labels
        "Highway Power": "राजमार्ग बिजली",
        "High-Capacity": "उच्च-क्षमता",
        "DC Charger": "डीसी चार्जर",
        "Public Charging": "सार्वजनिक चार्जिंग",
        "Station": "स्टेशन",
        "Electric": "इलेक्ट्रिक",
        "Vehicle": "वाहन",
        "Commercial": "वाणिज्यिक",
        "Power Grid": "बिजली ग्रिड",
        "Smart AC/DC": "स्मार्ट एसी/डीसी",
        "Chargers": "चार्जर्स",
        "BMS Load": "बीएमएस लोड",
        "Sharing": "साझाकरण",
        "Employee /": "कर्मचारी /",
        "Visitor EVs": "आगंतुक ईवी",
        "Residential": "आवासीय",
        "Smart AC": "स्मार्ट एसी",
        "Charger": "चार्जर",
        "Overnight": "रात भर",
        "Charging": "चार्जिंग",
        "Resident": "निवासी",
        "Vehicles": "वाहन",
        "Dedicated": "समर्पित",
        "High-Speed": "हाई-स्पीड",
        "Charging Hub": "चार्जिंग हब",
        "Fleet Logistics": "बेड़ा रसद",
        "Center": "केंद्र",
        "Commercial Fleet": "वाणिज्यिक बेड़ा",

        // CBG Tab Diagram Labels
        "Organic": "जैविक",
        "Waste": "कचरा",
        "CBG": "सीबीजी",
        "Production": "उत्पादन",
        "CNG Dispensing": "सीएनजी वितरण",
        "Automotive": "ऑटोमोटिव",
        "Industrial": "औद्योगिक",
        "Biogas": "बायोगैस",
        "Digester": "डाइजेस्टर",
        "Gas": "गैस",
        "Upgrading": "अपग्रेडिंग",
        "Process Heat": "प्रक्रिया ताप",
        "Food /": "खाना /",
        "Commercial Waste": "वाणिज्यिक कचरा",
        "Anaerobic": "अवायवीय",
        "Digestion": "पाचन",
        "Compressed": "संपीड़ित",
        "Buildings": "इमारतें",
        "Farm Biomass": "कृषि बायोमास",
        "/ Manure": "/ खाद",
        "On-Farm": "खेत पर",
        "Bio-Fertiliser": "जैव-उर्वरक",
        "& CBG": "और सीबीजी",
        "Farm Equipment": "कृषि उपकरण",
        "/ Rural Energy": "/ ग्रामीण ऊर्जा"
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

    // Applies translations to the DOM
    function applyTranslations(targetLang, callback) {
        if (targetLang === 'en') {
            originalTextNodes.forEach(item => {
                if (item.type === 'text') {
                    item.node.nodeValue = item.original;
                } else if (item.type === 'placeholder') {
                    item.node.setAttribute('placeholder', item.original);
                } else if (item.type === 'title') {
                    item.node.setAttribute('title', item.original);
                }
            });
            document.documentElement.setAttribute('lang', 'en');
            updateSwitcherUI('en');
            if (callback) callback();
        } else if (targetLang === 'hi') {
            originalTextNodes.forEach(item => {
                const cleanText = item.original.trim();
                const normalizedText = cleanText.replace(/\s+/g, ' ');
                let translated = STATIC_HINDI_TRANSLATIONS[cleanText] || STATIC_HINDI_TRANSLATIONS[normalizedText];

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
            });
            document.documentElement.setAttribute('lang', 'hi');
            updateSwitcherUI('hi');
            if (callback) callback();
        }
    }

    // ---------------------------------------------------------------
    // Diagram Translation: handles data-en / data-hi on SVG elements
    // ---------------------------------------------------------------
    function applyDiagramLang(lang) {
        const targetLang = lang || currentLang;
        // All elements that have either data-en or data-hi attributes
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

    // Expose so scripts.php tab handler can call it after tab switch
    window.applyDiagramLang = applyDiagramLang;

    // Expose reapplyTranslation for tab switching hook in scripts.php
    window.reapplyTranslation = function() {
        applyTranslations(currentLang);
        applyDiagramLang(currentLang);
    };

    // Handles interactive language toggling from the button
    window.toggleLanguage = function() {
        if (currentLang === 'en') {
            currentLang = 'hi';
        } else {
            currentLang = 'en';
        }
        localStorage.setItem('preferredLanguage', currentLang);
        applyTranslations(currentLang);
        applyDiagramLang(currentLang);
    };

    // Setup DOM change listener for dynamic components (modals, success messages, etc.)
    function initMutationObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver((mutations) => {
            if (currentLang !== 'hi') return;

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
                            const exists = originalTextNodes.some(existing => existing.node === item.node && existing.type === item.type);
                            if (!exists) {
                                originalTextNodes.push(item);
                                needsTranslation = true;
                            }
                        });
                    }
                });
            });

            if (needsTranslation) {
                applyTranslations('hi', () => {
                    // Re-connect observer once translation has finished
                    observer.observe(document.body, { childList: true, subtree: true });
                });
            } else {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Initial load handler
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        // Static translations do not require legacy cookie clearing or dynamic loader elements

        // 1. Scan DOM for all text and cache original English content
        originalTextNodes = getTranslatableNodes(document.body);

        // 2. Load stored preference
        const preferred = localStorage.getItem('preferredLanguage');
        if (preferred === 'hi') {
            currentLang = 'hi';
            applyTranslations('hi');
        } else {
            currentLang = 'en';
            updateSwitcherUI('en');
        }

        // 3. Apply diagram translations
        applyDiagramLang(currentLang);

        // 4. Start watching for dynamic element injections
        initMutationObserver();
    }

    // Run on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
