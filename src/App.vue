<script setup>
import { RouterView } from "vue-router";
import DateTime from "@/components/DateTime.vue";
import NavBar from "@/components/NavBar.vue";
</script>

<template>
	<i-layout>
		<i-layout vertical>
			<i-layout-aside>
				<DateTime />
				<hr />
				<NavBar />
			</i-layout-aside>

			<i-layout-content>
				<RouterView />
			</i-layout-content>
		</i-layout>
	</i-layout>
</template>

<style scoped>
.layout-aside {
	----width: 10rem !important;
	margin-right: 1rem;
	padding: 0.2rem;
}

hr {
	border-color: var(--color--primary);
	margin: 0.2rem 0;
}
</style>
