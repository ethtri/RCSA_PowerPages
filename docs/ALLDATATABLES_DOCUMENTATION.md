# ALLDATATABLES Page Documentation

## Overview
The **ALLDATATABLES** page is a special reference page in the RCSA Power Pages application that provides direct access to view all Dataverse tables and their data. This page serves as a comprehensive data browser and administrative tool.

## Purpose
- **Data Reference**: Provides a centralized location to view all Dataverse table contents
- **Development Support**: Allows developers and administrators to inspect data relationships
- **Testing Validation**: Enables verification that data is properly stored and linked
- **Troubleshooting**: Helps diagnose data-related issues during development and testing

## Page Location
- **URL**: \/alldatatables\
- **Navigation**: Accessible via \
View
All
Data\ link on the Dashboard
- **Visibility**: Hidden from site map but accessible to authenticated users

## Tables Displayed

The page displays **7 of the 9** Dataverse tables using Power Pages entity list components:

### 1. **Risks** (\isks\)
- Displays all risk records with AI insights enabled
- Shows risk titles, categories, and inherent scores
- Includes natural language search capability

### 2. **Controls** (\Ctrl\)
- Lists all control records with AI insights
- Shows control titles, types, and effectiveness ratings
- Includes natural language search capability

### 3. **Active Assessments** (\Active Assesses\)
- Displays current assessment records
- Shows assessment names, dates, and status
- Includes natural language search capability

### 4. **Processes** (\Proc\)
- Lists all business process records
- Shows process names, IDs, and criticality levels
- Includes natural language search capability

### 5. **Risk-Control Mappings** (\Active RiskCtrls\)
- Displays the many-to-many relationships between risks and controls
- Uses modern entity list styling
- Includes natural language search capability

### 6. **Issues** (\Issue\)
- Lists all issue records
- Shows issue titles, owners, and status
- Includes natural language search capability

### 7. **Key Risk Indicators** (\KRI\)
- Displays all KRI records
- Shows metric names, current values, and thresholds
- Includes natural language search capability

### 8. **Rating Scale** (\Scale\)
- Lists the risk scoring scale definitions
- Shows score levels, descriptions, and colors
- Includes natural language search capability

## Tables NOT Displayed

### **Business Units** (\BU\)
- **Reason**: Not included in the current page layout
- **Access**: Can be viewed through other administrative interfaces
- **Note**: Consider adding if comprehensive data review is needed

---

**Last Updated**: January 2025  
**Page Version**: 1.0  
**Environment**: Development/Testing  
**Access Level**: Authenticated Users Only
