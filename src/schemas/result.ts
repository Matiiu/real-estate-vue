export type ErrorResult = {
	data: null
	error: string
}

export type SuccessResult<T> = {
	data: T
	error: null
}

export type SimpleErrorResult = {
	error: string | null
}

export type Result<T> = SuccessResult<T> | ErrorResult
export type PromiseResult<T> = Promise<SuccessResult<T> | ErrorResult>
export type PromiseSimpleErrorResult = Promise<SimpleErrorResult>

export function handleError(error: unknown): string {
	if (error instanceof Error) {
		console.error('Error:', error.message)
		return error.message
	} else if (typeof error === 'string') {
		console.error('Error:', error)
		return error
	}

	console.error('Unexpected error:', error)
	return 'An unexpected error occurred.'
}
