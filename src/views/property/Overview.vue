<script lang="ts" setup>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import Heading from '@/ui/Heading.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import { useProperties } from '@/composables/useProperties'
import { generateToast } from '@/utils/alerts'
import { formatCurrency } from '../../utils/inputs'

const ShowImage = defineAsyncComponent(() => import('@/ui/ShowImage.vue'))
const Map = defineAsyncComponent(() => import('@/components/Map.vue'))

const route = useRoute()
const { property, loading, refreshProperty } = useProperties()
const propertyId = computed(() => {
	const id = route.params?.id
	return Array.isArray(id) ? id[0] : id || ''
})

onMounted(() => {
	refreshProperty(propertyId.value).catch(e => {
		generateToast(e?.message, { icon: 'error' })
	})
})
</script>

<template>
	<v-card
		max-width="800"
		flat
		class="mx-auto my-10"
		:loading="loading"
		:disabled="loading"
	>
		<template v-slot:loader="{ isActive }">
			<ProgressLoader :active="isActive" />
		</template>

		<v-skeleton-loader
			:loading="loading"
			type="card-avatar, article, actions"
			class="d-flex flex-column w-100"
		>
			<template v-if="property">
				<Heading>{{ property.title }}</Heading>
				<ShowImage :imageId="property.imageId" />

				<div class="d-flex flex-column ga-5 w-100">
					<div
						class="bg-blue-grey-lighten-5 d-flex flex-column flex-md-row w-100"
					>
						<v-card-text>
							Price:
							<span class="font-weight-bold">
								{{ formatCurrency(property.price) }}
							</span>
						</v-card-text>

						<v-card-text>
							WC:
							<span class="font-weight-bold">
								{{ property.numberBathrooms }}
							</span>
						</v-card-text>

						<v-card-text>
							Parkin Lots:
							<span class="font-weight-bold">
								{{ property.numberParkinLots }}
							</span>
						</v-card-text>

						<v-card-text>
							Bedrooms:
							<span class="font-weight-bold">
								{{ property.numberRooms }}
							</span>
						</v-card-text>
					</div>

					<v-row class="w-100">
						<v-col cols="12" md="8">
							<div class="text-pre-wrap py-10">
								{{ property.description }}
							</div>
						</v-col>

						<v-col cols="12" md="4">
							<Map
								:customCenter="property.location"
								:tooltip="property.title"
								disabled
							/>
						</v-col>
					</v-row>
				</div>
			</template>
		</v-skeleton-loader>
	</v-card>
</template>

<style scoped>
.text-pre-wrap {
	white-space: pre-wrap;
}
</style>
