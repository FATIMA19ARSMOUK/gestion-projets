
const API_URL = "/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const responseText = await response.text();

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { rawResponse: responseText };
    }

    if (!response.ok) {
      console.error("API ERROR:", {
        endpoint,
        status: response.status,
        response: data,
      });

      throw new Error(
        data.message ||
        data.exception ||
        data.rawResponse ||
        `Erreur API : ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("REQUEST FAILED:", error);
    throw error;
  }
}
