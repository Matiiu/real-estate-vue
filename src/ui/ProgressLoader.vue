<script lang="ts" setup>
interface Props {
	active?: boolean
}

withDefaults(defineProps<Props>(), {
	active: true,
})
</script>

<template>
	<v-progress-linear
		:active="active"
		color="blue-darken-1"
		height="4"
		indeterminate
	/>
</template>
