# 🛡️ RCSA PowerPages - Backup & Recovery Guide

## 🚨 EMERGENCY RECOVERY

If you ever see the pages revert to ugly LogicGate styling, **DON'T PANIC!** Follow these steps:

### **IMMEDIATE RECOVERY (30 seconds)**
```bash
# Restore to the last known good state
git checkout BEAUTIFUL_PAGES_WORKING

# Force deploy the restored pages
pac powerpages upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

### **SAFE RESTORE POINTS**

We have multiple restore points available:

1. **`BEAUTIFUL_PAGES_WORKING`** - All 6 pages with beautiful Bootstrap 5 styling ✅
2. **Commit `b1a0a0b`** - Same as above, full working state
3. **Commit `c8e55b7`** - Previous restore attempt
4. **Commit `4371232`** - Original UI upgrades

## 🔄 BEST PRACTICES GOING FORWARD

### **1. ALWAYS Create Branches for Experiments**
```bash
# Before making ANY changes, create a feature branch
git checkout -b feature/add-breadcrumbs
# Make changes here
# Test thoroughly
# Only merge to main when confirmed working
```

### **2. NEVER Edit Main Branch Directly**
```bash
# ❌ WRONG - Don't do this
git checkout main
# edit files directly

# ✅ CORRECT - Always use branches
git checkout -b feature/my-enhancement
# edit files
git add .
git commit -m "Add enhancement"
# Test deployment
# Only merge when confirmed working
```

### **3. Pre-Deployment Checklist**
Before ANY deployment:
- [ ] Test pages locally if possible
- [ ] Create git commit with descriptive message
- [ ] Create backup tag: `git tag backup-$(date +%Y%m%d-%H%M%S)`
- [ ] Deploy to staging/test environment first (if available)
- [ ] Verify pages look correct after deployment
- [ ] Only then proceed with main deployment

### **4. Safe Deployment Process**
```bash
# 1. Create backup tag
git tag backup-$(date +%Y%m%d-%H%M%S)

# 2. Push backup
git push origin --tags

# 3. Deploy
pac powerpages upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2

# 4. IMMEDIATELY verify pages look correct
# 5. If something's wrong, restore immediately:
git checkout BEAUTIFUL_PAGES_WORKING
pac powerpages upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2
```

## 📂 FILE BACKUP STRATEGY

### **Critical Files to Monitor**
These files contain your beautiful Bootstrap 5 styling:
- `Dashboard.en-US.webpage.copy.html`
- `Process-Selection.en-US.webpage.copy.html`
- `Risk-Identification.en-US.webpage.copy.html`
- `Control-Mapping-Overview.en-US.webpage.copy.html`
- `Residual-Risk-Assessment.en-US.webpage.copy.html`
- `Success-Page.en-US.webpage.copy.html`
- `bootstrap-5-upgrades.css`
- `modern-interactions.js`

### **Automated Backup Script**
```bash
# Create daily backups
mkdir -p backups/$(date +%Y%m%d)
cp -r powerpages/rcsa-copilot---site-5joks/web-pages/ backups/$(date +%Y%m%d)/
cp -r powerpages/rcsa-copilot---site-5joks/web-files/ backups/$(date +%Y%m%d)/
```

## 🔍 VERIFICATION CHECKLIST

After ANY deployment, verify these elements are present:

### **Dashboard Page:**
- [ ] Blue gradient header
- [ ] Pulsing test banner with timestamp
- [ ] 4 metric cards with gradient icons
- [ ] Recent assessments list
- [ ] Quick actions sidebar

### **Process Selection Page:**
- [ ] Green gradient header
- [ ] Business unit dropdown
- [ ] Interactive process cards
- [ ] Hover effects working
- [ ] Continue button enables after selection

### **Risk Identification Page:**
- [ ] Green gradient header with AI badge
- [ ] 3 risk cards with Accept/Modify/Reject buttons
- [ ] Risk assessment matrix
- [ ] Counter showing accepted risks
- [ ] Custom risk modal

### **Control Mapping Page:**
- [ ] Orange gradient header
- [ ] Progress circle showing 0/3
- [ ] Filter tabs working
- [ ] Control mapping modal
- [ ] Control chips removable

### **Residual Risk Assessment Page:**
- [ ] Purple gradient header
- [ ] Interactive 5x5 heat map
- [ ] Risk score calculator
- [ ] AI recommendations panel
- [ ] Rationale form validation

### **Success Page:**
- [ ] Green gradient header
- [ ] Confetti animation
- [ ] Pulsing checkmark
- [ ] Achievement badges
- [ ] Download/share buttons

## 🚨 EMERGENCY CONTACTS

If all else fails:
1. **Restore from git tag**: `git checkout BEAUTIFUL_PAGES_WORKING`
2. **Redeploy**: `pac powerpages upload --path powerpages/rcsa-copilot---site-5joks --modelVersion 2`
3. **Verify pages are beautiful again**

## 📝 CHANGE LOG

- **2024-01-XX**: Created comprehensive backup strategy after near-disaster
- **Tag: BEAUTIFUL_PAGES_WORKING**: All 6 pages with Bootstrap 5 styling confirmed working

---

**Remember: When in doubt, restore first, experiment later!** 🛡️ 