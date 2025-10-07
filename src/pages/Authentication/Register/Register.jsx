import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocailLogin/SocialLogin";

const Register = () => {
  const { createUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
        <label className="label">Email</label>
        <input
          type="email"
          {...register("email", {
            required: true,
          })}
          className="input w-full  md:w-8/12"
          placeholder="Email"
        />
        {errors.email?.type === "required" && (
          <p role="alert" className="text-red-400">
            Email is required
          </p>
        )}

        <label className="label">Password</label>
        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          className="input w-full  md:w-8/12"
          placeholder="Password"
        />
        {errors.password?.type === "required" && (
          <p role="alert" className="text-red-400">
            Password is required
          </p>
        )}
        {errors.password?.type === "minLength" && (
          <p role="alert" className="text-red-400">
            Password must be 6 character or longer
          </p>
        )}

        <button className="btn-primary btn mt-4 w-full  md:w-8/12 text-black">
          Register
        </button>
        <p className="mt-1">
          <small>
            Already have and Account{" "}
            <Link
              to={"/login"}
              className="link link-primary px-2 font-semibold"
            >
              Login
            </Link>
          </small>
        </p>
      </form>
      <div className="w-full md:w-8/12">
        <SocialLogin action={"Sign Up"} />
      </div>
    </div>
  );
};

export default Register;
