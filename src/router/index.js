import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/Overview.vue"),
        },
        {
            path: "/create",
            name: "create",
            component: () => import("../views/CreateTodo.vue"),
        },
        {
            path: "/todo/:id",
            name: "todo-detail",
            component: () => import("../views/TodoDetail.vue"),
        },
        {
            path: "/overview",
            name: "overview",
            component: () => import("../views/TodoList.vue"),
        },
    ],
})

export default router
