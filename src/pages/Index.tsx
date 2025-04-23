
import { useState } from "react";
import CustomerList from "@/components/CustomerList";
import { useCustomer } from "@/context/CustomerContext";
import { PageLoader } from "@/components/ui/loader";

const Index = () => {
  const { isLoading } = useCustomer();

  return (
    <div className="min-h-screen bg-background">
      {isLoading && <PageLoader />}
      <CustomerList />
    </div>
  );
};

export default Index;
