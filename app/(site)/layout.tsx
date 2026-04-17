import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getActiveCountries } from "@/server/db/queries/countries";
import { getNavFeatured } from "@/server/db/queries/nav";
import { getSelectedCountry } from "@/lib/country";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const selectedCountry = await getSelectedCountry();
  const [countries, { featuredStores, featuredCategories }] = await Promise.all(
    [getActiveCountries(), getNavFeatured(selectedCountry)]
  );

  return (
    <div className="site-dark bg-background text-foreground min-h-screen">
      <NavBar
        countries={countries}
        selectedCountry={selectedCountry}
        featuredStores={featuredStores}
        featuredCategories={featuredCategories}
      />
      <div className="pt-[60px] lg:pt-[76px]">{children}</div>
      <Footer />
    </div>
  );
}
