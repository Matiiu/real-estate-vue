<script lang="ts" setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { type Property } from '@/schemas/property'
import ShowImage from '@/ui/ShowImage.vue'
import { formatCurrency } from '@/utils/inputs'

interface Props {
	property: Property
}

const props = defineProps<Props>()
const { property } = toRefs(props)
</script>

<template>
	<v-col cols="12" sm="6" md="4" xl="3">
		<v-card>
			<ShowImage :image-id="property.imageId" :height="250" />

			<v-card-title>{{ property.title }}</v-card-title>
			<v-card-text class="text-truncate">{{
				property.description
			}}</v-card-text>
			<v-card-text class="text-h5 font-weight-bold">
				Price: {{ formatCurrency(property.price) }}
			</v-card-text>

			<v-card-actions>
				<v-btn
					block
					color="info"
					variant="flat"
					:to="{ name: 'property', params: { id: property.id } }"
					>Show Info</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-col>
</template>
