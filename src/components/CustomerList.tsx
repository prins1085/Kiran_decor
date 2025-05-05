
import { useState } from "react";
import { Plus, Edit2, Trash2, Search, ChevronRight, LayoutGrid, Users, Download, Printer, Share } from "lucide-react";
import { useCustomer } from "@/context/CustomerContext";
import { Customer } from "@/context/CustomerContext";
import CustomerForm from "./CustomerForm";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { generatePDF } from "@/utils/pdfGenerator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DataLoader, TableLoader } from "@/components/ui/loader";
import { LoadingButton } from "@/components/ui/loading-button";

const CustomerList = () => {
  const { customers, deleteCustomer, getCustomerById, isLoading } = useCustomer();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");  // Default to grid view
  const [loadingCustomerId, setLoadingCustomerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleEdit = async (customer: Customer) => {
    try {
      setLoadingCustomerId(customer.id);
      const detailedCustomer = await getCustomerById(customer.id);
      if (detailedCustomer) {
        setEditingCustomer(detailedCustomer);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch customer details for editing:", error);
      toast({
        title: "Error loading customer",
        description: "Failed to load customer details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCustomerId(null);
    }
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      setLoadingCustomerId(customer.id);
      deleteCustomer(customer.id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const calculateTotalQuotation = (customer: Customer): number => {
    return customer.quotations.reduce((total, quotation) => {
      return total + quotation.items.reduce((sum, item) => sum + item.total, 0);
    }, 0);
  };

  const exportToPDF = async (customer: Customer) => {
    try {
      setIsExporting(customer.id);
      const formattedDate = new Date(customer.quotations[0]?.date || new Date()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const finalJson = {
        date: formattedDate,
        customer: {
          name: customer.name,
          phone: customer.phone,
        },
        executive: "SURESH BHAI",
        items: customer.quotations[0]?.items.map((elem) => {
          const discount = elem.details?.discount || 0;
          return {
            description: `${elem.name} (${elem.type})`,
            total: (elem.total - discount).toFixed(0),  
            discount: discount.toFixed(0),
            total_amount: Number(elem.total.toFixed(0)),
          };
        }) || [],
      };

      await fetch("http://192.168.29.138:9090/RPT/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalJson),
      })
        .then(response => response.blob()) 
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
      
          const customerName = finalJson.customer.name.replace(/\s+/g, "_");
          a.download = `${customerName}_Quotation.pdf`;
      
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); 
          
          toast({
            title: "PDF Generated",
            description: `Quotation for ${customer.name} has been downloaded.`,
          });
        })
        .catch(error => {
          console.error("Error downloading the file:", error);
          toast({
            title: "Error Generating PDF",
            description: "Failed to generate PDF. Please try again.",
            variant: "destructive",
          });
        });
    } finally {
      setIsExporting(null);
    }
  };

  const shareOnWhatsApp = (customer: Customer) => {
    try {
      setIsSharing(customer.id);
      
      // Format the phone number for WhatsApp API
      let phoneNumber = customer.phone.replace(/\D/g, '');
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = `+91${phoneNumber}`; // Adding India country code as default
      }
      
      // Create message text
      const message = encodeURIComponent(`Hello ${customer.name}, here's your quotation from QuotePro!`);
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      
      toast({
        title: "Opening WhatsApp",
        description: `Sharing quotation with ${customer.name}.`,
      });
    } finally {
      setIsSharing(null);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.architect?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  // Render loading skeleton for the grid view
  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-3/4">
                <Skeleton className="h-5 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Render loading skeleton for the list view
  const renderListSkeleton = () => (
    <div className="w-full rounded-lg border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Phone</TableHead>
              <TableHead className="font-medium hidden md:table-cell">Architect</TableHead>
              <TableHead className="font-medium text-right">Total Amount</TableHead>
              <TableHead className="font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <Users size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Customers</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search customers..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-10 w-10"
              >
                <LayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-10 w-10"
              >
                <Users size={16} />
              </Button>
              <Button onClick={() => setShowForm(true)} className="gap-2 whitespace-nowrap flex-shrink-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "list" ? renderListSkeleton() : renderGridSkeleton()}
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div
              key="table-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-lg border shadow-sm overflow-hidden bg-card"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-medium">Name</TableHead>
                      <TableHead className="font-medium">Phone</TableHead>
                      <TableHead className="font-medium hidden md:table-cell">Architect</TableHead>
                      <TableHead className="font-medium text-right">Total Amount</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          {searchQuery ? "No customers found" : "No customers yet. Add your first customer!"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover-scale hover:bg-accent/30">
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.architect || "—"}</TableCell>
                          <TableCell className="text-right font-medium">
                          ₹ {customer.grand_total}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <LoadingButton 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    loading={isExporting === customer.id || isSharing === customer.id}
                                  >
                                    <Share className="h-4 w-4" />
                                  </LoadingButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => exportToPDF(customer)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Export PDF</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => shareOnWhatsApp(customer)}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    <span>Share on WhatsApp</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu> */}
                              <LoadingButton
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(customer)}
                                className="h-8 w-8"
                                loading={loadingCustomerId === customer.id}
                              >
                                <Edit2 className="h-4 w-4" />
                              </LoadingButton>
                              <LoadingButton
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(customer)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                loading={loadingCustomerId === customer.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </LoadingButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredCustomers.length === 0 ? (
                <div className="col-span-full h-24 flex items-center justify-center text-muted-foreground">
                  {searchQuery ? "No customers found" : "No customers yet. Add your first customer!"}
                </div>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover-scale overflow-hidden">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg truncate max-w-[160px] sm:max-w-full">{customer.name}</h3>
                            <p className="text-muted-foreground text-sm">{customer.phone}</p>
                          </div>
                          <div className="flex gap-1">
                            {/* <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <LoadingButton 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  loading={isExporting === customer.id || isSharing === customer.id}
                                >
                                  <Share className="h-4 w-4" />
                                </LoadingButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => exportToPDF(customer)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Export PDF</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => shareOnWhatsApp(customer)}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  <span>Share on WhatsApp</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu> */}
                            <LoadingButton
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(customer)}
                              className="h-8 w-8"
                              loading={loadingCustomerId === customer.id}
                            >
                              <Edit2 className="h-4 w-4" />
                            </LoadingButton>
                            <LoadingButton
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(customer)}
                              className="h-8 w-8 text-destructive"
                              loading={loadingCustomerId === customer.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </LoadingButton>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {customer.architect && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Architect:</span>
                              <span className="truncate max-w-[120px] sm:max-w-[140px]">{customer.architect}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="text-sm font-medium">Total Amount:</span>
                          <span className="font-semibold text-primary text-sm sm:text-base">
                            ₹ {customer.grand_total}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={handleCloseForm}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="fixed inset-0 sm:inset-8 bg-background rounded-xl shadow-glass-lg overflow-hidden z-50 max-w-6xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col overflow-hidden">
                <CustomerForm
                  onClose={handleCloseForm}
                  editingCustomer={editingCustomer}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerList;
