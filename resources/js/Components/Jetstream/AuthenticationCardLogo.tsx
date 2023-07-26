import { asset } from '@/Models/Helper';
import { Link } from '@inertiajs/react';
import React from 'react';

export default function AuthenticationCardLogo() {
  return (
    <Link href="/">
      <img
        src={asset('root', 'assets/images/Lambang_ITK.png')}
        alt="logo itk"
        className="w-40"
      />
    </Link>
  );
}
