class VariantSelector {
  constructor(container) {
    this.container = container;
    this.productId = container.dataset.productId;
    this.variants = JSON.parse(container.dataset.variants || '[]');
    this.currentVariant = null;
    
    // Elements
    this.sizeButtons = container.querySelectorAll('.size-button');
    this.qualityOptions = container.querySelectorAll('.quality-option');
    this.variantSelects = container.querySelectorAll('.variant-select');
    this.productSelect = container.querySelector('.product-form__variants');
    this.successMessage = container.querySelector('[data-success-message]');
    this.errorMessage = container.querySelector('[data-error-message]');
    
    this.init();
  }

  init() {
    this.initializeSizeButtons();
    this.initializeQualityOptions();
    this.updateAvailableOptions();
  }

  initializeSizeButtons() {
    this.sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleSizeSelection(e.currentTarget);
      });
    });
  }

  initializeQualityOptions() {
    this.qualityOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        if (!e.currentTarget.classList.contains('disabled')) {
          this.handleQualitySelection(e.currentTarget);
        }
      });
    });
  }

  handleSizeSelection(button) {
    const size = button.dataset.value;
    
    // Update UI
    this.sizeButtons.forEach(btn => {
      btn.classList.remove('bg-gray-900', 'text-white', 'border-gray-900');
    });
    button.classList.add('bg-gray-900', 'text-white', 'border-gray-900');
    
    // Update hidden select
    const sizeSelect = this.container.querySelector('select[data-index="option1"]');
    if (sizeSelect) {
      sizeSelect.value = size;
    }

    // Update available qualities
    this.updateAvailableOptions();
  }

  handleQualitySelection(option) {
    const quality = option.dataset.value;
    
    // Update UI
    this.qualityOptions.forEach(opt => {
      const check = opt.querySelector('.quality-check');
      check.classList.remove('border-gray-900', 'bg-gray-900');
      const svg = check.querySelector('svg');
      svg.classList.add('hidden');
    });

    const check = option.querySelector('.quality-check');
    check.classList.add('border-gray-900', 'bg-gray-900');
    const svg = check.querySelector('svg');
    svg.classList.remove('hidden');
    
    // Update hidden select
    const qualitySelect = this.container.querySelector('select[data-index="option2"]');
    if (qualitySelect) {
      qualitySelect.value = quality;
    }

    this.updateVariantSelection();
  }

  updateAvailableOptions() {
    const selectedSize = this.container.querySelector('select[data-index="option1"]').value;
    
    // Find available qualities for selected size
    const availableQualities = this.variants
      .filter(variant => variant.option1 === selectedSize && variant.available)
      .map(variant => variant.option2);

    // Update quality options UI
    this.qualityOptions.forEach(option => {
      const quality = option.dataset.value;
      if (availableQualities.includes(quality)) {
        option.classList.remove('opacity-50', 'cursor-not-allowed', 'disabled');
        option.querySelector('input').disabled = false;
      } else {
        option.classList.add('opacity-50', 'cursor-not-allowed', 'disabled');
        option.querySelector('input').disabled = true;
      }
    });

    // Reset quality selection if current selection is not available
    const currentQuality = this.container.querySelector('select[data-index="option2"]').value;
    if (!availableQualities.includes(currentQuality)) {
      this.resetQualitySelection();
    }

    this.updateVariantSelection();
  }

  resetQualitySelection() {
    const qualitySelect = this.container.querySelector('select[data-index="option2"]');
    qualitySelect.value = '';
    
    this.qualityOptions.forEach(option => {
      const check = option.querySelector('.quality-check');
      check.classList.remove('border-gray-900', 'bg-gray-900');
      const svg = check.querySelector('svg');
      svg.classList.add('hidden');
    });
  }

  updateVariantSelection() {
    const selectedOptions = Array.from(this.variantSelects).map(select => select.value);
    
    // Find matching variant
    this.currentVariant = this.variants.find(variant => {
      return variant.options.every((option, index) => option === selectedOptions[index]);
    });

    // Update main select and messages
    if (this.currentVariant && this.currentVariant.available) {
      this.productSelect.value = this.currentVariant.id;
      this.updateMessages(true);
    } else {
      this.updateMessages(false);
    }

    // Trigger change event
    this.container.dispatchEvent(new CustomEvent('variantChange', {
      detail: {
        variant: this.currentVariant
      }
    }));
  }

  updateMessages(success) {
    if (success) {
      this.successMessage.classList.remove('hidden');
      this.errorMessage.classList.add('hidden');
    } else {
      this.successMessage.classList.add('hidden');
      this.errorMessage.classList.remove('hidden');
    }
  }
}

// Initialize all variant selectors on the page
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.variant-wrapper').forEach(wrapper => {
    new VariantSelector(wrapper);
  });
});