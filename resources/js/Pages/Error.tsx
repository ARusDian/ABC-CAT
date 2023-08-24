import { asset } from '@/Models/Helper';
import { Head } from '@inertiajs/react';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  status: number;
}

export default function ErrorPage({ status }: Props) {
  const title = {
    503: 'Service Unavailable',
    500: 'Server Error',
    404: 'Page Not Found',
    403: 'Forbidden',
    401: 'Unauthorized',
  }[status];

  const description = {
    503: 'Maaf, Aplikasi sedang dalam tahap pemeliharaan. Silahkan coba lagi nanti.',
    500: 'Ups, Ada sesuatu yang salah pada server.',
    404: 'Maaf, halaman yang anda cari tidak ditemukan.',
    403: 'Maaf, anda tidak diizinkan mengakses halaman ini.',
    401: 'Maaf, anda tidak memiliki akses untuk halaman ini.',
  }[status];

  return (
    <>
      <Head title={`${status} ${title}`}>
        <link rel="icon" href={asset('root', 'assets/image/icon.png')} />
      </Head>
      <div
        className="min-h-screen flex flex-col items-center justify-center font-sans"
        style={{
          background:
            'linear-gradient(180deg, #116BF2 0%, rgba(49, 176, 168, 0.85) 33.33%, rgba(145, 168, 203, 0.55) 99.99%, rgba(255, 255, 255, 0.00) 100%)',
        }}
      >
        <div className="my-auto flex gap-10">
          <div className="flex flex-col gap-3 text-white text-center my-auto">
            <h1 className="text-7xl font-extrabold ">{status}</h1>
            <h4 className="text-3xl font-semibold">{title}</h4>
            <p className="text-lg">{description}</p>
          </div>
          <div>
            <img
              src={asset('root', `assets/image/errors/${title}.png`)}
              alt={status.toString()}
              className="h-96 max-h-96 max-w-3xl"
            />
          </div>
        </div>
      </div>
    </>
  );
}
