<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Heading from '@/ui/Heading.vue'
import { fetchProperties, deletePropertyById } from '@/services/property'
import { type Property } from '@/schemas/property'
import { generateToast } from '@/utils/alerts'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import ShowImage from '@/ui/ShowImage.vue'
import { formatCurrency } from '@/utils/inputs'

const properties = ref<Property[]>([])
const mustCardLoading = ref(false)

onMounted(() => {
	loadProperties()
})

const loadProperties = async () => {
	mustCardLoading.value = true
	try {
		const { error, data } = await fetchProperties()

		if (error) {
			generateToast(error, { icon: 'error' })
		}

		properties.value = data || []
	} finally {
		mustCardLoading.value = false
	}
}

const handleDeletePropertyById = async (id: Property['id']) => {
	mustCardLoading.value = true
	try {
		const { error, data } = await deletePropertyById(id)

		if (error) {
			generateToast(error, { icon: 'error' })
			return
		}

		generateToast(data)
		loadProperties()
	} finally {
		mustCardLoading.value = false
	}
}
</script>

<template>
	<Heading>Admin Panel</Heading>

	<div class="d-flex flex-column ga-6 w-100">
		<div>
			<v-btn color="blue" variant="flat" :to="{ name: 'new-property' }">
				<span class="text-white">New Property</span>
			</v-btn>
		</div>

		<v-card :loading="mustCardLoading" :disabled="mustCardLoading">
			<template v-slot:loader="{ isActive }">
				<ProgressLoader :active="isActive" />
			</template>

			<v-list>
				<template v-if="!!properties.length">
					<v-list-item v-for="property in properties" :key="property.id">
						<template v-slot:prepend>
							<v-list-item-media :start="true">
								<ShowImage :imageId="property.imageId" :width="200" />
							</v-list-item-media>
						</template>

						<div class="d-flex flex-column ga-3">
							<v-list-title>{{ property.title }}</v-list-title>
							<v-list-subtitle>
								{{ formatCurrency(property.price) }}
							</v-list-subtitle>
						</div>

						<template v-slot:append>
							<v-list-action class="d-flex align-center ga-3">
								<v-btn
									:to="{ name: 'edit-property', params: { id: property.id } }"
									color="info"
									flat
								>
									Edit
								</v-btn>
								<v-btn
									@click="handleDeletePropertyById(property.id)"
									color="red-darken-3"
									flat
								>
									Delete
								</v-btn>
							</v-list-action>
						</template>
					</v-list-item>
				</template>

				<template v-else-if="!mustCardLoading">
					<v-list-item
						class="w-100 d-flex justify-center align-center text-subtitle-1 text-grey-darken-2"
					>
						There are no properties available.
					</v-list-item>
				</template>
			</v-list>
		</v-card>
	</div>
</template>
