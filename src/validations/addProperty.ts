import { validateInteger } from '@/utils/inputs'

export const addPropertyValidation = {
	title(value: string) {
		if (!value?.trim() || value?.length <= 6) {
			return 'Property name must be at least 6 characters long'
		}
		return true
	},
	price(value: number) {
		if (!value || isNaN(value)) {
			return 'Price is required'
		}
		if (value < 0) {
			return 'Price must be greater than 0'
		}
		return true
	},
	numberRooms(value: number) {
		const { isValid } = validateInteger(value)
		if (!isValid) {
			return 'Choose a number of rooms'
		}
		return true
	},
	numberBathrooms(value: number) {
		const { isValid } = validateInteger(value)
		if (!isValid) {
			return 'Choose a number of bathrooms'
		}
		return true
	},
	numberParkinLots(value: number) {
		const { isValid } = validateInteger(value)
		if (!isValid) {
			return 'Choose a number of parking lots'
		}
		return true
	},
	description(value: string) {
		if (!value?.trim() || value.length < 10) {
			return 'Description must be at least 10 characters long'
		}
		return true
	},
}
