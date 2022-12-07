<script setup>
defineProps({
	to: {
		type: Object,
		required: true,
	}
});
</script>

<template>
	<i-nav-item :to="to" active-class="-active" class="_border _border-color:primary _text-align:center">
		<slot />
	</i-nav-item>
</template>

<style scoped>
.nav-item {
	margin-bottom: 0.15rem !important;
	color: var(--color--primary);
}

.nav-item.-active {
	background-color: var(--color--primary);
	color: var(--body--color--dark);
}
</style>