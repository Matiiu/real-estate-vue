import { z } from 'zod'

export const uploadInfoSchema = z.object({
	asset_id: z.string({
		required_error: 'Image ID is required',
		invalid_type_error: 'Image ID must be a string',
	}),
	public_id: z.string({
		required_error: 'Public image ID is required',
		invalid_type_error: 'Public image ID must be a string',
	}),
})

export type UploadInfo = z.infer<typeof uploadInfoSchema>
