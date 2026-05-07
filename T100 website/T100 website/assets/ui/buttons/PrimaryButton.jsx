import React from "react";
import "./Button.css";

export default function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
