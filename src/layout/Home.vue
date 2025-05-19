<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
	authStore.logout()
}
</script>

<template>
	<v-card elevation="3" max-width="1200" class="mx-auto">
		<v-layout>
			<v-app-bar color="blue-darken-1">
				<template #append>
					<div v-if="authStore.user">
						<v-btn :to="{ name: 'admin' }"> Admin </v-btn>
						<v-btn @click="handleLogout"> Logout </v-btn>
					</div>

					<div v-else>
						<v-btn :to="{ name: 'home' }"> Home </v-btn>
						<v-btn :to="{ name: 'login' }"> Log In </v-btn>
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
