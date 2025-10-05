import Banner from "../Banner/Banner";
import BeMarchant from "../BeMerchant/BeMerchant";
import Benefits from "../Benefits/Benefits";
import ClientLogos from "../ClientLogo/ClientLogos";
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
    </div>
  );
};

export default Home;
