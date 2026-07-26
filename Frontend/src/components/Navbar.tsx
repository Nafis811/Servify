import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../features/auth/auth.api";
import { clearStoredSession, getStoredSession, SESSION_CHANGE_EVENT } from "../features/auth/auth.session";
import { navigation } from "../data/navigation";

export function Navbar() {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    const syncSession = () => {
      setSession(getStoredSession());
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener(SESSION_CHANGE_EVENT, syncSession as EventListener);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(SESSION_CHANGE_EVENT, syncSession as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Keep clearing the local session so the UI stays in sync.
    } finally {
      clearStoredSession();
      setSession(null);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">Servify</Link>
        </div>

        <nav className="navbar-menu nav-links">
          {navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ))}

          {session ? (
            <>
              {session.user.role === "admin" ? (
                <Link className="nav-action nav-action--admin" to="/admin">
                  Dashboard Admin
                </Link>
              ) : (
                <Link className="nav-action nav-action--merchant" to="/merchant/info">
                  Jadi Mitra
                </Link>
              )}

              <button className="nav-action nav-action--logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/merchant/info">Jadi Mitra</Link>
              <Link className="nav-action nav-action--login" to="/login">Login</Link>
              <Link className="nav-action nav-action--register" to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

