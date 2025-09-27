// utils/handleError.ts
export function handleError(error: any) {
  // Handle Appwrite specific errors
  if (error?.code === 409) {
    return { error: "A user with this email already exists. Please login instead.", data: null };
  }

  if (error?.code === 401) {
    return { error: "Invalid credentials. Please check your email and password.", data: null };
  }

  if (error?.code === 400) {
    return { error: "Invalid request. Please check your input.", data: null };
  }

  if (error?.code === 404) {
    return { error: "Resource not found.", data: null };
  }

  if (error?.code === 429) {
    return { error: "Too many requests. Please try again later.", data: null };
  }

  if (error?.code === 500) {
    return { error: "Server error. Please try again later.", data: null };
  }

  // Handle network errors
  if (error?.message === "Network request failed") {
    return { error: "Network error. Please check your internet connection.", data: null };
  }

  // Fallback to generic message extraction
  const message =
    error?.response?.data?.error || // backend-sent error
    error?.response?.message ||      // Appwrite error message
    error?.message ||                // network/axios error
    "An unexpected error occurred";

  return { error: message, data: null };
}
