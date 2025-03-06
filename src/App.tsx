import { User, LogOut } from "lucide-react";
import CustomerList from "./components/CustomerList";
import { CustomerProvider } from "./context/CustomerContext";

function App() {
  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm fixed w-full top-0 z-50 h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">QuotePro</h1>
                </div>
                <nav className="ml-6 flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Customers
                  </a>
                </nav>
              </div>
              <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <User className="h-6 w-6 text-gray-600" />
                </button>
                <button className="ml-2 p-2 rounded-full hover:bg-gray-100">
                  <LogOut className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-8">
          <CustomerList />
        </main>
      </div>
    </CustomerProvider>
  );
}

export default App;
