<template>
	<svg class="spark-line" :viewBox="`0 0 ${width} ${height}`" width="100%" height="100%" preserveAspectRatio="none">
		<path class="zeroLine" :d="`M 0 ${zeroHeight} L ${width} ${zeroHeight}`" />
		<rect
			v-for="bar in bars"
			:x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height"
			:class="colorNegative && bar.negative ? 'negative' : ''"
		/>
	</svg>
</template>

<script>
export default {
	props: {
		data: { required: true, type: Array, default: [] },
		width: { default: 300 },
		height: { default: 50 },
		stroke: { default: 2 },
		color: { String, default: "var(--color--primary)" },
		colorNegative: { String, default: undefined},
	},
	data() {
		return {};
	},
	computed: {
		zeroHeight() {
			const imageHeight = this.height - this.stroke * 2;
			const highestPoint = Math.max.apply(null, this.data);
			const lowestPoint = Math.min.apply(null, this.data);
			return imageHeight - ((0 - lowestPoint) / (highestPoint - lowestPoint)) * imageHeight + this.stroke;
		},
		coordinates() {
			const imageHeight = this.height - this.stroke * 2;
			const highestPoint = Math.max.apply(null, this.data);
			const lowestPoint = Math.min.apply(null, this.data);
			const coordinateArray = [];
			const totalPoints = this.data.length - 1;

			this.data.forEach((item, n) => {
				const x = (n / totalPoints) * (this.width - 2 * this.stroke) + this.stroke;
				const y = imageHeight - ((item - lowestPoint) / (highestPoint - lowestPoint)) * imageHeight + this.stroke;
				coordinateArray.push({ x, y });
			});
			return coordinateArray;
		},
		bars() {
			const barCoordinates = [];
			this.coordinates.forEach((point) => {
				const left = point.x - this.stroke / 2;
				const y = point.y - this.stroke / 2;
				const width = this.stroke;
				const top = Math.min(y, this.zeroHeight);
				const height = Math.abs(y - this.zeroHeight);
				const isNegative = y > this.zeroHeight;
				barCoordinates.push({x: left, y: top, width: width, height: height, negative: isNegative});
			});
			return barCoordinates;
		},
		fillEndPath() {
			return `V ${this.height} L 4 ${this.height} Z`;
		},
	},
};
</script>

<style scoped>
svg {
	transition: all 1s ease-in-out;
}

svg path.zeroLine {
	stroke: v-bind(color);
}

svg rect {
	stroke: v-bind(color);
	fill: v-bind(color);
}

svg rect.negative {
	stroke: v-bind(colorNegative);
	fill: v-bind(colorNegative);
}
</style>
