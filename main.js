// ==UserScript==
// @name         Reddit Multi Code Decoder for obfuscated content
// @namespace    freebee9@tuta.io
// @version      0.2.0
// @description  Detects and translates obfuscation code in Reddit comments + Text selection popup for Google search
// @author       freebee9@tuta.io
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ===== TEXT SELECTION POPUP FEATURE =====
    let selectionPopup = null;

    function createSelectionPopup() {
        const popup = document.createElement('div');
        popup.id = 'text-selection-popup';
        popup.style.cssText = `
            position: fixed;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            display: none;
            max-width: 200px;
        `;

        const searchButton = document.createElement('button');
        searchButton.textContent = '🔍 Search on Google';
        searchButton.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            width: 100%;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        `;
        
        searchButton.onmouseover = () => searchButton.style.backgroundColor = '#3367d6';
        searchButton.onmouseout = () => searchButton.style.backgroundColor = '#4285f4';

        popup.appendChild(searchButton);
        document.body.appendChild(popup);
        
        return { popup, searchButton };
    }

    function hideSelectionPopup() {
        if (selectionPopup && selectionPopup.popup) {
            selectionPopup.popup.style.display = 'none';
        }
    }

    function showSelectionPopup(x, y, selectedText) {
        if (!selectionPopup) {
            selectionPopup = createSelectionPopup();
        }

        const { popup, searchButton } = selectionPopup;
        
        // Update button click handler with current selected text
        searchButton.onclick = () => {
            const encodedText = encodeURIComponent(selectedText.trim());
            window.open(`https://www.google.com/search?q=${encodedText}`, '_blank');
            hideSelectionPopup();
        };

        // Position popup near mouse cursor (using clientX/clientY with fixed positioning)
        popup.style.left = `${x + 10}px`;
        popup.style.top = `${y + 10}px`;
        popup.style.display = 'block';

        // Adjust position if popup goes off screen
        const rect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (rect.right > viewportWidth) {
            popup.style.left = `${x - rect.width - 10}px`;
        }
        if (rect.bottom > viewportHeight) {
            popup.style.top = `${y - rect.height - 10}px`;
        }
    }

    // Check if the target element is within a comment
    function isWithinComment(element) {
        // Comment selectors for different Reddit layouts
        const commentSelectors = [
            // New Reddit
            '[data-testid="comment"]',
            'shreddit-comment',
            '.Comment',
            '[data-click-id="text"]',
            
            // Old Reddit
            '.usertext-body',
            '.md',
            
            // Generic fallbacks
            '.comment',
            '[class*="comment"]'
        ];
        
        return commentSelectors.some(selector => element.closest(selector));
    }

    // Handle text selection events
    document.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 0 && isWithinComment(e.target)) {
                // Use clientX/clientY with fixed positioning for proper viewport positioning
                showSelectionPopup(e.clientX, e.clientY, selectedText);
            } else {
                hideSelectionPopup();
            }
        }, 10);
    });

    // Hide popup when clicking elsewhere or on escape
    document.addEventListener('mousedown', (e) => {
        if (selectionPopup && selectionPopup.popup && !selectionPopup.popup.contains(e.target)) {
            hideSelectionPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideSelectionPopup();
        }
    });

    // ===== ORIGINAL BINARY DECODER FUNCTIONALITY =====

    // Binary pattern: sequences of 0s and 1s, typically in groups of 8 (bytes)
    // Matches patterns like: 01001000 01100101 01101100 01101100 01101111
    const binaryPattern = /(?:\b[01]{8}\b[\s]*){2,}/g;

    // Function to convert binary string to text
    function binaryToText(binaryString) {
        try {
            // Remove all whitespace and split into 8-bit chunks
            const cleanBinary = binaryString.replace(/\s/g, '');
            if (cleanBinary.length % 8 !== 0) {
                return null; // Invalid binary string
            }

            let result = '';
            for (let i = 0; i < cleanBinary.length; i += 8) {
                const byte = cleanBinary.substr(i, 8);
                const charCode = parseInt(byte, 2);

                // Only convert printable ASCII characters (32-126) and common whitespace
                if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
                    result += String.fromCharCode(charCode);
                } else {
                    return null; // Contains non-printable characters, probably not text
                }
            }
            return result;
        } catch (e) {
            return null;
        }
    }

    // Function to create translation component
    function createTranslationComponent(binaryText, translatedText) {
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 8px 0;
            padding: 12px;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            font-weight: bold;
            color: #1a73e8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            flex-shrink: 0;
        `;
        header.textContent = '🔢 Binary:';

        const translationDiv = document.createElement('div');
        translationDiv.style.cssText = `
            background: #e8f5e8;
            padding: 8px;
            border-radius: 4px;
            font-weight: bold;
            color: #2d5a2d;
            flex-grow: 1;
        `;
        translationDiv.textContent = `${translatedText}`;

        const googleLink = document.createElement('a');
        googleLink.href = `https://www.google.com/search?q=${encodeURIComponent(translatedText)}&tbm=isch`;
        googleLink.target = '_blank';
        googleLink.rel = 'noopener noreferrer';
        googleLink.style.cssText = `
            background: #4285f4;
            color: white;
            padding: 6px 8px;
            border-radius: 4px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            flex-shrink: 0;
            transition: background-color 0.2s;
        `;
        googleLink.onmouseover = () => googleLink.style.backgroundColor = '#3367d6';
        googleLink.onmouseout = () => googleLink.style.backgroundColor = '#4285f4';

        // Google search icon (SVG)
        const googleIcon = document.createElement('span');
        googleIcon.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        `;

        googleLink.appendChild(googleIcon);
        googleLink.appendChild(document.createTextNode('Search'));

        container.appendChild(header);
        container.appendChild(translationDiv);
        container.appendChild(googleLink);

        return container;
    }

    // Function to process text nodes and detect binary
    function processTextNode(textNode) {
        const text = textNode.textContent;
        const matches = text.match(binaryPattern);

        if (matches) {
            matches.forEach(match => {
                const translated = binaryToText(match);
                if (translated && translated.trim().length > 0) {
                    // Create a wrapper for the original text node
                    const wrapper = document.createElement('span');
                    textNode.parentNode.insertBefore(wrapper, textNode);
                    wrapper.appendChild(textNode);

                    // Add translation component after the text
                    const translationComponent = createTranslationComponent(match, translated);
                    wrapper.parentNode.insertBefore(translationComponent, wrapper.nextSibling);
                }
            });
        }
    }

    // Function to scan for binary in comments
    function scanForBinary() {
        // Selectors for different Reddit layouts
        const commentSelectors = [
            // New Reddit
            '[data-testid="comment"] p',
            'shreddit-comment p',
            '.Comment p',
            '[data-click-id="text"] p',

            // Old Reddit
            '.usertext-body p',
            '.md p',

            // Generic fallbacks
            '.comment p',
            '[class*="comment"] p'
        ];

        commentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Skip if already processed
                if (element.hasAttribute('data-binary-processed')) return;
                element.setAttribute('data-binary-processed', 'true');

                // Process all text nodes in the element
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }

                textNodes.forEach(processTextNode);
            });
        });
    }

    // Initial scan
    setTimeout(scanForBinary, 1000);

    // Watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node contains comments
                    if (node.querySelector && (
                        node.querySelector('[data-testid="comment"]') ||
                        node.querySelector('shreddit-comment') ||
                        node.querySelector('.Comment') ||
                        node.querySelector('.usertext-body') ||
                        node.classList.contains('comment') ||
                        node.classList.contains('Comment')
                    )) {
                        shouldScan = true;
                    }
                }
            });
        });

        if (shouldScan) {
            setTimeout(scanForBinary, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Scan when comments are expanded or loaded
    document.addEventListener('click', (e) => {
        // Check for comment expansion buttons
        if (e.target.matches('[aria-expanded]') ||
            e.target.closest('[aria-expanded]') ||
            e.target.textContent.includes('more replies') ||
            e.target.textContent.includes('comments')) {
            setTimeout(scanForBinary, 1000);
        }
    });

    console.log('Reddit Binary Decoder v0.2.0 loaded - Binary translation + Text selection Google search');
})();
