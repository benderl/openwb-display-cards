<script setup lang="js">
import NavItem from "@/components/NavItem.vue";
</script>

<template>
	<i-nav vertical class="_align-items:stretch">
		<nav-item :to="{ name: 'dash-board' }"> DashBoard </nav-item>
		<nav-item :to="{ name: 'charge-points' }"> Ladepunkte </nav-item>
		<nav-item :to="{ name: 'status' }"> Status </nav-item>
	</i-nav>
</template>
