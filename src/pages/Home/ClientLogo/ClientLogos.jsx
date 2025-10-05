import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/casio.png";
import logo3 from "../../../assets/brands/moonstar.png";
import logo4 from "../../../assets/brands/start.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/amazon_vector.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6];

const ClientLogos = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="overflow-hidden bg-gray-50">
        <h1 className="text-center text-[#03377D] font-bold  text-3xl mb-4">
          We've helped thousands of sales teams
        </h1>
        <div className="flex animate-scroll whitespace-nowrap">
          {logos.concat(logos).map((logo, index) => (
            <div key={index} className="mx-6 flex-shrink-0">
              <img
                src={logo}
                alt={`client-${index}`}
                className="h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
