export function normalizeString(str: string): string {
	if (!str || typeof str !== 'string') return ''
	// removes accents, uppercase, and trims extra spaces.
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toUpperCase()
		.trim()
		.replace(/\s+/g, ' ')
}
