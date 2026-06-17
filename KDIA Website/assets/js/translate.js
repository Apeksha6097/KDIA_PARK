/**
 * KDIA Website Translation Service using Devnagri Translation API
 */

(function() {
    let currentLang = 'en';
    let originalTextNodes = []; // stores { type: 'text'|'placeholder'|'title', node, original: string }
    let isInitialized = false;
    let observer = null;

    // Helper functions for translation caching
    function getTranslationCache() {
        try {
            const cacheStr = localStorage.getItem('devnagri_cache_hi');
            return cacheStr ? JSON.parse(cacheStr) : {};
        } catch (e) {
            return {};
        }
    }

    function saveTranslationCache(cache) {
        try {
            localStorage.setItem('devnagri_cache_hi', JSON.stringify(cache));
        } catch (e) {}
    }

    // Clear legacy Google Translate cookies to avoid interference
    function clearLegacyCookies() {
        const cookies = ['googtrans', 'googtrans_ext'];
        const domains = [window.location.hostname, '.' + window.location.hostname, ''];
        cookies.forEach(c => {
            domains.forEach(d => {
                document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${d ? ` domain=${d};` : ''}`;
            });
        });
    }

    // Scans DOM recursively for translatable texts
    function getTranslatableNodes(root = document.body) {
        const nodes = [];
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
            acceptNode: function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    // Skip technical elements
                    if (tagName === 'script' || tagName === 'style' || tagName === 'svg' || tagName === 'code' || tagName === 'iframe' || tagName === 'noscript' || tagName === 'canvas') {
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

    // Injects a floating spinner and toast notification containers
    function injectUIElements() {
        if (!document.getElementById('trans-loading-indicator')) {
            const loader = document.createElement('div');
            loader.id = 'trans-loading-indicator';
            loader.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all duration-300 opacity-0 scale-95 pointer-events-none z-[9999]';
            loader.innerHTML = `
                <div class="w-3.5 h-3.5 border-2 border-brand-green border-b-transparent rounded-full animate-spin"></div>
                <span class="tracking-wide">Translating page...</span>
            `;
            document.body.appendChild(loader);
        }

        if (!document.getElementById('trans-toast-container')) {
            const container = document.createElement('div');
            container.id = 'trans-toast-container';
            container.className = 'fixed bottom-6 right-6 flex flex-col space-y-2 z-[9999]';
            document.body.appendChild(container);
        }
    }

    function showLoading(show) {
        const loader = document.getElementById('trans-loading-indicator');
        if (loader) {
            if (show) {
                loader.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                loader.classList.add('opacity-100', 'scale-100');
            } else {
                loader.classList.remove('opacity-100', 'scale-100');
                loader.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            }
        }
    }

    function showToastNotification(message, type = 'info') {
        const container = document.getElementById('trans-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold tracking-wide transition-all duration-500 transform translate-y-4 opacity-0 flex items-center space-x-2 ${
            type === 'error' 
                ? 'bg-rose-50 border-rose-100 text-rose-800' 
                : 'bg-emerald-50 border-emerald-100 text-emerald-800'
        }`;
        
        const iconName = type === 'error' ? 'alert-circle' : 'check-circle';
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        if (window.lucide) {
            window.lucide.createIcons({
                attrs: { class: 'w-4 h-4 shrink-0' }
            });
        }

        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }

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
            const cache = getTranslationCache();
            const nodesToTranslate = [];
            const missingTextsSet = new Set();

            originalTextNodes.forEach(item => {
                const cleanText = item.original.trim();
                if (cache[cleanText]) {
                    const translated = cache[cleanText];
                    const leadingSpace = item.original.match(/^\s*/)[0];
                    const trailingSpace = item.original.match(/\s*$/)[0];

                    if (item.type === 'text') {
                        item.node.nodeValue = leadingSpace + translated + trailingSpace;
                    } else if (item.type === 'placeholder') {
                        item.node.setAttribute('placeholder', translated);
                    } else if (item.type === 'title') {
                        item.node.setAttribute('title', translated);
                    }
                } else {
                    nodesToTranslate.push(item);
                    missingTextsSet.add(cleanText);
                }
            });

            if (missingTextsSet.size > 0) {
                showLoading(true);
                const missingArray = Array.from(missingTextsSet);

                fetch('/api/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        texts: missingArray,
                        source: 'en',
                        target: 'hi'
                    })
                })
                .then(res => {
                    if (!res.ok) throw new Error('API request failed');
                    return res.json();
                })
                .then(data => {
                    const translations = data.translations || {};
                    const updatedCache = { ...cache, ...translations };
                    saveTranslationCache(updatedCache);

                    nodesToTranslate.forEach(item => {
                        const cleanText = item.original.trim();
                        if (translations[cleanText]) {
                            const translated = translations[cleanText];
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
                })
                .catch(err => {
                    console.error('Devnagri translation API error:', err);
                    showToastNotification('Translation temporarily unavailable. Using fallback/original content.', 'error');
                    // Fall back to original English UI
                    applyTranslations('en');
                    if (callback) callback();
                })
                .finally(() => {
                    showLoading(false);
                });
            } else {
                document.documentElement.setAttribute('lang', 'hi');
                updateSwitcherUI('hi');
                if (callback) callback();
            }
        }
    }

    // Handles interactive language toggling from the button
    window.toggleLanguage = function() {
        if (currentLang === 'en') {
            currentLang = 'hi';
        } else {
            currentLang = 'en';
        }
        localStorage.setItem('preferredLanguage', currentLang);
        applyTranslations(currentLang);
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

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial load handler
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        clearLegacyCookies();
        injectUIElements();

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

        // 3. Start watching for dynamic element injections
        initMutationObserver();
    }

    // Run on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
