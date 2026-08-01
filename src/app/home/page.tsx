import BestSellers from "../components/best-sellers/best-sellers";
import Club from "../components/club/club";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import SiteHeader from "../components/layout/site-header";
import PlantCategoryShop from "../components/plant-categories/shop-plant-categories";
import OurPromise from "../components/promise/our-promise";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <Header />
      <PlantCategoryShop />
      <OurPromise />
      <BestSellers />
      <Club />
      <Footer />
    </main>
  );
}
