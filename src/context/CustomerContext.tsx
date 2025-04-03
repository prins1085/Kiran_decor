import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

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
  getCustomerById: (id: string) => Promise<Customer | null>; // New method
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // **🔹 Convert LocalStorage Data to API Format for Storing**
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

  // **🔹 Convert API Format Data Back to Original Format**
  const transformApiToLocalStorage = (apiData: any): Customer => ({
    id: apiData.data[0].customer_id, // Ensure unique ID
    name: apiData.data[0].customer_name,
    phone: apiData.data[0].mobile_number,
    architect: apiData.data[0].architect_name,
    quotations: [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        items: [
          ...apiData.curtains.map(({ name, total, ...rest }: any) => ({
            id: crypto.randomUUID(),
            type: "curtain",
            name: name || "",
            isOpen: false,
            total: total || 0,
            details: rest,
          })),
          ...apiData.blinds.map(({ name, total, ...rest }: any) => ({
            id: crypto.randomUUID(),
            type: "blind",
            name: name || "",
            isOpen: false,
            total: total || 0,
            details: rest,
          })),
          ...apiData.mattresses.map(({ name, total, ...rest }: any) => ({
            id: crypto.randomUUID(),
            type: "mattress",
            name: name || "",
            isOpen: false,
            total: total || 0,
            details: rest,
          })),
          ...apiData.sofas.map(({ name, total, ...rest }: any) => ({
            id: crypto.randomUUID(),
            type: "sofa",
            name: name || "",
            isOpen: false,
            total: total || 0,
            details: rest,
          })),
        ],
      },
    ],
  });

  const SAVE_API =
    `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/save`;
  const GET_ALL_API =
    `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/grid`;
  const GET_SINGLE_API =
    `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/getdata`;
  const DELETE_API =
    `${import.meta.env.VITE_PROXY}/QUOTEPRO/quation/delete`;

  // Fetch all customers on component mount
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(GET_ALL_API);

      const fetchedCustomers = response.data.map((apiData: any) => ({
        id: apiData.customer_id,
        name: apiData.customer_name,
        phone: apiData.mobile_number,
        architect: apiData.architect_name,
        quotations: [],
      }));
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load customers. Please refresh the page.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchCustomers();
    setLoading(false);
  }, []);

  // Fetch a single customer by ID
  const getCustomerById = async (id: string): Promise<Customer | null> => {
    try {
      const response = await axios.get(`${GET_SINGLE_API}?customer_id=${id}`);
      const customer = transformApiToLocalStorage(response.data);
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

  // Save customer to API
  const saveCustomer = async (customer: Customer, id?: string) => {
    try {
      const formattedCustomer = transformLocalStorageToApi(customer);
      console.log(formattedCustomer, "formattedCustomer");

      // Include the customer ID only during updates
      const payload = id
        ? { ...formattedCustomer, customerid: id }
        : formattedCustomer;

      const response = await axios.post(SAVE_API, payload);
      console.log(response, "res");
      // Check if the response contains a success message
      if (response.data.iserror === "N") {
        await fetchCustomers();

        toast({
          title: id ? "Customer updated" : "Customer added",
          description: `${customer.name} has been ${
            id ? "updated" : "added"
          } successfully.`,
        });
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast({
        title: "Error saving data",
        description: "Failed to save your changes.",
        variant: "destructive",
      });
    }
  };

  // Add or update customer
  const addCustomer = (customer: Customer) => saveCustomer(customer); // Add operation (no ID)

  const updateCustomer = (id: string, updatedCustomer: Customer) =>
    saveCustomer(updatedCustomer, id); // Update operation (with ID)

  // Delete customer
  const deleteCustomer = async (id: string) => {
    try {
      await axios.get(`${DELETE_API}?customer_id=${id}`);

      // Fetch updated data from the API
      await fetchCustomers();

      toast({
        title: "Customer deleted",
        description: `Customer with ID ${id} has been removed.`,
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error deleting data",
        description: "Failed to delete the customer.",
        variant: "destructive",
      });
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        loading,
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
