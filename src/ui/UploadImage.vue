<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue'
import { generateToast } from '@/utils/alerts'
import ShowImage, { Props as ShowImageProps } from '@/ui/ShowImage.vue'
import { type UploadInfo, uploadInfoSchema } from '@/schemas/images'

const props = defineProps<ShowImageProps>()
const { imageId } = toRefs(props)
const emit = defineEmits(['getImageId'])

const uploadInfo = ref<UploadInfo | null>(null)

watch(imageId, imgId => {
	if (imgId) {
		uploadInfo.value = { public_id: imgId }
	}
})

const widget = window.cloudinary.createUploadWidget(
	{
		cloudName: import.meta.env?.VITE_CLOUDINARY_NAME,
		uploadPreset: import.meta.env?.VITE_CLOUDINARY_FOLDER,
		multiple: false,
		sources: ['local', 'url', 'camera'],
		resourceType: 'image',
		clientAllowedFormats: ['png', 'jpg', 'jpeg'],
	},
	async (error, result) => {
		if (error) {
			console.error('Something wrong while trying to upload the image ', error)
			generateToast(
				'An unexpected error occurred while trying to upload the image, please try again.',
				{ icon: 'error' },
			)
			return
		}

		const file = result.info?.files?.[0]?.uploadInfo
		if (!file) return

		const parsed = uploadInfoSchema.safeParse(file)

		if (!parsed.success) {
			parsed.error.issues.forEach(error => {
				generateToast(error.message, { icon: 'error' })
			})
			return
		}

		uploadInfo.value = parsed.data
		emit('getImageId', parsed.data.public_id)
	},
)

const uploadImage = () => {
	widget.open()
}
</script>

<template>
	<v-btn @click="uploadImage" color="blue-darken-1">
		<span>Upload Image</span>
	</v-btn>

	<ShowImage
		:imageId="uploadInfo?.public_id"
		:height="height"
		:width="width"
		:object-fit="objectFit"
		@click="uploadImage"
		class="cursor-pointer"
		style="border: dashed 2px #858585"
	/>
</template>
