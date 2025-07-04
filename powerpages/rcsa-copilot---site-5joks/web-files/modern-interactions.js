/*
================================================================================
RCSA POWER PAGES - MODERN INTERACTIONS & UX ENHANCEMENTS
================================================================================
Enhanced user interactions, toast notifications, loading states, and accessibility
Based on LogicGate Risk Cloud and Monday.com interaction patterns
================================================================================
*/

class ModernInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupToastContainer();
    this.setupLoadingOverlay();
    this.setupKeyboardNavigation();
    this.setupCardInteractions();
    this.setupFormEnhancements();
  }

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================

  setupToastContainer() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(container);
    }
  }

  showToast(title, message, type = 'info', duration = 5000) {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    const toastId = 'toast-' + Date.now();
    
    toast.id = toastId;
    toast.className = `toast-modern toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const icons = {
      success: `<svg class="toast-icon" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
      error: `<svg class="toast-icon" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`,
      warning: `<svg class="toast-icon" fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>`,
      info: `<svg class="toast-icon" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>`
    };

    toast.innerHTML = `
      ${icons[type]}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="modernInteractions.dismissToast('${toastId}')" aria-label="Close notification">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;

    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismissToast(toastId), duration);
    }

    return toastId;
  }

  dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }

  // Quick toast methods
  showSuccess(title, message) {
    return this.showToast(title, message, 'success');
  }

  showError(title, message) {
    return this.showToast(title, message, 'error');
  }

  showWarning(title, message) {
    return this.showToast(title, message, 'warning');
  }

  showInfo(title, message) {
    return this.showToast(title, message, 'info');
  }

  // ============================================================================
  // LOADING STATES
  // ============================================================================

  setupLoadingOverlay() {
    if (!document.querySelector('.spinner-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'spinner-overlay';
      overlay.innerHTML = `
        <div class="spinner" role="status" aria-label="Loading"></div>
      `;
      document.body.appendChild(overlay);
    }
  }

  showLoading() {
    const overlay = document.querySelector('.spinner-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  hideLoading() {
    const overlay = document.querySelector('.spinner-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  setButtonLoading(button, isLoading = true) {
    if (isLoading) {
      button.classList.add('btn-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    } else {
      button.classList.remove('btn-loading');
      button.disabled = false;
      button.setAttribute('aria-busy', 'false');
    }
  }

  // ============================================================================
  // ENHANCED FORM INTERACTIONS
  // ============================================================================

  setupFormEnhancements() {
    // Auto-save indicators
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.handleAutoSave(e.target);
      }
    });

    // Form submission with loading
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form[data-enhanced]')) {
        this.handleEnhancedSubmit(e);
      }
    });
  }

  handleAutoSave(field) {
    // Clear existing timeout
    if (field.autoSaveTimeout) {
      clearTimeout(field.autoSaveTimeout);
    }

    // Add saving indicator
    const indicator = field.parentNode.querySelector('.save-indicator') || 
                     this.createSaveIndicator(field);
    
    indicator.textContent = 'Saving...';
    indicator.className = 'save-indicator saving';

    // Simulate auto-save after 1 second of no typing
    field.autoSaveTimeout = setTimeout(() => {
      indicator.textContent = 'Saved';
      indicator.className = 'save-indicator saved';
      
      setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
          indicator.textContent = '';
          indicator.className = 'save-indicator';
          indicator.style.opacity = '1';
        }, 200);
      }, 2000);
    }, 1000);
  }

  createSaveIndicator(field) {
    const indicator = document.createElement('span');
    indicator.className = 'save-indicator';
    indicator.style.cssText = `
      font-size: 0.75rem;
      color: #6b7280;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease-in-out;
    `;
    field.parentNode.appendChild(indicator);
    return indicator;
  }

  handleEnhancedSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    this.setButtonLoading(submitBtn, true);
    
    // Simulate form processing
    setTimeout(() => {
      this.setButtonLoading(submitBtn, false);
      this.showSuccess('Success!', 'Assessment submitted successfully ✅');
      
      // Optional: redirect or update UI
      if (form.dataset.successUrl) {
        setTimeout(() => {
          window.location.href = form.dataset.successUrl;
        }, 1500);
      }
    }, 2000);
  }

  // ============================================================================
  // CARD INTERACTIONS
  // ============================================================================

  setupCardInteractions() {
    // Keyboard navigation for cards
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('.card-interactive, .risk-card, .kanban-card')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.target.click();
        }
      }
    });

    // Card hover effects with accessibility
    document.addEventListener('mouseenter', (e) => {
      if (e.target.matches('.card-interactive, .risk-card')) {
        e.target.setAttribute('aria-expanded', 'true');
      }
    }, true);

    document.addEventListener('mouseleave', (e) => {
      if (e.target.matches('.card-interactive, .risk-card')) {
        e.target.setAttribute('aria-expanded', 'false');
      }
    }, true);
  }

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  setupKeyboardNavigation() {
    // Make cards focusable
    document.querySelectorAll('.card-interactive, .risk-card, .kanban-card').forEach(card => {
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
      if (!card.hasAttribute('role')) {
        card.setAttribute('role', 'button');
      }
    });

    // Arrow key navigation for grids
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.risk-grid, .kanban-board')) {
        this.handleGridNavigation(e);
      }
    });
  }

  handleGridNavigation(e) {
    const grid = e.target.closest('.risk-grid, .kanban-board');
    const cards = Array.from(grid.querySelectorAll('.risk-card, .kanban-card'));
    const currentIndex = cards.indexOf(e.target);
    
    if (currentIndex === -1) return;

    let newIndex;
    const isKanban = grid.classList.contains('kanban-board');
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, cards.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        if (!isKanban) {
          const cols = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
          newIndex = Math.min(currentIndex + cols, cards.length - 1);
        }
        break;
      case 'ArrowUp':
        if (!isKanban) {
          const cols = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
          newIndex = Math.max(currentIndex - cols, 0);
        }
        break;
      default:
        return;
    }

    if (newIndex !== undefined && cards[newIndex]) {
      e.preventDefault();
      cards[newIndex].focus();
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  // Smooth scroll to element
  scrollToElement(selector, offset = 80) {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  // Copy to clipboard with feedback
  async copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess('Copied!', successMessage);
    } catch (err) {
      this.showError('Error', 'Failed to copy to clipboard');
    }
  }

  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Format date for display
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  }

  // Format relative time
  formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }
}

// ============================================================================
// RISK ASSESSMENT SPECIFIC INTERACTIONS
// ============================================================================

class RiskAssessmentUI {
  constructor() {
    this.modernInteractions = new ModernInteractions();
    this.init();
  }

  init() {
    this.setupRiskCards();
    this.setupKanbanBoard();
    this.setupBulkActions();
  }

  setupRiskCards() {
    // Risk card click handlers
    document.addEventListener('click', (e) => {
      const riskCard = e.target.closest('.risk-card');
      if (riskCard && !e.target.closest('button')) {
        this.openRiskDetails(riskCard.dataset.riskId);
      }
    });
  }

  setupKanbanBoard() {
    // Basic drag and drop for kanban cards
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('kanban-card')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
        e.target.style.opacity = '0.5';
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('kanban-card')) {
        e.target.style.opacity = '1';
      }
    });

    document.addEventListener('dragover', (e) => {
      if (e.target.closest('.kanban-column')) {
        e.preventDefault();
      }
    });

    document.addEventListener('drop', (e) => {
      const column = e.target.closest('.kanban-column');
      if (column) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const newStatus = column.dataset.status;
        this.moveCard(cardId, newStatus);
      }
    });
  }

  setupBulkActions() {
    // Bulk selection for risk cards
    document.addEventListener('change', (e) => {
      if (e.target.matches('.risk-card input[type="checkbox"]')) {
        this.updateBulkActions();
      }
    });
  }

  openRiskDetails(riskId) {
    this.modernInteractions.showLoading();
    
    // Simulate loading risk details
    setTimeout(() => {
      this.modernInteractions.hideLoading();
      // Here you would typically open a modal or navigate to details page
      this.modernInteractions.showInfo('Risk Details', `Opening details for risk ${riskId}`);
    }, 1000);
  }

  moveCard(cardId, newStatus) {
    this.modernInteractions.showLoading();
    
    // Simulate API call to update card status
    setTimeout(() => {
      this.modernInteractions.hideLoading();
      this.modernInteractions.showSuccess('Updated!', `Assessment moved to ${newStatus}`);
      // Here you would update the UI with the new status
    }, 1000);
  }

  updateBulkActions() {
    const selectedCards = document.querySelectorAll('.risk-card input[type="checkbox"]:checked');
    const bulkActions = document.querySelector('.bulk-actions');
    
    if (selectedCards.length > 0) {
      if (bulkActions) {
        bulkActions.style.display = 'flex';
        bulkActions.querySelector('.selected-count').textContent = selectedCards.length;
      }
    } else {
      if (bulkActions) {
        bulkActions.style.display = 'none';
      }
    }
  }

  submitAssessment(assessmentId) {
    const submitBtn = document.querySelector(`[data-assessment-id="${assessmentId}"] .submit-btn`);
    
    this.modernInteractions.setButtonLoading(submitBtn, true);
    
    // Simulate assessment submission
    setTimeout(() => {
      this.modernInteractions.setButtonLoading(submitBtn, false);
      this.modernInteractions.showSuccess('Assessment Submitted!', 'Your assessment has been submitted for review ✅');
    }, 2000);
  }

  approveAssessment(assessmentId) {
    const approveBtn = document.querySelector(`[data-assessment-id="${assessmentId}"] .approve-btn`);
    
    this.modernInteractions.setButtonLoading(approveBtn, true);
    
    // Simulate assessment approval
    setTimeout(() => {
      this.modernInteractions.setButtonLoading(approveBtn, false);
      this.modernInteractions.showSuccess('Assessment Approved!', 'Assessment has been approved and published ✅');
    }, 1500);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.modernInteractions = new ModernInteractions();
  window.riskAssessmentUI = new RiskAssessmentUI();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernInteractions, RiskAssessmentUI };
} 