// All calls to the backend live here, nowhere else.
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// Photos uploaded by the admin are saved by the API as "/uploads/xxx.jpg".
export const imgUrl = (u) => (!u ? "" : u.startsWith("/uploads/") ? BASE + u : u);

async function req(path, opts = {}) {
  let res;
  try {
    res = await fetch(BASE + path, opts);
  } catch {
    throw new Error("Cannot reach the server. Check your internet and try again.");
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(
      (data && data.error) ||
        (res.status === 429 ? "Too many tries. Wait a minute and try again." : "Something went wrong (" + res.status + ").")
    );
    err.status = res.status;
    throw err;
  }
  return data;
}

const auth = (token) => ({ Authorization: "Bearer " + token });

export const getMenu = () => req("/api/menu");

export const saveMenu = (menu, token) =>
  req("/api/menu", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...auth(token) },
    body: JSON.stringify(menu),
  });

export const login = (username, password) =>
  req("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

export const uploadImage = (file, token) => {
  const fd = new FormData();
  fd.append("file", file);
  return req("/api/upload", { method: "POST", headers: auth(token), body: fd });
};
