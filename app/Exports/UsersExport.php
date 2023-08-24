<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements WithHeadings, FromView
{
    /**
     * @return \Illuminate\Support\Collection
     */
    // public function collection()
    // {
    //     return User::all([
    //         'name',
    //         'email',
    //         'phone_number',
    //         'active_year',
    //         'gender',
    //         'address'
    //     ]);
    // }

    public function view(): View
    {
        return view('exports.user', [
            'users' => User::role('student')->get(),
        ]);
    }

    // public function drawings()
    // {
    //     $drawing = new Drawing();
    //     $drawing->setName('Logo');
    //     $drawing->setDescription('Logo');
    //     $drawing->setPath(public_path('assets/image/logo.png'));
    //     $drawing->setHeight(50);
    //     $drawing->setCoordinates('A10');

    //     return $drawing;
    // }

    public function headings(): array
    {
        return [
            'Nama',
            'Email',
            'Nomor Telepon',
            'Tahun Aktif',
            'Jenis Kelamin',
            'Alamat',
        ];
    }
}
