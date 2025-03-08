import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface BlindFormProps {
  onTotalChange: (total: number) => void;
}

const BlindForm: React.FC<BlindFormProps> = ({ onTotalChange }) => {
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
  });
  const [calculations, setCalculations] = useState({
    totalSqFeet: 0,
    numberOfParts: 0,
    totalMeters: 0,
    channelSqFeet: 0,
    channelCost: 0,
    fabricCost: 0,
    fittingCost: 0,
    totalCost: 0,
  });
  const [prices, setPrices] = useState({
    perSqFeet: "",
    perMeter: "",
    channelPerSqFeet: "",
    fittingCost: "",
  });
  const [blindType, setBlindType] = useState("roller");

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const width = Number(dimensions.width);
      const height = Number(dimensions.height);
      const totalSqFeet = (width * height) / 144;
      
      if (blindType === "roller") {
        setCalculations({
          totalSqFeet,
          numberOfParts: 0,
          totalMeters: 0,
          channelSqFeet: 0,
          channelCost: 0,
          fabricCost: 0,
          fittingCost: Number(prices.fittingCost),
          totalCost: totalSqFeet * Number(prices.perSqFeet) + Number(prices.fittingCost),
        });
      } else if (blindType === "roman") {
        const parts = width <= 50 ? 1 : Math.ceil(width / 50);
        const metersPerPart = (height + 15) / 39;
        const totalMeters = parts * metersPerPart;
        const channelSqFeet = totalSqFeet;
        const fabricCost = totalMeters * Number(prices.perMeter);
        const channelCost = channelSqFeet * Number(prices.channelPerSqFeet);
        const fittingCost = Number(prices.fittingCost);
        const totalCost = fabricCost + channelCost + fittingCost;
        setCalculations({
          totalSqFeet,
          numberOfParts: parts,
          totalMeters,
          channelSqFeet,
          channelCost,
          fabricCost,
          fittingCost,
          totalCost,
        });
      }
    }
  }, [dimensions, blindType, prices]);

  useEffect(() => {
    onTotalChange(calculations.totalCost);
  }, [calculations.totalCost]);

  return (
    <div className="space-y-4">
      <FormControl fullWidth size="small">
        <Select value={blindType} onChange={(e) => setBlindType(e.target.value)}>
          <MenuItem value="roller">Roller</MenuItem>
          <MenuItem value="roman">Roman</MenuItem>
        </Select>
      </FormControl>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Width (inches)"
          fullWidth
          value={dimensions.width}
          onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
          type="number"
          size="small"
        />
        <TextField
          label="Height (inches)"
          fullWidth
          value={dimensions.height}
          onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
          type="number"
          size="small"
        />
      </div>

      {blindType === "roller" && (
        <TextField
          label="Price per Sq. Feet"
          fullWidth
          value={prices.perSqFeet}
          onChange={(e) => setPrices({ ...prices, perSqFeet: e.target.value })}
          type="number"
          size="small"
        />
      )}

      {blindType === "roman" && (
        <>
          <TextField
            label="Leather Price per Meter"
            fullWidth
            value={prices.perMeter}
            onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
            type="number"
            size="small"
          />
          <TextField
            label="Channel Price per Sq. Feet"
            fullWidth
            value={prices.channelPerSqFeet}
            onChange={(e) => setPrices({ ...prices, channelPerSqFeet: e.target.value })}
            type="number"
            size="small"
          />
          <TextField
            label="Channel Sq. Feet"
            fullWidth
            value={calculations.channelSqFeet.toFixed(2)}
            disabled
            size="small"
          />
        </>
      )}

      <TextField
        label="Fitting Cost"
        fullWidth
        value={prices.fittingCost}
        onChange={(e) => setPrices({ ...prices, fittingCost: e.target.value })}
        type="number"
        size="small"
      />

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900">Total Cost Breakdown</h4>
        <div className="mt-2 space-y-2 text-sm">
          {blindType === "roman" && (
            <>
              <div className="flex justify-between">
                <span>Fabric Cost:</span>
                <span>₹{calculations.fabricCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Channel Cost:</span>
                <span>₹{calculations.channelCost.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>Fitting Cost:</span>
            <span>₹{calculations.fittingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2">
            <span>Total:</span>
            <span>₹{calculations.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindForm;
