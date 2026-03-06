import Image from "next/image";
import Banner from "./components/Banner";
import MainProductsPage from "./mainproducts/page";
import Footer from "./components/Footer";
import TopRated from "./toprated/page";
import CustomerReviews from "./components/CustomerReviews";

export default function Home() {
  return (
    <div>
      <Banner />
      <MainProductsPage />
<TopRated/>

      
      <CustomerReviews/>
      <Footer/>
    </div>
  );
}
