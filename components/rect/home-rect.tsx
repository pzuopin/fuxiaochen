import { type SVGProps } from 'react';

export const HomeRect = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="725"
    height="990"
    viewBox="0 0 725 990"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="663.973"
      y="-454"
      width="1270.03"
      height="939"
      rx="15"
      transform="rotate(45 663.973 -454)"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="663.973"
        y1="-454"
        x2="1559.63"
        y2="757.412"
        gradientUnits="userSpaceOnUse"
      >
        {/* <stop stop-color="#6A98F0" />
        <stop offset="1" stop-color="#4961DC" /> */}
        <stop stopColor="hsl(var(--primary)/.9)" />
        <stop offset="1" stopColor="hsl(var(--primary))" />
      </linearGradient>
    </defs>
  </svg>
);
