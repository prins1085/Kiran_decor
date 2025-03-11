
import { User, LogOut, Moon, Sun } from "lucide-react";
import CustomerList from "@/components/CustomerList";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-sm" 
          : "bg-background"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <AnimatePresence mode="wait">
              <motion.div 
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <div className="flex-shrink-0">
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    Kiran Decor
                  </motion.h1>
                </div>
                <nav className="ml-6 hidden sm:flex space-x-1">
                  <motion.a
                    href="#"
                    className="relative text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-1.5 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    Customers
                  </motion.a>
                </nav>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-muted-foreground" />
                </Button>
                
                <Button variant="ghost" size="icon" className="rounded-full" onClick={logout}>
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <CustomerList />
      </main>
    </div>
  );
};

export default Index;
