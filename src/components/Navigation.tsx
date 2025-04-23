
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-accent py-3 px-4 mb-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="font-semibold text-lg">QuotePro</div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            asChild
            size="sm"
          >
            <Link to="/">Dashboard</Link>
          </Button>
          
          <Button
            variant={location.pathname === "/mattress-master" ? "default" : "ghost"}
            asChild
            size="sm"
          >
            <Link to="/mattress-master">Mattress Master</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
