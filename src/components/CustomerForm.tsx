import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";
import QuotationForm from "./QuotationForm";
import { TextField, Button, Grid, IconButton } from "@mui/material";

interface Customer {
  id: string;
  name: string;
  phone: string;
  architect: string;
  quotations?: any[];
}

interface CustomerFormProps {
  onClose: () => void;
  editingCustomer?: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onClose, editingCustomer }) => {
  const { addCustomer, updateCustomer } = useCustomer();
  const [customerData, setCustomerData] = useState<Omit<Customer, "id" | "quotations">>({
    name: "",
    phone: "",
    architect: "",
  });

  useEffect(() => {
    if (editingCustomer) {
      setCustomerData({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        architect: editingCustomer.architect,
      });
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, { ...editingCustomer, ...customerData });
    } else {
      addCustomer({
        ...customerData,
        id: Date.now().toString(),
        quotations: [],
      });
    }
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {editingCustomer ? "Edit Customer" : "New Customer"}
        </h3>
        <IconButton onClick={onClose} color="default">
          <X className="h-6 w-6" />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Responsive Grid for 3 inputs in one row */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              size="small"
              value={customerData.name}
              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
              required
              sx={{ minWidth: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              size="small"
              value={customerData.phone}
              onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
              required
              sx={{ minWidth: 0 }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Architect Name"
              variant="outlined"
              fullWidth
              size="small"
              value={customerData.architect}
              onChange={(e) => setCustomerData({ ...customerData, architect: e.target.value })}
              sx={{ minWidth: 0 }}
            />
          </Grid>
        </Grid>

        <QuotationForm />

        <div className="flex justify-end space-x-3">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editingCustomer ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
