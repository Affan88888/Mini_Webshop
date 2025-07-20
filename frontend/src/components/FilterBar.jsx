const FilterBar = () => (
  <div className="flex justify-center gap-4 p-4">
    <input type="text" placeholder="Search..." className="border p-2 rounded" />
    <select className="border p-2 rounded">
      <option>Sort by Price</option>
      <option>Sort by Name</option>
    </select>
  </div>
);

export default FilterBar;
