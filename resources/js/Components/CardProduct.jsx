export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
            {product.image && (
                <img
                    src={`/storage/${product.image}`}
                    className="w-full h-48 object-cover rounded-t"
                />
            )}
            <div className="p-4">
                <h3 className="font-semibold text-lg">
                    {product.name}
                </h3>
                <p className="text-indigo-600 font-bold">
                    Rp {product.price}
                </p>
                <p className="text-gray-600 text-sm">
                    {product.description}
                </p>
            </div>
        </div>
    );
}
