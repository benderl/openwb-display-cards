<script>
export default {
	name: "DateTime",
	data() {
		return {
			dateTimeInterval: "",
			date: "",
			time: "",
		};
	},
	methods: {
		update() {
			const now = new Date();
			const dateOptions = { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" };
			const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
			this.date = now.toLocaleDateString(undefined, dateOptions);
			this.time = now.toLocaleTimeString(undefined, timeOptions);
		},
	},
	mounted() {
		this.update();
		this.dateTimeInterval = setInterval(this.update, 1000);
	},
	beforeUnmount() {
		clearInterval(this.dateTimeInterval);
	},
}
</script>

<template>
	<i-container>
		<i-row center>
			{{ date }}
		</i-row>
		<i-row center>
			{{ time }}
		</i-row>
	</i-container>
</template>

<style scoped>

</style>
