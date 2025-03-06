import React, { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash } from "lucide-react"; // Import Trash icon
import CurtainForm from "./CurtainForm";
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import clsx from "clsx";

interface QuotationItem {
  id: number;
  type: string;
  details: any;
  isOpen: boolean;
  total: number;
}

const QuotationForm: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [items, setItems] = useState<QuotationItem[]>([]);

  const handleAddItem = () => {
    if (!selectedType) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        type: selectedType,
        details: {},
        isOpen: true,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const updateItemTotal = (id: number, total: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, total } : item)));
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case "curtain":
        return "Curtain";
      case "blind":
        return "Blind";
      case "sofa":
        return "Sofa";
      case "mattress":
        return "Mattress";
      default:
        return type;
    }
  };

  const totalQuotationAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        <Typography variant="h6">Quotation Details</Typography>

        <div className="mt-4 flex space-x-4">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Item Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Select Item Type"
            >
              <MenuItem value="">Select Item Type</MenuItem>
              <MenuItem value="curtain">Curtain</MenuItem>
              <MenuItem value="blind">Blind</MenuItem>
              <MenuItem value="sofa">Sofa</MenuItem>
              <MenuItem value="mattress">Mattress</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            startIcon={<Plus />}
          >
            Add Item
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <Card key={item.id} variant="outlined">
              <CardActions
                className={clsx(
                  "flex justify-between items-center px-4 py-3 cursor-pointer",
                  item.isOpen ? "bg-indigo-50" : "bg-white"
                )}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <IconButton size="small">
                    {item.isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </IconButton>
                  <Typography variant="subtitle1">
                    {getItemTypeLabel(item.type)}
                  </Typography>
                </div>

                <div className="flex items-center space-x-4">
                  <Typography variant="body1" fontWeight={600}>
                    ₹{item.total.toFixed(2)}
                  </Typography>
                  <IconButton size="small" color="error" onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling on remove
                    handleRemoveItem(item.id);
                  }}>
                    <Trash className="h-5 w-5" />
                  </IconButton>
                </div>
              </CardActions>

              {item.isOpen && (
                <CardContent className="bg-white border-t border-gray-200">
                  {item.type === "curtain" && (
                    <CurtainForm
                      onTotalChange={(total) => updateItemTotal(item.id, total)}
                    />
                  )}
                  {/* Add other form components for blind, sofa, and mattress */}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-medium text-gray-900">
              <Typography variant="h6">Total Quotation Amount</Typography>
              <Typography variant="h6">₹{totalQuotationAmount.toFixed(2)}</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;
