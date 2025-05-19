import type { Property } from '@/schemas/property'
import { fetchProperties } from '@/services/property'
import { generateToast } from '@/utils/alerts'
import { ref } from 'vue'

const loadProperties = async () => {
	const { error, data } = await fetchProperties()

	if (error) {
		generateToast(error, { icon: 'error' })
		return []
	}

	return data || []
}

export async function useProperties() {
	const properties = await ref<Promise<Property[]>>(loadProperties())

	return { properties }
}
