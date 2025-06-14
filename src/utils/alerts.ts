import Swal, { type SweetAlertOptions } from 'sweetalert2'

export function generateToast(title: string, config: SweetAlertOptions = {}) {
	if (!title) return
	const { icon = 'success', timer = 3000 } = config

	Swal.fire({
		title,
		icon,
		timer,
		position: 'top-end',
		showConfirmButton: false,
		showCloseButton: false,
		timerProgressBar: true,
		toast: true,
		didOpen: toast => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)

			const progressBar: HTMLDivElement | null = toast.querySelector(
				'.swal2-timer-progress-bar',
			)
			const icon: HTMLDivElement | null = toast.querySelector('.swal2-icon')

			if (icon && progressBar) {
				const iconColor = getComputedStyle(icon).color
				progressBar.style.backgroundColor = iconColor
			}
		},
		customClass: {
			title: 'text-h6',
		},
	})
}

export async function generateConfirmationPopUp(
	text: string,
	config: SweetAlertOptions = {},
) {
	const {
		title = 'Confirm',
		icon = 'question',
		confirmButtonText = 'Confirm',
		cancelButtonText = 'Cancel',
	} = config

	const { isConfirmed } = await Swal.fire({
		text,
		title,
		icon,
		showCancelButton: true,
		confirmButtonText,
		cancelButtonText,
		customClass: {
			confirmButton: 'bg-info',
			cancelButton: 'bg-red-darken-3',
		},
	})

	return { isConfirmed }
}

export function notify(
	hideAlerts: boolean,
	message?: string | null,
	config: SweetAlertOptions = {},
) {
	if (hideAlerts || !message?.trim()) return
	generateToast(message, config)
}
