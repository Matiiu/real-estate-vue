<script lang="ts" setup>
import { onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import Heading from '@/ui/Heading.vue'
import { type Property } from '@/schemas/property'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import ShowImage from '@/ui/ShowImage.vue'
import { formatCurrency } from '@/utils/inputs'
import BaseLayout from '@/ui/BaseLayout.vue'
import { useProperties } from '@/composables/useProperties'
import { generateConfirmationPopUp } from '@/utils/alerts'

const PropertyFilters = defineAsyncComponent(
	() => import('@/components/property/Filters.vue'),
)

const router = useRouter()
const { properties, loading, refreshProperties, searchPropertiesByFilters } =
	useProperties()

onMounted(() => {
	refreshProperties()
})

async function handleDeleteConfirmation(property: Property) {
	const { isConfirmed } = await generateConfirmationPopUp(
		`Are you sure you want to delete the property ${property.title}?`,
		{ title: 'Delete Property' },
	)

	if (isConfirmed) {
		router.push({ name: 'delete-property', params: { id: property.id } })
	}
}
</script>

<template>
	<Heading>Admin Panel</Heading>

	<BaseLayout>
		<div>
			<v-btn color="blue" variant="flat" :to="{ name: 'new-property' }">
				<span class="text-white">New Property</span>
			</v-btn>
		</div>

		<v-card :loading="loading" :disabled="loading">
			<template v-slot:loader="{ isActive }">
				<ProgressLoader :active="isActive" />
			</template>

			<v-card-text>
				<Heading tag="h4">Search</Heading>
				<PropertyFilters @search="searchPropertiesByFilters" />
			</v-card-text>

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
									@click="handleDeleteConfirmation(property)"
									color="red-darken-3"
									flat
								>
									Delete
								</v-btn>
							</v-list-action>
						</template>
					</v-list-item>
				</template>

				<template v-else-if="!loading">
					<v-list-item
						class="w-100 d-flex justify-center align-center text-subtitle-1 text-grey-darken-2"
					>
						There are no properties available.
					</v-list-item>
				</template>
			</v-list>
		</v-card>
	</BaseLayout>
</template>
