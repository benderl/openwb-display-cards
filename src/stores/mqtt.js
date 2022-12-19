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
	},
	actions: {
		addTopic(message) {
			console.log("addTopic", message);
			this.topics[message.topic] = message.payload;
		},
		removeTopic(topic) {
			delete this.topics[topic];
		},
		updateTopic(message) {
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

			if (message.topic in this.topics) {
				if (message.objectPath != undefined) {
					setPath(
						this.topics[message.topic],
						message.objectPath,
						message.payload
					);
				} else {
					this.topics[message.topic] = message.payload;
				}
			} else {
				console.debug("topic not found: ", message.topic);
			}
		},
		updateState(topic, value, objectPath = undefined) {
			console.debug("updateState:", topic, value, objectPath);
			this.updateTopic({
				topic: topic,
				objectPath: objectPath,
				payload: value,
			});
		},
	}
});
