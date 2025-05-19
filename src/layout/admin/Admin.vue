<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
	authStore.logout()
	router.push('/')
}
</script>

<template>
	<v-card elevation="3" max-width="1200" class="mx-auto pa-6">
		<v-layout>
			<v-app-bar color="blue-darken-1">
				<template #append>
					<div>
						<v-btn :to="{ name: 'admin' }"> Admin </v-btn>
						<v-btn @click="handleLogout"> Logout </v-btn>
					</div>
				</template>

				<template #prepend>
					<v-btn :to="{ name: 'home' }"> Real Estate - VueFire </v-btn>
				</template>
			</v-app-bar>

			<v-main>
				<RouterView />
			</v-main>
		</v-layout>
	</v-card>
</template>
