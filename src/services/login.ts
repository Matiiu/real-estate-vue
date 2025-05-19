import {
	signInWithEmailAndPassword,
	getAuth,
	setPersistence,
	browserLocalPersistence,
	onAuthStateChanged,
	signOut,
	type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import type { PromiseResult } from '@/schemas/result'
import type { LoginForm } from '@/schemas/login'
import { firebaseApp } from '@/config/firebase'

const auth = getAuth(firebaseApp)
const errorAuthCode: Record<string, string> = {
	'auth/user-not-found': 'User not found.',
	'auth/invalid-credential': 'Invalid credentials.',
}

export const signin = async ({
	email,
	password,
}: LoginForm): PromiseResult<User> => {
	try {
		// Set Firebase to persist login across sessions
		await setPersistence(auth, browserLocalPersistence)

		// Sign in the user
		const { user } = await signInWithEmailAndPassword(auth, email, password)

		const loginTime = new Date().getTime()
		localStorage.setItem('loginTime', loginTime.toString())

		// Get the token (optional, if needed for backend authentication)
		const idToken = await user.getIdToken()

		// Store the token in memory (or use a state management tool)
		sessionStorage.setItem('authToken', idToken)

		return {
			error: null,
			data: user,
		}
	} catch (error) {
		console.error('Error during sign-in: ', error)

		// Ensure the error is a FirebaseError
		if (error instanceof FirebaseError) {
			return {
				error: errorAuthCode[error.code] || 'Invalid credentials.',
				data: null,
			}
		}

		// Return a generic error
		return {
			error: 'An error has occurred, please try again.',
			data: null,
		}
	}
}

export const signout = () => {
	signOut(auth)
}

export const isSessionExpired = (): boolean => {
	const loginTime = localStorage.getItem('loginTime')

	if (!loginTime) return true

	const currentTime = new Date().getTime()
	const difference = currentTime - parseInt(loginTime, 10)

	// Validate if less than 7 days have passed
	if (difference < 604800000) return false

	// If more than 7 days have passed, cancel the session
	signOut(auth)
	localStorage.removeItem('loginTime')
	return true
}

export const checkSession = async (): Promise<null | User> => {
	return new Promise(resolve => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			unsubscribe()
			if (!user) resolve(null)

			const shouldSignOut = isSessionExpired()
			resolve(shouldSignOut ? null : user)
		})
	})
}
