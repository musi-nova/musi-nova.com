import React from "react";

const Play = ({ size = 64, color = "#22c55e", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="32" cy="32" r="32" fill={color} opacity="0.15" />
    <circle cx="32" cy="32" r="28" fill={color} opacity="0.3" />
    <circle cx="32" cy="32" r="24" fill={color} />
    <polygon points="26,20 26,44 46,32" fill="#fff" />
  </svg>
);

export default Play;
