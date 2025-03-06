import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface QuotationItem {
  total: number;
}

interface Quotation {
  items: QuotationItem[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  architect: string;
  quotations?: Quotation[];
}

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updatedCustomer: Customer) => void;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const updateCustomer = (id: string, updatedCustomer: Customer) => {
    setCustomers(customers.map((c) => (c.id === id ? updatedCustomer : c)));
  };

  return (
    <CustomerContext.Provider
      value={{ customers, addCustomer, updateCustomer }}
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
