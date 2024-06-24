import Navbar from "./Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
