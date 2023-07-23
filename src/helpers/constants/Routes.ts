const ROUTES = {
  PAGES: {
    ORDERS: {
      ROOT: "/orders",
      CREATE: "/orders/create",
      BY_ID: (id: string | number) => `/orders/${id}`,
    },
  },

  API: {
    ORDERS: {
      ROOT: "/api/orders",
      BY_ID: (id: string) => `/api/orders/${id}`,
    },
  },
};

export default ROUTES;
