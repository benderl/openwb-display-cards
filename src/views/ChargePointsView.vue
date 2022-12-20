<script>
import { useMqttStore } from "@/stores/mqtt.js";
import DashBoardCard from "@/components/DashBoardCard.vue";
import SparkLine from "@/components/SparkLine.vue";

export default {
	name: "ChargePoints",
	data() {
		return {
			mqttStore: useMqttStore(),
		};
	},
	components: { DashBoardCard, SparkLine },
	methods: {
		getChargePointName(id) {
			if (this.mqttStore.topics[`openWB/chargepoint/${id}/config`] !== undefined){
				return this.mqttStore.topics[`openWB/chargepoint/${id}/config`].name.toString();
			}
			return "---";
		},
		getChargePointValue(id) {
			return this.getValueString(`openWB/chargepoint/${id}/get/power`)
		},
		getValueString(topic, unit = "W") {
			var unitPrefix = "";
			var value = this.mqttStore.topics[topic];
			if (value === undefined) {
				return `--- ${unitPrefix}${unit}`;
			}
			var textValue = value.toString();
			if (value > 999 || value < -999) {
				textValue = (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
				unitPrefix = "k";
				if (value > 999999 || value < -999999) {
					textValue = (value / 1000000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
					unitPrefix = "M";
				}
			}
			return `${textValue} ${unitPrefix}${unit}`;
		},
		getValueBool(topic) {
			let value = this.mqttStore.topics[topic];
			if (value !== undefined) {
				return value;
			}
			return false;
		},
	},
}
</script>

<template>
	<div class="charge-points-card-wrapper">
		<dash-board-card color="primary">
			<template #headerTitle>
				{{ getChargePointName(3) }}
			</template>
			<template #headerValue>
				{{ getChargePointValue(3) }}
			</template>
			<spark-line
				color="var(--color--primary)"
				:data="[5, 7, 11, 13, 17, 19, 23, 29, 31, 3, 8]"
			/>
		</dash-board-card>
	</div>
</template>

<style scoped>
.charge-points-card-wrapper {
	display: flex;
	gap: var(--spacing);
	flex-wrap: wrap;
}
.card {
	min-width: 39rem;
	min-height: 130px;
	flex: 39rem;
	----background: inherit !important;
	----body--color: var(--contrast-color-for-dark-background) !important;
}
</style>
