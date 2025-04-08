import React, { useState, useEffect } from "react";
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
import { useMattress } from "@/context/MattressContext";

interface MattressFormProps {
  onTotalChange: (total: number, details?: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

const MattressForm = ({ onTotalChange, initialValues }: MattressFormProps) => {
  const { mattressProducts } = useMattress();

  // Existing state variables
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

  // New state variables for product and size selection
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Derived data based on selected company
  const filteredProducts = mattressProducts.filter(
    (product) => product.company === company
  );

  // Derived data based on selected product
  const filteredSizes =
    (selectedProduct &&
      filteredProducts
        .filter((p) => p.productName === selectedProduct)
        .map((p) => p.size)) ||
    [];

  // Handle product selection
  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    setSelectedSize(""); // Reset size when product changes
    setPricePerUnit(""); // Reset price when product changes
  };

  // Handle size selection
  const handleSizeChange = (value: string) => {
    setSelectedSize(value);

    // Automatically set the price based on the selected size
    const selectedProductDetails = filteredProducts.find(
      (p) => p.productName === selectedProduct && p.size === value
    );
    if (selectedProductDetails) {
      setPricePerUnit(selectedProductDetails.price.toString());
    }
  };

  // Existing calculation logic
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
        beforeDiscountPrice: discountedMaterialCost,
        afterDiscountPrice: calculatedTotal
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
  ]);

  return (
    <div className="space-y-3 max-w-full">
      {/* Company Selection */}
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

        {/* Product Selection */}
        <div className="space-y-1">
          <Label htmlFor="mattress-product">Product</Label>
          <Select value={selectedProduct} onValueChange={handleProductChange}>
            <SelectTrigger id="mattress-product" className="w-full">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(filteredProducts.map((p) => p.productName))
              ).map((productName) => (
                <SelectItem key={productName} value={productName}>
                  {productName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selection */}
        <div className="space-y-1">
          <Label htmlFor="mattress-size">Size</Label>
          <Select value={selectedSize} onValueChange={handleSizeChange}>
            <SelectTrigger id="mattress-size" className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {filteredSizes.map((size, index) => (
                <SelectItem key={index} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Per Unit */}
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
      </div>

      {/* Height and Display Height Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Width Input */}
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

      {/* Discount and Transportation Fee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Cost Breakdown Card */}
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
