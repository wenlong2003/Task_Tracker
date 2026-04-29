export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    window.dispatchEvent(new Event("auth-logout"));
  }

  return res;
};