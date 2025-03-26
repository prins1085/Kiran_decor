import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCustomer, Customer } from "@/context/CustomerContext";
import QuotationForm from "./QuotationForm";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  onClose: () => void;
  editingCustomer?: Customer | null;
}

const CustomerForm = ({ onClose, editingCustomer }: CustomerFormProps) => {
  const { addCustomer, updateCustomer } = useCustomer();
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    architect: "",
  });
  const [quotationData, setQuotationData] = useState<any[]>([]);

  // Deep clone function to properly clone nested objects
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

  // Initialize form data from editingCustomer with proper deep cloning
  useEffect(() => {
    if (editingCustomer) {
      setCustomerData({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        architect: editingCustomer.architect,
      });

      // Properly clone the items with all details
      if (editingCustomer.quotations && editingCustomer.quotations.length > 0) {
        const items = editingCustomer.quotations[0].items || [];
        // Deep clone to ensure all nested properties are preserved
        const clonedItems = deepClone(items);
        console.log("Setting quotation data for editing:", clonedItems);
        setQuotationData(clonedItems);
      }
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure all item details are preserved
    const quotationItems = deepClone(quotationData);

    // Create a properly structured quotation object with all item details
    const quotation = {
      id: editingCustomer?.quotations?.[0]?.id || Date.now().toString(),
      date: editingCustomer?.quotations?.[0]?.date || new Date().toISOString(),
      items: quotationItems,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        ...editingCustomer,
        ...customerData,
        quotations: [quotation],
      });
    } else {
      const newCustomer = {
        ...customerData,
        id: Date.now().toString(),
        quotations: [quotation],
      };

      addCustomer(newCustomer);
    }

    onClose();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center px-4 sm:px-8 py-6 border-b">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {editingCustomer ? "Edit Customer" : "New Customer"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={customerData.phone}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="architect">Architect</Label>
                <Input
                  id="architect"
                  placeholder="Enter architect name (optional)"
                  value={customerData.architect}
                  onChange={(e) =>
                    setCustomerData({
                      ...customerData,
                      architect: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <QuotationForm
              initialItems={quotationData}
              onQuotationChange={setQuotationData}
            />
          </motion.div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCustomer ? "Update Customer" : "Create Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
