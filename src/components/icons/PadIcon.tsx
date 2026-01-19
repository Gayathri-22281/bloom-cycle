import { SVGProps } from "react";

export function PadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Main pad body */}
      <path
        d="M12 20C12 16 14 12 20 12H44C50 12 52 16 52 20V44C52 48 50 52 44 52H20C14 52 12 48 12 44V20Z"
        fill="hsl(333, 50%, 95%)"
        stroke="hsl(333, 71%, 65%)"
        strokeWidth="2"
      />
      {/* Center absorbent area */}
      <rect
        x="18"
        y="18"
        width="28"
        height="28"
        rx="4"
        fill="hsl(333, 60%, 90%)"
        stroke="hsl(333, 71%, 75%)"
        strokeWidth="1.5"
      />
      {/* Wings */}
      <path
        d="M8 28C8 26 10 24 12 24V40C10 40 8 38 8 36V28Z"
        fill="hsl(333, 50%, 92%)"
        stroke="hsl(333, 71%, 70%)"
        strokeWidth="1.5"
      />
      <path
        d="M56 28C56 26 54 24 52 24V40C54 40 56 38 56 36V28Z"
        fill="hsl(333, 50%, 92%)"
        stroke="hsl(333, 71%, 70%)"
        strokeWidth="1.5"
      />
      {/* Quilted pattern */}
      <path
        d="M24 24V40"
        stroke="hsl(333, 50%, 82%)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M32 22V42"
        stroke="hsl(333, 50%, 82%)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M40 24V40"
        stroke="hsl(333, 50%, 82%)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
