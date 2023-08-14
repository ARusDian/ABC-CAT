<table>
    <thead>
        <tr>
            <th colspan="3"><b>Paket Belajar {{$learningPacket->name}}</b></th>
        </tr>
        <tr>
            <th><b>Nama</b></th>
            <th><b>Email</b></th>
            <th><b>Tanggal Berlangganan (DD-MM-YYYY)</b></th>
        </tr>
    </thead>
    <tbody>
        @foreach($learningPacket->userLearningPackets as $userLearningPacket)
        <tr>
            <td>{{$userLearningPacket->user->name}}</td>
            <td>{{$userLearningPacket->user->email}}</td>
            <td>{{$userLearningPacket->subscription_date}}</td>
        </tr>
        @endforeach
    </tbody>
</table>
