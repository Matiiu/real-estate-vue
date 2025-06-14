import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from '@/router/admin'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
    {
      path: '/',
      component: () => import('@/layout/Home.vue'),
			children: [
				{
					path: '',
					name: 'home',
					component: () => import('@/views/OverView.vue'),
				},
				{
					path: 'login',
					name: 'login',
					component: () => import('@/views/Login.vue'),
				},
				{
					path: 'porperty/:id',
					name: 'property',
					component: () => import('@/views/property/Overview.vue'),
				},
			],
		},
		...adminRoutes,
	],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()
	const isUserAuth = await authStore.isUserAuthenticated()

	// If the user is logged in, and they want to go to login redirect to admin
	if (to.name === 'login') {
		if (isUserAuth) {
			next({ name: 'admin' })
			return
		}
	}

	const isAuthorizationRequired = to.matched.some(
		({ meta }) => meta?.requiresAuth,
	)

	// If the page doesn't require authentication they can continuous
	if (!isAuthorizationRequired) {
		next()
		return
	}

	// if the user does not have correct credential return to login
	if (!isUserAuth) {
		next({ name: 'login' })
		return
	}

	// if the user has correct they can continuos
	next()
})

export default router
