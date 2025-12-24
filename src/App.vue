<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="container mx-auto">
      <!-- Progress Indicator -->
      <div class="max-w-4xl mx-auto mb-8 px-6">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="flex items-center justify-between">
            <div 
              v-for="step in 3" 
              :key="step"
              class="flex items-center flex-1"
            >
              <div class="flex flex-col items-center flex-1">
                <div 
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                    currentScreen >= step
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  ]"
                >
                  {{ step }}
                </div>
                <span 
                  :class="[
                    'text-xs mt-2 font-medium',
                    currentScreen >= step ? 'text-blue-600' : 'text-gray-500'
                  ]"
                >
                  {{ getStepLabel(step) }}
                </span>
              </div>
              
              <div 
                v-if="step < 3"
                :class="[
                  'h-1 flex-1 mx-2 rounded transition-all',
                  currentScreen > step ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Screen Components -->
      <transition name="fade" mode="out-in">
        <CategoryRanking v-if="currentScreen === 1" key="screen1" />
        <SubcategoryPoints v-else-if="currentScreen === 2" key="screen2" />
        <ResultsChart v-else-if="currentScreen === 3" key="screen3" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterData } from './composables/useCharacterData'
import CategoryRanking from './components/CategoryRanking.vue'
import SubcategoryPoints from './components/SubcategoryPoints.vue'
import ResultsChart from './components/ResultsChart.vue'

const { state } = useCharacterData()
const currentScreen = computed(() => state.currentScreen)

const getStepLabel = (step) => {
  const labels = {
    1: 'Categories',
    2: 'Attributes',
    3: 'Results'
  }
  return labels[step]
}
</script>

<style>
/* Fade transition for screen changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

