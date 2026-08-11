# अन्नपूर्णा देवी — पावन स्मृति

यह डिजिटल स्मृति-पुस्तक (Memorial Website) स्वर्गीय श्रीमती अन्नपूर्णा देवी की याद में बनाई गई है।

## संरचना (Structure)
- `index.html`: मुख्य वेबसाइट फ़ाइल
- `css/style.css`: वेबसाइट की स्टाइलिंग
- `js/script.js`: वेबसाइट का लॉजिक (Photo Swipe, Video Play, Shlok, etc.)
- `js/config.js`: यहाँ आप Photos, Videos और Shlokas का डेटा जोड़ सकते हैं।
- `assets/`: 
  - `photos/`: तस्वीरें यहाँ रखें
  - `videos/`: वीडियो यहाँ रखें
  - `audio/`: बैकग्राउंड म्यूज़िक यहाँ रखें

## तस्वीरें और वीडियो कैसे जोड़ें?

1. अपनी तस्वीरें `assets/photos/` फ़ोल्डर में डालें।
2. अपने वीडियो `assets/videos/` फ़ोल्डर में डालें।
3. `js/config.js` फ़ाइल खोलें और `photos` और `videos` array (सूची) में अपनी फ़ाइलों के नाम (src), title और caption अपडेट करें।

उदाहरण (`js/config.js` में):
```javascript
const photos = [
    {
        src: "assets/photos/meri-maa.jpg",
        title: "प्यारी माँ",
        caption: "हमारे साथ एक खास दिन",
        date: "2015"
    }
];
```

## रन कैसे करें (How to Run)
यह एक Static वेबसाइट है। इसे देखने के लिए बस `index.html` पर डबल-क्लिक करें और यह आपके ब्राउज़र में खुल जाएगी।

## टेक्नोलॉजी
- HTML5
- CSS3 (Vanilla)
- JavaScript (Vanilla)
- No frameworks. Fully static and portable.
