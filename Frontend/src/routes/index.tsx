export const routePaths = {
  home: "/",
  login: "/login",
  register: "/register",
  marketplace: "/marketplace",
  product: "/marketplace/detail/:id",

  merchantDashboard: "/merchant/dashboard",
  merchantProfile: "/merchant/profile",
  merchantReservations: "/merchant/reservations",
  merchantReservationDetail: "/merchant/reservations/:id",
  merchantProductAdd: "/merchant/products/add",
  findUs: "/findus",
  chatbot: "/chatbot",
} as const;