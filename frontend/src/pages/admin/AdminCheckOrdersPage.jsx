import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

const ORDERS_PER_PAGE = 3;

const AdminCheckOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusMap, setStatusMap] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/orders`);
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const sorted = [...orders].sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setSortedOrders(sorted);
    }, [orders, sortOrder]);

    const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * ORDERS_PER_PAGE,
        currentPage * ORDERS_PER_PAGE
    );

    const handleStatusChange = (orderId, status) => {
        setStatusMap((prev) => ({
            ...prev,
            [orderId]: status,
        }));
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Created Orders</h1>
                <button
                    onClick={toggleSortOrder}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Sort by Date: {sortOrder === "asc" ? "Oldest First" : "Newest First"}
                </button>
            </div>

            {paginatedOrders.map((order) => (
                <div key={order.id} className="p-4 mb-6 border rounded shadow">
                    <div className="mb-2">
                        <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
                        <p>Customer: {order.customer.name} {order.customer.surname}</p>
                        <p>Address: {order.customer.address}</p>
                        <p>Date: {new Date(order.timestamp).toLocaleString()}</p>
                        <p>Status: <span className="font-semibold">{statusMap[order.id] || "Pending"}</span></p>
                    </div>

                    <div className="pl-4 mb-2">
                        <h3 className="font-semibold">Items:</h3>
                        <ul className="space-y-2">
                            {order.items.map((item) => (
                                <li key={item.id} className="p-2 border rounded">
                                    <p><strong>Name:</strong> {item.name}</p>
                                    <p><strong>Description:</strong> {item.description}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <img
                                        src={`${API_BASE_URL}/${item.image_url}`}
                                        alt={item.name}
                                        className="w-32 mt-2 border"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => handleStatusChange(order.id, "Accepted (in preparation)")}
                            className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleStatusChange(order.id, "Denied")}
                            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                            Deny
                        </button>
                        <button
                            onClick={() => handleStatusChange(order.id, "Finished")}
                            className="px-3 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminCheckOrdersPage;
