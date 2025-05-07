import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Pencil, Trash, Building } from "lucide-react";
import { MattressProduct } from "@/types/mattress";
import { useMattress } from "@/context/MattressContext";
import { useToast } from "@/hooks/use-toast";

const MattressMaster = () => {
  const {
    mattressProducts,
    addMattressProduct,
    updateMattressProduct,
    deleteMattressProduct,
    getMattressProductById,
    isLoading,
    isSaving,
    isDeleting,
  } = useMattress();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<MattressProduct | null>(
    null
  );

  // Form state for new/edit product
  const [formData, setFormData] = useState({
    company: "sleepwell",
    productName: "",
    size: "",
    price: "",
  });

  // Handle search
  const filteredProducts = mattressProducts.filter(
    (product) =>
      product.company?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      product.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      String(product.size).includes(String(searchTerm)) || 
      String(product.price).includes(String(searchTerm))
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      company: "sleepwell",
      productName: "",
      size: "",
      price: "",
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle company select change
  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      company: value,
    }));
  };

  // Handle form submission for new product
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: MattressProduct = {
      company: formData.company,
      productName: formData.productName,
      size: formData.size,
      price: parseFloat(formData.price) || 0,
    };

    try {
      await addMattressProduct(newProduct);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Handle form submission for editing product
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentProduct) {
      const updatedProduct: MattressProduct = {
        ...currentProduct,
        company: formData.company,
        productName: formData.productName,
        size: formData.size,
        price: parseFloat(formData.price) || 0,
      };

      try {
        await updateMattressProduct(currentProduct.id, updatedProduct);
        resetForm();
        setCurrentProduct(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    }
  };

  // Open edit dialog with product data
  const openEditDialog = async (product: MattressProduct) => {
    try {
      const detailedMattressProduct = await getMattressProductById(product.id);
      if (detailedMattressProduct) {
        setCurrentProduct(detailedMattressProduct);
        setFormData({
          company: detailedMattressProduct.company,
          productName: detailedMattressProduct.productName,
          size: detailedMattressProduct.size,
          price: detailedMattressProduct.price.toString(),
        });
        setIsEditDialogOpen(true);
      }
    } catch (error) {
      console.error(
        "Failed to fetch mattress product details for editing:",
        error
      );
      toast({
        title: "Error loading mattress product",
        description:
          "Failed to load mattress product details. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product: MattressProduct) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (currentProduct) {
      try {
        await deleteMattressProduct(currentProduct.id);
        setCurrentProduct(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mattress Master</h1>

        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-8"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Mattress Product</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Select
                    value={formData.company}
                    onValueChange={handleCompanyChange}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-full" id="company">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sleepwell">Sleepwell</SelectItem>
                      <SelectItem value="kingkoil">King Koil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Product Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., King, Queen, Double"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Product Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={isSaving}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.company === "sleepwell"
                      ? "Sleepwell"
                      : "King Koil"}
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>
                    ₹
                    {product.price.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                        disabled={isLoading || isSaving || isDeleting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(product)}
                        disabled={isLoading || isSaving || isDeleting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  {searchTerm
                    ? "No matching products found"
                    : "No products added yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mattress Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company Name</Label>
              <Select
                value={formData.company}
                onValueChange={handleCompanyChange}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full" id="edit-company">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleepwell">Sleepwell</SelectItem>
                  <SelectItem value="kingkoil">King Koil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-productName">Product Name</Label>
              <Input
                id="edit-productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-size">Product Size</Label>
              <Input
                id="edit-size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Product Price (₹)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                disabled={isSaving}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "
              {currentProduct?.productName}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MattressMaster;
