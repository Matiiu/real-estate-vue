import { ref } from 'vue'
import type { LeafletEvent } from 'leaflet'

export function useLocationMap() {
	const zoom = ref(15)
	const center = ref([47.41322, -1.219482])

	const getPin = (event: LeafletEvent) => {
		center.value = Object.values(event.target.getLatLng())
	}

	return {
		zoom,
		center,
		getPin,
	}
}
