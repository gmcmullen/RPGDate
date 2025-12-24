<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-center mb-4 text-gray-800">Partner Character Creation</h1>
    <p class="text-center text-gray-600 mb-8">Drag and drop to rank your priorities</p>
    
    <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-center text-gray-700">
          Rank Your Priorities
        </h2>
        <p class="text-center text-gray-500 mb-6">
          1st place gets the most weight • 2nd gets moderate weight • 3rd gets the least
        </p>
      </div>

      <div class="space-y-4">
        <!-- Ranking slots -->
        <div
          v-for="rank in 3"
          :key="rank"
          @drop="onDrop($event, rank)"
          @dragover.prevent
          @dragenter.prevent="onDragEnter($event, rank)"
          @dragleave.prevent="onDragLeave($event, rank)"
          :class="[
            'flex items-center gap-6 p-6 rounded-lg border-3 transition-all min-h-24',
            dragOverRank === rank ? 'border-blue-400 bg-blue-50 scale-105' : 'border-gray-300 bg-gray-50'
          ]"
        >
          <!-- Rank indicator -->
          <div class="flex items-center gap-4 min-w-32">
            <div class="flex flex-col items-center">
              <div class="text-3xl font-bold text-gray-700">{{ rank }}</div>
              <div class="text-xs text-gray-500">{{ getRankLabel(rank) }}</div>
            </div>
            <div class="text-2xl font-bold text-blue-600">
              {{ getRankPoints(rank) }}
            </div>
          </div>

          <!-- Category card (if assigned) -->
          <div 
            v-if="rankedCategories[rank - 1]"
            draggable="true"
            @dragstart="onDragStart($event, rankedCategories[rank - 1])"
            @dragend="onDragEnd"
            :class="[
              'flex-1 p-4 rounded-lg cursor-move transition-all border-l-8 shadow-md hover:shadow-lg',
              rankedCategories[rank - 1].color === 'red' ? 'bg-red-100 border-red-500' : '',
              rankedCategories[rank - 1].color === 'green' ? 'bg-green-100 border-green-500' : '',
              rankedCategories[rank - 1].color === 'yellow' ? 'bg-yellow-100 border-yellow-500' : '',
              draggedCategory === rankedCategories[rank - 1].key ? 'opacity-50' : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-800">{{ rankedCategories[rank - 1].name }}</h3>
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
              </svg>
            </div>
          </div>

          <!-- Empty slot -->
          <div 
            v-else
            class="flex-1 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-white"
          >
            <p class="text-center text-gray-400 italic">Drop category here</p>
          </div>
        </div>
      </div>

      <!-- Unranked categories pool -->
      <div v-if="unrankedCategories.length > 0" class="mt-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Available Categories</h3>
        <div class="flex justify-center gap-4">
          <div
            v-for="category in unrankedCategories"
            :key="category.key"
            draggable="true"
            @dragstart="onDragStart($event, category.key)"
            @dragend="onDragEnd"
            :class="[
              'p-4 rounded-lg cursor-move transition-all border-l-8 shadow-md hover:shadow-lg min-w-48',
              category.color === 'red' ? 'bg-red-100 border-red-500' : '',
              category.color === 'green' ? 'bg-green-100 border-green-500' : '',
              category.color === 'yellow' ? 'bg-yellow-100 border-yellow-500' : '',
              draggedCategory === category.key ? 'opacity-50' : ''
            ]"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-800">{{ category.name }}</h3>
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <button
        @click="proceedToNext"
        :disabled="!canProceed"
        :class="[
          'px-8 py-4 rounded-lg font-semibold text-lg transition-all',
          canProceed
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Next: Adjust Preferences
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCharacterData } from '../composables/useCharacterData'

const { state, setCategoryPoints, canProceedFromCategoryRanking, setScreen } = useCharacterData()
const categories = state.categories

// Drag and drop state
const draggedCategory = ref(null)
const dragOverRank = ref(null)

// Track which category is in which rank position [rank1, rank2, rank3]
const ranking = ref([null, null, null])

// Computed: get categories with their keys
const categoriesWithKeys = computed(() => {
  return Object.keys(categories).map(key => ({
    key,
    name: categories[key].name,
    color: categories[key].color
  }))
})

// Computed: get categories already ranked
const rankedCategories = computed(() => {
  return ranking.value.map(key => {
    if (!key) return null
    return {
      key,
      name: categories[key].name,
      color: categories[key].color
    }
  })
})

// Computed: get categories not yet ranked
const unrankedCategories = computed(() => {
  return categoriesWithKeys.value.filter(cat => !ranking.value.includes(cat.key))
})

const getRankLabel = (rank) => {
  const labels = { 1: '1st', 2: '2nd', 3: '3rd' }
  return labels[rank]
}

const getRankPoints = (rank) => {
  const weights = { 1: 'High', 2: 'Med', 3: 'Low' }
  return weights[rank]
}

const onDragStart = (event, categoryOrKey) => {
  // Handle both category object and category key
  const key = typeof categoryOrKey === 'string' ? categoryOrKey : categoryOrKey.key
  draggedCategory.value = key
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', key)
}

const onDragEnd = () => {
  draggedCategory.value = null
  dragOverRank.value = null
}

const onDragEnter = (event, rank) => {
  dragOverRank.value = rank
}

const onDragLeave = (event, rank) => {
  if (dragOverRank.value === rank) {
    dragOverRank.value = null
  }
}

const onDrop = (event, targetRank) => {
  event.preventDefault()
  dragOverRank.value = null
  
  if (!draggedCategory.value) return
  
  const draggedKey = draggedCategory.value
  const targetIndex = targetRank - 1
  
  // Find if dragged category is already ranked
  const currentIndex = ranking.value.indexOf(draggedKey)
  
  if (currentIndex !== -1) {
    // Moving from one rank to another
    const displaced = ranking.value[targetIndex]
    ranking.value[currentIndex] = displaced
    ranking.value[targetIndex] = draggedKey
  } else {
    // Adding from unranked pool
    const displaced = ranking.value[targetIndex]
    ranking.value[targetIndex] = draggedKey
    
    // If something was displaced, it goes back to unranked
    if (displaced) {
      setCategoryPoints(displaced, 0)
    }
  }
  
  // Update points based on ranking
  updatePoints()
  draggedCategory.value = null
}

const updatePoints = () => {
  const pointsMap = { 0: 15, 1: 10, 2: 5 }
  
  ranking.value.forEach((categoryKey, index) => {
    if (categoryKey) {
      setCategoryPoints(categoryKey, pointsMap[index])
    }
  })
  
  // Reset any unranked categories
  Object.keys(categories).forEach(key => {
    if (!ranking.value.includes(key)) {
      setCategoryPoints(key, 0)
    }
  })
}

const canProceed = canProceedFromCategoryRanking

const proceedToNext = () => {
  if (canProceed.value) {
    setScreen(2)
  }
}
</script>
