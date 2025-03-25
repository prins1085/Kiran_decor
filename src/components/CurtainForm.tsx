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
import { roundToNearestQuarter } from "@/utils/roundQuarterNumber";

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
    materialCostAfterDiscount: 0,
    laborCost: 0,
    channelType: initialValues?.channelType || "manual",
    channelFeet: 0,
    channelCost: 0,
    dimoutMeters: 0,
    dimoutCost: 0,
    sheerMeters: 0,
    sheerHeight: initialValues?.sheerHeight || initialValues?.height,
    sheerCost: 0,
    sheerCostAfterDiscount: 0,
    panelCost: 0,
  });

  const [prices, setPrices] = useState({
    perMeter: initialValues?.perMeter || "",
    labor: initialValues?.labor || "",
    channelPerFeet: initialValues?.channelPerFeet || "",
    dimoutPerMeter: initialValues?.dimoutPerMeter || "",
    sheerPerMeter: initialValues?.sheerPerMeter || "",
    sheerDiscountPercentage: initialValues?.sheerDiscountPercentage || "",
    panelMeters: initialValues?.panelMeters || "",
    panelPerMeter: initialValues?.panelPerMeter || "",
    materialDiscountPercentage: initialValues?.materialDiscountPercentage || "",
    motorPrice: initialValues?.motorPrice || "",
    remotePrice: initialValues?.remotePrice || "",
    fittingCost: initialValues?.fittingCost || "",
  });

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const parts = Math.round(Number(dimensions.width) / 20);
      const metersPerPart = (Number(dimensions.height) + 15) / 39;
      const totalM = roundToNearestQuarter(parts * metersPerPart);
      const channelF = roundToNearestQuarter(Number(dimensions.width) / 12);

      const SheermetersPerPart = (Number(calculations.sheerHeight) + 15) / 39;
      const SheertotalM = roundToNearestQuarter(parts * SheermetersPerPart);

      setCalculations({
        ...calculations,
        numberOfParts: parts,
        meterPerPart: metersPerPart,
        totalMeters: totalM,
        channelFeet: channelF,
        dimoutMeters: totalM,
        sheerMeters: SheertotalM,
      });
    }
  }, [dimensions, calculations.sheerHeight]);

  useEffect(() => {
    const totalLeather =
      calculations.totalMeters * Number(prices.perMeter || 0);
    const discountPercentage = Number(prices.materialDiscountPercentage || 0);
    const materialDiscount = (totalLeather * discountPercentage) / 100;
    const materialCostAfterDiscount = Math.max(
      totalLeather - materialDiscount,
      0
    );

    const channelFeetCost =
      calculations.channelFeet * Number(prices.channelPerFeet || 0);
    const motorCost =
      calculations.channelType === "motorized"
        ? Number(prices.motorPrice || 0)
        : 0;
    const remoteCost =
      calculations.channelType === "motorized"
        ? Number(prices.remotePrice || 0)
        : 0;
    const fittingCost =
      calculations.channelType === "motorized"
        ? Number(prices.fittingCost || 0)
        : 0;

    const channelCost = channelFeetCost + motorCost + remoteCost + fittingCost;

    const dimoutCost =
      calculations.dimoutMeters * Number(prices.dimoutPerMeter || 0);

    const sheerCost =
      calculations.sheerMeters * Number(prices.sheerPerMeter || 0);
    const sheerDiscountPercentage = Number(prices.sheerDiscountPercentage || 0);
    const sheerDiscount = (sheerCost * sheerDiscountPercentage) / 100;
    const sheerCostAfterDiscount = Math.max(sheerCost - sheerDiscount, 0);

    const panelCost =
      Number(prices.panelMeters || 0) * Number(prices.panelPerMeter || 0);
    const laborCost = Number(prices.labor || 0);

    setCalculations((prev) => ({
      ...prev,
      totalLeather,
      materialCostAfterDiscount,
      laborCost,
      channelCost,
      dimoutCost,
      sheerCost,
      sheerCostAfterDiscount,
      panelCost,
    }));

    const total =
      materialCostAfterDiscount +
      laborCost +
      channelCost +
      dimoutCost +
      sheerCostAfterDiscount +
      panelCost;
    const details = {
      width: dimensions.width,
      height: dimensions.height,
      perMeter: prices.perMeter,
      labor: prices.labor,
      channelPerFeet: prices.channelPerFeet,
      dimoutPerMeter: prices.dimoutPerMeter,
      sheerPerMeter: prices.sheerPerMeter,
      sheerHeight: calculations.sheerHeight,
      sheerDiscountPercentage: prices.sheerDiscountPercentage,
      panelMeters: prices.panelMeters,
      panelPerMeter: prices.panelPerMeter,
      channelType: calculations.channelType,
      motorPrice: prices.motorPrice,
      remotePrice: prices.remotePrice,
      fittingCost: prices.fittingCost,
      materialDiscountPercentage: prices.materialDiscountPercentage,
    };

    onTotalChange(total, details);
  }, [
    prices,
    calculations.totalMeters,
    calculations.channelFeet,
    calculations.dimoutMeters,
    calculations.sheerMeters,
    calculations.sheerHeight,
  ]);

  return (
    <div className="space-y-6">
      {/* ==================== MATERIAL SECTION ================ */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
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
            onChange={(e) => {
              setDimensions({ ...dimensions, height: e.target.value });
              setCalculations({ ...calculations, sheerHeight: e.target.value });
            }}
            placeholder="Enter height"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material-meters">Total Meters</Label>
          <Input
            id="material-meters"
            type="text"
            value={calculations.totalMeters.toFixed(2)}
            readOnly
            className="bg-muted/50"
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

        <div className="space-y-2">
          <Label htmlFor="material-discount">Discount (%)</Label>
          <Input
            id="material-discount"
            type="number"
            value={prices.materialDiscountPercentage}
            onChange={(e) =>
              setPrices({
                ...prices,
                materialDiscountPercentage: e.target.value,
              })
            }
            placeholder="Enter discount percentage"
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      </div> */}

      {/* ============== DIMOUT AND SHEER SECTION ============== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Dimout Fabric</h4>

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
            <h4 className="font-medium text-sm">Sheer Fabric</h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                <Label htmlFor="sheer-height">Height (inches)</Label>
                <Input
                  id="sheer-height"
                  type="number"
                  value={calculations.sheerHeight}
                  onChange={(e) =>
                    setCalculations({
                      ...calculations,
                      sheerHeight: e.target.value,
                    })
                  }
                  placeholder="Enter height"
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

              <div className="space-y-2">
                <Label htmlFor="sheer-discount">Discount (%)</Label>
                <Input
                  id="sheer-discount"
                  type="number"
                  value={prices.sheerDiscountPercentage}
                  onChange={(e) =>
                    setPrices({
                      ...prices,
                      sheerDiscountPercentage: e.target.value,
                    })
                  }
                  placeholder="Enter discount percentage"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============== CHANNEL SECTION ================ */}
      <Card className="border border-border/60">
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium text-sm">Channel</h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="channel-feet">Total Feet</Label>
              <Input
                id="channel-feet"
                type="text"
                value={calculations.channelFeet.toFixed(2)}
                readOnly
                className="bg-muted/50"
              />
            </div>

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
                onChange={(e) =>
                  setPrices({ ...prices, labor: e.target.value })
                }
                placeholder="Enter labor cost"
              />
            </div>

            {calculations.channelType === "motorized" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="motor-price">Motor Price</Label>
                  <Input
                    id="motor-price"
                    type="number"
                    value={prices.motorPrice}
                    onChange={(e) =>
                      setPrices({ ...prices, motorPrice: e.target.value })
                    }
                    placeholder="Enter motor price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remote-price">Remote Price</Label>
                  <Input
                    id="remote-price"
                    type="number"
                    value={prices.remotePrice}
                    onChange={(e) =>
                      setPrices({ ...prices, remotePrice: e.target.value })
                    }
                    placeholder="Enter remote price"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitting-cost">Fitting Cost</Label>
                  <Input
                    id="fitting-cost"
                    type="number"
                    value={prices.fittingCost}
                    onChange={(e) =>
                      setPrices({ ...prices, fittingCost: e.target.value })
                    }
                    placeholder="Enter fitting cost"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ============== PANEL SECTION ============== */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Panel</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panel-meters">Panel Meters</Label>
                <Input
                  id="panel-meters"
                  type="number"
                  value={prices.panelMeters}
                  onChange={(e) =>
                    setPrices({ ...prices, panelMeters: e.target.value })
                  }
                  placeholder="Enter panel meters"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panel-price">Price per Meter</Label>
                <Input
                  id="panel-price"
                  type="number"
                  value={prices.panelPerMeter}
                  onChange={(e) =>
                    setPrices({ ...prices, panelPerMeter: e.target.value })
                  }
                  placeholder="Enter panel price per meter"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============== COST BREAKDOWN SECTION ============== */}
      <Card className="border-t border-border mt-4 bg-accent/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Cost Breakdown</h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fabric Cost:</span>
              <span>
                ₹
                {calculations.totalLeather.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount ({prices.materialDiscountPercentage || 0}%):
              </span>
              <span>
                - ₹
                {(
                  (calculations.totalLeather *
                    Number(prices.materialDiscountPercentage || 0)) /
                  100
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Fabric Cost After Discount:</span>
              <span className="text-primary">
                ₹
                {calculations.materialCostAfterDiscount.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
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

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Sheer Discount ({prices.sheerDiscountPercentage || 0}%):
              </span>
              <span>
                - ₹
                {(
                  (calculations.sheerCost *
                    Number(prices.sheerDiscountPercentage || 0)) /
                  100
                ).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Sheer Cost After Discount:</span>
              <span className="text-primary">
                ₹
                {calculations.sheerCostAfterDiscount.toLocaleString("en-IN", {
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
              <span className="text-muted-foreground">Panel Cost:</span>
              <span>
                ₹
                {calculations.panelCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between font-medium pt-2 mt-2 border-t">
              <span>Total:</span>
              <span className="text-primary font-semibold">
                ₹
                {(
                  calculations.materialCostAfterDiscount +
                  calculations.laborCost +
                  calculations.channelCost +
                  calculations.dimoutCost +
                  calculations.sheerCostAfterDiscount +
                  calculations.panelCost
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
