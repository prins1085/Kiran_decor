import React, { useState, useEffect } from "react";
import { TextField, Typography, MenuItem } from "@mui/material";

interface MattressFormProps {
    onTotalChange: (total: number) => void;
  }

const MattressForm: React.FC<MattressFormProps> = ({ onTotalChange }) => {
  const [company, setCompany] = useState("sleepwell");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [displayHeight, setDisplayHeight] = useState(""); // Display-only height field
  const [pricePerUnit, setPricePerUnit] = useState("0");
  const [transportationFee, setTransportationFee] = useState("0");
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (width && height && pricePerUnit) {
      let area = 0;
      if (company === "sleepwell") {
        area = (Number(width) * Number(height)) / 1550.5; // Convert to sq.mt
      } else if (company === "kingkoil") {
        area = (Number(width) * Number(height)) / 144; // Convert to sq.ft
      }
      const calculatedTotal = area * Number(pricePerUnit) + Number(transportationFee);
      setTotalCost(calculatedTotal);
      onTotalChange(calculatedTotal);
    }
  }, [company, width, height, pricePerUnit, transportationFee, onTotalChange]);

  return (
    <div className="space-y-4">
      <TextField
        select
        label="Select Company"
        fullWidth
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        size="small"
      >
        <MenuItem value="sleepwell">Sleepwell</MenuItem>
        <MenuItem value="kingkoil">King Koil</MenuItem>
      </TextField>

      <TextField
        label="Width (in inches)"
        fullWidth
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label="Length (in inches)"
        fullWidth
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label="Height (in inches)"
        fullWidth
        value={displayHeight}
        onChange={(e) => setDisplayHeight(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label={`Price per ${company === "sleepwell" ? "sq.mt" : "sq.ft"}`}
        fullWidth
        value={pricePerUnit}
        onChange={(e) => setPricePerUnit(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label="Transportation Fee"
        fullWidth
        value={transportationFee}
        onChange={(e) => setTransportationFee(e.target.value)}
        type="number"
        size="small"
      />

      <div className="border-t border-gray-200 pt-4">
        <Typography variant="h6">Total Cost: ₹{totalCost.toFixed(2)}</Typography>
      </div>
    </div>
  );
};

export default MattressForm;
