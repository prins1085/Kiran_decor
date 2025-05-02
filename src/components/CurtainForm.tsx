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
    laborCost2: 0,
    channelType: initialValues?.channelType || "manual",
    channelFeet: 0,
    channelCost: 0,
    channelType2: initialValues?.channelType2 || "manual",
    channelFeet2: 0,
    channelCost2: 0,
    dimoutMeters: 0,
    dimoutCost: 0,
    sheerMeters: 0,
    sheerWidth: initialValues?.sheerWidth || initialValues?.width,
    sheerHeight: initialValues?.sheerHeight || initialValues?.height,
    sheerCost: 0,
    sheerCostAfterDiscount: 0,
    panelCost: 0,
    weightDoriMeters: 0,
    weightDoriCost: 0,
  });

  const [prices, setPrices] = useState({
    perMeter: initialValues?.perMeter || "",
    labor: initialValues?.labor || "",
    channelPerFeet: initialValues?.channelPerFeet || "",
    labor2: initialValues?.labor2 || "",
    channelPerFeet2: initialValues?.channelPerFeet2 || "",
    dimoutPerMeter: initialValues?.dimoutPerMeter || "",
    sheerPerMeter: initialValues?.sheerPerMeter || "",
    sheerDiscountPercentage: initialValues?.sheerDiscountPercentage || "",
    panelMeters: initialValues?.panelMeters || "",
    panelPerMeter: initialValues?.panelPerMeter || "",
    materialDiscountPercentage: initialValues?.materialDiscountPercentage || "",
    motorPrice: initialValues?.motorPrice || "",
    remotePrice: initialValues?.remotePrice || "",
    fittingCost: initialValues?.fittingCost || "",
    motorPrice2: initialValues?.motorPrice2 || "",
    remotePrice2: initialValues?.remotePrice2 || "",
    fittingCost2: initialValues?.fittingCost2 || "",
    weightDoriPerMeter: initialValues?.weightDoriPerMeter || "",
  });

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const parts = Math.round(Number(dimensions.width) / 20);
      const metersPerPart = (Number(dimensions.height) + 15) / 39;
      const totalM = roundToNearestQuarter(parts * metersPerPart);
      const totalWD = roundToNearestQuarter(parts * 1.5);
      const channelF = roundToNearestQuarter(Number(dimensions.width) / 12);
      const channelF2 = roundToNearestQuarter(Number(calculations.sheerWidth) / 12);

      const SheermetersPerPart = (Number(calculations.sheerHeight) + 15) / 39;
      const SheertotalM = roundToNearestQuarter(parts * SheermetersPerPart);

      setCalculations({
        ...calculations,
        numberOfParts: parts,
        meterPerPart: metersPerPart,
        totalMeters: totalM,
        channelFeet: channelF,
        channelFeet2: channelF2,
        dimoutMeters: totalM,
        sheerMeters: SheertotalM,
        weightDoriMeters: totalWD,
      });
    }
  }, [dimensions, calculations.sheerHeight, calculations.sheerWidth, prices.sheerPerMeter]);

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

    const channelFeetCost2 =
      calculations.channelFeet2 * Number(prices.channelPerFeet2 || 0);
    const motorCost2 =
      calculations.channelType2 === "motorized"
        ? Number(prices.motorPrice2 || 0)
        : 0;
    const remoteCost2 =
      calculations.channelType2 === "motorized"
        ? Number(prices.remotePrice2 || 0)
        : 0;
    const fittingCost2 =
      calculations.channelType2 === "motorized"
        ? Number(prices.fittingCost2 || 0)
        : 0;

    const channelCost2 = channelFeetCost2 + motorCost2 + remoteCost2 + fittingCost2;

    const dimoutCost =
      calculations.dimoutMeters * Number(prices.dimoutPerMeter || 0);

    const weightDoriCost =
      calculations.weightDoriMeters * Number(prices.weightDoriPerMeter || 0);

    const sheerCost =
      calculations.sheerMeters * Number(prices.sheerPerMeter || 0);
    const sheerDiscountPercentage = Number(prices.sheerDiscountPercentage || 0);
    const sheerDiscount = (sheerCost * sheerDiscountPercentage) / 100;
    const sheerCostAfterDiscount = Math.max(sheerCost - sheerDiscount, 0);

    const panelCost =
      Number(prices.panelMeters || 0) * Number(prices.panelPerMeter || 0);
    const laborCost = Number(prices.labor || 0);
    const laborCost2 = Number(prices.labor2 || 0);

    setCalculations((prev) => ({
      ...prev,
      totalLeather,
      materialCostAfterDiscount,
      laborCost,
      laborCost2,
      channelCost,
      channelCost2,
      dimoutCost,
      sheerCost,
      sheerCostAfterDiscount,
      panelCost,
      weightDoriCost,
    }));

    const total =
      materialCostAfterDiscount +
      laborCost +
      laborCost2 +
      channelCost +
      channelCost2 +
      dimoutCost +
      sheerCostAfterDiscount +
      panelCost +
      weightDoriCost;
    const details: any = {
      width: dimensions.width,
      height: dimensions.height,
      perMeter: prices.perMeter,
      labor: prices.labor,
      channelPerFeet: prices.channelPerFeet,
      dimoutPerMeter: prices.dimoutPerMeter,
      sheerPerMeter: prices.sheerPerMeter,
      sheerWidth: calculations.sheerWidth,
      sheerHeight: calculations.sheerHeight,
      sheerDiscountPercentage: prices.sheerDiscountPercentage,
      panelMeters: prices.panelMeters,
      panelPerMeter: prices.panelPerMeter,
      channelType: calculations.channelType,
      motorPrice: prices.motorPrice,
      remotePrice: prices.remotePrice,
      fittingCost: prices.fittingCost,
      materialDiscountPercentage: prices.materialDiscountPercentage,
      weightDoriPerMeter: prices.weightDoriPerMeter,
      discount: materialDiscount + sheerDiscount,
      beforeDiscountPrice : materialDiscount + sheerDiscount + total,
      afterDiscountPrice : total,
    };
    if (Number(prices.sheerPerMeter || 0) > 0) {
      details.labor2 = prices.labor2;
      details.channelPerFeet2 = prices.channelPerFeet2;
      details.channelType2 = calculations.channelType2;
      details.motorPrice2 = prices.motorPrice2;
      details.remotePrice2 = prices.remotePrice2;
      details.fittingCost2 = prices.fittingCost2;
    }

    onTotalChange(total, details);
  }, [
    prices,
    calculations.totalMeters,
    calculations.channelFeet,
    calculations.channelFeet2,
    calculations.dimoutMeters,
    calculations.dimoutMeters,
    calculations.sheerMeters,
    calculations.weightDoriMeters,
  ]);

  return (
    <div className="space-y-3">
      {/* ==================== MATERIAL SECTION ================ */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        <div className="space-y-1">
          <Label htmlFor="curtain-width">Width (inches)</Label>
          <Input
            id="curtain-width"
            type="number"
            value={dimensions.width}
            onChange={(e) => {
              setDimensions({ ...dimensions, width: e.target.value })
              setCalculations({ ...calculations, sheerWidth: e.target.value });
            }}
            placeholder="Enter width"
          />
        </div>

        <div className="space-y-1">
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

        <div className="space-y-1">
          <Label htmlFor="material-meters">Total Meters</Label>
          <Input
            id="material-meters"
            type="text"
            value={calculations.totalMeters.toFixed(2)}
            readOnly
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="price-per-meter">Price per Meter</Label>
          <Input
            id="price-per-meter"
            type="number"
            value={prices.perMeter}
            onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
            placeholder="Enter price per meter"
          />
        </div>

        <div className="space-y-1">
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
        <div className="space-y-1">
          <Label htmlFor="price-per-meter">Price per Meter</Label>
          <Input
            id="price-per-meter"
            type="number"
            value={prices.perMeter}
            onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
            placeholder="Enter price per meter"
          />
        </div>

        <div className="space-y-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-border/60 col-span-1">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Dimout Fabric</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="dimout-meters">Total Meters</Label>
                <Input
                  id="dimout-meters"
                  type="text"
                  value={calculations.dimoutMeters.toFixed(2)}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-1">
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

        <Card className="border border-border/60 col-span-2">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Sheer Fabric</h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="space-y-1">
                <Label htmlFor="sheer-meters">Total Meters</Label>
                <Input
                  id="sheer-meters"
                  type="text"
                  value={calculations.sheerMeters.toFixed(2)}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sheer-width">Width (inches)</Label>
                <Input
                  id="sheer-width"
                  type="number"
                  value={calculations.sheerWidth}
                  onChange={(e) =>
                    setCalculations({
                      ...calculations,
                      sheerWidth: e.target.value,
                    })
                  }
                  placeholder="Enter width"
                />
              </div>

              <div className="space-y-1">
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

              <div className="space-y-1">
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

              <div className="space-y-1">
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
            <div className="space-y-1">
              <Label htmlFor="channel-type">Type</Label>
              <Select
                value={calculations.channelType}
                onValueChange={(value) => {
                  if (value === "manual") {
                    // Reset motor-related fields when switching to manual
                    setPrices((prevPrices) => ({
                      ...prevPrices,
                      motorPrice: "",
                      remotePrice: "",
                      fittingCost: "",
                    }));
                  }
                  setCalculations({ ...calculations, channelType: value });
                }}
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

            <div className="space-y-1">
              <Label htmlFor="channel-feet">Total Feet</Label>
              <Input
                id="channel-feet"
                type="text"
                value={calculations.channelFeet.toFixed(2)}
                readOnly
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-1">
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
            <div className="space-y-1">
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
                <div className="space-y-1">
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

                <div className="space-y-1">
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

                <div className="space-y-1">
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

<hr></hr>
          {Number(prices.sheerPerMeter || 0) > 0 && 
           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
           <div className="space-y-1">
             <Label htmlFor="channel-type2">Type</Label>
             <Select
               value={calculations.channelType2}
               onValueChange={(value) => {
                 if (value === "manual") {
                   // Reset motor-related fields when switching to manual
                   setPrices((prevPrices) => ({
                     ...prevPrices,
                     motorPrice2: "",
                     remotePrice2: "",
                     fittingCost2: "",
                   }));
                 }
                 setCalculations({ ...calculations, channelType2: value });
               }}
             >
               <SelectTrigger id="channel-type2">
                 <SelectValue placeholder="Select channel type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="manual">Manual</SelectItem>
                 <SelectItem value="motorized">Motorized</SelectItem>
               </SelectContent>
             </Select>
           </div>

           <div className="space-y-1">
             <Label htmlFor="channel-feet2">Total Feet</Label>
             <Input
               id="channel-feet2"
               type="text"
               value={calculations.channelFeet2.toFixed(2)}
               readOnly
               className="bg-muted/50"
             />
           </div>

           <div className="space-y-1">
             <Label htmlFor="channel-price2">Price per Feet</Label>
             <Input
               id="channel-price2"
               type="number"
               value={prices.channelPerFeet2}
               onChange={(e) =>
                 setPrices({ ...prices, channelPerFeet2: e.target.value })
               }
               placeholder="Enter price"
             />
           </div>
           <div className="space-y-1">
             <Label htmlFor="labor-cost2">Labour Cost</Label>
             <Input
               id="labor-cost2"
               type="number"
               value={prices.labor2}
               onChange={(e) =>
                 setPrices({ ...prices, labor2: e.target.value })
               }
               placeholder="Enter labor cost"
             />
           </div>

           {calculations.channelType2 === "motorized" && (
             <>
               <div className="space-y-1">
                 <Label htmlFor="motor-price2">Motor Price</Label>
                 <Input
                   id="motor-price2"
                   type="number"
                   value={prices.motorPrice2}
                   onChange={(e) =>
                     setPrices({ ...prices, motorPrice2: e.target.value })
                   }
                   placeholder="Enter motor price"
                 />
               </div>

               <div className="space-y-1">
                 <Label htmlFor="remote-price2">Remote Price</Label>
                 <Input
                   id="remote-price2"
                   type="number"
                   value={prices.remotePrice2}
                   onChange={(e) =>
                     setPrices({ ...prices, remotePrice2: e.target.value })
                   }
                   placeholder="Enter remote price"
                 />
               </div>

               <div className="space-y-1">
                 <Label htmlFor="fitting-cost2">Fitting Cost</Label>
                 <Input
                   id="fitting-cost2"
                   type="number"
                   value={prices.fittingCost2}
                   onChange={(e) =>
                     setPrices({ ...prices, fittingCost2: e.target.value })
                   }
                   placeholder="Enter fitting cost"
                 />
               </div>
             </>
           )}
         </div>
          }
        </CardContent>
      </Card>

      {/* ============== PANEL SECTION ============== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Panel</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
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

              <div className="space-y-1">
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

        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Weight Dori</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="dimout-meters">Total Meters</Label>
                <Input
                  id="dimout-meters"
                  type="text"
                  value={calculations.weightDoriMeters.toFixed(2)}
                  readOnly
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="dimout-price">Price per Meter</Label>
                <Input
                  id="dimout-price"
                  type="number"
                  value={prices.weightDoriPerMeter}
                  onChange={(e) =>
                    setPrices({ ...prices, weightDoriPerMeter: e.target.value })
                  }
                  placeholder="Enter price"
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
                {(calculations.laborCost + calculations.laborCost2).toLocaleString("en-IN", {
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
              <span className="text-muted-foreground">Channel Cost 2:</span>
              <span>
                ₹
                {calculations.channelCost2.toLocaleString("en-IN", {
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
                  calculations.laborCost2 +
                  calculations.channelCost +
                  calculations.channelCost2 +
                  calculations.dimoutCost +
                  calculations.sheerCostAfterDiscount +
                  calculations.panelCost +
                  calculations.weightDoriCost
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
