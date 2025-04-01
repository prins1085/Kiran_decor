
import { useState, useCallback, useEffect } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import CurtainForm from "./CurtainForm";
import BlindForm from "./BlindForm";
import SofaForm from "./SofaForm";
import MattressForm from "./MattressForm";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface QuotationItem {
  id: number;
  type: string;
  name: string;
  isOpen: boolean;
  total: number;
  details?: Record<string, any>;
}

const QuotationForm = ({ initialItems = [], onQuotationChange }: { initialItems?: QuotationItem[], onQuotationChange?: (items: QuotationItem[]) => void }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([]);
  
  // Deep clone function to ensure all nested properties are preserved
  const deepClone = (obj: any): any => {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    
    const cloned: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  };
  
  // Initialize items from props and ensure they persist
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      // Make sure each item has the isOpen property and details
      const itemsWithDetails = initialItems.map(item => ({
        ...item,
        isOpen: item.isOpen !== undefined ? item.isOpen : true,
        details: item.details || {}
      }));
      
      console.log("Setting initial items in QuotationForm:", itemsWithDetails);
      setItems(itemsWithDetails);
    }
  }, [initialItems]);

  const handleAddItem = () => {
    if (!selectedType || !itemName.trim()) return;

    const newItem = {
      id: Date.now(),
      type: selectedType,
      name: itemName.trim(),
      isOpen: true,
      total: 0,
      details: {},
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setSelectedType("");
    setItemName("");

    if (onQuotationChange) {
      onQuotationChange(updatedItems);
    }
  };

  const handleRemoveItem = useCallback((id: number, event: React.MouseEvent) => {
    // Prevent event propagation to stop the popup from closing
    event.stopPropagation();
    event.preventDefault();
    
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    
    if (onQuotationChange) {
      onQuotationChange(updatedItems);
    }
  }, [items, onQuotationChange]);

  const toggleItem = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };
  
  const updateItemTotal = useCallback((id: number, total: number, details?: Record<string, any>) => {
    setItems((prevItems) => {
      // Create a deep clone of the previous items to ensure all nested properties are preserved
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          // Preserve existing details and merge with new details
          const mergedDetails = details 
            ? { ...(item.details || {}), ...deepClone(details) }
            : item.details;
          
          console.log(`Updating item ${id} with total: ${total} and details:`, mergedDetails);
          
          return { 
            ...item, 
            total,
            details: mergedDetails
          };
        }
        return item;
      });
      
      if (onQuotationChange) {
        onQuotationChange(updatedItems);
      }
      
      return updatedItems;
    });
  }, [onQuotationChange]);

  const totalQuotationAmount = items.reduce((sum, item) => sum + item.total, 0);

  // Helper function to get the correct form component based on the item type
  const renderItemForm = useCallback((item: QuotationItem) => {
    if (!item.isOpen) return null;
    
    // Ensure we're passing a deep clone of the initial values to avoid reference issues
    const initialValues = deepClone(item.details || {});
    console.log(`Rendering form for ${item.type} with initial values:`, initialValues);
    
    const commonProps = {
      onTotalChange: (total: number, details?: Record<string, any>) => updateItemTotal(item.id, total, details),
      initialValues: initialValues
    };
    
    switch (item.type) {
      case "curtain":
        return <CurtainForm {...commonProps} />;
      case "blind":
        return <BlindForm {...commonProps} />;
      case "sofa":
        return <SofaForm {...commonProps} />;
      case "mattress":
        return <MattressForm {...commonProps} />;
      default:
        return null;
    }
  }, [updateItemTotal]);

  return (
    <div className="space-y-3">
      <div className="pt-6 border-t">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="space-y-2 w-full sm:w-auto sm:min-w-[180px]">
            <Label htmlFor="item-type">Item Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="item-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="curtain">Curtain</SelectItem>
                <SelectItem value="blind">Blind</SelectItem>
                <SelectItem value="sofa">Sofa</SelectItem>
                <SelectItem value="mattress">Mattress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full sm:w-auto sm:min-w-[180px]">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={handleAddItem} 
            className="gap-1 whitespace-nowrap w-full sm:w-auto"
            disabled={!selectedType || !itemName.trim()}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer border-b bg-accent/50 hover:bg-accent/70 transition-colors"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {item.isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.type})</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">
                        ₹{item.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleRemoveItem(item.id, e)}
                        type="button" // Make sure it doesn't submit the form
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {item.isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="p-6 overflow-x-auto">
                          {renderItemForm(item)}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              No items added yet. Add an item to create a quotation.
            </div>
          )}
        </div>

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pt-4 border-t flex justify-between items-center"
          >
            <span className="text-lg font-medium">Total Quotation Amount</span>
            <span className="text-xl font-bold text-primary">
              ₹{totalQuotationAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;
