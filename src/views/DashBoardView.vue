<script>
import { useMqttStore } from "@/stores/mqtt.js";
import DashBoardCard from "@/components/DashBoardCard.vue";
import SparkLine from "@/components/SparkLine.vue";

export default {
	name: "DashBoard",
	data() {
		return {
			mqttStore: useMqttStore(),
		};
	},
	components: { DashBoardCard, SparkLine },
	computed: {
		gridPower() {
			let gridId = 0;
			gridId = this.mqttStore.getGridId;
			if (gridId === undefined) {
				return "---";
			}
			return this.getValueString(`openWB/counter/${gridId}/get/power`);
		},
		homePower() {
			return this.getValueString("openWB/counter/set/home_consumption");
		},
		batteryConfigured() {
			return this.getValueBool("openWB/bat/config/configured");
		},
		batteryPower() {
			return this.getValueString("openWB/bat/get/power");
		},
		batterySoc() {
			return this.getValueString("openWB/bat/get/soc", "%");
		},
		chargePointSumPower() {
			return this.getValueString("openWB/chargepoint/get/power");
		},
		pvConfigured() {
			return this.getValueBool("openWB/pv/config/configured");
		},
		pvPower() {
			return this.getValueString("openWB/pv/get/power");
		},
	},
	methods: {
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
	<div class="dash-board-card-wrapper">
		<dash-board-card color="danger">
			<template #headerTitle>
				EVU
			</template>
			<template #headerValue>
				{{ gridPower }}
			</template>
			<spark-line
				color="var(--color--danger)"
				colorNegative="var(--color--success)"
				:data="[5, 7, 11, 13, 7, 2, -3, -13, 8]"
			/>
		</dash-board-card>
		<dash-board-card color="light">
			<template #headerTitle>
				Hausverbrauch
			</template>
			<template #headerValue>
				{{ homePower }}
			</template>
			<spark-line
				color="var(--color--light)"
				:data="[5, 7, 11, 13, 17, 19, 2, 3, 8]"
			/>
		</dash-board-card>
		<dash-board-card color="warning" v-if="batteryConfigured">
			<template #headerTitle>
				Speicher
			</template>
			<template #headerValue>
				{{ batteryPower }}
			</template>
			<spark-line
				color="var(--color--warning)"
				:data="[5, 7, 3, 8]"
			/>
		</dash-board-card>
		<dash-board-card color="warning" v-if="batteryConfigured">
			<template #headerTitle>
				Speicher SoC
			</template>
			<template #headerValue>
				{{ batterySoc }}
			</template>
			<spark-line
				color="var(--color--warning)"
				:data="[5, 7, 11, 13, 17, 19, 23, 29, 31, 75, 100]"
			/>
		</dash-board-card>
		<dash-board-card color="primary">
			<template #headerTitle>
				Ladepunkte
			</template>
			<template #headerValue>
				{{ chargePointSumPower }}
			</template>
			<spark-line
				color="var(--color--primary)"
				:data="[13, 17, 19, 23, 29, 31]"
			/>
		</dash-board-card>
		<dash-board-card color="success" v-if="pvConfigured">
			<template #headerTitle>
				PV
			</template>
			<template #headerValue>
				{{ pvPower }}
			</template>
			<spark-line
				color="var(--color--success)"
				:data="[5, 7, 11, 13, 17, 31, 3, 8]"
			/>
		</dash-board-card>
	</div>
</template>

<style scoped>
.dash-board-card-wrapper {
	display: flex;
	gap: var(--spacing);
	flex-wrap: wrap;
}

.card {
	min-width: 19rem;
	min-height: 130px;
	flex: 19rem;
	----background: inherit !important;
	----body--color: var(--contrast-color-for-dark-background) !important;
}
</style>
