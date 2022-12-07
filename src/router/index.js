import { createRouter, createWebHistory } from "vue-router";
import DashBoard from "../views/DashBoard.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			alias: "/DashBoard",
			name: "dash-board",
			component: DashBoard,
		},
		{
			path: "/ChargePoints",
			name: "charge-points",
			// route level code-splitting
			// this generates a separate chunk (ChargePoints.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import("../views/ChargePoints.vue"),
		},
		{
			path: "/Status",
			name: "status",
			component: () => import("../views/Status.vue"),
		},
	],
});

export default router;
