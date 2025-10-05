import location from "../../../assets/location-merchant.png";
const BeMerchant = () => {
  return (
    <div
      data-aos="zoom-in-up"
      className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat p-20 rounded-4xl bg-[#03373D]"
    >
      <div className="hero-content flex-col lg:flex-row-reverse text-white">
        <img src={location} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn btn-primary rounded-full text-black">
            Become A Merchant
          </button>
          <button className="btn btn-primary hover:text-black text-primary rounded-full btn-outline ms-4">
            Earn With Shiftly
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
