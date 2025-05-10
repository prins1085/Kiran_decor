import React, { createContext, useContext, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { Customer } from "./CustomerContext";
import axios from "axios";

interface PDFExportContextType {
  exportCustomerPDFs: (customer: Customer) => Promise<void>;
  isExporting: string | null;
  error: Error | null;
}

const PDFExportContext = createContext<PDFExportContextType | null>(null);

// API endpoints
const TAIL_PDF_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/invoice/TAIL`;
const FAB_PDF_API = `${import.meta.env.VITE_PROXY}/QUOTEPRO/invoice/FAB`;

interface PDFExportProviderProps {
  children: ReactNode;
}

export const PDFExportProvider: React.FC<PDFExportProviderProps> = ({ children }) => {
  const [isExporting, setIsExporting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  const downloadPDF = async (url: string, filename: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Error downloading PDF: ${filename}`, error);
      throw error;
    }
  };

  const exportCustomerPDFs = async (customer: Customer) => {
    try {
      setIsExporting(customer.id);
      setError(null);

      const customerName = customer.name.replace(/\s+/g, "_");
      const tailFilename = `${customerName}_TAIL.pdf`;
      const fabFilename = `${customerName}_FAB.pdf`;

      // Create an array of promises for both PDF downloads
      const pdfPromises = [
        downloadPDF(`${TAIL_PDF_API}?customer_id=${customer.id}`, tailFilename),
        downloadPDF(`${FAB_PDF_API}?customer_id=${customer.id}`, fabFilename)
      ];

      // Wait for both PDFs to be downloaded
      await Promise.all(pdfPromises);

      toast({
        title: "PDFs Generated",
        description: `Quotations for ${customer.name} have been downloaded.`,
      });
    } catch (error) {
      console.error("Error downloading the files:", error);
      setError(error as Error);
      toast({
        title: "Error Generating PDFs",
        description: "Failed to generate PDFs. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw the error to be caught by the caller
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <PDFExportContext.Provider
      value={{
        exportCustomerPDFs,
        isExporting,
        error,
      }}
    >
      {children}
    </PDFExportContext.Provider>
  );
};

export const usePDFExport = (): PDFExportContextType => {
  const context = useContext(PDFExportContext);
  if (!context) {
    throw new Error("usePDFExport must be used within a PDFExportProvider");
  }
  return context;
}; 