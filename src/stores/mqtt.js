import { defineStore } from "pinia";

export const useMqttStore = defineStore('mqtt', {
	state: () => ({
		topics: {},
	}),
	getters: {
		getWildcardIndexList: (state) => {
			return (baseTopic, isRegex = false) => {
				let baseTopicRegex = baseTopic;
				if (!isRegex) {
					// build a valid regex based on the provided wildcard topic
					baseTopicRegex =
						"^" +
						baseTopic
							.replaceAll("/", "\\/")
							.replaceAll("+", "[^+/]+")
							.replaceAll("#", "[^#/]+") +
						"$";
				}
				// filter and return all topics matching our regex
				let myTopics = Object.keys(state.mqtt).filter((key) => {
					return key.match(baseTopicRegex);
				});
				myTopics.forEach((topic, index, array) => {
					array[index] = parseInt(
						topic
							.match(/(?:\/)([0-9]+)(?=\/)*/g)[0]
							.replace(/[^0-9]+/g, "")
					);
				});
				return myTopics;
			};
		},
		getWildcardTopics: (state) => {
			return (baseTopic, isRegex = false) => {
				let baseTopicRegex = baseTopic;
				if (!isRegex) {
					// build a valid regex based on the provided wildcard topic
					baseTopicRegex =
						"^" +
						baseTopic
							.replaceAll("/", "\\/")
							.replaceAll("+", "[^+/]+")
							.replaceAll("#", "[^#/]+") +
						"$";
				}
				// filter and return all topics matching our regex
				return Object.keys(state.topics)
					.filter((key) => {
						return key.match(baseTopicRegex);
					})
					.reduce((obj, key) => {
						return {
							...obj,
							[key]: state.topics[key],
						};
					}, {});
			};
		},
		// getGridId(state) {
		// 	let hierarchy = state.topics["openWB/counter/get/hierarchy"];
		// 	console.log("getGridId", hierarchy);
		// 	if (hierarchy !== undefined) {
		// 		let index = Object.keys(state.topics["openWB/counter/get/hierarchy"])[0];
		// 		console.log("getGridId", index, state.topics["openWB/counter/get/hierarchy"][index]);
		// 		if (state.topics["openWB/counter/get/hierarchy"][index].type == "counter") {
		// 			return state.topics["openWB/counter/get/hierarchy"][index].id;
		// 		}
		// 	}
		// 	return 0;
		// },
	},
	actions: {
		initTopic(topic, defaultValue = undefined) {
			if (topic.includes("#") || topic.includes("+")) {
				console.debug("skipping init of wildcard topic:", topic);
			} else {
				this.addTopic(topic, defaultValue);
			}
		},
		addTopic(topic, payload) {
			console.debug("addTopic", topic, payload);
			this.topics[topic] = payload;
		},
		removeTopic(topic) {
			if (topic.includes("#") || topic.includes("+")) {
				console.debug("expanding wildcard topic for removal:", topic);
				Object.keys(this.getWildcardTopics(topic)).forEach(
					(wildcardTopic) => {
						console.debug("removing wildcardTopic:", wildcardTopic);
						delete this.topics[wildcardTopic];
					}
				);
			} else {
				delete this.topics[topic];
			}
		},
		updateTopic(topic, payload, objectPath) {
			// helper function to update nested objects py path
			const setPath = (object, path, value) =>
				path
					.split(".")
					.reduce(
						(o, p, i) =>
						(o[p] =
							path.split(".").length === ++i
								? value
								: o[p] || {}),
						object
					);

			if (topic in this.topics) {
				if (objectPath != undefined) {
					setPath(
						this.topics[topic],
						objectPath,
						payload
					);
				} else {
					this.topics[topic] = payload;
				}
			} else {
				console.debug("topic not found: ", topic);
			}
		},
		updateState(topic, value, objectPath = undefined) {
			console.debug("updateState:", topic, value, objectPath);
			this.updateTopic(topic, value, objectPath);
		},
	}
});
