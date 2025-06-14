export const allowOnlyNumbers = (event: KeyboardEvent) => {
	// Allow numbers (0-9) and essential control keys
	const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
	if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
		event.preventDefault()
	}
}

export const validateEmail = (email: string) => {
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
	return { isValid: emailRegex.test(email) }
}

export const formatCurrency = (value: number | string = 0) => {
	try {
		const numericValue = Number(value)

		if (isNaN(numericValue)) {
			throw new Error(`Invalid number input: ${value}`)
		}

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(numericValue)
	} catch (error) {
		console.error('Unexpected error traying to format currency:', error)
		return '$0.00'
	}
}

export function validateInteger(value: string | number) {
	if (value === null || value === undefined || value === '') {
		return { isValid: false }
	}

	const integerRegex = /^-?\d+$/
	let isValid = false

	if (typeof value === 'string') {
		isValid = integerRegex.test(value.trim())
	} else if (typeof value === 'number') {
		isValid = Number.isInteger(value)
	}

	return { isValid }
}
