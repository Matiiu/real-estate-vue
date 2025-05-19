import Swal, { type SweetAlertIcon } from 'sweetalert2'

type Alert = {
	timer?: number
	icon?: SweetAlertIcon
}

export const generateToast = (title: string, configAlert: Alert = {}) => {
	const { icon = 'success', timer = 3000 } = configAlert

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
