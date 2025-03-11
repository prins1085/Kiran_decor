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

const CustomerList = () => {
  const { customers, deleteCustomer } = useCustomer();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");  // Default to grid view

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
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

  const exportToPDF = (customer: Customer) => {
    generatePDF(customer);
    toast({
      title: "PDF Generated",
      description: `Quotation for ${customer.name} has been generated.`,
    });
  };

  const shareOnWhatsApp = (customer: Customer) => {
    // Generate and export PDF
    const pdfBlob = generatePDF(customer, true);
    
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
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.architect.toLowerCase().includes(searchQuery.toLowerCase())
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
          {viewMode === "list" ? (
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
                      <TableHead className="font-medium hidden sm:table-cell">Quotations</TableHead>
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
                          <TableCell className="hidden sm:table-cell">{customer.quotations.length}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{calculateTotalQuotation(customer).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Share className="h-4 w-4" />
                                  </Button>
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
                              </DropdownMenu>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(customer)}
                                className="h-8 w-8"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(customer)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share className="h-4 w-4" />
                                </Button>
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
                            </DropdownMenu>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(customer)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(customer)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {customer.architect && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Architect:</span>
                              <span className="truncate max-w-[120px] sm:max-w-[140px]">{customer.architect}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quotations:</span>
                            <span className="font-medium">{customer.quotations.length}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="text-sm font-medium">Total Amount:</span>
                          <span className="font-semibold text-primary text-sm sm:text-base">
                            ₹{calculateTotalQuotation(customer).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
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
