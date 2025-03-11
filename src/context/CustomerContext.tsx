
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export interface QuotationItem {
  id: number;
  type: string;
  name: string;
  isOpen: boolean;
  total: number;
  details?: Record<string, any>;
}

export interface Quotation {
  id: string;
  date: string;
  items: QuotationItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  architect: string;
  quotations: Quotation[];
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Customer) => void;
  deleteCustomer: (id: string) => void;
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedCustomers = localStorage.getItem("customers");
      if (savedCustomers) {
        const parsedCustomers = JSON.parse(savedCustomers);
        
        // Ensure all items have a details property
        const customersWithDetails = parsedCustomers.map((customer: Customer) => {
          if (customer.quotations && customer.quotations.length > 0) {
            const updatedQuotations = customer.quotations.map(quotation => {
              const updatedItems = quotation.items.map(item => ({
                ...item,
                details: item.details || {}
              }));
              return { ...quotation, items: updatedItems };
            });
            return { ...customer, quotations: updatedQuotations };
          }
          return customer;
        });
        
        setCustomers(customersWithDetails);
        console.log("Loaded customers from localStorage:", customersWithDetails);
      } else {
        setCustomers([]);
        console.log("No customers found in localStorage");
      }
    } catch (error) {
      console.error("Failed to load customers from localStorage:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load your customers. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        // Deep clone customers to preserve all nested properties
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
        
        const customersToSave = deepClone(customers);
        localStorage.setItem("customers", JSON.stringify(customersToSave));
        console.log("Saved customers to localStorage:", customersToSave);
      } catch (error) {
        console.error("Failed to save customers to localStorage:", error);
        toast({
          title: "Error saving data",
          description: "Failed to save your changes. Please check your browser storage settings.",
          variant: "destructive"
        });
      }
    }
  }, [customers, loading]);

  const addCustomer = (customer: Customer) => {
    // Ensure all details are preserved during add
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
    
    const customerWithDetails = deepClone(customer);
    setCustomers(prev => [...prev, customerWithDetails]);
    console.log("Added customer:", customerWithDetails);
    
    toast({
      title: "Customer added",
      description: `${customer.name} has been added successfully.`,
    });
  };

  const updateCustomer = (id: string, updatedCustomer: Customer) => {
    // Deep clone to ensure all nested properties are preserved
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
    
    const customerWithDetails = deepClone(updatedCustomer);
    
    setCustomers(prev => prev.map(c => c.id === id ? customerWithDetails : c));
    console.log("Updated customer:", customerWithDetails);
    
    toast({
      title: "Customer updated",
      description: `${updatedCustomer.name}'s information has been updated.`,
    });
  };

  const deleteCustomer = (id: string) => {
    const customerToDelete = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    
    if (customerToDelete) {
      console.log("Deleted customer:", customerToDelete);
      toast({
        title: "Customer deleted",
        description: `${customerToDelete.name} has been removed.`,
      });
    }
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer, loading }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};
