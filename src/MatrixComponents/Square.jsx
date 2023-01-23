import React from "react";

export default function Square({ value, k, color }) {
  return (
    <span className="matrix-square">
      <span className={`matrix-square__value matrix-square--${color}`}>
        {value}
      </span>
      <span className="matrix-square__k">
        {value !== "-" && value > 0 && k + 1}
      </span>
    </span>
  );
}
