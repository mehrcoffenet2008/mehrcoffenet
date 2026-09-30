import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/profile/")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (loginId, password, remember = false) => {
    const res = await fetch("/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginId, email: loginId, password, remember }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      if (remember) {
        localStorage.setItem("remembered_login_id", loginId);
      } else {
        localStorage.removeItem("remembered_login_id");
      }
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (userData) => {
    const res = await fetch("/api/auth/complete-registration/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = async () => {
    await fetch("/api/auth/logout/", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await fetch("/api/auth/profile/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser((prev) => ({ ...prev, ...data.user }));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await fetch("/api/auth/change-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
