import React, { PropsWithChildren } from 'react';

import AuthenticationCardLogo from '@/Components/Jetstream/AuthenticationCardLogo';
import { useMediaQuery } from '@/Hooks/useMediaQuery';
import { asset } from '@/Models/Helper';

export default function AuthenticationCard({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex">
      <div className="w-screen h-full lg:h-screen flex">
        <div className='basis-1/2'>
            <img src={asset('root', 'assets/image/login-img.png')} className="object-cover w-full h-full" />
        </div>
        <div className='basis-1/2 mx-0 lg:mx-auto px-10  sm:justify-center items-center flex flex-col'>
          <div className="card glass py-5 w-full md:w-3/4 mt-10 lg:mt-0 justify-center shadow-2xl shadow-sky-400/50 p-7 rounded-2xl">
            <div className="card-body ">
              <div className="flex flex-col text-black">
                <img src={asset('root', 'assets/image/logo.png')} className="mx-auto" />
              </div>
              <div className="mt-6 py-4 sm:rounded-lg ">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
