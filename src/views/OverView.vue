<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useProperties } from '@/composables/useProperties'
import Heading from '@/ui/Heading.vue'
import PropertyCard from '@/components/property/Card.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'

// const SearchPropertiesDialog = defineAsyncComponent(
// 	() => import('@/components/property/SearchPropertiesDialog.vue'),
// )

const PropertyFilters = defineAsyncComponent(
	() => import('@/components/property/Filters.vue'),
)

const { properties, loading, searchPropertiesByFilters } = useProperties()
</script>

<template>
	<Heading>Vue Real Estate</Heading>

	<v-card flat :loading="loading" :disabled="loading" class="pa-3">
		<template v-slot:loader="{ isActive }">
			<ProgressLoader :active="isActive" />
		</template>

		<v-card-text>
			<Heading tag="h4">Search</Heading>
			<PropertyFilters @search="searchPropertiesByFilters" />
		</v-card-text>

		<template v-if="properties.length">
			<v-row class="w-100">
				<PropertyCard
					v-for="property in properties"
					:key="property.id"
					:property="property"
				/>
			</v-row>
		</template>
	</v-card>
</template>
