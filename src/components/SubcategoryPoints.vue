<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-center mb-4 text-gray-800">Adjust Your Preferences</h1>
    <p class="text-center text-gray-600 mb-8">Slide each attribute to adjust its weight in your ideal partner profile</p>
    
    <!-- Category Tabs -->
    <div class="flex justify-center gap-4 mb-8">
      <button
        v-for="(category, key) in categories"
        :key="key"
        @click="currentCategory = key"
        :class="[
          'px-6 py-3 rounded-lg font-semibold transition-all',
          currentCategory === key && category.color === 'red'
            ? 'bg-red-600 text-white shadow-lg'
            : currentCategory === key && category.color === 'green'
            ? 'bg-green-600 text-white shadow-lg'
            : currentCategory === key && category.color === 'yellow'
            ? 'bg-yellow-600 text-white shadow-lg'
            : category.color === 'red'
            ? 'bg-white text-gray-700 border-2 border-red-300 hover:border-red-500'
            : category.color === 'green'
            ? 'bg-white text-gray-700 border-2 border-green-300 hover:border-green-500'
            : 'bg-white text-gray-700 border-2 border-yellow-300 hover:border-yellow-500'
        ]"
      >
        {{ category.name }}
      </button>
    </div>


    <!-- Subcategories -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
      <div class="space-y-6">
        <div
          v-for="(sub, key) in currentCategoryData.subcategories"
          :key="key"
          class="p-6 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex-1 mr-8">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ sub.label }}</h3>
              <div class="text-sm text-gray-500 mb-3 flex justify-between">
                <span class="text-red-500">{{ sub.min }}</span>
                <span class="text-green-500">{{ sub.max }}</span>
              </div>
              
              <!-- Slider -->
              <input
                type="range"
                min="2"
                max="10"
                step="0.01"
                :value="sub.value"
                @input="updateValue(key, $event.target.value)"
                :class="[
                  'w-full max-w-md h-3 rounded-lg appearance-none cursor-pointer slider',
                  'bg-gray-200'
                ]"
                :style="getSliderStyle(sub.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <button
        @click="goBack"
        class="px-8 py-4 rounded-lg font-semibold text-lg bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl transition-all"
      >
        ← Back
      </button>
      
      <button
        @click="proceedToResults"
        :disabled="!canProceed"
        :class="[
          'px-8 py-4 rounded-lg font-semibold text-lg transition-all',
          canProceed
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        View Profile →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCharacterData } from '../composables/useCharacterData'

const { 
  state, 
  setScreen, 
  setSubcategoryValue, 
  getAvailablePoints,
  canProceedFromSubcategories 
} = useCharacterData()

const categories = state.categories
const currentCategory = ref('looks')

const currentCategoryData = computed(() => categories[currentCategory.value])
const availablePoints = computed(() => getAvailablePoints(currentCategory.value))
const canProceed = canProceedFromSubcategories

const updateValue = (subcategoryKey, newValue) => {
  const floatValue = parseFloat(newValue)
  const currentValue = currentCategoryData.value.subcategories[subcategoryKey].value
  const categoryKey = currentCategory.value
  
  // Round to nearest integer for internal tracking
  const roundedValue = Math.round(floatValue)
  
  // Calculate if this change is allowed
  const difference = roundedValue - Math.round(currentValue)
  
  if (difference > 0) {
    // Increasing: check if we have enough points
    if (availablePoints.value >= difference) {
      setSubcategoryValue(categoryKey, subcategoryKey, floatValue)
    }
    // If not enough points, don't update (slider will snap back)
  } else {
    // Decreasing: always allowed (down to minimum of 2)
    setSubcategoryValue(categoryKey, subcategoryKey, floatValue)
  }
}

const getSliderStyle = (value) => {
  // Calculate the percentage for the gradient (2-10 range, with 3 as center)
  const percentage = ((value - 2) / 8) * 100
  const centerPercentage = ((3 - 2) / 8) * 100
  
  let color
  if (value < 3) {
    color = '#ef4444' // red-500
  } else if (value > 3) {
    color = '#22c55e' // green-500
  } else {
    color = '#9ca3af' // gray-400
  }
  
  return {
    background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
  }
}

const goBack = () => {
  setScreen(1)
}

const proceedToResults = () => {
  if (canProceed.value) {
    setScreen(3)
  }
}
</script>

<style scoped>
/* Custom slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.slider::-moz-range-thumb:hover {
  background: #2563eb;
  transform: scale(1.1);
}
</style>

