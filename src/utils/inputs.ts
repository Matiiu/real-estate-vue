const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

export const allowOnlyNumbers = (event: KeyboardEvent) => {
	// Allow numbers (0-9) and essential control keys
	if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
		event.preventDefault()
	}
}

export const validateEmail = (email: string) => {
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
