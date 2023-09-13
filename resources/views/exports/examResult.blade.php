<table>
    <thead>
        <tr>
            <th colspan="9"><b>{{$title}}</b></th>
        </tr>
        <tr>
            <th><b>Nama</b></th>
            <th><b>Email</b></th>
            <th><b>Nama Latihan</b></th>
            <th><b>Nilai</b></th>
            <th><b>Kategori Pembelajaran</b></th>
            <th><b>Sub Paket</b></th>
            <th><b>Paket</b></th>
            <th><b>Waktu Mulai</b></th>
            <th><b>Waktu Selesai</b></th>
        </tr>
    </thead>
    <tbody>
        @foreach ($exams as $exam)
        <tr>
            <td>{{$exam->user->name}}</td>
            <td>{{$exam->user->email}}</td>
            <td>{{$exam->exerciseQuestion->name}}</td>
            <td>{{$exam->answers_sum_score}}</td>
            <td>{{$exam->exerciseQuestion->learningCategory->name}}</td>
            <td>{{$exam->exerciseQuestion->learningCategory->subLearningPacket->name}}</td>
            <td>{{$exam->exerciseQuestion->learningCategory->subLearningPacket->learningPacket->name}}</td>
            <td>{{$exam->created_at}}</td>
            <td>{{$exam->finished_at}}</td>
        </tr>
        @endforeach
    </tbody>
</table>
