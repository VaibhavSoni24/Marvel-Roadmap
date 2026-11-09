/**
 * Marvel Multiverse Roadmap - Support Page Interactivity
 * Handles one-click clipboard copying and floating toast notifications.
 */

(function () {
  'use strict';

  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease-out';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  function onSuccess(btn, label, text) {
    if (btn) {
      btn.classList.add('copied');
      const span = btn.querySelector('span');
      const originalText = span ? span.textContent : 'Copy';
      if (span) span.textContent = 'Copied! ✓';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (span) span.textContent = originalText;
      }, 2000);
    }
    showToast(`Copied ${label || 'detail'}: ${text}`);
  }

  function fallbackCopy(text, btn, label) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      onSuccess(btn, label, text);
    } catch (e) {
      showToast('Could not copy to clipboard');
    }
    document.body.removeChild(textarea);
  }

  function copyText(text, btn, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        onSuccess(btn, label, text);
      }).catch(() => {
        fallbackCopy(text, btn, label);
      });
    } else {
      fallbackCopy(text, btn, label);
    }
  }

  function initCopyButtons() {
    document.querySelectorAll('.field-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const el = document.getElementById(targetId);
        if (!el) return;
        const text = el.textContent.trim();
        const item = btn.closest('.support-field-item');
        const labelEl = item ? item.querySelector('.field-label span') : null;
        const label = labelEl ? labelEl.textContent.trim() : 'Detail';
        copyText(text, btn, label);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
