import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
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
          className="input"
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
          className="input"
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

        <button className="btn btn-neutral mt-4">Login</button>
      </form>
    </div>
  );
};

export default Login;
