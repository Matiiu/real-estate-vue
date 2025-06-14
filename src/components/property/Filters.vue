<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { PropertyFilters } from '@/schemas/property'

const filters = reactive<PropertyFilters>({
	title: null,
	hasPool: null,
	priceSort: null,
	activeMoreFilters: false,
})
const emit = defineEmits(['search'])

onMounted(() => {
	submitFilters()
})

function submitFilters() {
	emit('search', filters)
}

function handleClickHasSwimPool() {
	filters.hasPool = null
	submitFilters()
}
</script>

<template>
	<v-form @submit.prevent="submitFilters">
		<v-row>
			<v-col cols="10">
				<v-text-field
					v-model.trim="filters.title"
					@click:clear="submitFilters"
					ref="inputRef"
					density="compact"
					label="Search"
					prepend-inner-icon="mdi-magnify"
					variant="solo-filled"
					flat
					hide-details
					single-line
					clearable
				/>
			</v-col>
			<v-col cols="2">
				<div class="d-flex align-center ga-3">
					<v-btn
						type="button"
						icon="mdi-filter-check"
						@click="filters.activeMoreFilters = !filters.activeMoreFilters"
					/>
					<v-btn type="submit" icon="mdi-magnify" />
				</div>
			</v-col>
		</v-row>

		<v-row v-if="filters.activeMoreFilters">
			<v-col cols="12" md="3">
				<v-select
					v-model="filters.priceSort"
					:items="[
						{ title: 'Lowest Price', value: 'asc' },
						{ title: 'Highest Price', value: 'desc' },
					]"
					@click:clear="submitFilters"
					item-title="title"
					item-value="value"
					label="Sort by Price"
					dense
					outlined
					clearable
				/>
			</v-col>
			<v-col cols="12" md="3">
				<label for="child-check">Swim Pool</label>
				<v-radio-group v-model="filters.hasPool" inline>
					<div class="d-flex align-center ga-1 w-100">
						<v-radio :value="true" label="Yes" id="child-check" />
						<v-radio :value="false" label="No" />
						<v-icon
							v-show="filters.hasPool !== null"
							@click="handleClickHasSwimPool"
							color="grey-lighten-1"
							class="cursor-pointer ml-2"
							icon="mdi-close-circle"
						/>
					</div>
				</v-radio-group>
			</v-col>
		</v-row>
	</v-form>
</template>
