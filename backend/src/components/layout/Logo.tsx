import { cn } from '@/lib/utils';
import React from 'react';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 102 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8', className)}
    >
      <path
        d="M50.9997 0.963867C50.9997 0.963867 36.438 30.5639 27.5255 49.3496C18.613 68.1354 1.51343 103.013 1.51343 103.013C1.51343 103.013 2.06201 104.991 2.50285 106.13C4.21405 110.638 7.37799 111.458 10.3792 111.97C16.2731 113.084 19.3479 111.97 22.1955 109.843C25.043 107.717 25.1322 105.441 24.2409 102.378C23.6826 100.419 22.4228 97.4361 21.074 94.3916C21.074 94.3916 35.199 71.0482 45.4802 54.3494C55.7615 37.6506 50.9997 0.963867 50.9997 0.963867Z"
        fill="url(#paint0_linear_314_17)"
      />
      <path
        d="M51.0003 0.963867C51.0003 0.963867 65.562 30.5639 74.4745 49.3496C83.387 68.1354 100.487 103.013 100.487 103.013C100.487 103.013 99.938 104.991 99.4972 106.13C97.7859 110.638 94.622 111.458 91.6208 111.97C85.7269 113.084 82.6521 111.97 79.8045 109.843C76.957 107.717 76.8678 105.441 77.7591 102.378C78.3174 100.419 79.5772 97.4361 80.926 94.3916C80.926 94.3916 66.801 71.0482 56.5198 54.3494C46.2385 37.6506 51.0003 0.963867 51.0003 0.963867Z"
        fill="url(#paint1_linear_314_17)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_314_17"
          x1="26.2575"
          y1="56.4669"
          x2="26.2575"
          y2="111.97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_314_17"
          x1="75.7425"
          y1="56.4669"
          x2="75.7425"
          y2="111.97"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
