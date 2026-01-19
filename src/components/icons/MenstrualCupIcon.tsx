import { SVGProps } from "react";

export function MenstrualCupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* U-shaped menstrual cup body */}
      <path
        d="M16 12C16 10 18 8 20 8H44C46 8 48 10 48 12V28C48 42 40 52 32 52C24 52 16 42 16 28V12Z"
        fill="hsl(333, 71%, 85%)"
        stroke="hsl(333, 71%, 60%)"
        strokeWidth="2"
      />
      {/* Inner rim highlight */}
      <ellipse
        cx="32"
        cy="12"
        rx="14"
        ry="4"
        fill="hsl(333, 71%, 90%)"
        stroke="hsl(333, 71%, 65%)"
        strokeWidth="1.5"
      />
      {/* Stem */}
      <path
        d="M30 52V60C30 61 31 62 32 62C33 62 34 61 34 60V52"
        fill="hsl(333, 71%, 80%)"
        stroke="hsl(333, 71%, 60%)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Grip lines on cup */}
      <path
        d="M22 32C22 32 27 36 32 36C37 36 42 32 42 32"
        stroke="hsl(333, 71%, 70%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 40C24 40 28 43 32 43C36 43 40 40 40 40"
        stroke="hsl(333, 71%, 70%)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
