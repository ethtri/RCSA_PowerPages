/**
 * ============================================================================
 * RCSA POWER PAGES - LOGICGATE COMPONENTS LIBRARY
 * ============================================================================
 * Interactive components and utilities inspired by LogicGate Risk Cloud's
 * sophisticated enterprise GRC platform functionality.
 * 
 * Version: 1.0.0
 * Last Updated: January 2025
 * ============================================================================
 */

// Global namespace for LogicGate components
window.LogicGate = window.LogicGate || {};

/**
 * ============================================================================
 * TOAST NOTIFICATIONS
 * ============================================================================
 */
LogicGate.Toast = {
  show: function(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `lg-toast lg-toast-${type} lg-fade-in`;
    toast.innerHTML = `
      <div class="lg-toast-content">
        <div class="lg-toast-icon">${this.getIcon(type)}</div>
        <div class="lg-toast-message">${message}</div>
        <button class="lg-toast-close" onclick="LogicGate.Toast.hide(this.parentElement)">×</button>
      </div>
    `;

    let container = document.getElementById('lg-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'lg-toast-container';
      container.className = 'lg-toast-container';
      document.body.appendChild(container);
    }

    container.appendChild(toast);
    setTimeout(() => this.hide(toast), duration);
  },

  hide: function(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  },

  getIcon: function(type) {
    const icons = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
};

/**
 * ============================================================================
 * LOADING STATES
 * ============================================================================
 */
LogicGate.Loading = {
  show: function(element, message = 'Loading...') {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const spinner = document.createElement('div');
    spinner.className = 'lg-loading-overlay';
    spinner.innerHTML = `
      <div class="lg-loading-content">
        <div class="lg-spinner"></div>
        <div class="lg-loading-message">${message}</div>
      </div>
    `;

    el.style.position = 'relative';
    el.appendChild(spinner);
  },

  hide: function(element) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const spinner = el.querySelector('.lg-loading-overlay');
    if (spinner) spinner.remove();
  }
};

/**
 * ============================================================================
 * MODAL DIALOGS
 * ============================================================================
 */
LogicGate.Modal = {
  /**
   * Show a modal dialog
   * @param {Object} options - Modal configuration
   */
  show: function(options = {}) {
    const {
      title = 'Modal',
      content = '',
      size = 'md',
      showClose = true,
      buttons = [],
      onShow = null,
      onHide = null
    } = options;

    const modal = document.createElement('div');
    modal.className = 'lg-modal lg-fade-in';
    modal.innerHTML = `
      <div class="lg-modal-backdrop" onclick="LogicGate.Modal.hide()"></div>
      <div class="lg-modal-content lg-modal-${size} lg-slide-up">
        <div class="lg-modal-header">
          <h3 class="lg-modal-title">${title}</h3>
          ${showClose ? `
            <button class="lg-modal-close" onclick="LogicGate.Modal.hide()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ` : ''}
        </div>
        <div class="lg-modal-body">
          ${content}
        </div>
        ${buttons.length > 0 ? `
          <div class="lg-modal-footer">
            ${buttons.map(btn => `
              <button class="lg-btn lg-btn-${btn.type || 'secondary'}" onclick="${btn.action || 'LogicGate.Modal.hide()'}">
                ${btn.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Handle escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    };
    document.addEventListener('keydown', escapeHandler);
    modal.escapeHandler = escapeHandler;

    if (onShow) onShow(modal);
    
    return modal;
  },

  /**
   * Hide the current modal
   */
  hide: function() {
    const modal = document.querySelector('.lg-modal');
    if (modal) {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', modal.escapeHandler);
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  }
};

/**
 * ============================================================================
 * PROGRESS TRACKING
 * ============================================================================
 */
LogicGate.Progress = {
  /**
   * Update progress circle
   * @param {Element|string} element - Progress circle element
   * @param {number} current - Current progress
   * @param {number} total - Total items
   */
  updateCircle: function(element, current, total) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    el.textContent = `${current}/${total}`;
    el.setAttribute('data-progress', percentage);
    
    // Update color based on progress
    el.className = el.className.replace(/lg-progress-\w+/g, '');
    if (percentage === 100) {
      el.classList.add('lg-progress-complete');
    } else if (percentage >= 75) {
      el.classList.add('lg-progress-high');
    } else if (percentage >= 50) {
      el.classList.add('lg-progress-medium');
    } else {
      el.classList.add('lg-progress-low');
    }
  },

  /**
   * Update progress bar
   * @param {Element|string} element - Progress bar element
   * @param {number} percentage - Progress percentage (0-100)
   */
  updateBar: function(element, percentage) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const bar = el.querySelector('.lg-progress-bar');
    if (bar) {
      bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    }
  }
};

