# Reddit Multi Code Decoder for obfuscated content

A userscript that automatically detects and translates binary code in Reddit comments, making hidden messages instantly readable.

## Code repository for contributions and support

[github.com/freebee9/reddit-multi-code-decoder-userscript](https://github.com/freebee9/reddit-multi-code-decoder-userscript)

## 🚀 Features

- **Automatic Detection**: Scans Reddit comments for binary patterns (sequences of 0s and 1s)
- **Real-time Translation**: Converts binary code to readable ASCII text
- **Smart Filtering**: Only shows translations for valid, meaningful text
- **Google Search Integration**: One-click search button for translated text
- **Cross-Platform**: Works on both new Reddit and old Reddit
- **Dynamic Loading**: Handles lazy-loaded comments and expansions
- **Performance Optimized**: Minimal impact on browsing experience

## 📋 Requirements

- Browser with userscript support (Chrome, Firefox, Safari, Edge)
- Userscript manager extension:
  - **Violentmonkey** (recommended)
  - Tampermonkey
  - Greasemonkey

## 🔧 Installation

1. **Install a userscript manager**:
   - [Violentmonkey](https://violentmonkey.github.io/) (recommended)
   - [Tampermonkey](https://www.tampermonkey.net/)

2. **Install the script**:
   - Copy the userscript code
   - Open your userscript manager
   - Click "Create new script" or "+" button
   - Paste the code and save

3. **Enable the script**:
   - Make sure the script is enabled in your userscript manager
   - Visit any Reddit page to start using it

## 📖 How It Works

### Binary Pattern Detection
The script looks for patterns like:
```
01001000 01100101 01101100 01101100 01101111
```

### Translation Process
1. Detects 8-bit binary sequences in comments
2. Converts each 8-bit group to ASCII characters
3. Validates that the result contains readable text
4. Creates a translation component if valid

### Example
**Binary code found in comment:**
```
01001000 01100101 01101100 01101100 01101111
```

**Script output:**
```
🔢 Binary: "Hello" [🔍 Search]
```

## 🎯 Usage

1. **Browse Reddit normally** - the script works automatically
2. **Look for binary translation boxes** - they appear below comments containing binary
3. **Click the search button** - instantly Google the translated text
4. **Expand comments** - the script will scan newly loaded content

## ⚙️ Technical Details

### Supported Reddit Layouts
- New Reddit (reddit.com)
- Old Reddit (old.reddit.com)
- Mobile Reddit layouts

### Binary Format Requirements
- Must be valid 8-bit binary (multiples of 8 characters)
- Should decode to printable ASCII characters (32-126)
- Minimum 2 consecutive 8-bit sequences required

### Performance Features
- **Efficient scanning**: Uses TreeWalker for optimal DOM traversal
- **Duplicate prevention**: Marks processed elements to avoid re-scanning
- **Lazy loading support**: Monitors for dynamically added content
- **Event-driven updates**: Responds to comment expansions

## 🛠️ Customization

### Modify Detection Pattern
To change what binary patterns are detected, edit the regex:
```javascript
const binaryPattern = /(?:\b[01]{8}\b[\s]*){2,}/g;
```

### Styling Customization
The translation component styles can be modified in the `createTranslationComponent` function:
```javascript
container.style.cssText = `
    margin: 8px 0;
    padding: 12px;
    background: #f8f9fa;
    // Add your custom styles here
`;
```

### Search Provider
To use a different search engine, modify the Google link:
```javascript
googleLink.href = `https://www.bing.com/search?q=${encodeURIComponent(translatedText)}`;
```

## 🐛 Troubleshooting

### Script Not Working
- Ensure your userscript manager is enabled
- Check that the script is active in the extension
- Refresh the Reddit page
- Check browser console for errors

### No Translations Appearing
- Verify the binary code is in valid 8-bit format
- Ensure the binary translates to readable ASCII text
- Some binary sequences might be filtered out if they contain non-printable characters

### Performance Issues
- The script is optimized for performance
- If experiencing slowdowns, try disabling other Reddit extensions temporarily

## 🔄 Updates

### Version History
- **v0.1**: Initial release with binary detection and Google search integration

### Future Enhancements
- Support for different binary formats (16-bit, custom delimiters)
- Multiple search engine options
- Copy-to-clipboard functionality
- Custom styling themes

## 📄 License

This project is licensed under the MIT License - see the license text in the script for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ✅ No warranty provided

*Made with AI ❤️ ;) for the Reddit community*
