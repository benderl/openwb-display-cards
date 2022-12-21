<script>
export default {
	name: "DashBoardCard",
	props: {
		color: String,
	},
};
</script>

<template>
	<i-card :color="color">
		<template #header>
			<div class="_display:flex _justify-content:space-between">
				<div>
					<slot name="headerTitle" />
				</div>
				<div>
					<slot name="headerValue" />
				</div>
			</div>
		</template>
		<slot />
	</i-card>
</template>

<style scoped></style>
