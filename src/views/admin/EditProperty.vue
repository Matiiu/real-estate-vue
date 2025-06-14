<script lang="ts" setup>
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { addPropertyValidation as validationSchema } from '@/validations/addProperty'
import { allowOnlyNumbers } from '@/utils/inputs'
import { generateToast } from '@/utils/alerts'
import Heading from '@/ui/Heading.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import type { Property } from '@/schemas/property'
import { useProperties } from '@/composables/useProperties'

const UploadImage = defineAsyncComponent(() => import('@/ui/UploadImage.vue'))
const Map = defineAsyncComponent(() => import('@/components/Map.vue'))

const router = useRouter()
const route = useRoute()
const { property, loading, refreshProperty, updateProperty } = useProperties()
const propertyId = computed(() => {
	const id = route.params?.id
	return Array.isArray(id) ? id[0] : id || ''
})

const accountRooms = [1, 2, 3, 4, 5]
const { handleSubmit } = useForm<Property>({ validationSchema })
const title = useField<Property['title']>('title')
const price = useField<Property['price']>('price')
const numberRooms = useField<Property['numberRooms']>('numberRooms')
const numberBathrooms = useField<Property['numberBathrooms']>('numberBathrooms')
const numberParkinLots =
	useField<Property['numberParkinLots']>('numberParkinLots')
const description = useField<Property['description']>('description')
const hasPool = useField<Property['hasPool']>('hasPool')
const imageId = ref<Property['imageId']>('')
const center = ref<Property['location']>([])

onMounted(() => {
	refreshProperty(propertyId.value)
})

watch(property, () => {
	if (property.value) {
		title.value.value = property.value.title
		price.value.value = property.value.price
		numberRooms.value.value = property.value.numberRooms
		numberBathrooms.value.value = property.value.numberBathrooms
		numberParkinLots.value.value = property.value.numberParkinLots
		description.value.value = property.value.description
		hasPool.value.value = property.value.hasPool
		imageId.value = property.value.imageId
		center.value = property.value.location
	}
})

const getImageId = imgId => {
	imageId.value = typeof imgId === 'string' ? imgId : ''
}

const submit = handleSubmit(async inputValues => {
	if (!imageId.value) {
		generateToast('Image is required.', { icon: 'error' })
		return
	}

	try {
		await updateProperty({
			...inputValues,
			price: Number(inputValues.price),
			imageId: imageId.value,
			location: center.value,
			id: propertyId.value,
		})

		router.push({ name: 'admin' })
	} catch (e) {
		generateToast(e?.message, { icon: 'error' })
	}
})

function getLocation(location: Property['location']) {
	center.value = location
}
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

		<v-card-title class="text-h4 font-weight-bold" tag="h3">
			Edit Property
		</v-card-title>
		<v-card-subtitle class="text-h5" tag="h5">
			Edit property filling out the network form
		</v-card-subtitle>

		<v-form @submit.prevent="submit">
			<fieldset class="d-flex flex-column ga-5 pa-5 my-5 rounded">
				<legend class="text-h4 text-blue-grey-darken-3">Edit Property</legend>
				<v-text-field
					label="Property Title"
					v-model="title.value.value"
					:error-messages="title.errorMessage.value"
				/>

				<UploadImage
					ref="image"
					:height="450"
					@get-image-id="getImageId"
					:imageId="imageId"
				/>

				<v-text-field
					label="Price"
					v-model="price.value.value"
					:error-messages="price.errorMessage.value"
					@keydown="allowOnlyNumbers"
				/>
				<div class="d-flex ga-3 flex-column flex-md-row">
					<v-autocomplete
						label="Rooms"
						class="flex-fill"
						:items="accountRooms"
						v-model="numberRooms.value.value"
						:error-messages="numberRooms.errorMessage.value"
					/>
					<v-autocomplete
						label="Bathrooms"
						class="flex-fill"
						:items="accountRooms"
						v-model="numberBathrooms.value.value"
						:error-messages="numberBathrooms.errorMessage.value"
					/>
					<v-autocomplete
						label="Parking Lots"
						class="flex-fill"
						:items="accountRooms"
						v-model="numberParkinLots.value.value"
						:error-messages="numberParkinLots.errorMessage.value"
					/>
				</div>

				<div class="d-flex ga-3 flex-column flex-md-row">
					<v-textarea
						label="Description"
						rows="1"
						class="flex-fill"
						v-model="description.value.value"
						:error-messages="description.errorMessage.value"
					/>
					<v-checkbox
						label="Has Swimming Pool"
						class="flex-fill"
						v-model="hasPool.value.value"
					/>
				</div>

				<div>
					<Heading tag="h2">Location</Heading>
					<Map :custom-center="center" @update:location="getLocation" />
				</div>

				<v-btn type="submit" color="pink-accent-3">
					<span>Edit Property</span>
				</v-btn>
			</fieldset>
		</v-form>
	</v-card>
</template>
