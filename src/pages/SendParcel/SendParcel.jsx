import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// === Generate Unique Tracking ID ===
const generateTrackingId = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // 20251007
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // A8D3XQ
  return `PCL-${datePart}-${randomPart}`;
};

const SendParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();

  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];

  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);

  const getDistrictsByRegion = (region) =>
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "Document",
    },
  });

  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  // Update sender/receiver districts dynamically
  useEffect(() => {
    if (senderRegion) {
      setSenderDistricts(getDistrictsByRegion(senderRegion));
      setValue("senderDistrict", "");
    }
  }, [senderRegion, setValue]);

  useEffect(() => {
    if (receiverRegion) {
      setReceiverDistricts(getDistrictsByRegion(receiverRegion));
      setValue("receiverDistrict", "");
    }
  }, [receiverRegion, setValue]);

  // === Handle Submit ===
  const onSubmit = (data) => {
    const weight = parseFloat(data.parcelWeight);
    const sameCity =
      data.senderRegion === data.receiverRegion &&
      data.senderDistrict === data.receiverDistrict;

    let baseCharge = 0;
    let extraWeight = 0;
    let outsideExtra = 0;

    // === Pricing Logic ===
    if (data.parcelType === "Document") {
      if (weight <= 3) baseCharge = sameCity ? 60 : 80;
      else {
        extraWeight = (weight - 3) * 40;
        baseCharge = sameCity ? 110 : 150;
        if (!sameCity) outsideExtra = 40;
      }
    } else {
      if (weight <= 3) baseCharge = sameCity ? 110 : 150;
      else {
        extraWeight = (weight - 3) * 40;
        baseCharge = sameCity ? 110 : 150;
        if (!sameCity) outsideExtra = 40;
      }
    }

    const total = baseCharge + extraWeight + outsideExtra;

    // === Final Parcel Data ===
    const parcelData = {
      ...data,
      tracking_id: generateTrackingId(),
      cost: total,
      created_by: user?.email || "unknown@system.com",
      payment_status: "unpaid",
      delivery_status: "not_collected",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_date: new Date().toLocaleDateString("en-GB"), // 07/10/2025
      created_time: new Date().toLocaleTimeString("en-US", { hour12: true }), // 4:55 PM
      status_history: [
        {
          status: "created",
          message: "Parcel booked successfully",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // console.log("📦 Parcel Data to Save:", parcelData);

    // === SweetAlert Confirmation ===
    Swal.fire({
      title: "Confirm Booking",
      html: `
        <div style="font-size:14px; color:#475569; text-align:left; line-height:1.6;">
          <div><b>Parcel:</b> ${data.parcelType}</div>
          <div><b>Weight:</b> ${weight} kg</div>
          <div><b>From:</b> ${data.senderDistrict}</div>
          <div><b>To:</b> ${data.receiverDistrict}</div>
          <hr style="margin:8px 0; border:1px solid #e5e7eb;" />
          <div style="display:flex; justify-content:space-between;">
            <span>Base</span><b>৳${baseCharge}</b>
          </div>
          ${
            extraWeight
              ? `<div style="display:flex; justify-content:space-between;"><span>Extra</span><b>৳${extraWeight}</b></div>`
              : ""
          }
          ${
            outsideExtra
              ? `<div style="display:flex; justify-content:space-between;"><span>Outside</span><b>৳${outsideExtra}</b></div>`
              : ""
          }
          <hr style="margin:8px 0; border:1px solid #e5e7eb;" />
          <div style="display:flex; justify-content:space-between; font-weight:600; color:#16a34a;">
            <span>Total</span><b>৳${total}</b>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "✅ Confirm",
      cancelButtonText: "✏️ Edit",
      reverseButtons: true,
      width: "360px",
      background: "#fff",
      customClass: {
        popup: "rounded-xl shadow-md border border-gray-100",
        actions: "flex justify-center gap-3 mt-4",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md transition",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md transition",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // 🟢 Save to Backend (example)
        // fetch("/api/parcels", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(parcelData),
        // })
        // .then(res => res.json())
        // .then(() => {
        axiosSecure.post("/parcels", parcelData).then((res) => {
          // Todl :redirect to the payment page
          //   console.log(res.data);
          if (res.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Booking Confirmed",
              text: `Tracking ID: ${parcelData.tracking_id}`,
              confirmButtonText: "Done",
              confirmButtonColor: "#16a34a",
              width: "320px",
              customClass: {
                popup: "rounded-xl shadow border border-gray-100",
              },
            }).then(() => {
              reset({ parcelType: "Document" });
            });
          }
        });

        // });
      }
    });
  };

  // === Reusable Input Components ===
  const InputField = ({ label, name, placeholder, type = "text" }) => (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input input-bordered w-full ${
          errors[name] ? "input-error" : ""
        }`}
        {...register(name, { required: `${label} is required` })}
      />
      {errors[name] && (
        <p className="text-error text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options, placeholder }) => (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className={`select select-bordered w-full ${
          errors[name] ? "select-error" : ""
        }`}
        {...register(name, { required: `${label} is required` })}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-error text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  const TextareaField = ({ label, name, placeholder }) => (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea
        placeholder={placeholder}
        className={`textarea textarea-bordered h-24 w-full ${
          errors[name] ? "textarea-error" : ""
        }`}
        {...register(name, { required: `${label} is required` })}
      />
      {errors[name] && (
        <p className="text-error text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Parcel</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* === Parcel Type === */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Enter your parcel details
        </h2>

        <div className="flex space-x-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="Document"
              className="radio checked:bg-primary"
              {...register("parcelType")}
            />
            <span className="text-gray-700">Document</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="Non-Document"
              className="radio checked:bg-primary"
              {...register("parcelType")}
            />
            <span className="text-gray-700">Non-Document</span>
          </label>
        </div>

        {/* Parcel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <InputField
            label="Parcel Name"
            name="parcelName"
            placeholder="Parcel Name"
          />
          <InputField
            label="Parcel Weight (KG)"
            name="parcelWeight"
            placeholder="Parcel Weight (KG)"
            type="number"
          />
        </div>

        {/* Sender / Receiver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Sender Details
            </h3>
            <InputField
              label="Sender Name"
              name="senderName"
              placeholder="Sender Name"
            />
            <InputField
              label="Sender Email"
              name="senderEmail"
              placeholder="Sender Email"
              type="email"
            />
            <InputField
              label="Sender Address"
              name="senderAddress"
              placeholder="Address"
            />
            <InputField
              label="Sender Contact No"
              name="senderContactNo"
              placeholder="Sender Contact No"
              type="tel"
            />
            <SelectField
              label="Sender Region"
              name="senderRegion"
              placeholder="Select region"
              options={uniqueRegions}
            />
            {senderDistricts.length > 0 && (
              <SelectField
                label="Sender District"
                name="senderDistrict"
                placeholder="Select district"
                options={senderDistricts}
              />
            )}
            <TextareaField
              label="Pickup Instruction"
              name="pickupInstruction"
              placeholder="Any special pickup note"
            />
          </div>

          {/* Receiver */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Receiver Details
            </h3>
            <InputField
              label="Receiver Name"
              name="receiverName"
              placeholder="Receiver Name"
            />
            <InputField
              label="Receiver Address"
              name="receiverAddress"
              placeholder="Address"
            />
            <InputField
              label="Receiver Contact No"
              name="receiverContactNo"
              placeholder="Receiver Contact No"
              type="tel"
            />
            <SelectField
              label="Receiver Region"
              name="receiverRegion"
              placeholder="Select region"
              options={uniqueRegions}
            />
            {receiverDistricts.length > 0 && (
              <SelectField
                label="Receiver District"
                name="receiverDistrict"
                placeholder="Select district"
                options={receiverDistricts}
              />
            )}
            <TextareaField
              label="Delivery Instruction"
              name="deliveryInstruction"
              placeholder="Any delivery note"
            />
          </div>
        </div>

        {/* === Submit === */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-3">
            * Pickup Time: 4pm–7pm (Approx)
          </p>
          <button
            type="submit"
            className="btn bg-lime-400 text-gray-800 hover:bg-lime-500 border-none w-auto px-10 py-3 font-semibold shadow-md"
          >
            Proceed to Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
