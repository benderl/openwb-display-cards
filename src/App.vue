<script setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";
</script>

<template>
	<i-layout>
		<i-layout vertical>
			<i-layout-aside>
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
}
</style>