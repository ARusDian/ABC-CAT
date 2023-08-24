<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements WithStartRow, OnEachRow, WithHeadingRow
{
    /**
     * @return int
     */
    public function startRow(): int
    {
        return 4;
    }

    /**
     * @param array $row
     */
    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();
        $row = $row->toArray();

        $users = User::withTrashed()->updateOrCreate(
            [
                'email' => $row['email'],
            ],
            [
                'name' => $row['nama'],
                'email' => $row['email'],
                'password' => Hash::make($row['password']),
                'phone_number' => $row['no_telepon'],
                'active_year' => $row['tahun_aktif'],
                'gender' => $row['jenis_kelamin'],
                'address' => $row['alamat'],
            ],
        );
        $users->assignRole('student');
    }

    public function headingRow(): int
    {
        return 3;
    }
}
