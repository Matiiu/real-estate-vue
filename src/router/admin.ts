import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
	{
		path: '/admin',
		component: () => import('@/layout/admin/Admin.vue'),
		meta: {
			requiresAuth: true,
		},
		children: [
			{
				path: '',
				name: 'admin',
				component: () => import('@/views/admin/Dashboard.vue'),
			},
			{
				path: 'new',
				name: 'new-property',
				component: () => import('@/views/admin/AddProperty.vue'),
			},
			{
				path: 'edit/:id',
				name: 'edit-property',
				component: () => import('@/views/admin/EditProperty.vue'),
			},
		],
	},
]

export default adminRoutes
