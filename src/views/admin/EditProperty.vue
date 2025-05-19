<script lang="ts" setup>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { useLocationMap } from '@/composables/useLocationMap'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { updateProperty } from '@/services/property'
import { addPropertyValidation as validationSchema } from '@/validations/addProperty'
import { allowOnlyNumbers } from '@/utils/inputs'
import { fetchPropertyById } from '@/services/property'
import { generateToast } from '@/utils/alerts'
import Heading from '@/ui/Heading.vue'
import ProgressLoader from '@/ui/ProgressLoader.vue'
import type { Property } from '@/schemas/property'

const UploadImage = defineAsyncComponent(() => import('@/ui/UploadImage.vue'))

const router = useRouter()
const route = useRoute()
const propertyId = computed(() => {
	const id = route.params?.id
	return Array.isArray(id) ? id[0] : id || ''
})

const accountRooms = [1, 2, 3, 4, 5]
const shouldCardLoadiong = ref(false)
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
const { zoom, center, getPin } = useLocationMap()

onMounted(() => {
	loadProperty()
})

const loadProperty = async () => {
	shouldCardLoadiong.value = true
	try {
		const { data, error } = await fetchPropertyById(propertyId.value)

		if (error) {
			generateToast(error, { icon: 'error' })
			return
		}

		if (data) {
			title.value.value = data.title
			price.value.value = data.price
			numberRooms.value.value = data.numberRooms
			numberBathrooms.value.value = data.numberBathrooms
			numberParkinLots.value.value = data.numberParkinLots
			description.value.value = data.description
			hasPool.value.value = data.hasPool
			imageId.value = data.imageId
			center.value = data.location
		}
	} finally {
		shouldCardLoadiong.value = false
	}
}

const getImageId = imgId => {
	imageId.value = typeof imgId === 'string' ? imgId : ''
}

const submit = handleSubmit(async inputValues => {
	if (!imageId.value) {
		generateToast('Image is required.', { icon: 'error' })
		return
	}

	const payload = {
		...inputValues,
		price: Number(inputValues.price),
		imageId: imageId.value,
		location: center.value,
		id: propertyId.value,
	}
	shouldCardLoadiong.value = true
	try {
		const { error, data: success } = await updateProperty(payload)

		if (error) {
			generateToast(error, { icon: 'error' })
			return
		}

		if (success) {
			generateToast(success)
		}

		router.push({ name: 'admin' })
	} finally {
		shouldCardLoadiong.value = false
	}
})
</script>

<template>
	<v-card
		max-width="800"
		flat
		class="mx-auto my-10"
		:loading="shouldCardLoadiong"
	>
		<template v-slot:loader="{ isActive }">
			<ProgressLoader :active="isActive" />
		</template>

		<v-card-title class="text-h4 font-weight-bold" tag="h3">
			New Property
		</v-card-title>
		<v-card-subtitle class="text-h5" tag="h5">
			Create a new property filling out the network form
		</v-card-subtitle>

		<v-form @submit.prevent="submit" :readonly="shouldCardLoadiong">
			<fieldset class="d-flex flex-column ga-5 pa-5 my-5 rounded">
				<legend class="text-h4 text-blue-grey-darken-3">Create Property</legend>
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
					<LMap
						style="height: 500px; width: 100%"
						ref="map"
						v-model:zoom="zoom"
						:center="center"
						:use-global-leaflet="false"
					>
						<LMarker :lat-lng="center" draggable @moveend="getPin" />
						<LTileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							layer-type="base"
							name="OpenStreetMap"
						/>
					</LMap>
				</div>

				<v-btn type="submit" color="pink-accent-3">
					<span>Edit Property</span>
				</v-btn>
			</fieldset>
		</v-form>
	</v-card>
</template>
