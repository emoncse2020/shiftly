import {
  Truck,
  Globe2,
  PackageCheck,
  DollarSign,
  Building2,
  RefreshCcw,
} from "lucide-react";

const iconMap = {
  "Express & Standard Delivery": <Truck className="w-10 h-10 text-blue-500" />,
  "Nationwide Delivery": <Globe2 className="w-10 h-10 text-green-500" />,
  "Fulfillment Solution": <PackageCheck className="w-10 h-10 text-amber-500" />,
  "Cash on Home Delivery": <DollarSign className="w-10 h-10 text-red-500" />,
  "Corporate Service / Contract In Logistics": (
    <Building2 className="w-10 h-10 text-purple-500" />
  ),
  "Parcel Return": <RefreshCcw className="w-10 h-10 text-indigo-500" />,
};

const ServiceCard = ({ title, description }) => {
  return (
    <div className="card bg-gray-50  shadow-md border hover:shadow-xl transition-all p-6 rounded-2xl text-center hover:bg-[#CAEB66]">
      <div className="flex justify-center mb-4">{iconMap[title]}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;
