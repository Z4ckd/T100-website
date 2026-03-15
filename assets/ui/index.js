// assets/ui/Index.js
window.UI = window.UI || {};

/* ---------- Icons ---------- */
window.UI.IconPhone = function IconPhone() {
  return React.createElement(
    "svg",
    { className: "ui-icon", width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" },
    React.createElement("path", {
      d: "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
      stroke: "currentColor",
      strokeWidth: 2
    })
  );
};

window.UI.IconArrowRight = function IconArrowRight() {
  return React.createElement(
    "svg",
    { className: "ui-icon", width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" },
    React.createElement("path", {
      d: "M5 12h14M13 5l6 7-6 7",
      stroke: "currentColor",
      strokeWidth: 2
    })
  );
};

/* ---------- Buttons ---------- */
window.UI.PrimaryButton = function PrimaryButton(props) {
  const { children, onClick, className = "" } = props;
  return React.createElement(
    "button",
    { className: `btn btn-primary ${className}`, onClick },
    children
  );
};

window.UI.SecondaryButton = function SecondaryButton(props) {
  const { children, href, className = "" } = props;
  return React.createElement(
    "a",
    { className: `btn btn-secondary ${className}`, href },
    children
  );
};
