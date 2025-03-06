import React, { useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { useCustomer } from "../context/CustomerContext";
import CustomerForm from "./CustomerForm";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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

const CustomerList: React.FC = () => {
  const { customers } = useCustomer() as { customers: Customer[] };
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const calculateTotalQuotation = (customer: Customer): number => {
    return (
      customer.quotations?.reduce((total, quotation) => {
        return (
          total +
          quotation.items.reduce((itemTotal, item) => itemTotal + item.total, 0)
        );
      }, 0) || 0
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Customers</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CustomerForm
              onClose={handleCloseForm}
              editingCustomer={editingCustomer}
            />
          </div>
        </div>
      )}

      <TableContainer
        component={Paper}
        className="min-h-[400px]"
        sx={{ height: "calc(100vh - 200px)" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ height: "40px", backgroundColor: "white" }}>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Phone</b>
              </TableCell>
              <TableCell>
                <b>Architect</b>
              </TableCell>
              <TableCell>
                <b>Total Quotations</b>
              </TableCell>
              <TableCell align="right">
                <b>Total Amount</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} hover sx={{ height: "40px" }}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.architect}</TableCell>
                <TableCell>{customer.quotations?.length || 0}</TableCell>
                <TableCell align="right">
                  ₹{calculateTotalQuotation(customer).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleEdit(customer)}
                    sx={{ minWidth: "auto", padding: 0, minHeight: "auto" }}
                  >
                    <Edit2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomerList;
