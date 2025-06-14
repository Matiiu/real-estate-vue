<script lang="ts" setup>
import { toRefs, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocationMap } from '@/composables/useLocationMap'

interface Props {
	customCenter?: number[]
	customZoom?: number
	disabled?: boolean
	tooltip?: string | null
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
})
const { customCenter, customZoom, disabled, tooltip } = toRefs(props)
const emit = defineEmits(['update:location'])

const { zoom, center, getPin } = useLocationMap()

watch(
	customCenter,
	newVal => {
		if (newVal && Array.isArray(newVal) && newVal.length === 2) {
			center.value = newVal
		}
	},
	{ immediate: true },
)
watch(
	customZoom,
	newVal => {
		if (newVal && typeof newVal === 'number') {
			zoom.value = newVal
		}
	},
	{ immediate: true },
)
watch(
	center,
	newVal => {
		if (newVal) {
			emit('update:location', newVal)
		}
	},
	{ immediate: true },
)
</script>

<template>
	<LMap
		style="height: 500px; width: 100%"
		ref="map"
		v-model:zoom="zoom"
		:center="center"
		:use-global-leaflet="false"
	>
		<template v-if="disabled">
			<LMarker :lat-lng="center">
				<LPopup v-if="tooltip">{{ tooltip }}</LPopup>
			</LMarker>
		</template>
		<template v-else>
			<LMarker :lat-lng="center" draggable @moveend="getPin">
				<LPopup v-if="tooltip">{{ tooltip }}</LPopup>
			</LMarker>
		</template>
		<LTileLayer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			layer-type="base"
			name="OpenStreetMap"
		/>
	</LMap>
</template>
