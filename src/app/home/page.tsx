import BestSellers from "../components/best-sellers/best-sellers";
import Club from "../components/club/club";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import SuperHeader from "../components/layout/super-header";
import PlantCategoryShop from "../components/plant-categories/shop-plant-categories";
import OurPromise from "../components/promise/our-promise";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SuperHeader />
      <Header />
      <div className="flex-1" />
      <PlantCategoryShop/>
      <OurPromise/>
      <BestSellers/>
      <Club/>
      <Footer />
    </main>
  );
}
