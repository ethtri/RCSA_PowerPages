# 🎨 CapTech Logo Upload Instructions

## 📁 **How to Upload Your CapTech Logo**

### **Method 1: Power Pages Studio (Recommended)**

1. **Access Power Pages Studio**
   - Go to: https://make.powerpages.microsoft.com/
   - Sign in with your Power Platform credentials
   - Select your "RCSA Copilot - site-5joks" site

2. **Upload the Logo**
   - Click **"Style"** in the left navigation menu
   - Click **"Upload"** in the top toolbar
   - Select your CapTech logo file
   - **Important**: Name the file exactly `captech-logo.png`

3. **Verify Upload**
   - Confirm the file appears in the file list
   - Note the URL should be `~/captech-logo.png`

### **Method 2: CLI Upload (Advanced)**

1. **Prepare the File**
   - Place your logo file in: `powerpages/rcsa-copilot---site-5joks/web-files/`
   - Name it exactly: `captech-logo.png`

2. **Upload via CLI**
   ```bash
   cd powerpages/rcsa-copilot---site-5joks
   pac pages upload --path . --modelVersion 2
   ```

## 🎯 **Logo Specifications**

### **Recommended Format**
- **File Format**: PNG (preferred) or SVG
- **File Name**: `captech-logo.png` (exactly)
- **Dimensions**: 200px width max, 60px height max
- **Background**: Transparent preferred
- **Color**: Any (we'll handle dark/light themes in CSS)

### **Quality Guidelines**
- High resolution for crisp display
- Vector format (SVG) preferred for scalability
- Optimized file size (<100KB recommended)

## 🎨 **How the Logo Will Appear**

### **Current Implementation**
- **Location**: Top-right corner of all main pages
- **Pages**: Dashboard, Process Selection, Risk Identification
- **Styling**: 
  - White version on dark backgrounds (page headers)
  - Normal version on light backgrounds
  - Responsive sizing
  - Professional placement

### **CSS Classes Applied**
```css
.captech-logo {
  max-height: 60px;
  max-width: 200px;
  height: auto;
  width: auto;
  filter: brightness(0) invert(1); /* White on dark backgrounds */
}

.captech-logo-dark {
  filter: none; /* Normal on light backgrounds */
}
```

## 🚀 **After Upload**

### **Automatic Integration**
Once you upload the logo as `captech-logo.png`, it will automatically appear on:
- ✅ Dashboard page header
- ✅ Process Selection page header  
- ✅ Risk Identification page header
- ✅ All future pages we build

### **Testing**
1. Upload the logo file
2. Refresh any of the main pages
3. Logo should appear in the top-right corner
4. Verify it looks good on both dark and light sections

## 📝 **Alternative Logo Names**

If you need to use a different filename, update these references:

**In HTML files** (3 locations):
```html
<img src="~/your-logo-name.png" alt="CapTech Consulting" class="captech-logo" />
```

**In web file config**:
```yaml
# Update: powerpages/rcsa-copilot---site-5joks/web-files/your-logo-name.png.webfile.yml
adx_name: your-logo-name.png
adx_partialurl: ~/your-logo-name.png
```

## 🆘 **Troubleshooting**

### **Logo Not Appearing**
1. Check filename is exactly `captech-logo.png`
2. Verify file uploaded successfully in Power Pages Studio
3. Clear browser cache and refresh
4. Check browser developer tools for 404 errors

### **Logo Too Large/Small**
- Adjust CSS in `rcsa-styles.css`:
```css
.captech-logo {
  max-height: 80px; /* Increase for larger */
  max-width: 250px; /* Increase for wider */
}
```

### **Logo Color Issues**
- For dark backgrounds: Uses white filter automatically
- For light backgrounds: Use `.captech-logo-dark` class
- Custom colors: Remove filter in CSS

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for errors
2. Verify the file path in Power Pages Studio
3. Ensure the file format is supported (PNG, JPG, SVG)
4. Contact support if upload fails

---

**Ready to upload your CapTech logo and see it live on the RCSA application! 🎯** 