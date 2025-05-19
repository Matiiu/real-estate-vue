import {
	addDoc,
	getFirestore,
	getDocs,
	collection,
	getDoc,
	doc,
	setDoc,
	deleteDoc,
} from 'firebase/firestore'
import { firebaseApp } from '@/config/firebase'
import type { NewProperty, Property } from '@/schemas/property'
import { FirebaseError } from 'firebase/app'
import type { PromiseResult } from '@/schemas/result'
import {
	newPropertySchema,
	propertiesSchema,
	propertySchema,
	propertyIdSchema,
} from '@/schemas/property'

const db = getFirestore(firebaseApp)
const docPath = 'properties'

export const createProperty = async (
	newProperty: NewProperty,
): PromiseResult<string> => {
	try {
		const parsed = newPropertySchema.safeParse(newProperty)

		if (!parsed.success) {
			const error = parsed.error.issues?.[0]?.message || 'Invalid data.'
			return {
				error,
				data: null,
			}
		}

		await addDoc(collection(db, docPath), parsed.data)
		return {
			error: null,
			data: 'The property was saved successfully.',
		}
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error saving the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to save the property.'
		}

		return {
			error,
			data: null,
		}
	}
}

export const fetchProperties = async (): PromiseResult<Property[]> => {
	const querySnapshot = await getDocs(collection(db, docPath))

	const properties: unknown[] = []
	querySnapshot.forEach(docSnap => {
		properties.push({ ...docSnap.data(), id: docSnap.id })
	})

	const parsed = propertiesSchema.safeParse(properties)

	if (!parsed.success) {
		return {
			error: parsed.error.issues?.[0]?.message || 'Invalid data.',
			data: null,
		}
	}

	return {
		error: null,
		data: parsed.data,
	}
}

export const fetchPropertyById = async (
	id: Property['id'],
): PromiseResult<Property> => {
	const validateId = propertyIdSchema.safeParse({ id })

	if (!validateId.success) {
		return {
			error: validateId.error.issues?.[0]?.message || 'Invalid ID.',
			data: null,
		}
	}
	const docSnap = await getDoc(doc(db, docPath, id))

	if (!docSnap.exists()) {
		return {
			error: 'No such document!',
			data: null,
		}
	}

	const result = { ...docSnap.data(), id: docSnap.id }
	const parsed = propertySchema.safeParse(result)

	if (!parsed.success) {
		return {
			error: parsed.error.issues?.[0]?.message || 'Invalid data.',
			data: null,
		}
	}

	return {
		error: null,
		data: parsed.data,
	}
}

export const updateProperty = async (
	property: Property,
): PromiseResult<string> => {
	try {
		const parsed = propertySchema.safeParse(property)

		if (!parsed.success) {
			const error = parsed.error.issues?.[0]?.message || 'Invalid data.'
			return {
				error,
				data: null,
			}
		}

		const { id, ...restProperty } = parsed.data

		await setDoc(doc(db, docPath, id), restProperty, { merge: true })
		return {
			error: null,
			data: 'The property was updated successfully.',
		}
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error updating the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to update the property.'
		}

		return {
			error,
			data: null,
		}
	}
}

export const deletePropertyById = async (
	id: Property['id'],
): PromiseResult<string> => {
	const validateId = propertyIdSchema.safeParse({ id })

	if (!validateId.success) {
		return {
			error: validateId.error.issues?.[0]?.message || 'Invalid ID.',
			data: null,
		}
	}

	try {
		await deleteDoc(doc(db, docPath, id))

		return {
			error: null,
			data: 'Property deleted successfully',
		}
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error deleting the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to delete the property.'
		}

		return {
			error,
			data: null,
		}
	}
}
