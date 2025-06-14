<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProperties } from '@/composables/useProperties'
import { generateToast } from '@/utils/alerts'
import Spinner from '@/ui/Spinner.vue'

const route = useRoute()
const router = useRouter()
const propertyId = computed(() => {
	const id = route.params?.id
	return Array.isArray(id) ? id[0] : id || ''
})
const { deletePropertyById } = useProperties()

onMounted(async () => {
	try {
		if (!propertyId.value) {
			generateToast('Property ID is required', { icon: 'error' })
			return
		}

		await deletePropertyById(propertyId.value)
	} catch (e) {
		generateToast(e.message, { icon: 'error' })
	} finally {
		router.push({ name: 'admin' })
	}
})
</script>

<template>
	<Spinner />
</template>
