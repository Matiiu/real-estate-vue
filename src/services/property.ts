import {
	addDoc,
	getFirestore,
	getDocs,
	collection,
	getDoc,
	doc,
	setDoc,
	deleteDoc,
	query,
	where,
	orderBy,
} from 'firebase/firestore'
import { firebaseApp } from '@/config/firebase'
import type { NewProperty, Property } from '@/schemas/property'
import { FirebaseError } from 'firebase/app'
import type { PromiseResult, PromiseSimpleErrorResult } from '@/schemas/result'
import {
	newPropertySchema,
	propertiesSchema,
	propertySchema,
	type PropertyFilters,
} from '@/schemas/property'
import { normalizeString } from '@/utils/strings'

const db = getFirestore(firebaseApp)
const docPath = 'properties'

export const createProperty = async (
	newProperty: NewProperty,
): PromiseSimpleErrorResult => {
	try {
		const parsed = newPropertySchema.safeParse(newProperty)

		if (!parsed.success) {
			const error = parsed.error.issues?.[0]?.message || 'Invalid data.'
			return { error }
		}

		const dataNormalized = {
			titleNormalized: normalizeString(parsed.data.title),
			descirptionNormalized: normalizeString(parsed.data.description),
		}

		await addDoc(collection(db, docPath), { ...parsed.data, ...dataNormalized })
		return { error: null }
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error saving the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to save the property.'
		}

		return { error }
	}
}

export const fetchProperties = async (): PromiseResult<Property[]> => {
	const q = query(collection(db, docPath), orderBy('titleNormalized', 'asc'))
	const querySnapshot = await getDocs(q)

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
	const validateId = propertySchema.pick({ id: true }).safeParse({ id })
	console.log('validateId', validateId)

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
): PromiseSimpleErrorResult => {
	try {
		const parsed = propertySchema.safeParse(property)

		if (!parsed.success) {
			const error = parsed.error.issues?.[0]?.message || 'Invalid data.'
			return { error }
		}

		const { id, ...restProperty } = parsed.data
		const dataNormalized = {
			titleNormalized: normalizeString(parsed.data.title),
			descirptionNormalized: normalizeString(parsed.data.description),
		}

		await setDoc(
			doc(db, docPath, id),
			{ ...restProperty, ...dataNormalized },
			{ merge: true },
		)
		return { error: null }
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error updating the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to update the property.'
		}

		return { error }
	}
}

export const deletePropertyById = async (
	id: Property['id'],
): PromiseSimpleErrorResult => {
	const validateId = propertySchema.pick({ id: true }).safeParse({ id })

	if (!validateId.success) {
		return { error: validateId.error.issues?.[0]?.message || 'Invalid ID.' }
	}

	try {
		await deleteDoc(doc(db, docPath, id))

		return { error: null }
	} catch (err) {
		let error = ''

		if (err instanceof FirebaseError) {
			console.error(`Firebase Error (${err.code}): ${err.message}`)
			error = 'Error deleting the property.'
		} else {
			console.error('Unexpected Error:', err)
			error = 'An error occurred while trying to delete the property.'
		}

		return { error }
	}
}

export const searchPropertiesByFilters = async (
	filters: PropertyFilters,
): PromiseResult<Property[]> => {
	const q = createQueryFromFilters(filters)
	const properties: unknown[] = []
	const querySnapshot = await getDocs(q)
	querySnapshot.forEach(doc => {
		properties.push({ ...doc.data(), id: doc.id })
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

const createQueryFromFilters = (filters: PropertyFilters) => {
	const { activeMoreFilters, title, hasPool, priceSort } = filters

	const cleanTitle = normalizeString(title)
	const propertiesRef = collection(db, docPath)
	const conditions = [
		where('titleNormalized', '>=', cleanTitle),
		where('titleNormalized', '<=', cleanTitle + '\uf8ff'),
	]
	const sorts = []

	if (!activeMoreFilters) {
		return query(propertiesRef, ...conditions)
	}

	if (hasPool !== null) {
		conditions.push(where('hasPool', '==', hasPool))
	}

	if (priceSort) {
		sorts.push(orderBy('price', priceSort))
	}

	sorts.push(orderBy('titleNormalized', 'asc'))

	return query(propertiesRef, ...conditions, ...sorts)
}
