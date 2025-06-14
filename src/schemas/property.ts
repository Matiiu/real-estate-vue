import { z } from 'zod'

export const propertySchema = z.object({
	id: z
		.string({
			required_error: 'Property ID is required',
			invalid_type_error: 'Property ID must be a string',
		})
		.min(20, { message: 'Property ID must be at least 20 characters long' })
		.max(28, { message: 'Property ID must be at most 28 characters long' })
		.regex(/^[a-zA-Z0-9_-]+$/, {
			message: 'Property ID must be alphanumeric (letters, numbers, - or _)',
		}),
	title: z.string(),
	price: z.number(),
	numberRooms: z.number(),
	numberBathrooms: z.number(),
	numberParkinLots: z.number(),
	description: z.string(),
	hasPool: z.boolean(),
	imageId: z.string(),
	location: z.array(z.number()),
})

export const newPropertySchema = z.object({
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title must be a string',
		})
		.trim()
		.min(6, { message: 'Title must be at least 6 characters long' }),
	price: z.union([
		z.string().transform((val, ctx) => {
			const number = Number(val)
			if (isNaN(number)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Price must be a valid number',
				})
				return z.NEVER
			}
			return number
		}),
		z.number(),
	]),
	numberRooms: z.number({
		required_error: 'Number of rooms is required',
		invalid_type_error: 'Number of rooms must be a number',
	}),
	numberBathrooms: z.number({
		required_error: 'Number of bathrooms is required',
		invalid_type_error: 'Number of bathrooms must be a number',
	}),
	numberParkinLots: z.number({
		required_error: 'Number of parking lots is required',
		invalid_type_error: 'Number of parking lots must be a number',
	}),
	description: z
		.string({
			required_error: 'Description is required',
			invalid_type_error: 'Description must be a string',
		})
		.min(10, {
			message: 'Description must be at least 10 characters long',
		})
		.trim(),
	hasPool: z.boolean({
		required_error: 'Pool information is required',
		invalid_type_error: 'Pool must be true or false',
	}),
	imageId: z
		.string({
			required_error: 'Image ID is required',
			invalid_type_error: 'Image ID must be a string',
		})
		.trim(),
	location: z.array(z.number()),
})

export const propertiesSchema = z.array(propertySchema)

export type Property = z.infer<typeof propertySchema>
export type NewProperty = z.infer<typeof newPropertySchema>
export type PropertyFilters = Pick<Property, 'title' | 'hasPool'> & {
	activeMoreFilters: boolean
	priceSort: 'asc' | 'desc' | null
}
