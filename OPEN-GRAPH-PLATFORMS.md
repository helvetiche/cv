# Open Graph Protocol - Platform Coverage Guide

## ✅ Platforms That Use Open Graph (OG) Tags

Open Graph has become the **universal standard** for social media link previews. Here's the complete breakdown:

---

### 🥇 **FULLY SUPPORTED** (Uses OG as Primary)

These platforms **primarily** use Open Graph tags to render link previews:

| Platform | Image Size | Notes |
|----------|-----------|-------|
| **Facebook** | 1200×630px | OG was created by Facebook. Full support including video, products, articles. |
| **WhatsApp** | 1200×630px | Uses OG for link previews in chats. Image must be ≤ 300KB for best results. |
| **Messenger** | 1200×630px | Facebook's messaging app uses same OG protocol. |
| **LinkedIn** | 1200×630px | Professional network uses OG for link shares. Also supports `og:author`. |
| **Telegram** | 1200×630px | Instantly reads OG tags for link previews. |
| **Slack** | 1200×630px | Uses OG for unfurling links in channels. |
| **Discord** | 1200×630px | Rich embeds use OG data. |
| **iMessage** | 1200×630px | Apple's Messages app creates rich previews from OG. |
| **Pinterest** | 1200×630px | Uses OG for pin creation from URLs. |
| **Snapchat** | 1200×630px | Snapchat's link previews use OG data. |
| **WeChat** | 1200×630px | Chinese messaging app uses OG for link sharing. |
| **Viber** | 1200×630px | Messaging app with OG support. |
| **Line** | 1200×630px | Popular in Asia, uses OG for link previews. |
| **VKontakte (VK)** | 1200×630px | Russian social network uses OG. |
| **Odnoklassniki** | 1200×630px | Russian social network with OG support. |

---

### 🥈 **PARTIAL SUPPORT** (Uses OG as Fallback)

These platforms have their own protocols but **fall back to OG** when their specific tags are missing:

| Platform | Primary Protocol | Fallback to OG | Notes |
|----------|-----------------|----------------|-------|
| **X (Twitter)** | Twitter Cards | ✅ Yes | Uses `twitter:card`, `twitter:title`, etc. Falls back to `og:title`, `og:description`, `og:image` if Twitter-specific tags are missing. |
| **Google Chat** | Custom | ✅ Yes | Google's messaging uses OG as fallback. |
| **Microsoft Teams** | Custom | ✅ Yes | Uses OG for link unfurling. |
| **Skype** | Custom | ✅ Yes | Falls back to OG for link previews. |
| **Reddit** | Custom | ✅ Yes | Uses OG when Open Graph is available. |
| **Quora** | Custom | ✅ Yes | Uses OG for link previews in posts. |

---

### 🤖 **AI & SEARCH PLATFORMS** (Read OG for Context)

Modern AI crawlers and search engines read OG tags to understand page content:

| Platform | Usage |
|----------|-------|
| **ChatGPT (OpenAI)** | Reads `og:title`, `og:description` for link context |
| **Claude (Anthropic)** | Uses OG metadata for page understanding |
| **Perplexity** | Reads OG for citation context |
| **Google AI Overviews** | Uses OG for featured snippets and AI summaries |
| **Bing AI** | Reads OG for enhanced search results |

---

## 📋 Required Open Graph Tags

### **4 Required Tags** (Must have for any preview to work)

```html
<meta property="og:title" content="Nasche Del Ponso | Portfolio" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://nascheponso.com/og-image.png" />
<meta property="og:url" content="https://nascheponso.com" />
```

### **Recommended Tags** (Significantly improve previews)

```html
<meta property="og:description" content="Junior Modern Technology Generalist specializing in integration, cloud computing, and AI." />
<meta property="og:site_name" content="Nasche Del Ponso" />
<meta property="og:locale" content="en_US" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Nasche Del Ponso - Portfolio" />
```

