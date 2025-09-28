import React from "react";
import "./SearchBar.css";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="clear-btn" onClick={handleClear}>
          ×
        </button>
      )}
    </div>
  );
}