<table>
    <thead>
        <tr>
            <th colspan="{{ 4 + $choice_count }}">
                <h5><b>Bank Soal {{ $bankQuestion->name }}</b></h5>
            </th>
        </tr>
        <tr>
            <th colspan="{{ 4 + $choice_count }}">Contoh Pengisian Data Soal</th>
        </tr>
        <tr>
            <th><b>Soal 1</b></th>
            <th><b>Pilihan Mana Yang Benar?</b></th>
            @foreach (range(1, $choice_count) as $i)
                <th><b>Pilihan {{ $i }}</b></th>
            @endforeach
            <th><b>1 ( 1 
                @foreach (range(2, $choice_count) as $i)
                    / {{ $i }}
                @endforeach
                )</b></th>
            <th><b>Tentu Saja Pilihan 1</b></th>
        </tr>
        <tr>
            <th colspan="{{ 4 + $choice_count }}"><b>Isi Data Soal Dibawah</b></th>
        </tr>
        <tr>
            <th><b>Nama</b></th>
            <th><b>Pertanyaan</b></th>
            @foreach (range(1, $choice_count) as $i)
                <th><b>Pilihan {{ $i }}</b></th>
            @endforeach
            <th><b>Jawaban</b></th>
            <th><b>Pembahasan</b></th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
