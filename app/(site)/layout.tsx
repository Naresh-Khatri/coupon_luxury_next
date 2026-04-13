import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 w-full">
        <NavBar />
      </div>
      <div className="pt-[59px] lg:pt-[75px]">{children}</div>
      <Footer />
    </>
  );
}
