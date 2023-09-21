<table>
    <thead>
        <tr>
            <th colspan="{{ 3 + $choice_count * 2 }}"><b>Bank Soal {{ $bankQuestion->name }}</b></th>
        </tr>
        <tr>
            <th colspan="{{ 3 + $choice_count * 2 }}">Contoh Pengisian Data Soal</th>
        </tr>
        <tr>
            <th><b>Soal 1</b></th>
            <th><b>Pilihan Mana Yang Benar?</b></th>
            @foreach (range(1, $choice_count) as $i)
                <th><b>Pilihan {{ $i }}</b></th>
                <th><b>{{ random_int(0, 10) }}</b></th>
            @endforeach
            <th><b>Tentu saja banyak Pilihan</b></th>
        </tr>
        <tr>
            <th colspan="{{ 3 + $choice_count * 2 }}"><b>Isi Data Soal Dibawah</b></th>
        </tr>
        <tr>
            <th><b>Nama</b></th>
            <th><b>pertanyaan</b></th>
            @foreach (range(1, $choice_count) as $i)
                <th><b>Pilihan {{ $i }}</b></th>
                <th><b>Bobot {{ $i }}</b></th>
	    @endforeach
            <th><b>Pembahasan</b></th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