/**
 * ============================================================================
 * SEARCH AND FILTER
 * ============================================================================
 */
LogicGate.Search = {
  /**
   * Initialize search functionality
   * @param {string} inputSelector - Search input selector
   * @param {string} itemsSelector - Items to search selector
   * @param {Object} options - Search options
   */
  init: function(inputSelector, itemsSelector, options = {}) {
    const {
      searchFields = ['textContent'],
      onFilter = null,
      debounceMs = 300
    } = options;

    const input = document.querySelector(inputSelector);
    const items = document.querySelectorAll(itemsSelector);
    
    if (!input || !items.length) return;

    let debounceTimer;
    
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        items.forEach(item => {
          const matches = searchFields.some(field => {
            const value = field === 'textContent' ? 
              item.textContent.toLowerCase() : 
              item.getAttribute(field)?.toLowerCase() || '';
            return value.includes(searchTerm);
          });
          
          item.style.display = matches || !searchTerm ? '' : 'none';
        });
        
        if (onFilter) onFilter(searchTerm, items);
      }, debounceMs);
    });
  }
};

/**
 * ============================================================================
 * BULK OPERATIONS
 * ============================================================================
 */
LogicGate.BulkActions = {
  /**
   * Initialize bulk selection
   * @param {string} containerSelector - Container selector
   * @param {Object} options - Bulk action options
   */
  init: function(containerSelector, options = {}) {
    const {
      itemSelector = '.lg-card',
      checkboxSelector = '.lg-bulk-checkbox',
      selectAllSelector = '.lg-bulk-select-all',
      actionBarSelector = '.lg-bulk-actions',
      onSelectionChange = null
    } = options;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const selectAll = document.querySelector(selectAllSelector);
    const actionBar = document.querySelector(actionBarSelector);
    
    // Handle individual checkbox changes
    container.addEventListener('change', (e) => {
      if (e.target.matches(checkboxSelector)) {
        this.updateSelectionState(container, options);
      }
    });
    
    // Handle select all
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
        const checkboxes = container.querySelectorAll(checkboxSelector);
        checkboxes.forEach(cb => {
          cb.checked = e.target.checked;
        });
        this.updateSelectionState(container, options);
      });
    }
  },

  /**
   * Update selection state
   * @param {Element} container - Container element
   * @param {Object} options - Options object
   */
  updateSelectionState: function(container, options) {
    const checkboxes = container.querySelectorAll(options.checkboxSelector || '.lg-bulk-checkbox');
    const selectAll = document.querySelector(options.selectAllSelector || '.lg-bulk-select-all');
    const actionBar = document.querySelector(options.actionBarSelector || '.lg-bulk-actions');
    
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    const total = checkboxes.length;
    
    // Update select all state
    if (selectAll) {
      selectAll.checked = selected.length === total;
      selectAll.indeterminate = selected.length > 0 && selected.length < total;
    }
    
    // Show/hide action bar
    if (actionBar) {
      actionBar.style.display = selected.length > 0 ? 'flex' : 'none';
      const countElement = actionBar.querySelector('.lg-selection-count');
      if (countElement) {
        countElement.textContent = `${selected.length} selected`;
      }
    }
    
    // Callback
    if (options.onSelectionChange) {
      options.onSelectionChange(selected, total);
    }
  },

  /**
   * Get selected items
   * @param {string} containerSelector - Container selector
   * @param {string} checkboxSelector - Checkbox selector
   * @returns {Array} Selected elements
   */
  getSelected: function(containerSelector, checkboxSelector = '.lg-bulk-checkbox') {
    const container = document.querySelector(containerSelector);
    if (!container) return [];
    
    const checkboxes = container.querySelectorAll(checkboxSelector + ':checked');
    return Array.from(checkboxes).map(cb => cb.closest('.lg-card') || cb.parentElement);
  }
};

/**
 * ============================================================================
 * RISK UTILITIES
 * ============================================================================
 */
