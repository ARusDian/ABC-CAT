<table>
    <thead>
        <tr>
            <th>Foto Profil</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Nomor Telepon</th>
            <th>Tahun Aktif</th>
            <th>Jenis Kelamin</th>
            <th>Alamat</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
        <tr>
            <td><img src="{{ $user->profile_photo_path ? public_path('storage/'.$user->profile_photo_path) : public_path('assets/image/default-profile.png') }}" height="100"></td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->phone_number }}</td>
            <td>{{$user->active_year}}</td>
            <td>{{$user->gender}}</td>
            <td>{{$user->address}}</td>
        </tr>
        @endforeach
    </tbody>
</table>
