import Banner from "../Banner/Banner";
import BeMarchant from "../BeMerchant/BeMerchant";
import Benefits from "../Benefits/Benefits";
import ClientLogos from "../ClientLogo/ClientLogos";
import CustomerSays from "../CustomerSays/CustomerSays";
import HowItWorks from "../HowItWorks/HowItWorks";
import Services from "../Services/Services";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <Services />
      <ClientLogos />
      <Benefits />
      <BeMarchant />
      <CustomerSays />
    </div>
  );
};

export default Home;
