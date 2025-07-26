import React from 'react';

const FilterBar = ({ filters, onChange, onClear }) => {
    return (
        <div className="p-4 mb-6 bg-white border rounded shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    Filter & Sort Products
                </h2>
                <button
                    onClick={onClear}
                    className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Clear Filters
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Name Filter */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-600">
                        Search by Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        placeholder="e.g. T-shirt"
                        value={filters.name}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                {/* Price Filters */}
                <div className="flex flex-col">
                    <label htmlFor="min_price" className="mb-1 text-sm font-medium text-gray-600">
                        Min Price
                    </label>
                    <input
                        id="min_price"
                        name="min_price"
                        type="number"
                        placeholder="0"
                        value={filters.min_price}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="max_price" className="mb-1 text-sm font-medium text-gray-600">
                        Max Price
                    </label>
                    <input
                        id="max_price"
                        name="max_price"
                        type="number"
                        placeholder="100"
                        value={filters.max_price}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                {/* Quantity Filters */}
                <div className="flex flex-col">
                    <label htmlFor="min_quantity" className="mb-1 text-sm font-medium text-gray-600">
                        Min Quantity
                    </label>
                    <input
                        id="min_quantity"
                        name="min_quantity"
                        type="number"
                        placeholder="0"
                        value={filters.min_quantity}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="max_quantity" className="mb-1 text-sm font-medium text-gray-600">
                        Max Quantity
                    </label>
                    <input
                        id="max_quantity"
                        name="max_quantity"
                        type="number"
                        placeholder="100"
                        value={filters.max_quantity}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                {/* Sorting */}
                <div className="flex flex-col">
                    <label htmlFor="sort_by" className="mb-1 text-sm font-medium text-gray-600">
                        Sort By
                    </label>
                    <select
                        id="sort_by"
                        name="sort_by"
                        value={filters.sort_by}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    >
                        <option value="date">Date</option>
                        <option value="price">Price</option>
                        <option value="quantity">Quantity</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="order" className="mb-1 text-sm font-medium text-gray-600">
                        Order
                    </label>
                    <select
                        id="order"
                        name="order"
                        value={filters.order}
                        onChange={onChange}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
