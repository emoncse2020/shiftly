import { useLoaderData } from "react-router";
import BangladeshMap from "./BangladeshMap";
import { useState } from "react";

const Coverage = () => {
  const serviceCenters = useLoaderData();
  //   console.log(serviceCenters);
  const [searchItem, setSearchItem] = useState("");
  const [filteredCenters, setFilteredCenters] = useState(serviceCenters);
  const [flyToPosition, setFlyToPosition] = useState(null);

  const handleSearch = () => {
    if (searchItem.trim() === "") {
      setFilteredCenters(serviceCenters);
      setFlyToPosition(null);
    } else {
      const result = serviceCenters.filter(
        (center) =>
          center.district
            .toLowerCase()
            .includes(searchItem.toLocaleLowerCase()) ||
          center.covered_area.some((area) =>
            area.toLocaleLowerCase().includes(searchItem.toLocaleLowerCase())
          )
      );
      setFilteredCenters(result);
      if (result.length > 0) {
        setFlyToPosition([result[0].latitude, result[0].longitude]);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        We are available in 64 districts
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Search your district to check our delivery coverage.
      </p>

      {/* Search Box (DaisyUI + Tailwind) */}
      <div className="form-control w-full max-w-md mb-8">
        <div className="input-group flex">
          <input
            type="text"
            placeholder="Search district name..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary/40"
          />
          <button className="btn btn-primary text-black">Search</button>
        </div>
      </div>

      {/* Map Component */}
      <BangladeshMap
        serviceCenters={filteredCenters}
        flyToPosition={flyToPosition}
      />
    </div>
  );
};

export default Coverage;
