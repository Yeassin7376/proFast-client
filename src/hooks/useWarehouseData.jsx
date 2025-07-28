// hooks/useWarehouseData.js
import { useEffect, useState } from "react";

const useWarehouseData = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch("/warehouses.json");
        const data = await res.json();
        setWarehouses(data);

        const uniqueRegions = [...new Set(data.map(w => w.region))];
        setRegions(uniqueRegions);
      } catch (error) {
        console.error("Failed to load warehouse data", error);
      }
    };

    fetchWarehouses();
  }, []);

  return { warehouses, regions };
};

export default useWarehouseData;
