export type ErrorResult = {
	data: null
	error: string
}

export type SuccessResult<T> = {
	data: T
	error: null
}

export type Result<T> = SuccessResult<T> | ErrorResult
export type PromiseResult<T> = Promise<SuccessResult<T> | ErrorResult>
