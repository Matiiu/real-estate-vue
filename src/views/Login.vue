<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { loginValidation as validationSchema } from '@/validations/login'
import type { LoginForm } from '@/schemas/login'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { handleSubmit } = useForm<LoginForm>({ validationSchema })
const email = useField<LoginForm['email']>('email')
const password = useField<LoginForm['password']>('password')
const errorMessage = ref<string>('')
const isShowPassword = ref(false)

const submit = handleSubmit(async fieldValues => {
	const error = await authStore.login(fieldValues)
	if (error) {
		errorMessage.value = error
		return
	}

	errorMessage.value = ''
	router.push({ name: 'admin' })
})

const revealPassword = (isReveal = false) => {
	isShowPassword.value = isReveal
}

watch([email.value, password.value], () => {
	errorMessage.value = ''
})
</script>

<template>
	<v-card flat max-width="600" class="mx-auto">
		<v-form id="login-form" @submit.prevent="submit">
			<fieldset class="d-flex flex-column ga-3 pa-5">
				<legend class="text-h4 text-blue-grey-darken-3">Login</legend>
				<v-expand-transition>
					<v-alert
						:model-value="!!errorMessage"
						:text="errorMessage"
						type="error"
					/>
				</v-expand-transition>

				<v-text-field
					type="email"
					name="email"
					id="email"
					label="Email"
					bg-color="blue-grey-lighten-5"
					required
					v-model="email.value.value"
					:error-messages="email.errorMessage.value"
				/>

				<div class="position-relative">
					<v-text-field
						:type="`${isShowPassword ? 'text' : 'password'}`"
						name="password"
						id="password"
						label="Password"
						bg-color="blue-grey-lighten-5"
						required
						v-model="password.value.value"
						:error-messages="password.errorMessage.value"
					/>

					<v-icon
						class="cursor-pointer ma-0 position-absolute right-0"
						style="top: 35%; transform: translate(-50%, -50%)"
						:icon="`${isShowPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}`"
						@click="revealPassword(!isShowPassword)"
					/>
				</div>

				<v-btn type="submit" block color="indigo-darken-3">
					<span class="text-white">Login</span>
				</v-btn>
			</fieldset>
		</v-form>
	</v-card>
</template>
