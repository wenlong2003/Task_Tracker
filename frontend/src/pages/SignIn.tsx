import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import "./SignIn.css";

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SignIn = ({ setIsAuthenticated }: SignInProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);

      setIsAuthenticated(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        
        <input
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;