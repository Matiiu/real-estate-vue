<template>
	<div class="loader-container">
		<div class="loader-content">
			<div class="loader"></div>
			<div class="text-grey-lighten-5 text-h5">
				The page is loading, please wait.
			</div>
		</div>
	</div>
</template>

<style scoped>
.loader-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.527);
	z-index: 9999;
}

.loader-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	width: 100%;
}

.loader {
	width: 50px;
	padding: 8px;
	aspect-ratio: 1;
	border-radius: 50%;
	background: #42a5f5;
	--_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
	-webkit-mask: var(--_m);
	mask: var(--_m);
	-webkit-mask-composite: source-out;
	mask-composite: subtract;
	animation: l3 1s infinite linear;
}
@keyframes l3 {
	to {
		transform: rotate(1turn);
	}
}
</style>
