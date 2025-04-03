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
  addMattressProduct: (product: MattressProduct) => void;
  updateMattressProduct: (id: string, updatedProduct: MattressProduct) => void;
  deleteMattressProduct: (id: string) => void;
  getMattressProductById: (id: string) => Promise<MattressProduct | null>;
  loading: boolean;
}

const MattressContext = createContext<MattressContextType | null>(null);

interface MattressProviderProps {
  children: ReactNode;
}

export const MattressProvider: React.FC<MattressProviderProps> = ({
  children,
}) => {
  const [mattressProducts, setMattressProducts] = useState<MattressProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);

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
  const GET_SINGLE_API = `${
    import.meta.env.VITE_PROXY
  }/QUOTEPRO/mattcompany/getdata`;
  const DELETE_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/mattcompany/delete`;

  const fetchMattressProducts = async () => {
    try {
      const response = await axios.get(GET_ALL_API);

      setMattressProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch mattress products:", error);
      toast({
        title: "Error loading data",
        description:
          "Failed to load mattress products. Please refresh the page.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    fetchMattressProducts();
    setLoading(false);
  }, []);

  //   // Load data from localStorage
  //   useEffect(() => {
  //     try {
  //       const savedProducts = localStorage.getItem("mattressProducts");
  //       if (savedProducts) {
  //         setMattressProducts(JSON.parse(savedProducts));
  //         console.log(
  //           "Loaded mattress products from localStorage:",
  //           JSON.parse(savedProducts)
  //         );
  //       } else {
  //         setMattressProducts([]);
  //         console.log("No mattress products found in localStorage");
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Failed to load mattress products from localStorage:",
  //         error
  //       );
  //       toast({
  //         title: "Error loading data",
  //         description:
  //           "Failed to load mattress products. Please try refreshing the page.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);

  //   // Save data to localStorage whenever it changes
  //   useEffect(() => {
  //     if (!loading) {
  //       try {
  //         localStorage.setItem(
  //           "mattressProducts",
  //           JSON.stringify(mattressProducts)
  //         );
  //         console.log(
  //           "Saved mattress products to localStorage:",
  //           mattressProducts
  //         );
  //       } catch (error) {
  //         console.error(
  //           "Failed to save mattress products to localStorage:",
  //           error
  //         );
  //         toast({
  //           title: "Error saving data",
  //           description:
  //             "Failed to save your changes. Please check your browser storage settings.",
  //           variant: "destructive",
  //         });
  //       }
  //     }
  //   }, [mattressProducts, loading]);

  // Fetch a single customer by ID
  const getMattressProductById = async (
    id: string
  ): Promise<MattressProduct | null> => {
    try {
      const response = await axios.get(`${GET_SINGLE_API}?id=${id}`);
      const mattressData = transformApiToLocalStorage(response.data);
      return mattressData;
    } catch (error) {
      console.error("Failed to fetch mattress product details:", error);
      toast({
        title: "Error loading mattress product",
        description:
          "Failed to load mattress product details. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Save customer to API
  const saveMattressProduct = async (product: MattressProduct, id?: string) => {
    try {
      // Include the customer ID only during updates
      const payload = id ? { ...product, id: id } : product;

      const response = await axios.post(SAVE_API, payload);
      // Check if the response contains a success message
      if (response.data.iserror === "N") {
        await fetchMattressProducts();

        toast({
          title: id ? "Mattress Product updated" : "Mattress Product added",
          description: `${product.productName} has been ${
            id ? "updated" : "added"
          } successfully.`,
        });
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.error("Failed to save mattress product:", error);
      toast({
        title: "Error saving data",
        description: "Failed to save your changes.",
        variant: "destructive",
      });
    }
  };

  const addMattressProduct = (product: MattressProduct) =>
    saveMattressProduct(product);

  const updateMattressProduct = (id: string, updatedProduct: MattressProduct) =>
    saveMattressProduct(updatedProduct, id);

  const deleteMattressProduct = async (id: string) => {
    try {
      await axios.get(`${DELETE_API}?id=${id}`);

      // Fetch updated data from the API
      await fetchMattressProducts();

      toast({
        title: "Mattress Product deleted",
        description: `Mattress Product with ID ${id} has been removed.`,
      });
    } catch (error) {
      console.error("Failed to delete mattress product:", error);
      toast({
        title: "Error deleting data",
        description: "Failed to delete the mattress product.",
        variant: "destructive",
      });
    }
    await axios.get(`${DELETE_API}?id=${id}`);

    // Fetch updated data from the API
    await fetchMattressProducts();

    toast({
      title: "Mattress Product deleted",
      description: `Mattress Product with ID ${id} has been removed.`,
    });
  };

  return (
    <MattressContext.Provider
      value={{
        mattressProducts,
        addMattressProduct,
        updateMattressProduct,
        deleteMattressProduct,
        getMattressProductById,
        loading,
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
