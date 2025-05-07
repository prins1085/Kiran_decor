import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface SofaFormProps {
  onTotalChange: (total: number, details?: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

const SofaForm = ({ onTotalChange, initialValues }: SofaFormProps) => {
  const [sofaSize, setSofaSize] = useState(initialValues?.sofaSize || "");
  const [designPattern, setDesignPattern] = useState(
    initialValues?.designPattern || "1.25"
  );
  const [pricePerFoot, setPricePerFoot] = useState(
    initialValues?.pricePerFoot || ""
  );
  const [transportationFee, setTransportationFee] = useState(
    initialValues?.transportationFee || ""
  );
  const [leatherMeter, setLeatherMeter] = useState(
    initialValues?.leatherMeter || ""
  );
  const [leatherPrice, setLeatherPrice] = useState(
    initialValues?.leatherPrice || ""
  );
  const [fabricMeter, setFabricMeter] = useState(
    initialValues?.fabricMeter || ""
  );
  const [fabricPrice, setFabricPrice] = useState(
    initialValues?.fabricPrice || ""
  );
  const [totalCost, setTotalCost] = useState(0);

  // Calculate the total whenever any input changes
  useEffect(() => {
    if (sofaSize && pricePerFoot && designPattern) {
      const sizeInFeet = Number(sofaSize) / 12; // Convert inches to feet
      const materialCost =
        sizeInFeet * Number(designPattern) * Number(pricePerFoot || 0);
      const leatherCost = Number(leatherMeter) * Number(leatherPrice || 0);
      const fabricCost = Number(fabricMeter) * Number(fabricPrice || 0);
      const calculatedTotal =
        materialCost +
        leatherCost +
        fabricCost +
        Number(transportationFee || 0);
      setTotalCost(calculatedTotal);

      const reportsData = [
        {
          DESCRIPTION : "MAIN MATERIAL - SOFA",
          QTY: sizeInFeet * Number(designPattern),
          RATE: Number(pricePerFoot || 0),
          TOTAL: materialCost,
          DISCOUNT: 0,
          FINAL_TOTAL: materialCost,
          TYPE: "FAB"
        },
         {
          DESCRIPTION : "MAIN FABRIC - SOFA",
          QTY: Number(fabricMeter),
          RATE: Number(fabricPrice || 0),
          TOTAL: fabricCost,
          DISCOUNT: 0,
          FINAL_TOTAL: fabricCost,
          TYPE: "FAB"
        },
         {
          DESCRIPTION : "MAIN LEATHER - SOFA",
          QTY: Number(leatherMeter),
          RATE: Number(leatherPrice || 0),
          TOTAL: leatherCost,
          DISCOUNT: 0,
          FINAL_TOTAL: leatherCost,
          TYPE: "FAB"
        },
        {
          DESCRIPTION : "TRANSPORTATION COST - SOFA",
          QTY: 1,
          RATE: transportationFee,
          TOTAL: transportationFee,
          DISCOUNT: 0,
          FINAL_TOTAL: transportationFee,  
          TYPE: "TAIL"
        },
      ]

      const filteredReportsData = reportsData.filter(
        item => Number(item.RATE) > 0
      );

      // Pass both the total and the form details to parent
      onTotalChange(calculatedTotal, {
        sofaSize,
        designPattern,
        pricePerFoot,
        transportationFee,
        leatherMeter,
        leatherPrice,
        fabricMeter,
        fabricPrice,
        sizeInFeet,
        reportsData: filteredReportsData
      });
    } else {
      setTotalCost(0);
      onTotalChange(0, {
        sofaSize,
        designPattern,
        pricePerFoot,
        transportationFee,
      });
    }
  }, [
    sofaSize,
    designPattern,
    pricePerFoot,
    transportationFee,
    leatherMeter,
    leatherPrice,
    fabricMeter,
    fabricPrice,
    // onTotalChange,
  ]);

  return (
    <div className="space-y-3 max-w-full">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="space-y-1">
          <Label htmlFor="sofa-size">Sofa Size (inches)</Label>
          <Input
            id="sofa-size"
            type="number"
            value={sofaSize}
            onChange={(e) => setSofaSize(e.target.value)}
            placeholder="Enter sofa size"
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="design-pattern">Design Pattern</Label>
          <Input
            id="design-pattern"
            type="number"
            value={designPattern}
            onChange={(e) => setDesignPattern(e.target.value)}
            placeholder="Enter design pattern multiplier"
            step="0.01"
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="price-per-foot">Price per Foot</Label>
          <Input
            id="price-per-foot"
            type="number"
            value={pricePerFoot}
            onChange={(e) => setPricePerFoot(e.target.value)}
            placeholder="Enter price per foot"
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="transportation-fee">Transportation Fee</Label>
          <Input
            id="transportation-fee"
            type="number"
            value={transportationFee}
            onChange={(e) => setTransportationFee(e.target.value)}
            placeholder="Enter transportation fee"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Fabric</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="fabric-meters">Total Meters</Label>
                <Input
                  id="fabric-meters"
                  type="text"
                  value={fabricMeter}
                  onChange={(e) => setFabricMeter(e.target.value)}
                  placeholder="Enter Meter"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fabric-price">Price per Meter</Label>
                <Input
                  id="fabric-price"
                  type="number"
                  value={fabricPrice}
                  onChange={(e) => setFabricPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-sm">Leather</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="leather-meters">Total Meters</Label>
                <Input
                  id="leather-meters"
                  type="text"
                  value={leatherMeter}
                  onChange={(e) => setLeatherMeter(e.target.value)}
                  placeholder="Enter Meter"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="leather-price">Price per Meter</Label>
                <Input
                  id="leather-price"
                  type="number"
                  value={leatherPrice}
                  onChange={(e) => setLeatherPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <Label htmlFor="sofa-feet">Size in Feet</Label>
          <Input
            id="sofa-feet"
            type="text"
            value={sofaSize ? (Number(sofaSize) / 12).toFixed(2) : ""}
            readOnly
            className="bg-muted/50 w-full"
          />
        </div>
      </div> */}

      <Card className="border-t border-border mt-4 bg-accent/30 w-full">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Cost Breakdown</h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material Cost:</span>
              <span>
                ₹
                {(
                  (Number(sofaSize) / 12) *
                  Number(designPattern) *
                  Number(pricePerFoot || 0)
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Leather Cost:</span>
              <span>
                ₹
                {(
                  Number(leatherMeter) * Number(leatherPrice || 0)
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Fabric Cost:</span>
              <span>
                ₹
                {(
                  Number(fabricMeter) * Number(fabricPrice || 0)
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Transportation:</span>
              <span>
                ₹
                {Number(transportationFee || 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between font-medium pt-2 mt-2 border-t">
              <span>Total:</span>
              <span className="text-primary font-semibold">
                ₹
                {totalCost.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SofaForm;
