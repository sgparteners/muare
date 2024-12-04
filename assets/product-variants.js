{% assign current_variant = product.selected_or_first_available_variant %}

<div class="product-variants-section py-8 px-4 max-w-7xl mx-auto">
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Product Gallery -->
    <div class="product-gallery sticky top-8">
      <div class="main-image-container aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <img 
          src="{{ current_variant.featured_image | default: product.featured_image | img_url: '1000x' }}"
          alt="{{ product.title | escape }}"
          id="ProductImage"
          class="w-full h-full object-cover object-center transition-opacity duration-300"
          loading="eager"
        >
      </div>

      {% if product.images.size > 1 %}
        <div class="thumbnails-grid mt-4 grid grid-cols-6 gap-3">
          {% for image in product.images %}
            <button 
              type="button"
              class="thumbnail-btn aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:opacity-80 {% if forloop.first %}border-black{% else %}border-transparent{% endif %}"
              data-thumbnail-id="{{ image.id }}"
              data-image-url="{{ image | img_url: '1000x' }}"
            >
              <img 
                src="{{ image | img_url: '150x' }}"
                alt="{{ image.alt | escape }}"
                class="w-full h-full object-cover object-center"
                loading="lazy"
              >
            </button>
          {% endfor %}
        </div>
      {% endif %}
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>
      
      <div class="price-container mb-6">
        <span class="text-2xl font-semibold" id="ProductPrice">
          {{ current_variant.price | money }}
        </span>
      </div>

      {% form 'product', product %}
        <input type="hidden" name="id" id="VariantId" value="{{ current_variant.id }}">

        <div class="variant-selectors space-y-4" data-variants="{{ product.variants | json }}">
          {% for option in product.options_with_values %}
            {% if option.name == 'Size' or option.name == 'Talla' %}
              <div class="variant-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ option.name }}
                </label>
                <select
                  id="SizeSelect"
                  name="options[{{ option.name }}]"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  required
                >
                  <option value="">Seleccionar talla</option>
                  {% for value in option.values %}
                    <option value="{{ value }}">{{ value }}</option>
                  {% endfor %}
                </select>
              </div>
            {% endif %}

            {% if option.name == 'Quality' or option.name == 'Calidad' %}
              <div class="variant-group hidden" id="QualityWrapper">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ option.name }}
                </label>
                <select
                  id="QualitySelect"
                  name="options[{{ option.name }}]"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  required
                  disabled
                >
                  <option value="">Seleccionar calidad</option>
                </select>
              </div>
            {% endif %}
          {% endfor %}

          <div class="quantity-selector">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Metros
            </label>
            <div class="inline-flex items-center border-2 border-gray-200 rounded-lg">
              <button 
                type="button"
                class="quantity-btn w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-gray-50"
                data-action="decrease"
              >−</button>
              <input 
                type="number"
                id="Quantity"
                name="quantity"
                value="1"
                min="1"
                class="w-20 h-12 text-center border-x-2 border-gray-200 focus:ring-0 focus:outline-none"
              >
              <button 
                type="button"
                class="quantity-btn w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-gray-50"
                data-action="increase"
              >+</button>
            </div>
          </div>

          <button 
            type="submit"
            id="AddToCart"
            class="w-full mt-6 bg-black text-white py-4 px-6 rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
            disabled
          >
            <span>Selecciona una talla</span>
          </button>
        </div>
      {% endform %}

      {% if product.description != blank %}
        <div class="product-description mt-8 pt-8 border-t border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Descripción del producto</h2>
          <div class="prose prose-gray">
            {{ product.description }}
          </div>
        </div>
      {% endif %}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Product Variants",
  "settings": [],
  "presets": [
    {
      "name": "Product Variants",
      "category": "Product"
    }
  ]
}
{% endschema %}

<script src="{{ 'product-variants.js' | asset_url }}" defer></script>