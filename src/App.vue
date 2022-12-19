<script>
import { RouterView } from "vue-router";
import mqtt from "mqtt";
import DateTime from "@/components/DateTime.vue";
import NavBar from "@/components/NavBar.vue";

import { useMqttStore } from "@/stores/mqtt.js";

export default {
	name: "openwbDisplayCardsApp",
	components: {
		DateTime,
		NavBar,
	},
	data() {
		return {
			client: {
				connected: false,
			},
			connection: {
				protocol: location.protocol == "https:" ? "wss" : "ws",
				host: location.hostname,
				port:
					parseInt(location.port) ||
					(location.protocol == "https:" ? 443 : 80),
				endpoint: "/ws",
				connectTimeout: 4000,
				reconnectPeriod: 4000,
			},
			mqttTopicsToSubscribe: [
				"openWB/test",
			],
			mqttStore: useMqttStore(),
		};
	},
	methods: {
		/**
		 * Establishes a connection to the configured broker
		 */
		createConnection() {
			const { protocol, host, port, endpoint, ...options } =
				this.connection;
			const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
			console.debug("connecting to broker:", connectUrl);
			try {
				this.client = mqtt.connect(connectUrl, options);
			} catch (error) {
				console.error("mqtt.connect error", error);
			}
			this.client.on("connect", () => {
				console.debug(
					"Connection succeeded! ClientId: ",
					this.client.options.clientId
				);
				this.doSubscribe(this.mqttTopicsToSubscribe);
			});
			this.client.on("error", (error) => {
				console.error("Connection failed", error);
			});
			this.client.on("message", (topic, message) => {
				console.debug(
					`Received message "${message}" from topic "${topic}"`
				);
				if (message.toString().length > 0) {
					let myPayload = undefined;
					try {
						myPayload = JSON.parse(message.toString());
					} catch (error) {
						console.debug(
							"Json parsing failed, fallback to string: ",
							topic
						);
						myPayload = message.toString();
					}
					this.mqttStore.addTopic({
						topic: topic,
						payload: myPayload,
					});
				} else {
					this.mqttStore.removeTopic(topic);
				}
			});
		},
		doSubscribe(topics) {
			this.client.subscribe(topics, {}, (error) => {
				if (error) {
					console.error("Subscribe to topics error", error);
					return;
				}
			});
		},
		doUnsubscribe(topics) {
			this.client.unsubscribe(topics, (error) => {
				if (error) {
					console.error("Unsubscribe error", error);
				}
			});
		},
	},
	created() {
		this.createConnection();
	},
}
</script>

<template>
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
