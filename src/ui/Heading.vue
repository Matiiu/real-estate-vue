<script lang="ts" setup>
import { computed, toRefs } from 'vue'

interface Props {
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	title?: string
}

const props = withDefaults(defineProps<Props>(), {
	tag: 'h1',
	title: '',
})

const { tag, title } = toRefs(props)

const classConfig: Record<NonNullable<Props['tag']>, string> = {
	h1: 'text-center text-h2 font-bold my-5',
	h2: 'text-center text-h3 font-semibold my-4',
	h3: 'text-center text-h4 font-medium my-3',
	h4: 'text-left text-h5 font-normal my-3',
	h5: 'text-left text-subtitle-1 font-normal my-2',
	h6: 'text-left text-subtitle-2 font-light my-1',
}

const headingStyle = computed(() => classConfig?.[tag.value] || 'h1')
</script>

<template>
	<component :is="tag" :class="headingStyle">
		<template v-if="title">
			{{ title }}
		</template>
		<template v-else>
			<slot />
		</template>
	</component>
</template>