LogicGate.Risk = {
  /**
   * Get risk level color class
   * @param {string} level - Risk level (low, medium, high, critical)
   * @returns {string} CSS class
   */
  getLevelClass: function(level) {
    const classes = {
      low: 'lg-risk-low',
      medium: 'lg-risk-medium',
      high: 'lg-risk-high',
      critical: 'lg-risk-critical'
    };
    return classes[level.toLowerCase()] || 'lg-risk-medium';
  },

  /**
   * Calculate risk score
   * @param {number} likelihood - Likelihood (1-5)
   * @param {number} impact - Impact (1-5)
   * @returns {Object} Risk score and level
   */
  calculateScore: function(likelihood, impact) {
    const score = likelihood * impact;
    let level;
    
    if (score <= 6) level = 'low';
    else if (score <= 12) level = 'medium';
    else if (score <= 20) level = 'high';
    else level = 'critical';
    
    return { score, level };
  },

  /**
   * Update risk indicator
   * @param {Element|string} element - Risk card element
   * @param {string} level - Risk level
   * @param {boolean} hasControls - Whether controls are mapped
   */
  updateIndicator: function(element, level, hasControls = false) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    // Update risk level class
    el.className = el.className.replace(/risk-\w+/g, '');
    el.classList.add(`risk-${level}`);
    
    // Update control indicator
    let indicator = el.querySelector('.lg-control-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'lg-control-indicator';
      el.appendChild(indicator);
    }
    
    indicator.className = 'lg-control-indicator ' + (hasControls ? 'mapped' : 'unmapped');
  }
};

/**
 * ============================================================================
 * EXPORT UTILITIES
 * ============================================================================
 */
LogicGate.Export = {
  /**
   * Export data to CSV
   * @param {Array} data - Array of objects to export
   * @param {string} filename - Export filename
   * @param {Array} columns - Column configuration
   */
  toCSV: function(data, filename = 'export.csv', columns = null) {
    if (!data.length) return;
    
    const headers = columns || Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return typeof value === 'string' && value.includes(',') ? 
            `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    this.downloadFile(csvContent, filename, 'text/csv');
  },

  /**
   * Export data to JSON
   * @param {Array|Object} data - Data to export
   * @param {string} filename - Export filename
   */
  toJSON: function(data, filename = 'export.json') {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json');
  },

  /**
   * Download file
   * @param {string} content - File content
   * @param {string} filename - Filename
   * @param {string} mimeType - MIME type
   */
  downloadFile: function(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * ============================================================================
 * INITIALIZATION
 * ============================================================================
 */
LogicGate.init = function() {
  // Auto-initialize components with data attributes
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize search components
    document.querySelectorAll('[data-lg-search]').forEach(element => {
      const target = element.getAttribute('data-lg-search');
      const fields = element.getAttribute('data-lg-search-fields')?.split(',') || ['textContent'];
      LogicGate.Search.init(element, target, { searchFields: fields });
    });
    
    // Initialize bulk actions
    document.querySelectorAll('[data-lg-bulk-container]').forEach(element => {
      LogicGate.BulkActions.init(element);
    });
    
    // Add toast styles if not present
    if (!document.getElementById('lg-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'lg-toast-styles';
      style.textContent = `
        .lg-toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: var(--lg-z-toast, 1080);
          max-width: 400px;
        }
        
        .lg-toast {
          background: white;
          border: 1px solid var(--lg-gray-200);
          border-radius: var(--lg-border-radius-lg);
          box-shadow: var(--lg-shadow-lg);
          margin-bottom: 12px;
          transform: translateX(100%);
          transition: all 0.3s ease;
        }
        
        .lg-toast.lg-fade-in {
          transform: translateX(0);
        }
        
        .lg-toast-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }
        
        .lg-toast-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }
        
        .lg-toast-message {
          flex: 1;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .lg-toast-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .lg-toast-close:hover {
          opacity: 1;
        }
        
        .lg-toast-success .lg-toast-icon { color: var(--lg-success-600); }
        .lg-toast-warning .lg-toast-icon { color: var(--lg-warning-600); }
        .lg-toast-danger .lg-toast-icon { color: var(--lg-danger-600); }
        .lg-toast-info .lg-toast-icon { color: var(--lg-info-600); }
        
        .lg-loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        
        .lg-loading-content {
          text-align: center;
        }
        
        .lg-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--lg-gray-200);
          border-top: 3px solid var(--lg-primary-600);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 12px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .lg-loading-message {
          font-size: 14px;
          color: var(--lg-gray-600);
        }
        
        .lg-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: var(--lg-z-modal, 1050);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .lg-modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .lg-modal-content {
          background: white;
          border-radius: var(--lg-border-radius-lg);
          box-shadow: var(--lg-shadow-xl);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .lg-modal-sm { max-width: 400px; }
        .lg-modal-md { max-width: 600px; }
        .lg-modal-lg { max-width: 800px; }
        .lg-modal-xl { max-width: 1200px; }
        
        .lg-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }
        
        .lg-modal-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .lg-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .lg-modal-close:hover {
          opacity: 1;
        }
        
        .lg-modal-body {
          padding: 24px;
        }
        
        .lg-modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 0 24px 24px;
        }
      `;
      document.head.appendChild(style);
    }
  });
};

// Initialize the library
LogicGate.init();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LogicGate;
} 