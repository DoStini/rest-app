export const setDynamicRoute = (request: Request) => {
  new URL(request.url);
};

export const jsonPost = (url: string, body: any) => {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};
