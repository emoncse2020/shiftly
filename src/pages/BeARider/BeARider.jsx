import React from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import riderImg from "../../assets/agent-pending.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");

  // ✅ Fetch service center data from public folder
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ["serviceCenters"],
    queryFn: async () => {
      const res = await fetch("/serviceCenter.json");
      return res.json();
    },
  });

  // Extract unique regions
  const regions = Array.from(new Set(centers.map((c) => c.region)));

  // Filter districts based on selected region
  const districts = selectedRegion
    ? Array.from(
        new Set(
          centers
            .filter((c) => c.region === selectedRegion)
            .map((c) => c.district)
        )
      )
    : [];

  // Filter covered areas based on selected district
  const coveredAreas = selectedDistrict
    ? centers.find(
        (c) => c.region === selectedRegion && c.district === selectedDistrict
      )?.covered_area || []
    : [];

  // ✅ Submit handler
  const onSubmit = (data) => {
    // console.log("🚴 Rider Application Data:", data);
    // alert("✅ Rider application submitted successfully!");
    const riderData = {
      ...data,
      email: user?.email || "unknown@gmail.com",
      status: "pending",
      created_at: new Date().toISOString(),
    };
    // console.log(formData);
    axiosSecure.post("/riders", riderData).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your application is pending approval",
        });
      }
    });
  };

  return (
    <div className="my-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE - FORM */}
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Be a <span className="text-green-600">Rider</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-lg">
            Join our reliable delivery network and become part of a trusted
            logistics team. Enjoy flexible hours, competitive pay, and real-time
            tracking tools.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-pink-400 w-fit pb-1">
            Tell us about yourself
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            Full Name + Age
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />
                {errors.fullName && (
                  <p className="text-error text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    min: {
                      value: 18,
                      message: "You must be at least 18 years old to apply",
                    },
                  })}
                  placeholder="Age"
                  className="input input-bordered w-full"
                />
                {errors.age && (
                  <p className="text-error text-xs mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
            </div>
            {/* Email + Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div> */}

              <div>
                <input
                  type="tel"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^01[3-9]\d{8}$/,
                      message: "Enter a valid Bangladeshi phone number",
                    },
                  })}
                  placeholder="Contact Number"
                  className="input input-bordered w-full"
                />
                {errors.contact && (
                  <p className="text-error text-xs mt-1">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              {/* <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="male"
                    {...register("gender", { required: "Gender is required" })}
                    className="radio radio-primary"
                  />
                  Male
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="female"
                    {...register("gender", { required: "Gender is required" })}
                    className="radio radio-primary"
                  />
                  Female
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="other"
                    {...register("gender", { required: "Gender is required" })}
                    className="radio radio-primary"
                  />
                  Other
                </label>
              </div>
              {errors.gender && (
                <p className="text-error text-xs mt-1">
                  {errors.gender.message}
                </p>
              )} */}

              <div>
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Gender
                  </span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Male"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="radio radio-primary"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Female"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="radio radio-primary"
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Other"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="radio radio-primary"
                    />
                    Other
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-error text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
            {/* Region + District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  {...register("region", { required: "Region is required" })}
                  className="select select-bordered w-full"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {isLoading ? "Loading Regions..." : "Select Region"}
                  </option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-error text-xs mt-1">
                    {errors.region.message}
                  </p>
                )}
              </div>

              <div>
                <select
                  {...register("district", {
                    required: "District is required",
                  })}
                  className="select select-bordered w-full"
                  disabled={!selectedRegion}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {selectedRegion ? "Select District" : "Select Region First"}
                  </option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-error text-xs mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>
            {/* Covered Area */}
            {/* <div>
              <select
                {...register("coveredArea", {
                  required: "Covered area is required",
                })}
                className="select select-bordered w-full"
                disabled={!selectedDistrict}
                defaultValue=""
              >
                <option value="" disabled>
                  {selectedDistrict
                    ? "Select Covered Area"
                    : "Select District First"}
                </option>
                {coveredAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.coveredArea && (
                <p className="text-error text-xs mt-1">
                  {errors.coveredArea.message}
                </p>
              )}
            </div> */}
            {/* <div>
              <select
                {...register("coveredArea", {
                  required: "At least one covered area is required",
                })}
                className="select select-bordered w-full h-32"
                disabled={!selectedDistrict}
                multiple
              >
                {coveredAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.coveredArea && (
                <p className="text-error text-xs mt-1">
                  {errors.coveredArea.message}
                </p>
              )}
            </div> */}
            <div>
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Covered Areas
                </span>
              </label>
              {coveredAreas.map((area) => (
                <label key={area} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    value={area}
                    {...register("coveredArea")}
                    className="checkbox checkbox-primary"
                  />
                  {area}
                </label>
              ))}
              {errors.coveredArea && (
                <p className="text-error text-xs mt-1">
                  {errors.coveredArea.message}
                </p>
              )}
            </div>
            {/* Rider Type */}
            <div>
              <select
                {...register("riderType", {
                  required: "Rider type is required",
                })}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Rider Type
                </option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
              </select>
              {errors.riderType && (
                <p className="text-error text-xs mt-1">
                  {errors.riderType.message}
                </p>
              )}
            </div>
            {/* NID + Driving License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  {...register("nidNo", { required: "NID number is required" })}
                  placeholder="NID Number"
                  className="input input-bordered w-full"
                />
                {errors.nidNo && (
                  <p className="text-error text-xs mt-1">
                    {errors.nidNo.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("licenseNo", {
                    required: "Driving license number is required",
                  })}
                  placeholder="Driving License Number"
                  className="input input-bordered w-full"
                />
                {errors.licenseNo && (
                  <p className="text-error text-xs mt-1">
                    {errors.licenseNo.message}
                  </p>
                )}
              </div>
            </div>
            {/* Address */}
            <div>
              <textarea
                {...register("address", { required: "Address is required" })}
                placeholder="Full Address"
                className="textarea textarea-bordered w-full h-24"
              ></textarea>
              {errors.address && (
                <p className="text-error text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="btn bg-lime-400 text-gray-800 w-full hover:bg-lime-500 border-none font-semibold shadow-md flex items-center justify-center"
            >
              <Check className="h-5 w-5 mr-2" />
              Submit Application
            </button>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="order-1 lg:order-2 flex justify-center items-center lg:mt-64">
          <img
            src={riderImg}
            alt="Delivery Rider"
            className="w-full h-auto object-contain lg:max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
