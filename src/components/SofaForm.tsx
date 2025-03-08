import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";

interface SofaFormProps {
  onTotalChange: (total: number) => void;
}

const SofaForm: React.FC<SofaFormProps> = ({ onTotalChange }) => {
  const [sofaSize, setSofaSize] = useState("");
  const [designPattern, setDesignPattern] = useState("1.25");
  const [pricePerFoot, setPricePerFoot] = useState("0");
  const [transportationFee, setTransportationFee] = useState("0");
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (sofaSize && pricePerFoot && designPattern) {
      const sizeInFeet = Number(sofaSize) / 12; // Convert inches to feet
      const calculatedTotal =
        sizeInFeet * Number(designPattern) * Number(pricePerFoot) + Number(transportationFee);
      setTotalCost(calculatedTotal);
      onTotalChange(calculatedTotal);
    }
  }, [sofaSize, designPattern, pricePerFoot, transportationFee, onTotalChange]);

  return (
    <div className="space-y-4">
      <TextField
        label="Sofa Size (in inches)"
        fullWidth
        value={sofaSize}
        onChange={(e) => setSofaSize(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label="Design Pattern (Multiplier)"
        fullWidth
        value={designPattern}
        onChange={(e) => setDesignPattern(e.target.value)}
        type="number"
        size="small"
      />

      <TextField
        label="Price per Foot"
        fullWidth
        value={pricePerFoot}
        onChange={(e) => setPricePerFoot(e.target.value)}
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

export default SofaForm;
