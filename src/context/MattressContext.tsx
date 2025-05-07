import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/hooks/use-toast";
import { MattressProduct } from "@/types/mattress";
import axios from "axios";

interface MattressContextType {
  mattressProducts: MattressProduct[];
  addMattressProduct: (product: MattressProduct) => Promise<void>;
  updateMattressProduct: (id: string, updatedProduct: MattressProduct) => Promise<void>;
  deleteMattressProduct: (id: string) => Promise<void>;
  getMattressProductById: (id: string) => Promise<MattressProduct | null>;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: Error | null;
}

const MattressContext = createContext<MattressContextType | null>(null);

interface MattressProviderProps {
  children: ReactNode;
}

export const MattressProvider: React.FC<MattressProviderProps> = ({
  children,
}) => {
  const [mattressProducts, setMattressProducts] = useState<MattressProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // **🔹 Convert API Format Data Back to Original Format**
  const transformApiToLocalStorage = (apiData: any): MattressProduct => ({
    id: apiData.data[0].mattcompanyid, 
    company: apiData.data[0].company,
    price: apiData.data[0].price,
    productName: apiData.data[0].productName,
    size: apiData.data[0].size,
  });

  const SAVE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/mattcompany/save`;
  const GET_ALL_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/mattcompany/grid`;
  const GET_SINGLE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/mattcompany/getdata`;
  const DELETE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/mattcompany/delete`;

  const fetchMattressProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(GET_ALL_API);
      setMattressProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch mattress products:", error);
      setError(error as Error);
      toast({
        title: "Error loading data",
        description: "Failed to load mattress products. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMattressProducts();
  }, []);

  // Fetch a single customer by ID
  const getMattressProductById = async (id: string): Promise<MattressProduct | null> => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${GET_SINGLE_API}?id=${id}`);
      const mattressData = transformApiToLocalStorage(response.data);
      return mattressData;
    } catch (error) {
      console.error("Failed to fetch mattress product details:", error);
      setError(error as Error);
      toast({
        title: "Error loading mattress product",
        description: "Failed to load mattress product details. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save customer to API
  const saveMattressProduct = async (product: MattressProduct, id?: string): Promise<void> => {
    try {
      setIsSaving(true);
      // Include the customer ID only during updates
      const payload = id ? { ...product, id: id } : product;

      const response = await axios.post(SAVE_API, payload);
      // Check if the response contains a success message
      if (response.data.iserror === "N") {
        await fetchMattressProducts();

        toast({
          title: id ? "Mattress Product updated" : "Mattress Product added",
          description: `${product.productName} has been ${id ? "updated" : "added"} successfully.`,
        });
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("Failed to save mattress product:", error);
      setError(error as Error);
      toast({
        title: "Error saving data",
        description: "Failed to save your changes.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const addMattressProduct = (product: MattressProduct): Promise<void> => 
    saveMattressProduct(product);

  const updateMattressProduct = (id: string, updatedProduct: MattressProduct): Promise<void> => 
    saveMattressProduct(updatedProduct, id);

  const deleteMattressProduct = async (id: string): Promise<void> => {
    try {
      setIsDeleting(true);
      await axios.get(`${DELETE_API}?id=${id}`);
      await fetchMattressProducts();

      toast({
        title: "Mattress Product deleted",
        description: `Mattress Product has been removed.`,
      });
    } catch (error) {
      console.error("Failed to delete mattress product:", error);
      setError(error as Error);
      toast({
        title: "Error deleting data",
        description: "Failed to delete the mattress product.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MattressContext.Provider
      value={{
        mattressProducts,
        addMattressProduct,
        updateMattressProduct,
        deleteMattressProduct,
        getMattressProductById,
        isLoading,
        isSaving,
        isDeleting,
        error,
      }}
    >
      {children}
    </MattressContext.Provider>
  );
};

export const useMattress = (): MattressContextType => {
  const context = useContext(MattressContext);
  if (!context) {
    throw new Error("useMattress must be used within a MattressProvider");
  }
  return context;
};
