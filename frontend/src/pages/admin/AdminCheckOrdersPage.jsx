import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import GoBackButton from "../../components/GoBackButton";

const ORDERS_PER_PAGE = 2;

const AdminCheckOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [sortedOrders, setSortedOrders] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/orders`);
                if (!response.ok) throw new Error("Failed to fetch orders");
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

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const status_timestamp = new Date().toISOString();

        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus,
                    status_timestamp: status_timestamp,
                }),
            });

            if (!response.ok) throw new Error("Failed to update order status");

            // Update local state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus, status_timestamp }
                        : order
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-md">
                <GoBackButton />
            </div>

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
                        <p><b>Customer:</b> {order.customer.name} {order.customer.surname}</p>
                        <p><b>Address:</b> {order.customer.address}</p>
                        <p><b>Email:</b> {order.customer.email}</p>
                        <p><b>Phone:</b> {order.customer.phone}</p>
                        <p><b>Date:</b> {new Date(order.timestamp).toLocaleString()}</p>
                        <p><b>Status:</b> <span className="font-semibold">{order.status || "Pending"}</span></p>
                        {order.status_timestamp && (
                            <p className="text-sm text-gray-500">
                                Updated: {new Date(order.status_timestamp).toLocaleString()}
                            </p>
                        )}
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
