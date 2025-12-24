import { reactive, computed } from 'vue'

const state = reactive({
  currentScreen: 1, // 1: Category Ranking, 2: Subcategory Points, 3: Results
  categories: {
    looks: {
      name: 'Looks',
      color: 'red',
      points: 0,
      subcategories: {
        height: { label: 'Height', min: 'Short', max: 'Tall', value: 3 },
        attractiveness: { label: 'Attractiveness', min: 'Ugly', max: 'Beautiful', value: 3 },
        fitness: { label: 'Fitness', min: 'Flab', max: 'Fit', value: 3 },
        style: { label: 'Style', min: 'Frumpy', max: 'Fashionable', value: 3 },
        muscles: { label: 'Muscles', min: 'Puny', max: 'Jacked', value: 3 }
      }
    },
    social: {
      name: 'Social',
      color: 'green',
      points: 0,
      subcategories: {
        wealth: { label: 'Wealth', min: 'Broke', max: 'Rich', value: 3 },
        power: { label: 'Power', min: 'Ignored', max: 'Influential', value: 3 },
        success: { label: 'Success', min: 'Failure', max: 'Successful', value: 3 },
        sociability: { label: 'Sociability', min: 'Introvert', max: 'Extrovert', value: 3 },
        charisma: { label: 'Charisma', min: 'Awkward', max: 'Charming', value: 3 }
      }
    },
    brain: {
      name: 'Brain',
      color: 'yellow',
      points: 0,
      subcategories: {
        intellectual: { label: 'Intellectual', min: 'Dumb', max: 'Smart', value: 3 },
        psychological: { label: 'Psychological', min: 'Crazy', max: 'Stable', value: 3 },
        creativity: { label: 'Creativity', min: 'None', max: 'Artist', value: 3 },
        education: { label: 'Education', min: 'Dropout', max: 'PhD', value: 3 },
        approach: { label: 'Approach', min: 'Emotion', max: 'Logic', value: 3 }
      }
    }
  }
})

export function useCharacterData() {
  const setScreen = (screen) => {
    state.currentScreen = screen
  }

  const setCategoryPoints = (category, points) => {
    state.categories[category].points = points
  }

  const setSubcategoryValue = (category, subcategory, value) => {
    state.categories[category].subcategories[subcategory].value = value
  }

  const getAvailablePoints = (category) => {
    const categoryData = state.categories[category]
    const allocated = categoryData.points
    const BASE_VALUE = 3
    
    // Calculate spent points (values above base) - round for integer math
    let spent = 0
    Object.values(categoryData.subcategories).forEach(sub => {
      const roundedValue = Math.round(sub.value)
      if (roundedValue > BASE_VALUE) {
        spent += (roundedValue - BASE_VALUE)
      }
    })
    
    // Calculate bonus points from values below base (can only go down to 2)
    let bonus = 0
    Object.values(categoryData.subcategories).forEach(sub => {
      const roundedValue = Math.round(sub.value)
      if (roundedValue < BASE_VALUE) {
        bonus += (BASE_VALUE - roundedValue)
      }
    })
    
    return allocated + bonus - spent
  }

  const canProceedFromCategoryRanking = computed(() => {
    const pointsArray = Object.values(state.categories).map(c => c.points)
    return pointsArray.includes(15) && pointsArray.includes(10) && pointsArray.includes(5)
  })

  const canProceedFromSubcategories = computed(() => {
    // Check if all categories have zero remaining points
    return ['looks', 'social', 'brain'].every(cat => getAvailablePoints(cat) === 0)
  })

  const getAllSubcategoryData = () => {
    const data = []
    Object.entries(state.categories).forEach(([catKey, category]) => {
      Object.entries(category.subcategories).forEach(([subKey, subcategory]) => {
        data.push({
          categoryKey: catKey,
          categoryName: category.name,
          subcategoryKey: subKey,
          label: subcategory.label,
          value: subcategory.value,
          min: subcategory.min,
          max: subcategory.max
        })
      })
    })
    return data
  }

  const getCategorySubcategoryData = (category) => {
    const categoryData = state.categories[category]
    return Object.entries(categoryData.subcategories).map(([key, sub]) => ({
      key,
      label: sub.label,
      value: sub.value,
      min: sub.min,
      max: sub.max
    }))
  }

  return {
    state,
    setScreen,
    setCategoryPoints,
    setSubcategoryValue,
    getAvailablePoints,
    canProceedFromCategoryRanking,
    canProceedFromSubcategories,
    getAllSubcategoryData,
    getCategorySubcategoryData
  }
}

