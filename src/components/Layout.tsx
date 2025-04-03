import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
