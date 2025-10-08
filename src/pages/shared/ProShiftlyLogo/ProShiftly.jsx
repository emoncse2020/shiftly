import { Link } from "react-router";
import logo from "../../../assets/logo.png";

const ProShiftly = () => {
  return (
    <Link to={"/"}>
      {" "}
      <div className="flex items-end">
        <img className="mb-2" src={logo} alt="" />
        <p className="text-3xl font-extrabold -ml-4">Shiftly</p>
      </div>
    </Link>
  );
};

export default ProShiftly;
