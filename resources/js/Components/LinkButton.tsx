import { Link } from '@inertiajs/react';
import React from 'react';

interface Props {
  href: string;
  colorCode?: string;
  className?: string;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  colorCode = '#3A63F5',
  className = '',
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={`text-white font-sans bg-[${colorCode}] text-center rounded-full  my-auto py-3 font-thin hover:brightness-90 uppercase px-5 ${className}`}
    >
      {children}
    </Link>
  );
}
