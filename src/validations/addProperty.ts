export const addPropertyValidation = {
	title(value: string) {
		if (value?.length >= 6) return true
		return 'El titulo de la propiedad es obligatorio o muy corto'
	},
	price(value: number) {
		if (!value || isNaN(value)) return 'Precio no valido'
		return true
	},
	numberRooms(value: number) {
		if (value) return true
		return 'Selecciona una Cantidad'
	},
	numberBathrooms(value: number) {
		if (value) return true
		return 'Selecciona una Cantidad'
	},
	numberParkinLots(value: number) {
		if (value) return true
		return 'Selecciona una Cantidad'
	},
	description(value: string) {
		if (value) return true
		return 'Agrega una Descripción'
	},
}
