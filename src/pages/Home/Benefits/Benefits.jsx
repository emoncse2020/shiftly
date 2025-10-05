import image1 from "../../../assets/features_image/Transit warehouse.png";
import image2 from "../../../assets/features_image/Group 4.png";
import image3 from "../../../assets/features_image/Group 4 (1).png";
const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Track your parcels in real-time from pickup to delivery, ensuring full transparency.",
    image: image1,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We guarantee secure handling of all packages so they reach their destination safely.",
    image: image2,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available round the clock to assist you with any queries.",
    image: image3,
  },
];

const Benefits = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="object-contain"
                />
              </div>

              {/* Vertical separator */}
              <div className="ml-8 border-l-2 border-dashed h-32 border-gray-300 px-4"></div>

              {/* Text */}
              <div className="px-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
