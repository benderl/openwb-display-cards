<template>
	<svg
		class="spark-line"
		:viewBox="`0 0 ${width} ${height}`"
		width="100%"
		height="100%"
		preserveAspectRatio="none"
		:stroke-width="stroke"
	>
		<path class="spark-line--line" :d="shape" fill="none"></path>
	</svg>
</template>

<script>
export default {
	props: {
		data: { required: true, type: Array },
		width: { default: 300 },
		height: { default: 50 },
		stroke: { default: 3 },
		color: { String, default: "var(--color--primary)" },
	},
	data() {
		return {};
	},
	computed: {
		shape() {
			const stroke = this.stroke;
			const width = this.width;
			const height = this.height - stroke * 2;

			const data = this.data || [];
			const highestPoint = Math.max.apply(null, data);
			const coordinates = [];
			const totalPoints = this.data.length - 1;

			data.forEach((item, n) => {
				const x = (n / totalPoints) * width + stroke;
				const y = height - (item / highestPoint) * height + stroke;

				coordinates.push({ x, y });
			});

			if (!coordinates[0]) {
				return (
					"M 0 " +
					this.stroke +
					" L 0 " +
					this.stroke +
					" L " +
					this.width +
					" " +
					this.stroke
				);
			}

			const path = [];

			coordinates.forEach((point) =>
				path.push(["L", point.x, point.y].join(" "))
			);

			return ["M" + coordinates[0].x, coordinates[0].y, ...path].join(" ");
		},
		fillEndPath() {
			return `V ${this.height} L 4 ${this.height} Z`;
		},
	},
};
</script>

<style scoped>
svg {
	/* stroke: var(--color--danger); */
	stroke: v-bind(color);
	fill: rgba(31, 140, 235, 0.06);
	transition: all 1s ease-in-out;
}

svg path {
	box-sizing: border-box;
}
</style>
