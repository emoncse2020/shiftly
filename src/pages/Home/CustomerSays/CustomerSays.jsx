import { useState, useEffect } from "react";
import reviewImage from "../../../assets/customer-top.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviews = [
  {
    id: "1",
    userName: "John Doe",
    review:
      "Smooth delivery and polite staff. I can always rely on them for urgent shipments.",
    user_photoURL: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: "2",
    userName: "Jane Smith",
    review:
      "A bit delay once, but customer support handled it very professionally.",
    user_photoURL: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    id: "3",
    userName: "Alex Brown",
    review:
      "Excellent service! Fast, reliable, and real-time tracking is a huge plus.",
    user_photoURL: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: "4",
    userName: "Lisa White",
    review:
      "Their 24/7 support team actually helps — very responsive and polite.",
    user_photoURL: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "5",
    userName: "Michael Lee",
    review: "Parcel arrived before the expected time! Safe and well packaged.",
    user_photoURL: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const CustomerSays = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Responsive visible cards (1 mobile, 2 tablet, 3 desktop)
  const getVisibleCount = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slice for visible reviews
  const visibleReviews = reviews.slice(
    currentIndex,
    currentIndex + visibleCount
  );
  const displayReviews =
    visibleReviews.length < visibleCount
      ? [
          ...visibleReviews,
          ...reviews.slice(0, visibleCount - visibleReviews.length),
        ]
      : visibleReviews;

  return (
    <section className="py-16">
      <div className=" px-4 text-center">
        {/* Top Illustration */}
        <div className="flex justify-center mb-6">
          <img
            src={reviewImage}
            alt="Customer Review"
            className="w-24 h-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What Our Customers Are Saying
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        {/* Slider Container */}
        <div className="flex items-center justify-center">
          {/* Cards */}
          <div className="flex justify-center overflow-hidden w-full gap-6 transition-transform duration-500">
            {displayReviews.map((review, idx) => {
              const isHighlighted = idx === Math.floor(visibleCount / 2);
              return (
                <div
                  key={review.id}
                  className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 rounded-2xl p-8 text-left mx-auto transition-all duration-500 ${
                    isHighlighted
                      ? "  scale-105 border-t-4 border-blue-500"
                      : " scale-95 opacity-70"
                  }`}
                >
                  <p className="text-gray-700 italic mb-4 leading-relaxed break-words">
                    &quot;{review.review}&quot;
                  </p>
                  <hr className="border-dashed border-gray-300 mb-4" />
                  <div className="flex items-center">
                    <img
                      src={review.user_photoURL}
                      alt={review.userName}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <h3 className="font-semibold text-gray-900 text-base">
                      {review.userName}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition z-10"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          {/* Dots */}
          <div className="flex justify-center items-center gap-2">
            {reviews.map((_, idx) => (
              <span
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-blue-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              ></span>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-3 bg-white rounded-full shadow hover:bg-gray-100 transition z-10"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerSays;
