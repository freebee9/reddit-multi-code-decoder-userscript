# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a userscript project that provides a Reddit Multi Code Decoder for obfuscated content. The main functionality includes:

1. **Binary Code Detection & Translation**: Automatically scans Reddit comments for binary patterns (sequences of 0s and 1s) and converts them to readable ASCII text
2. **NATO Phonetic Alphabet Decoder**: Detects and translates NATO phonetic sequences like "Alpha Bravo Charlie" to "ABC"
3. **Text Selection Search**: Provides a popup for Google search when text is selected within Reddit comments
4. **Centralized Search Configuration**: Unified search provider system with template-based URL generation

## Architecture

### Single File Structure
- `main.js`: The complete userscript containing all functionality
- No build process or dependencies - this is a standalone userscript

### Key Components

**Common Section (`lines 16-141`)**:
- `COMMENT_SELECTORS` array shared across all features
- `SEARCH_CONFIG` object with provider templates (Google, Bing, DuckDuckGo)
- `buildSearchURL()` function for template-based URL generation
- Provider validation and switching utilities
- `NATO_ALPHABET` mapping and `natoToText()` conversion function
- `natoPattern` regex for detecting NATO phonetic sequences
- Default configuration: Google Images search

**Text Selection Feature (`lines 143-259`)**:
- Creates floating popup for search when text is selected in comments
- Uses centralized search configuration system
- Handles positioning, cleanup, and event management
- Defaults to Google Images search

**Multi-Decoder Feature (`lines 261-497`)**:
- **Binary Decoder**: Pattern matching using regex `/(?:\b[01]{8}\b[\s]*){2,}/g` for 8-bit binary sequences
- **NATO Decoder**: Pattern matching for NATO phonetic words with flexible separators, combines all sequences in same text into single widget
- **Unified Processing**: Single `processTextNode()` function handles both decoder types
- **Consistent Styling**: `createTranslationComponent()` uses unified theme for all decoders
- **Shared Scanning**: Generic `scanForPatterns()` with `data-processed` marking
- Uses TreeWalker for efficient DOM traversal

**Reddit Compatibility**:
- Supports both new Reddit (reddit.com) and old Reddit (old.reddit.com)
- Centralized comment selectors handle different Reddit layouts
- MutationObserver watches for dynamically loaded content
- Event listeners handle comment expansions and lazy loading

## Development Notes
- Any part of code that can be reused must be moved to the upper part of the file in a segment named // ===== COMMON =====
- Do not duplicate code, try to implement Single Source of Truth as best as you can 

### Comment Detection Strategy
The `COMMENT_SELECTORS` array is shared between all features and covers:
- New Reddit: `[data-testid="comment"]`, `shreddit-comment`, `.Comment`
- Old Reddit: `.usertext-body`, `.md`
- Generic fallbacks: `.comment`, `[class*="comment"]`

### Decoder System Architecture
The multi-decoder system uses:
- **Unified Processing**: Single `processTextNode()` function handles all decoder types
- **Consistent Styling**: `createTranslationComponent(type, originalText, translatedText)` uses unified theme for all decoders
- **Shared Infrastructure**: Common scanning, DOM manipulation, and performance optimizations
- **Pattern Detection**: Multiple regex patterns processed in single text scan

### Decoder Types
- **Binary**: Standard theme (`🔢 Binary:`), converts 8-bit binary sequences to ASCII
- **NATO**: Standard theme (`📻 NATO:`), converts phonetic alphabet to letters
- Both use identical styling with centralized search system and consistent UI patterns

### Future Decoder Implementation Guidelines
- **No custom themes**: All new decoders must use the standard unified theme (gray background `#f8f9fa`)
- **Icon differentiation**: Only change the icon/emoji and label text to distinguish decoder types
- **Consistent UX**: Maintain identical layout, colors, and behavior across all decoder types

### Search Configuration System
The centralized search system uses:
- `SEARCH_CONFIG` object with provider templates using `{{QUERY}}` placeholders
- `buildSearchURL(query, searchType)` function for URL generation
- Provider validation with automatic fallback to Google
- Support for multiple search types: `webSearch`, `imageSearch`, `videoSearch`
- Default configuration: Google Images search for all features

### Search Provider Customization
Easy provider switching:
```javascript
// Switch to different provider
SEARCH_CONFIG.active.provider = "bing";

// Change default search type
SEARCH_CONFIG.active.defaultSearchType = "webSearch";

// Add custom provider
SEARCH_CONFIG.providers.custom = {
    name: "Custom",
    webSearch: "https://example.com/search?q={{QUERY}}",
    imageSearch: "https://example.com/images?q={{QUERY}}"
};
```

### Performance Considerations
- Elements are marked with `data-processed` to prevent re-scanning (unified for all decoders)
- Debounced scanning with timeouts (500ms-1000ms delays)
- TreeWalker used for efficient text node traversal
- MutationObserver only triggers scans when comment-related DOM changes occur
- Single DOM traversal processes all decoder types simultaneously
- Lazy wrapper creation (only when translations found)

### Userscript Metadata
- Version tracking in header comment block (`@version`)
- Specific Reddit domain matching (`@match`)
- No external dependencies (`@grant none`)

## Testing

No automated test framework is present - testing is manual browser-based validation.