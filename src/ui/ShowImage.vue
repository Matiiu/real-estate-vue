<script lang="ts" setup>
import { toRefs, computed } from 'vue'
import { AdvancedImage } from '@cloudinary/vue'
import { Cloudinary } from '@cloudinary/url-gen'

export interface Props {
	imageId?: string | null
	height?: number | string
	width?: number | string
	objectFit?: 'contain' | 'cover' | 'fill' | 'none'
}
const props = withDefaults(defineProps<Props>(), {
	imageId: null,
	height: '100%',
	width: '100%',
	objectFit: 'contain',
})
const { imageId, height, width } = toRefs(props)

const cld = new Cloudinary({
	cloud: { cloudName: import.meta.env?.VITE_CLOUDINARY_NAME || '' },
})

const image = computed(() => (imageId.value ? cld.image(imageId.value) : null))
const heightImage = computed(() =>
	typeof height.value === 'number' ? height.value + 'px' : height.value,
)
const widthImage = computed(() =>
	typeof width.value === 'number' ? width.value + 'px' : width.value,
)
</script>

<template>
	<div :style="[{ height: heightImage, width: widthImage }]">
		<AdvancedImage
			v-if="image"
			:cld-img="image"
			class="w-100 h-100"
			:style="{ objectFit: objectFit }"
		/>
	</div>
</template>
