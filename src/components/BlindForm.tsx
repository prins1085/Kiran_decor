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
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface BlindFormProps {
  onTotalChange: (total: number, details?: Record<string, any>) => void;
  initialValues?: Record<string, any>;
}

const BlindForm = ({ onTotalChange, initialValues }: BlindFormProps) => {
  const [blindType, setBlindType] = useState(initialValues?.blindType || "roller");
  const [dimensions, setDimensions] = useState({
    width: initialValues?.dimensions?.width || "",
    height: initialValues?.dimensions?.height || "",
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
    perSqFeet: initialValues?.prices?.perSqFeet || "",
    perMeter: initialValues?.prices?.perMeter || "",
    channelPerSqFeet: initialValues?.prices?.channelPerSqFeet || "",
    fittingCost: initialValues?.prices?.fittingCost || "",
  });

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const width = Number(dimensions.width);
      const height = Number(dimensions.height);
      const totalSqFeet = (width * height) / 144;
      
      let updatedCalculations = {
        totalSqFeet,
        numberOfParts: 0,
        totalMeters: 0,
        channelSqFeet: 0,
        channelCost: 0,
        fabricCost: 0,
        fittingCost: 0,
        totalCost: 0,
      };
      
      if (blindType === "roller") {
        const fittingCost = Number(prices.fittingCost || 0);
        const fabricCost = totalSqFeet * Number(prices.perSqFeet || 0);
        const totalCost = fabricCost + fittingCost;
        
        updatedCalculations = {
          ...updatedCalculations,
          fabricCost,
          fittingCost,
          totalCost,
        };
      } else if (blindType === "roman") {
        const parts = width <= 50 ? 1 : Math.ceil(width / 50);
        const metersPerPart = (height + 15) / 39;
        const totalMeters = parts * metersPerPart;
        const channelSqFeet = totalSqFeet;
        const fabricCost = totalMeters * Number(prices.perMeter || 0);
        const channelCost = channelSqFeet * Number(prices.channelPerSqFeet || 0);
        const fittingCost = Number(prices.fittingCost || 0);
        const totalCost = fabricCost + channelCost + fittingCost;
        
        updatedCalculations = {
          ...updatedCalculations,
          numberOfParts: parts,
          totalMeters,
          channelSqFeet,
          channelCost,
          fabricCost,
          fittingCost,
          totalCost,
        };
      }
      
      setCalculations(updatedCalculations);
      
      onTotalChange(updatedCalculations.totalCost, {
        blindType,
        dimensions,
        prices,
        calculations: updatedCalculations
      });
    }
  }, [dimensions, blindType, prices, onTotalChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="blind-type">Blind Type</Label>
        <Select value={blindType} onValueChange={setBlindType}>
          <SelectTrigger id="blind-type">
            <SelectValue placeholder="Select blind type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roller">Roller</SelectItem>
            <SelectItem value="roman">Roman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="blind-width">Width (inches)</Label>
          <Input
            id="blind-width"
            type="number"
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
            placeholder="Enter width"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="blind-height">Height (inches)</Label>
          <Input
            id="blind-height"
            type="number"
            value={dimensions.height}
            onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
            placeholder="Enter height"
          />
        </div>
      </div>

      {blindType === "roller" ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price-per-sqft">Price per Sq. Feet</Label>
            <Input
              id="price-per-sqft"
              type="number"
              value={prices.perSqFeet}
              onChange={(e) => setPrices({ ...prices, perSqFeet: e.target.value })}
              placeholder="Enter price per sq. feet"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fitting-cost">Fitting Cost</Label>
              <Input
                id="fitting-cost"
                type="number"
                value={prices.fittingCost}
                onChange={(e) => setPrices({ ...prices, fittingCost: e.target.value })}
                placeholder="Enter fitting cost"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total-sqft">Total Sq. Feet</Label>
              <Input
                id="total-sqft"
                type="text"
                value={calculations.totalSqFeet.toFixed(2)}
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="leather-price">Fabric Price per Meter</Label>
              <Input
                id="leather-price"
                type="number"
                value={prices.perMeter}
                onChange={(e) => setPrices({ ...prices, perMeter: e.target.value })}
                placeholder="Enter price per meter"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="channel-price">Channel Price per Sq. Feet</Label>
              <Input
                id="channel-price"
                type="number"
                value={prices.channelPerSqFeet}
                onChange={(e) => setPrices({ ...prices, channelPerSqFeet: e.target.value })}
                placeholder="Enter channel price"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="channel-sqft">Channel Sq. Feet</Label>
              <Input
                id="channel-sqft"
                type="text"
                value={calculations.channelSqFeet.toFixed(2)}
                readOnly
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fitting-cost-roman">Fitting Cost</Label>
              <Input
                id="fitting-cost-roman"
                type="number"
                value={prices.fittingCost}
                onChange={(e) => setPrices({ ...prices, fittingCost: e.target.value })}
                placeholder="Enter fitting cost"
              />
            </div>
          </div>
        </div>
      )}

      <Card className="border-t border-border mt-4 bg-accent/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Total Cost Breakdown</h4>
          
          <div className="space-y-2 text-sm">
            {blindType === "roman" && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fabric Cost:</span>
                  <span>₹{calculations.fabricCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel Cost:</span>
                  <span>₹{calculations.channelCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </>
            )}
            
            {blindType === "roller" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material Cost:</span>
                <span>₹{calculations.fabricCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fitting Cost:</span>
              <span>₹{calculations.fittingCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between font-medium pt-2 mt-2 border-t">
              <span>Total:</span>
              <span className="text-primary font-semibold">
                ₹{calculations.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlindForm;
