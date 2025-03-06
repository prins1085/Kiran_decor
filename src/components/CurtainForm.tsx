import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface CurtainFormProps {
  onTotalChange: (total: number) => void;
}

const CurtainForm: React.FC<CurtainFormProps> = ({ onTotalChange }) => {
  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
  });
  const [calculations, setCalculations] = useState({
    numberOfParts: 0,
    meterPerPart: 0,
    totalMeters: 0,
    totalLeather: 0,
    laborCost: 0,
    channelType: "manual",
    channelFeet: 0,
    channelCost: 0,
    dimoutMeters: 0,
    dimoutCost: 0,
    sierraMeters: 0,
    sierraCost: 0,
  });
  const [prices, setPrices] = useState({
    perMeter: "",
    labor: "",
    channelPerFeet: "",
    dimoutPerMeter: "",
    sierraPerMeter: "",
  });

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const parts = Math.round(Number(dimensions.width) / 20);
      const metersPerPart = (Number(dimensions.height) + 15) / 39;
      const totalM = parts * metersPerPart;
      const channelF = Number(dimensions.width) / 12;

      setCalculations({
        ...calculations,
        numberOfParts: parts,
        meterPerPart: metersPerPart,
        totalMeters: totalM,
        channelFeet: channelF,
        dimoutMeters: totalM,
        sierraMeters: totalM,
      });
    }
  }, [dimensions]);

  useEffect(() => {
    const totalLeather = calculations.totalMeters * Number(prices.perMeter);
    const channelCost =
      calculations.channelFeet * Number(prices.channelPerFeet);
    const dimoutCost =
      calculations.dimoutMeters * Number(prices.dimoutPerMeter);
    const sierraCost =
      calculations.sierraMeters * Number(prices.sierraPerMeter);
    const laborCost = Number(prices.labor);

    const newCalculations = {
      ...calculations,
      totalLeather,
      laborCost,
      channelCost,
      dimoutCost,
      sierraCost,
    };

    setCalculations(newCalculations);

    const total = totalLeather + laborCost + channelCost + dimoutCost + sierraCost;
    onTotalChange(total);
  }, [
    prices,
    calculations.totalMeters,
    calculations.channelFeet,
    calculations.dimoutMeters,
    calculations.sierraMeters,
  ]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Width (inches)"
          fullWidth
          value={dimensions.width}
          onChange={(e) =>
            setDimensions({ ...dimensions, width: e.target.value })
          }
          type="number"
          size="small"
        />
        <TextField
          label="Height (inches)"
          fullWidth
          value={dimensions.height}
          onChange={(e) =>
            setDimensions({ ...dimensions, height: e.target.value })
          }
          type="number"
          size="small"
        />
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Number of Parts"
          fullWidth
          value={calculations.numberOfParts}
          size="small"
          disabled
        />
        <TextField
          label="Meters per Part"
          fullWidth
          value={calculations.meterPerPart.toFixed(2)}
          size="small"
          disabled
        />
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        {/* <TextField
          label="Total Meters"
          fullWidth
          value={calculations.totalMeters.toFixed(2)}
          size="small"
          disabled
        /> */}
        <TextField
          label="Price per Meter"
          fullWidth
          value={prices.perMeter}
          onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
          type="number"
          size="small"
        />
        <TextField
          label="Labor Cost"
          fullWidth
          className="mt-4"
          value={prices.labor}
          onChange={(e) => setPrices({ ...prices, labor: e.target.value })}
          type="number"
          size="small"
        />
      </div>

      <div className="space-y-3">
        <Typography variant="subtitle1" fontWeight={700}>Channel</Typography>
        <div className="grid grid-cols-3 gap-4">
          <FormControl fullWidth size="small">
            <Select
              value={calculations.channelType}
              onChange={(e) =>
                setCalculations({
                  ...calculations,
                  channelType: e.target.value as string,
                })
              }
            >
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="motorized">Motorized</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Total Feet"
            fullWidth
            value={calculations.channelFeet.toFixed(2)}
            size="small"
            disabled
          />
          <TextField
            label="Price per Feet"
            fullWidth
            className="mt-4"
            value={prices.channelPerFeet}
            onChange={(e) =>
              setPrices({ ...prices, channelPerFeet: e.target.value })
            }
            type="number"
            size="small"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Typography variant="subtitle1" fontWeight={700}>Dimout</Typography>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Total Meters"
            fullWidth
            value={calculations.dimoutMeters.toFixed(2)}
            size="small"
            disabled
          />
          <TextField
            label="Price per Meter"
            fullWidth
            value={prices.dimoutPerMeter}
            onChange={(e) =>
              setPrices({ ...prices, dimoutPerMeter: e.target.value })
            }
            type="number"
            size="small"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Typography variant="subtitle1" fontWeight={700}>Sierra</Typography>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Total Meters"
            fullWidth
            value={calculations.sierraMeters.toFixed(2)}
            size="small"
            disabled
          />
          <TextField
            label="Price per Meter"
            fullWidth
            value={prices.sierraPerMeter}
            onChange={(e) =>
              setPrices({ ...prices, sierraPerMeter: e.target.value })
            }
            type="number"
            size="small"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Cost:</span>
            <span>₹{calculations.totalLeather.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labor Cost:</span>
            <span>₹{calculations.laborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Channel Cost:</span>
            <span>₹{calculations.channelCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dimout Cost:</span>
            <span>₹{calculations.dimoutCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sierra Cost:</span>
            <span>₹{calculations.sierraCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total:</span>
            <span>
              ₹
              {(
                calculations.totalLeather +
                calculations.laborCost +
                calculations.channelCost +
                calculations.dimoutCost +
                calculations.sierraCost
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurtainForm;
