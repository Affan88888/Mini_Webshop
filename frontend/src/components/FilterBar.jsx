import React from 'react';

const FilterBar = ({ filters, onChange }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mb-4">
            <input
                name="name"
                placeholder="Search Name"
                value={filters.name}
                onChange={onChange}
            />
            <input
                name="min_price"
                placeholder="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={onChange}
            />
            <input
                name="max_price"
                placeholder="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={onChange}
            />
            <input
                name="min_quantity"
                placeholder="Min Qty"
                type="number"
                value={filters.minQuantity}
                onChange={onChange}
            />
            <input
                name="max_quantity"
                placeholder="Max Qty"
                type="number"
                value={filters.maxQuantity}
                onChange={onChange}
            />
            <select name="sort_by" value={filters.sortBy} onChange={onChange}>
                <option value="date">Date</option>
                <option value="price">Price</option>
                <option value="quantity">Quantity</option>
            </select>
            <select name="order" value={filters.order} onChange={onChange}>
                <option value="desc">DESC</option>
                <option value="asc">ASC</option>
            </select>
        </div>
    );
};

export default FilterBar;
