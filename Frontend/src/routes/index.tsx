export const routePaths = {
  home: "/",
  login: "/login",
  register: "/register",
  marketplace: "/marketplace",
  product: "/marketplace/detail/:id",

  merchantInfo: "/merchant/info",
  merchantRegister: "/merchant/register",
  merchantWaiting: "/merchant/waiting",
  merchantDashboard: "/merchant/dashboard",
  merchantProfile: "/merchant/profile",
  merchantReservations: "/merchant/reservations",
  merchantReservationDetail: "/merchant/reservations/:id",
  merchantProductAdd: "/merchant/products/add",

  adminDashboard: "/admin",

  findUs: "/findus",
  chatbot: "/chatbot",
} as const;