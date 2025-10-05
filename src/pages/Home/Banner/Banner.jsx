import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import image1 from "../../../assets/banner/banner1.png";
import image2 from "../../../assets/banner/banner2.png";
import image3 from "../../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <div>
      <Carousel
        autoPlay={true}
        interval={3000}
        infiniteLoop={true}
        stopOnHover={true}
        transitionTime={1000}
        showThumbs={false}
      >
        <div>
          <img src={image1} />
          <p className="legend">Book Now</p>
        </div>
        <div>
          <img src={image2} />
          <p className="legend">Start Shipping</p>
        </div>
        <div>
          <img src={image3} />
          <p className="legend">Track Your Parcel</p>
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
