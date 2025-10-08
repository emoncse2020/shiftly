import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocailLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { signIn } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((res) => {
        console.log(res.user);
        navigate(from);
      })
      .catch((error) => {
        console.log(error);
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
          className="input w-full  md:w-8/12 "
          placeholder="Email"
        />
        {errors.email?.type === "required" && (
          <p role="alert">Email is required</p>
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
          <p role="alert">Password is required</p>
        )}
        {errors.password?.type === "minLength" && (
          <p role="alert">Password must be 6 character long</p>
        )}

        <div>
          <a className="link link-hover">Forgot password?</a>
        </div>

        <button className="btn btn-primary text-black mt-4 w-full md:w-8/12">
          Login
        </button>
        <p className="mt-1">
          <small>
            Don't have any Account{" "}
            <Link to={"/register"} className="link link-primary">
              Register
            </Link>
          </small>
        </p>
      </form>
      <div className="w-full md:w-8/12">
        <SocialLogin action={"Sign In"} />
      </div>
    </div>
  );
};

export default Login;
