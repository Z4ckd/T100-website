import React from "react";
import "./Button.css";

export default function SecondaryButton({ children, href }) {
  return (
    <a className="btn btn-secondary" href={href}>
      {children}
    </a>
  );
}
