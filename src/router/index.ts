import { createRouter, createWebHistory } from "vue-router";

const identifyAdmin = async () => {
  const localstore = localStorage.getItem("user");
  if (localstore) {
    const data = JSON.parse(localstore || "{}");
    return data.role === "ADMIN" ? true : "/auth/login";
  }
  return "/auth/login";
};

const identifyUser = async () => {
  const localstore = localStorage.getItem("user");
  if (localstore) {
    const data = JSON.parse(localstore || "{}");
    return data.role === "EMPLOYEE" || data.role === "INTERN" ? true : "/auth/login";
  }
  return "/auth/login";
};

const userLoggedOut = async () => {
  const localstore = localStorage.getItem("user");
  if (localstore) {
    const data = JSON.parse(localstore || "{}");
    const role: string = data.role;
    if (role === "EMPLOYEE" || role === "INTERN") return "/user/dashboard";
    else return "/admin/dashboard";
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: () => {
        return {
          path: "/auth"
        };
      }
    },
    {
      path: "/huh",
      component: () => import("../views/DELETEDesignView.vue")
    },
    {
      path: "/auth",
      name: "auth",
      redirect: () => {
        return "/auth/login";
      },
      component: () => import("../views/AuthView.vue"),
      children: [
        {
          path: "login",
          component: () => import("../components/Auth/LoginPage.vue")
        },
        {
          path: "signup",
          component: () => import("../components/Auth/SignupPage.vue")
        }
      ],
      beforeEnter: userLoggedOut
    },
    {
      path: "/admin",
      redirect: () => "/admin/dashboard",
      component: () => import("../views/AdminView.vue"),
      children: [
        {
          path: "dashboard",
          component: () => import("../components/Admin/DashboardPage.vue")
        },
        {
          path: "employees",
          component: () => import("../components/Admin/EmployeesPage.vue")
        },
        {
          path: "attendances",
          component: () => import("../components/Admin/AttendancesPage.vue")
        },

      ],
      beforeEnter: identifyAdmin
    },
    {
      path: "/user",
      redirect: () => "/user/dashboard",
      component: () => import("../views/UserView.vue"),
      beforeEnter: identifyUser,
      children: [
        {
          path: "dashboard",
          component: () => import("../components/User/DashboardPage.vue")
        },
      
      ]
    },
    {
      path: "/sandbox",
      component: () => import("../components/SandBoxPage.vue")
    }
  ]
});

export default router;