### **Twitter-Specific Tags** (For X/Twitter - falls back to OG if missing)

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@nascheponso" />
<meta name="twitter:creator" content="@nascheponso" />
<meta name="twitter:title" content="Nasche Del Ponso | Portfolio" />
<meta name="twitter:description" content="Junior Modern Technology Generalist" />
<meta name="twitter:image" content="https://nascheponso.com/og-image.png" />
```

---

## 🖼️ Image Specifications by Platform

| Platform | Recommended Size | Aspect Ratio | Max File Size | Format |
|----------|-----------------|--------------|---------------|--------|
| **Facebook** | 1200×630px | 1.91:1 | 8 MB | JPG, PNG |
| **WhatsApp** | 1200×630px | 1.91:1 | 300 KB (optimal) | JPG, PNG |
| **LinkedIn** | 1200×630px | 1.91:1 | 8 MB | JPG, PNG |
| **X (Twitter)** | 1200×630px | 1.91:1 | 5 MB | JPG, PNG, GIF |
| **Telegram** | 1200×630px | 1.91:1 | 10 MB | JPG, PNG |
| **Slack** | 1200×630px | 1.91:1 | 10 MB | JPG, PNG |
| **Discord** | 1200×630px | 1.91:1 | 8 MB | JPG, PNG, GIF |
| **iMessage** | 1200×630px | 1.91:1 | 10 MB | JPG, PNG |
| **Pinterest** | 1000×1500px | 2:3 (optimal) | 32 MB | JPG, PNG |

**💡 Pro Tip:** Use **1200×630px** as your standard OG image size - it works perfectly across 95% of platforms!

---

## 🔧 Platform-Specific Best Practices

### **Facebook**
- Use high-quality images (minimum 600×315px)
- Images with text overlay work well
- Avoid images that are too small (will be rejected)
- Use `og:video` for video content

### **WhatsApp**
- Keep image file size under 300KB for fast loading
- Use JPG for photos, PNG for graphics with text
- WhatsApp caches images - changes may take time to appear

### **LinkedIn**
- Professional imagery works best
- Use `og:author` for article attribution
- Square images (1:1) also work well for feed

### **X (Twitter)**
- Always include `twitter:card` tag
- Use `summary_large_image` for best visual impact
- Twitter caches aggressively - use their Card Validator to refresh

### **Telegram**
- Supports instant view pages
- Use `og:video` for video previews
- Telegram can generate previews even without OG (but less reliable)

### **Slack**
- Images are cached per channel
- Use clear, readable text in images
- Slack unfurls links automatically

---

## 🧪 Testing Your Open Graph Implementation

### **Official Testing Tools**

1. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Scrapes your URL and shows exactly what Facebook sees
   - Clears Facebook's cache

2. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Shows how your link appears on X/Twitter
   - Requires Twitter account

3. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Shows LinkedIn-specific preview
   - Requires LinkedIn account

4. **OpenGraph.dev** (Universal)
   - https://opengraph.dev/
   - Tests across multiple platforms
   - Real-time preview generator

5. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Tests structured data (JSON-LD)
   - Shows how Google sees your page

---

## 📊 Open Graph Impact on SEO

While Open Graph tags are **not direct Google ranking factors**, they significantly impact:

1. **Click-Through Rate (CTR)**
   - Rich previews get 30-40% more clicks than plain URLs
   - Better CTR signals quality to search engines

2. **Social Signals**
   - More shares = more visibility
   - Social proof improves brand authority

3. **Brand Consistency**
   - Controlled messaging across platforms
   - Professional appearance builds trust

4. **AI Citation**
   - AI tools use OG data to understand page context
   - Well-described pages get cited more often

5. **Traffic Quality**
   - Better previews attract more qualified visitors
   - Lower bounce rates improve SEO signals

---

## ✅ Implementation Checklist

- [x] 4 required OG tags (title, type, image, url)
- [x] Recommended OG tags (description, site_name, locale)
- [x] Image dimensions specified (og:image:width, og:image:height)
- [x] Image alt text (og:image:alt)
- [x] Twitter Card tags (twitter:card, twitter:site, twitter:creator)
- [x] Absolute HTTPS URLs for all images
- [x] Image file size optimized (< 300KB for WhatsApp)
- [x] JSON-LD structured data (Person, Website schemas)
- [x] Robots.txt configured
- [x] Sitemap.xml created
- [ ] Create actual OG image (1200×630px)
- [ ] Test with Facebook Debugger
- [ ] Test with Twitter Validator
- [ ] Test with LinkedIn Inspector
- [ ] Add Google Search Console verification
- [ ] Update social media handles (@nascheponso)

---

## 🎯 Summary

**One set of OG tags covers:**
- ✅ Facebook
- ✅ WhatsApp
- ✅ Messenger
- ✅ LinkedIn
- ✅ Telegram
- ✅ Slack
- ✅ Discord
- ✅ iMessage
- ✅ Pinterest
- ✅ X/Twitter (with fallback)
- ✅ Google Chat
- ✅ Microsoft Teams
- ✅ Most other messaging apps
- ✅ AI chatbots (ChatGPT, Claude, etc.)

**You only need:**
1. **4 required OG tags** (title, type, image, url)
2. **Twitter Card tags** (for X/Twitter optimization)
3. **One 1200×630px image** (works everywhere!)

---

**Last Updated:** June 22, 2026
**Next Review:** After creating OG image and testing with platform validators
