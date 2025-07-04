# RCSA Dataverse Data Import Guide

## Overview
This guide provides step-by-step instructions for importing the dummy data into your RCSA Power Pages Dataverse tables.

## Import Order (CRITICAL)
**⚠️ IMPORTANT**: Import in this exact order due to lookup relationships:

1. **Scale** (no dependencies)
2. **BU** (Business Units - no dependencies)
3. **Proc** (Processes - depends on BU)
4. **Risk** (Risks - depends on Proc)
5. **Ctrl** (Controls - no dependencies)
6. **RiskCtrl** (Risk-Control mappings - depends on Risk & Ctrl)
7. **Assess** (Assessments - depends on Risk)
8. **Issue** (Issues - depends on Risk)
9. **KRI** (Key Risk Indicators - depends on Risk)

## Method 1: Power Apps Maker Portal (Recommended)

### Step 1: Access Power Apps
1. Go to `make.powerapps.com`
2. Select your environment (where RCSA is deployed)
3. Navigate to **Dataverse** → **Tables**

### Step 2: Import Each Table
For each CSV file in order:

1. **Find the Table**:
   - Look for tables with prefix `cr129_` (your solution prefix)
   - Example: `cr129_bu`, `cr129_proc`, `cr129_risk`, etc.

2. **Import Data**:
   - Click on the table name
   - Select **Data** tab
   - Click **Import data from Excel**
   - Upload the corresponding CSV file
   - Map columns (should auto-match)
   - Click **Import**

### Step 3: Handle Lookups
For tables with lookup fields:
- **Proc**: Map `BUName` to the BU table lookup
- **Risk**: Map `ProcessName` to the Proc table lookup
- **RiskCtrl**: Map both `RiskTitle` and `ControlTitle` to respective lookups
- **Assess**: Map `RiskTitle` to the Risk table lookup
- **Issue**: Map `RiskTitle` to the Risk table lookup
- **KRI**: Map `RiskTitle` to the Risk table lookup

## Method 2: Power Pages Admin Center

### Step 1: Access Admin Center
1. Go to `admin.powerplatform.microsoft.com`
2. Navigate to **Power Pages sites**
3. Select your RCSA site
4. Go to **Data** → **Tables**

### Step 2: Import Process
1. Select each table in order
2. Use **Import from Excel** option
3. Upload CSV files
4. Map columns and relationships
5. Complete import

## Method 3: Excel Power Query (Advanced)

### Step 1: Prepare Excel Workbook
1. Create new Excel workbook
2. Add each CSV as a separate worksheet
3. Use Power Query to connect to Dataverse
4. Map relationships and data types

### Step 2: Upload to Dataverse
1. Use Excel's Dataverse connector
2. Publish data to respective tables
3. Validate relationships

## Validation Steps

### After Each Import:
1. **Check Record Count**: Verify expected number of records
2. **Test Lookups**: Ensure relationships work correctly
3. **View in Power Pages**: Check ALLDATATABLES page
4. **Test Functionality**: Verify dropdown lists populate

### Expected Record Counts:
- **BU**: 8 records
- **Proc**: 12 records  
- **Risk**: 15 records
- **Scale**: 5 records
- **Ctrl**: 15 records
- **RiskCtrl**: 20 records
- **Assess**: 8 records
- **Issue**: 8 records
- **KRI**: 12 records

## Troubleshooting

### Common Issues:

#### 1. **Lookup Field Errors**
- **Problem**: "Invalid lookup value"
- **Solution**: Ensure parent records exist first
- **Fix**: Import in correct order, verify parent table data

#### 2. **Choice Field Errors**
- **Problem**: "Invalid choice value"
- **Solution**: Check choice field options in table definition
- **Fix**: Update CSV values to match exact choice options

#### 3. **Required Field Errors**
- **Problem**: "Required field missing"
- **Solution**: Check table schema for required fields
- **Fix**: Add missing columns to CSV files

#### 4. **Date Format Errors**
- **Problem**: "Invalid date format"
- **Solution**: Use ISO format (YYYY-MM-DD)
- **Fix**: Format dates as 2025-01-15

### Validation Queries:
After import, run these checks:

```sql
-- Check BU count
SELECT COUNT(*) FROM cr129_bu; -- Should be 8

-- Check Process-BU relationships
SELECT p.cr129_processname, b.cr129_buname 
FROM cr129_proc p 
JOIN cr129_bu b ON p.cr129_buname = b.cr129_buid;

-- Check Risk-Process relationships  
SELECT r.cr129_risktitle, p.cr129_processname
FROM cr129_risk r
JOIN cr129_proc p ON r.cr129_processname = p.cr129_procid;
```

## Files Included

### CSV Files:
- `01-BU.csv` - Business Units (8 records)
- `02-Proc.csv` - Processes (12 records)
- `03-Risk.csv` - Risks (15 records)
- `04-Scale.csv` - Rating Scale (5 records)
- `05-Ctrl.csv` - Controls (15 records)

### Missing Files (Create as needed):
- `06-RiskCtrl.csv` - Risk-Control mappings
- `07-Assess.csv` - Assessments
- `08-Issue.csv` - Issues
- `09-KRI.csv` - Key Risk Indicators

## Post-Import Testing

### Test in Power Pages:
1. **Dashboard**: Check metrics populate
2. **Process Selection**: Verify dropdowns work
3. **Risk Identification**: Test AI suggestions
4. **ALLDATATABLES**: Verify all data visible

### Test Data Relationships:
1. **BU → Proc**: Business units show correct processes
2. **Proc → Risk**: Processes show associated risks
3. **Risk → Ctrl**: Risk-control mappings work
4. **All Lookups**: Dropdown lists populate correctly

## Support

### If You Need Help:
1. Check Dataverse table definitions
2. Verify column names match exactly
3. Ensure lookup relationships are configured
4. Test with small data sets first
5. Use Power Apps monitoring to debug issues

---

**Last Updated**: January 2025  
**Data Version**: 1.0  
**Total Records**: 100+ across 9 tables 