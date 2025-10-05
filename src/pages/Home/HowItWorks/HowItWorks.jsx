import {
  FaTruck,
  FaMoneyBillAlt,
  FaWarehouse,
  FaBuilding,
  FaUsers,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaTruck className="text-blue-500 text-4xl" />,
    title: "Booking Pick & Drop",
    description:
      "From personal packages to business shipments — we deliver on time, every time.",
  },
  {
    icon: <FaMoneyBillAlt className="text-green-500 text-4xl" />,
    title: "Cash On Delivery",
    description:
      "Pay only when your package reaches its destination safely and securely.",
  },
  {
    icon: <FaWarehouse className="text-purple-500 text-4xl" />,
    title: "Delivery Hub",
    description:
      "Our strategically located hubs ensure faster sorting and dispatch of all parcels.",
  },
  {
    icon: <FaBuilding className="text-orange-500 text-4xl" />,
    title: "Booking SME",
    description:
      "Tailored delivery solutions for small and medium enterprises with flexible options.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
