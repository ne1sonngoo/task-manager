const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("accessToken");
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach JWT if we have one
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // If token expired/invalid, backend typically returns 401
  if (res.status === 401) {
    // throw a special error so UI can log out
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  // 204 means no body
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || "Request failed";
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// AUTH
export async function register({ name, email, password }) {
  // returns { user: {id,name,email} }
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  // returns { accessToken }
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// TASKS
export async function getTasks(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/tasks${qs}`, { method: "GET" });
}

export async function createTask({ title, status }) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, status }),
  });
}

export async function updateTask(id, { title, status }) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, status }),
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${id}`, { method: "DELETE" });
}
