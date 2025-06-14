<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { defineAsyncComponent, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { addPropertyValidation as validationSchema } from '@/validations/addProperty'
import { allowOnlyNumbers } from '@/utils/inputs'
import { generateToast } from '@/utils/alerts'
import Heading from '@/ui/Heading.vue'
import type { NewProperty } from '@/schemas/property'
import { useProperties } from '@/composables/useProperties'

const router = useRouter()
const UploadImage = defineAsyncComponent(() => import('@/ui/UploadImage.vue'))
const Map = defineAsyncComponent(() => import('@/components/Map.vue'))
const { loading, createProperty } = useProperties()

const accountRooms = [1, 2, 3, 4, 5]
const { handleSubmit } = useForm<NewProperty>({
	validationSchema,
	initialValues: {
		hasPool: false,
		numberBathrooms: 1,
		numberParkinLots: 1,
		numberRooms: 1,
	},
})
const title = useField<NewProperty['title']>('title')
const price = useField<NewProperty['price']>('price')
const numberRooms = useField<NewProperty['numberRooms']>('numberRooms')
const numberBathrooms =
	useField<NewProperty['numberBathrooms']>('numberBathrooms')
const numberParkinLots =
	useField<NewProperty['numberParkinLots']>('numberParkinLots')
const description = useField<NewProperty['description']>('description')
const hasPool = useField<NewProperty['hasPool']>('hasPool')
const imageId = ref<NewProperty['imageId']>('')
const center = ref<NewProperty['location']>([])

const getImageId = imgId => {
	imageId.value = typeof imgId === 'string' ? imgId : ''
}

const submit = handleSubmit(async inputValues => {
	try {
		createProperty({
			...inputValues,
			price: Number(inputValues.price),
			imageId: imageId.value,
			location: center.value,
		})

		router.push({ name: 'admin' })
	} catch (e) {
		generateToast(e?.message, { icon: 'error' })
	}
})

function getLocaltion(location: NewProperty['location']) {
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
			New Property
		</v-card-title>
		<v-card-subtitle class="text-h5" tag="h5">
			Create a new property filling out the network form
		</v-card-subtitle>

		<v-form @submit.prevent="submit">
			<fieldset class="d-flex flex-column ga-5 pa-5 rounded">
				<legend class="text-h4 text-blue-grey-darken-3">Create Property</legend>
				<v-text-field
					label="Property Title"
					v-model="title.value.value"
					:error-messages="title.errorMessage.value"
				/>

				<UploadImage ref="image" :height="450" @get-image-id="getImageId" />

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
					<Map @update:location="getLocaltion" />
				</div>

				<v-btn type="submit" color="pink-accent-3">
					<span>Add Property</span>
				</v-btn>
			</fieldset>
		</v-form>
	</v-card>
</template>
