import { ref } from 'vue'
import type { User } from 'firebase/auth'
import { defineStore } from 'pinia'
import { checkSession, signout, signin } from '@/services/login'
import type { LoginForm } from '@/schemas/login'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(null)

	const isUserAuthenticated = async () => {
		if (user.value) return true

		const useAuth = await checkSession()
		user.value = useAuth
		return !!useAuth
	}

	const login = async (formData: LoginForm): Promise<string | null> => {
		const { error, data } = await signin(formData)
		user.value = data
		return error
	}

	const logout = () => {
		signout()
		user.value = null
	}

	return { user, isUserAuthenticated, login, logout }
})
