<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-center mb-4 text-gray-800">Partner Profile</h1>
    <p class="text-center text-gray-600 mb-8">Here's your ideal partner's weighted profile</p>
    
    <!-- Combined Chart -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-semibold text-center mb-6 text-gray-700">Complete Profile</h2>
      <div class="max-w-2xl mx-auto">
        <RadarChart
          :labels="allLabels"
          :datasets="allDatasets"
          :max-value="maxValue"
          title="All Attributes"
          :multi-category="true"
        />
      </div>
    </div>

    <!-- Individual Category Charts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="(categoryKey) in categoryKeys"
        :key="categoryKey"
        class="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 class="text-xl font-semibold text-center mb-4 text-gray-700">
          {{ categories[categoryKey].name }}
        </h3>
        <RadarChart
          :labels="getCategoryLabels(categoryKey)"
          :data="getCategoryData(categoryKey)"
          :max-value="getCategoryMaxValue(categoryKey)"
          :title="categories[categoryKey].name"
          :color="categories[categoryKey].color"
        />
        
        <!-- Stats breakdown -->
        <div class="mt-4 space-y-2 text-sm">
          <div
            v-for="(sub, subKey) in categories[categoryKey].subcategories"
            :key="subKey"
            class="flex justify-between items-center"
          >
            <span class="text-gray-600">{{ sub.label }}</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div 
                :class="[
                  'h-2 rounded-full transition-all',
                  sub.value > 3 ? 'bg-green-500' : sub.value < 3 ? 'bg-red-500' : 'bg-gray-400'
                ]"
                :style="{ width: `${((Math.round(sub.value) - 2) / 8) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-center">
      <button
        @click="goBack"
        class="px-8 py-4 rounded-lg font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        ← Adjust Points
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterData } from '../composables/useCharacterData'
import RadarChart from './RadarChart.vue'

const { state, setScreen, getAllSubcategoryData, getCategorySubcategoryData } = useCharacterData()

const categories = state.categories
const categoryKeys = ['looks', 'social', 'brain']

// Combined chart data
const allLabels = computed(() => {
  return getAllSubcategoryData().map(item => item.label)
})

const allData = computed(() => {
  return getAllSubcategoryData().map(item => item.value)
})

// Create separate datasets for each category in the combined chart
const allDatasets = computed(() => {
  const allSubcategoryData = getAllSubcategoryData()
  
  return categoryKeys.map(categoryKey => {
    // Create array with values for this category's subcategories, 0 for others (to fill to center)
    const data = allSubcategoryData.map(item => {
      return item.categoryKey === categoryKey ? item.value : 0
    })
    
    return {
      label: categories[categoryKey].name,
      data: data,
      color: categories[categoryKey].color
    }
  })
})

const maxValue = computed(() => {
  // Max value is 10 - the maximum subcategory value
  return 10
})

// Individual category chart helpers
const getCategoryLabels = (categoryKey) => {
  return getCategorySubcategoryData(categoryKey).map(item => item.label)
}

const getCategoryData = (categoryKey) => {
  return getCategorySubcategoryData(categoryKey).map(item => item.value)
}

const getCategoryMaxValue = (categoryKey) => {
  // Max value is 10 - the maximum subcategory value
  return 10
}

const goBack = () => {
  setScreen(2)
}
</script>

