<!DOCTYPE html>
<html>
<head>
    <title>Cetak Produk</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; }
        th { background: #f3f3f3; }
        @media print {
            button { display: none; }
        }
    </style>
</head>
<body>

    <h2>Daftar Produk</h2>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Harga</th>
                <th>Deskripsi</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($products as $p)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $p->name }}</td>
                    <td>Rp {{ number_format($p->price, 0, ',', '.') }}</td>
                    <td>{{ $p->description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
