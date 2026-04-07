import "./toggle.css";
import React from "react";

interface ToggleProps {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isChecked: boolean;
}

function Toggle({ handleChange, isChecked }: ToggleProps) {
    return (
        <div className="toggle-container">
            <input
                type="checkbox"
                id="check"
                className="toggle"
                onChange={handleChange}
                checked={isChecked}
            />
            <label htmlFor="check">
                <i className={isChecked ? "bi bi-moon-stars-fill" : "bi bi-brightness-high-fill"}></i>
            </label>
        </div>
    );
}

export default Toggle;