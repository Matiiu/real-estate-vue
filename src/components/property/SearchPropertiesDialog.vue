<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'vue-debounce'

const router = useRouter()
const route = useRoute()
const model = defineModel<boolean>({ default: false })
const searchQuery = computed(() => {
	const value = route.query?.searchQuery
	return value && Array.isArray(value) ? value[0] || '' : (value as string)
})
const search = ref('')
const savedSearch = ref('')

onMounted(async () => {
	await nextTick()
	if (searchQuery.value) {
		search.value = searchQuery.value || ''
	}
})

const debouncedSearch = debounce(() => {
	if (search.value === savedSearch.value) return
	savedSearch.value = search.value
	updateRouteSearchQuery(search.value || undefined)
}, 700)

function clearSearch() {
	savedSearch.value = ''
	search.value = ''
	updateRouteSearchQuery()
}

function updateRouteSearchQuery(value: string | undefined = undefined) {
	router.push({
		name: route.name,
		query: {
			...route.query,
			searchQuery: value,
		},
	})
}
</script>

<template>
	<v-dialog
		max-width="500"
		:model-value="model"
		opacity="0.8"
		@update:model-value="model = false"
	>
		<v-text-field
			v-model.trim="search"
			@update:model-value="debouncedSearch"
			@click:clear="clearSearch"
			ref="inputRef"
			density="compact"
			label="Search"
			prepend-inner-icon="mdi-magnify"
			variant="solo-filled"
			flat
			hide-details
			single-line
			clearable
		/>
	</v-dialog>
</template>
