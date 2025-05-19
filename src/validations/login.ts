import { validateEmail } from '@/utils/inputs'

export const loginValidation = {
	email(value: string) {
		if (!value) {
			return 'Este campo es obligatorio'
		}

		const { isValid } = validateEmail(value)

		if (!isValid) {
			return 'Email no válido'
		}

		return true
	},
	password(value: string) {
		if (value) return true
		return 'El Password es Obligatorio'
	},
}
