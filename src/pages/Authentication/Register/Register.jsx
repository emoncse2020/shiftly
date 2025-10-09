import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocailLogin/SocialLogin";
import axios from "axios";
import { useState } from "react";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then(async (res) => {
        // console.log(res.user);
        // update user info at database
        const userInfo = {
          email: data.email,
          role: "user", //default
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);
        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile).then(() => {
          console.log("Profile name pic added");
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    // console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    const res = await axios.post(imageUploadUrl, formData);

    setProfilePic(res.data.data.url);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
        {/* name field */}
        <label className="label">Name</label>
        <input
          type="text"
          {...register("name", {
            required: true,
          })}
          className="input w-full  md:w-8/12"
          placeholder="Name"
        />
        {errors.name?.type === "required" && (
          <p role="alert" className="text-red-400">
            name is required
          </p>
        )}

        {/* profile picture */}
        <label className="label">Profile</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="input w-full  md:w-8/12"
          placeholder="Your profile picture"
        />
        {/* email field */}
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
