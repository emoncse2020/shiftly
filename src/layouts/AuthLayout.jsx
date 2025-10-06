import { Outlet } from "react-router";
import authImg from "../assets/authImage.png";
import ProFastLogo from "../pages/shared/ProShiftlyLogo/ProShiftly";

const AuthLayout = () => {
  return (
    <div>
      <div className=" bg-base-200 p-12">
        <div>
          <ProFastLogo />
        </div>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex-1">
            <img src={authImg} className="" />
          </div>
          <div className="flex-1 border-2">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
