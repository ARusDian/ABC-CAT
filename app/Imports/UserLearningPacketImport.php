<?php

namespace App\Imports;

use App\Models\User;
use App\Models\UserLearningPacket;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UserLearningPacketImport implements WithStartRow, OnEachRow, WithHeadingRow
{
    private $learningPacketId;
    
    public function __construct(int $learningPacketId)
    {
        $this->learningPacketId = $learningPacketId;
    }

    /**
     * @return int
     */
    public function headingRow(): int
    {
        return 2;
    }

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
        $row      = $row->toArray();
        $email = $row['email'];
        $date = date_create('30-12-1899');

        $user = User::where('email', $email)->first();
        if ($user) {
            $userLearningPacket = UserLearningPacket::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'learning_packet_id' => $this->learningPacketId,
                ],
                [
                    'subscription_date' => date_add($date, date_interval_create_from_date_string("{$row['tanggal_berlangganan_dd_mm_yyyy']} days")),
                ]
            );
        }
    }

}
