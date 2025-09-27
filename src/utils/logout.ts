import authService from "@/services/auth.appwrite";

export const handleLogout = async () => {
  try {
    // Logout from Appwrite
    await authService.logout();

    // Clear any local storage
    localStorage.removeItem("token");

    // Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    // Even if logout fails, redirect to login
    window.location.href = "/login";
  }
};