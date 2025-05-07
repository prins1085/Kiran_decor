
import React, { createContext, useContext, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  grand_total?: any;
  quotations: Quotation[];
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Customer) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Promise<Customer | null>;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: Error | null;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

// API endpoints
const SAVE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/save`;
const GET_ALL_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/grid`;
const GET_SINGLE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/getdata`;
const DELETE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/delete`;

// Transform functions
const transformLocalStorageToApi = (customer: Customer) => ({
  customer_name: customer.name,
  cmobilenumber: customer.phone,
  architectname: customer.architect,
  curtains: customer.quotations.flatMap((q) =>
    q.items
      .filter((i) => i.type === "curtain")
      .map(({ details, ...rest }) => ({ ...rest, ...details }))
  ),
  blinds: customer.quotations.flatMap((q) =>
    q.items
      .filter((i) => i.type === "blind")
      .map(({ details, ...rest }) => ({ ...rest, ...details }))
  ),
  mattresses: customer.quotations.flatMap((q) =>
    q.items
      .filter((i) => i.type === "mattress")
      .map(({ details, ...rest }) => ({ ...rest, ...details }))
  ),
  sofas: customer.quotations.flatMap((q) =>
    q.items
      .filter((i) => i.type === "sofa")
      .map(({ details, ...rest }) => ({ ...rest, ...details }))
  ),
});

const transformApiToLocalStorage = (apiData: any): Customer => ({
  id: apiData.data[0].customer_id,
  name: apiData.data[0].customer_name,
  phone: apiData.data[0].mobile_number,
  architect: apiData.data[0].architect_name,
  quotations: [
    {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: [
        ...apiData.curtains.map(({ itemname, total, ...rest }: any) => ({
          id: crypto.randomUUID(),
          type: "curtain",
          name: itemname || "",
          isOpen: true,
          total: total || 0,
          details: rest,
        })),
        ...apiData.blinds.map(({ name, total, ...rest }: any) => ({
          id: crypto.randomUUID(),
          type: "blind",
          name: name || "",
          isOpen: true,
          total: total || 0,
          details: rest,
        })),
        ...apiData.mattresses.map(({ itemname, total, ...rest }: any) => ({
          id: crypto.randomUUID(),
          type: "mattress",
          name: itemname || "",
          isOpen: true,
          total: total || 0,
          details: rest,
        })),
        ...apiData.sofas.map(({ itemname, total, ...rest }: any) => ({
          id: crypto.randomUUID(),
          type: "sofa",
          name: itemname || "",
          isOpen: true,
          total: total || 0,
          details: rest,
        })),
      ],
    },
  ],
});

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  // Use React Query to fetch all customers
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axios.get(GET_ALL_API);
      return response.data.map((apiData: any) => ({
        id: apiData.customer_id,
        name: apiData.customer_name,
        phone: apiData.mobile_number,
        architect: apiData.architect_name,
        grand_total: apiData.grand_total,
        quotations: [],
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch a single customer by ID
  const getCustomerById = async (id: string): Promise<Customer | null> => {
    try {
      // Check if we have a cached result first
      // const cachedCustomer = queryClient.getQueryData<Customer>(['customer', id]);
      // if (cachedCustomer) return cachedCustomer;

      const response = await axios.get(`${GET_SINGLE_API}?customer_id=${id}`);
      const customer = transformApiToLocalStorage(response.data);
      
      // Cache the result
      queryClient.setQueryData(['customer', id], customer);
      
      return customer;
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      toast({
        title: "Error loading customer",
        description: "Failed to load customer details. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add mutation
  const addMutation = useMutation({
    mutationFn: async (customer: Customer) => {
      const formattedCustomer = transformLocalStorageToApi(customer);
      const response = await axios.post(SAVE_API, formattedCustomer);
      
      if (response.data.iserror !== "N") {
        throw new Error("Unexpected API response");
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      toast({
        title: "Customer added",
        description: "Customer has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to add customer:", error);
      toast({
        title: "Error saving data",
        description: "Failed to save your changes.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedCustomer }: { id: string, updatedCustomer: Customer }) => {
      const formattedCustomer = transformLocalStorageToApi(updatedCustomer);
      const payload = { ...formattedCustomer, customerid: id };
      
      const response = await axios.post(SAVE_API, payload);
      
      if (response.data.iserror !== "N") {
        throw new Error("Unexpected API response");
      }
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      
      toast({
        title: "Customer updated",
        description: "Customer has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Failed to update customer:", error);
      toast({
        title: "Error updating data",
        description: "Failed to update your changes.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.get(`${DELETE_API}?customer_id=${id}`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.removeQueries({ queryKey: ['customer', id] });
      
      toast({
        title: "Customer deleted",
        description: "Customer has been removed.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error deleting data",
        description: "Failed to delete the customer.",
        variant: "destructive",
      });
    },
  });

  const addCustomer = (customer: Customer) => {
    addMutation.mutate(customer);
  };

  const updateCustomer = (id: string, updatedCustomer: Customer) => {
    updateMutation.mutate({ id, updatedCustomer });
  };

  const deleteCustomer = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        isLoading,
        isSaving: addMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        error: error as Error | null,
      }}
    >
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
