import { useState, useEffect } from "react";
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

interface MattressFormProps {
  onTotalChange: (total: number, details?: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

const MattressForm = ({ onTotalChange, initialValues }: MattressFormProps) => {
  const [company, setCompany] = useState(initialValues?.company || "sleepwell");
  const [width, setWidth] = useState(initialValues?.width || "");
  const [height, setHeight] = useState(initialValues?.height || "");
  const [displayHeight, setDisplayHeight] = useState(
    initialValues?.displayHeight || ""
  );
  const [pricePerUnit, setPricePerUnit] = useState(
    initialValues?.pricePerUnit || ""
  );
  const [transportationFee, setTransportationFee] = useState(
    initialValues?.transportationFee || ""
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    initialValues?.discountPercentage || ""
  );
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (width && height && pricePerUnit) {
      let area = 0;
      if (company === "sleepwell") {
        area = (Number(width) * Number(height)) / 1550.5; // Convert to sq.mt
      } else if (company === "kingkoil") {
        area = (Number(width) * Number(height)) / 144; // Convert to sq.ft
      }

      const materialCost = area * Number(pricePerUnit);
      const discountAmount =
        (materialCost * Number(discountPercentage || 0)) / 100;
      const discountedMaterialCost = materialCost - discountAmount;

      const calculatedTotal =
        discountedMaterialCost + Number(transportationFee || 0);
      setTotalCost(calculatedTotal);

      // Pass both the total and the form details to parent
      onTotalChange(calculatedTotal, {
        company,
        width,
        height,
        displayHeight,
        pricePerUnit,
        transportationFee,
        discountPercentage,
        area,
        materialCost,
        discountAmount,
        discount: discountAmount,
        discountedMaterialCost,
      });
    } else {
      setTotalCost(0);
      onTotalChange(0, {
        company,
        width,
        height,
        displayHeight,
        pricePerUnit,
        transportationFee,
        discountPercentage,
      });
    }
  }, [
    company,
    width,
    height,
    displayHeight,
    pricePerUnit,
    transportationFee,
    discountPercentage,
    // onTotalChange,
  ]);

  return (
    <div className="space-y-3 max-w-full">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="space-y-1">
          <Label htmlFor="mattress-company">Company</Label>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger id="mattress-company" className="w-full">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sleepwell">Sleepwell</SelectItem>
              <SelectItem value="kingkoil">King Koil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="mattress-width">Width (inches)</Label>
          <Input
            id="mattress-width"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Enter width"
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="mattress-length">Length (inches)</Label>
          <Input
            id="mattress-length"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter length"
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="mattress-height">Height (inches)</Label>
          <Input
            id="mattress-height"
            type="number"
            value={displayHeight}
            onChange={(e) => setDisplayHeight(e.target.value)}
            placeholder="Enter height"
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-1">
          <Label htmlFor="price-per-unit">
            Price per {company === "sleepwell" ? "sq.mt" : "sq.ft"}
          </Label>
          <Input
            id="price-per-unit"
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            placeholder={`Enter price per ${
              company === "sleepwell" ? "sq.mt" : "sq.ft"
            }`}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="material-discount">Discount (%)</Label>
          <Input
            id="material-discount"
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="Enter discount percentage"
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

      {/* <div className="space-y-1">
        <Label htmlFor="calculated-area">
          Calculated Area ({company === "sleepwell" ? "sq.mt" : "sq.ft"})
        </Label>
        <Input
          id="calculated-area"
          type="text"
          value={
            width && height
              ? company === "sleepwell"
                ? ((Number(width) * Number(height)) / 1550.5).toFixed(2)
                : ((Number(width) * Number(height)) / 144).toFixed(2)
              : ""
          }
          readOnly
          className="bg-muted/50 w-full"
        />
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
                  Number(pricePerUnit) *
                  ((Number(width) * Number(height)) /
                    (company === "sleepwell" ? 1550.5 : 144))
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount ({discountPercentage || 0}%):
              </span>
              <span>
                -₹
                {(
                  (Number(pricePerUnit) *
                    ((Number(width) * Number(height)) /
                      (company === "sleepwell" ? 1550.5 : 144)) *
                    Number(discountPercentage || 0)) /
                  100
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Material Cost After Discount:</span>
              <span className="text-primary">
                ₹
                {(totalCost - Number(transportationFee || 0)).toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 2 }
                )}
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

export default MattressForm;
