import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface CurtainFormProps {
  onTotalChange: (total: number, details: Record<string, any>) => void;
  initialValues?: Record<string, any>; // for editing existing data
}

const CurtainForm = ({ onTotalChange, initialValues }: CurtainFormProps) => {
  const [dimensions, setDimensions] = useState({
    width: initialValues?.width || "",
    height: initialValues?.height || "",
  });

  const [calculations, setCalculations] = useState({
    numberOfParts: 0,
    meterPerPart: 0,
    totalMeters: 0,
    totalLeather: 0,
    laborCost: 0,
    channelType: initialValues?.channelType || "manual",
    channelFeet: 0,
    channelCost: 0,
    dimoutMeters: 0,
    dimoutCost: 0,
    sheerMeters: 0,
    sheerCost: 0,
  });

  const [prices, setPrices] = useState({
    perMeter: initialValues?.perMeter || "",
    labor: initialValues?.labor || "",
    channelPerFeet: initialValues?.channelPerFeet || "",
    dimoutPerMeter: initialValues?.dimoutPerMeter || "",
    sheerPerMeter: initialValues?.sheerPerMeter || "",
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
        sheerMeters: totalM,
      });
    }
  }, [dimensions]);

  useEffect(() => {
    const totalLeather =
      calculations.totalMeters * Number(prices.perMeter || 0);
    const channelCost =
      calculations.channelFeet * Number(prices.channelPerFeet || 0);
    const dimoutCost =
      calculations.dimoutMeters * Number(prices.dimoutPerMeter || 0);
    const sheerCost =
      calculations.sheerMeters * Number(prices.sheerPerMeter || 0);
    const laborCost = Number(prices.labor || 0);

    setCalculations((prev) => ({
      ...prev,
      totalLeather,
      laborCost,
      channelCost,
      dimoutCost,
      sheerCost,
    }));

    const total =
      totalLeather + laborCost + channelCost + dimoutCost + sheerCost;
    const details = {
      width: dimensions.width,
      height: dimensions.height,
      perMeter: prices.perMeter,
      labor: prices.labor,
      channelPerFeet: prices.channelPerFeet,
      dimoutPerMeter: prices.dimoutPerMeter,
      sheerPerMeter: prices.sheerPerMeter,
      channelType: calculations.channelType,
    };

    onTotalChange(total, details);
  }, [
    prices,
    calculations.totalMeters,
    calculations.channelFeet,
    calculations.dimoutMeters,
    calculations.sheerMeters,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="curtain-width">Width (inches)</Label>
          <Input
            id="curtain-width"
            type="number"
            value={dimensions.width}
            onChange={(e) =>
              setDimensions({ ...dimensions, width: e.target.value })
            }
            placeholder="Enter width"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curtain-height">Height (inches)</Label>
          <Input
            id="curtain-height"
            type="number"
            value={dimensions.height}
            onChange={(e) =>
              setDimensions({ ...dimensions, height: e.target.value })
            }
            placeholder="Enter height"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price-per-meter">Price per Meter</Label>
          <Input
            id="price-per-meter"
            type="number"
            value={prices.perMeter}
            onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
            placeholder="Enter price per meter"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* <div className="space-y-2">
          <Label htmlFor="price-per-meter">Price per Meter</Label>
          <Input
            id="price-per-meter"
            type="number"
            value={prices.perMeter}
            onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
            placeholder="Enter price per meter"
          />
        </div> */}

        {/* <div className="space-y-2">
          <Label htmlFor="labor-cost">Labour Cost</Label>
          <Input
            id="labor-cost"
            type="number"
            value={prices.labor}
            onChange={(e) => setPrices({ ...prices, labor: e.target.value })}
            placeholder="Enter labor cost"
          />
        </div> */}
      </div>

      <Card className="border border-border/60">
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium text-sm">Channel</h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel-type">Type</Label>
              <Select
                value={calculations.channelType}
                onValueChange={(value) =>
                  setCalculations({ ...calculations, channelType: value })
                }
              >
                <SelectTrigger id="channel-type">
                  <SelectValue placeholder="Select channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="motorized">Motorized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="channel-feet">Total Feet</Label>
              <Input
                id="channel-feet"
                type="text"
                value={calculations.channelFeet.toFixed(2)}
                readOnly
                className="bg-muted/50"
              />
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="channel-price">Price per Feet</Label>
              <Input
                id="channel-price"
                type="number"
                value={prices.channelPerFeet}
                onChange={(e) =>
                  setPrices({ ...prices, channelPerFeet: e.target.value })
                }
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
          <Label htmlFor="labor-cost">Labour Cost</Label>
          <Input
            id="labor-cost"
            type="number"
            value={prices.labor}
            onChange={(e) => setPrices({ ...prices, labor: e.target.value })}
            placeholder="Enter labor cost"
          />
        </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Dimout</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dimout-meters">Total Meters</Label>
                <Input
                  id="dimout-meters"
                  type="text"
                  value={calculations.dimoutMeters.toFixed(2)}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimout-price">Price per Meter</Label>
                <Input
                  id="dimout-price"
                  type="number"
                  value={prices.dimoutPerMeter}
                  onChange={(e) =>
                    setPrices({ ...prices, dimoutPerMeter: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Sheer</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sheer-meters">Total Meters</Label>
                <Input
                  id="sheer-meters"
                  type="text"
                  value={calculations.sheerMeters.toFixed(2)}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sheer-price">Price per Meter</Label>
                <Input
                  id="sheer-price"
                  type="number"
                  value={prices.sheerPerMeter}
                  onChange={(e) =>
                    setPrices({ ...prices, sheerPerMeter: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t border-border mt-4 bg-accent/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Cost Breakdown</h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material Cost:</span>
              <span>
                ₹
                {calculations.totalLeather.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Labor Cost:</span>
              <span>
                ₹
                {calculations.laborCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Channel Cost:</span>
              <span>
                ₹
                {calculations.channelCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Dimout Cost:</span>
              <span>
                ₹
                {calculations.dimoutCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Sheer Cost:</span>
              <span>
                ₹
                {calculations.sheerCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between font-medium pt-2 mt-2 border-t">
              <span>Total:</span>
              <span className="text-primary font-semibold">
                ₹
                {(
                  calculations.totalLeather +
                  calculations.laborCost +
                  calculations.channelCost +
                  calculations.dimoutCost +
                  calculations.sheerCost
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurtainForm;
