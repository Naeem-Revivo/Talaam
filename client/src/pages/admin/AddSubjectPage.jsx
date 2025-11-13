import React, { useState } from "react";

export default function AddSubjectPage() {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectData = { subjectName, description, code };
    console.log("Created Subject:", subjectData);
    // TODO: Add API call or database save logic here
  };

  const handleCancel = () => {
    setSubjectName("");
    setDescription("");
    setCode("");
  };

  return (
    <div className=" bg-gray-50 flex flex-col justify-center p-6">
        <h1 className="text-4xl font-bold text-blue-dark mb-12">
          Create Subject
        </h1>

      <div className="rounded-[14px] bg-white shadow-[0px_2px_20px_0px_#0327460D] border border-[#03274633] w-full pt-10 pb-7 px-8">
        <h3 className="text-lg font-bold text-blue-dark mb-10">
          Create Subject
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Name */}
          <div>
            <label className="block text-base font-normal text-blue-dark mb-3">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="Enter subject name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full border h-[50px] border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-normal text-blue-dark mb-3">
              Description
            </label>
            <textarea
              placeholder="A brief description of the subject"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full h-[160px] border border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
            ></textarea>
          </div>

          {/* Code (optional) */}
          <div>
            <label className="block text-base font-normal text-blue-dark mb-3">
              Code (optional)
            </label>
            <input
              type="text"
              placeholder="Enter subject code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[50px] border border-[#03274633] rounded-xl px-3 py-2 focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-end pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 sm:w-[120px] py-2 border border-[#E5E7EB] w-full rounded-lg text-base text-blue-dark font-medium bg-white hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sm:w-[120px] py-2 bg-orange-dark w-full text-white text-base font-medium rounded-md hover:bg-orange-600 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
