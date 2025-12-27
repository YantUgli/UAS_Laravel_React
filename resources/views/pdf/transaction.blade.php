<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Bukti Transaksi #{{ $transaction->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #4f46e5;
            margin: 0;
        }
        .info {
            margin-bottom: 30px;
        }
        .info table {
            width: 100%;
        }
        .info td {
            padding: 8px 0;
        }
        .items table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .items th, .items td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .items th {
            background-color: #f3f4f6;
        }
        .total {
            text-align: right;
            font-size: 1.2em;
            margin-top: 30px;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>UAS_[Nama Kamu]</h1>
        <h2>Bukti Transaksi #{{ $transaction->id }}</h2>
    </div>

    <div class="info">
        <table>
            <tr>
                <td><strong>Tanggal Transaksi</strong></td>
                <td>: {{ \Carbon\Carbon::parse($transaction->created_at)->format('d F Y H:i') }}</td>
            </tr>
            <tr>
                <td><strong>Pembeli</strong></td>
                <td>: {{ $transaction->user->name }} ({{ $transaction->user->email }})</td>
            </tr>
            <tr>
                <td><strong>Status</strong></td>
                <td>: <span style="color: green; font-weight: bold;">{{ ucfirst($transaction->status) }}</span></td>
            </tr>
        </table>
    </div>

    <div class="items">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Produk</th>
                    <th>Harga Satuan</th>
                    <th>Jumlah</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transaction->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product->name }}</td>
                    <td>Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>Rp {{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="total">
        <strong>Total Pembayaran: Rp {{ number_format($transaction->total_price, 0, ',', '.') }}</strong>
    </div>

    <div class="footer">
        <p>Terima kasih telah berbelanja di UAS_[Nama Kamu]!</p>
        <p>Dicetak pada: {{ \Carbon\Carbon::now()->format('d F Y H:i') }}</p>
    </div>

</body>
</html>