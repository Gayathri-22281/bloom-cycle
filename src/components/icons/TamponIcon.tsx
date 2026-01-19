import { SVGProps } from "react";

export function TamponIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Cylindrical tampon body */}
      <rect
        x="22"
        y="8"
        width="20"
        height="36"
        rx="10"
        fill="hsl(333, 50%, 92%)"
        stroke="hsl(333, 71%, 65%)"
        strokeWidth="2"
      />
      {/* Rounded top */}
      <ellipse
        cx="32"
        cy="14"
        rx="10"
        ry="6"
        fill="hsl(333, 60%, 88%)"
        stroke="hsl(333, 71%, 65%)"
        strokeWidth="1.5"
      />
      {/* Cotton texture lines */}
      <path
        d="M26 22V36"
        stroke="hsl(333, 40%, 80%)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M32 20V38"
        stroke="hsl(333, 40%, 80%)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M38 22V36"
        stroke="hsl(333, 40%, 80%)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* String */}
      <path
        d="M32 44C32 44 28 52 26 56C24 60 22 62 22 62"
        stroke="hsl(333, 71%, 70%)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small loop at end of string */}
      <circle
        cx="21"
        cy="61"
        r="2"
        fill="hsl(333, 71%, 80%)"
        stroke="hsl(333, 71%, 65%)"
        strokeWidth="1"
      />
    </svg>
  );
}
