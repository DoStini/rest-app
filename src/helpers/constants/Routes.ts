const ROUTES = {
  PAGES: {
    ORDERS: {
      ROOT: "/orders",
      CREATE: "/orders/create",
      BY_ID: (id: string | number) => `/orders/${id}`,
      ADD_BY_ID: (id: number) => `/orders/${id}/add`,
    },
  },
  API: {
    ORDERS: {
      ROOT: "/api/orders",
      BY_ID: (id: string) => `/api/orders/${id}`,
      BY_ID_WITH_CATEGORIES: (id: string) => `/api/orders/${id}/categories`,
      UPDATE: (orderId: number, productId: number) =>
        `/api/orders/${orderId}/update/${productId}`,
    },
  },
};

export default ROUTES;
