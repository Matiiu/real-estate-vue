import { ref, computed } from 'vue'
import type { Property, NewProperty, PropertyFilters } from '@/schemas/property'
import {
	createProperty as create,
	fetchProperties,
	fetchPropertyById,
	deletePropertyById as deleteById,
	updateProperty as update,
	searchPropertiesByFilters as search,
} from '@/services/property'
import { handleError } from '@/schemas/result'

export function useProperties() {
	const properties = ref<Property[]>([])
	const property = ref<Property | null>(null)
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	const isError = computed(() => !!error.value)

	async function createProperty(newProperty: NewProperty) {
		await withLoadingAndError(async () => {
			const { error } = await create(newProperty)
			if (error) throw new Error(error)
		})
	}

	async function refreshProperties() {
		await withLoadingAndError(async () => {
			const { error, data } = await fetchProperties()
			if (error) throw new Error(error)
			properties.value = data || []
		})
	}

	async function refreshProperty(id: Property['id']) {
		await withLoadingAndError(async () => {
			const { error, data } = await fetchPropertyById(id)
			if (error) throw new Error(error)
			property.value = data
		})
	}

	async function updateProperty(currentProperty: Property) {
		await withLoadingAndError(async () => {
			const { error } = await update(currentProperty)
			if (error) throw new Error(error)
		})
	}

	async function deletePropertyById(id: Property['id']) {
		await withLoadingAndError(async () => {
			const { error } = await deleteById(id)
			if (error) throw new Error(error)
		})
	}

	async function searchPropertiesByFilters(filters: PropertyFilters) {
		if (!filters.activeMoreFilters && !filters.title) {
			return refreshProperties()
		}

		await withLoadingAndError(async () => {
			const { error, data } = await search(filters)
			if (error) throw new Error(error)
			properties.value = data || []
		})
	}

	async function withLoadingAndError<T>(fn: () => Promise<T>): Promise<T> {
		isLoading.value = true
		try {
			const result = await fn()
			error.value = null
			return result
		} catch (e) {
			const message = handleError(e)
			error.value = message
			throw new Error(message)
		} finally {
			isLoading.value = false
		}
	}

	return {
		properties,
		property,
		loading: isLoading,
		error,
		isError,
		createProperty,
		refreshProperties,
		refreshProperty,
		updateProperty,
		deletePropertyById,
		searchPropertiesByFilters,
	}
}
