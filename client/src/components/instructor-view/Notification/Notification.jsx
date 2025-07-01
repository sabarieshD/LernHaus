import React, { useState } from "react";
import axios from "axios";

const Notification = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBulk, setIsBulk] = useState(false); // Toggle between individual and bulk notification

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const endpoint = isBulk
        ? "http://localhost:5000/instructor/notification/send-to-all"
        : "http://localhost:5000/instructor/notification/send-to-user";

      const payload = isBulk
        ? { subject, message }
        : { email, subject, message };

      const res = await axios.post(endpoint, payload);

      setResponseMessage(res.data.message);
    } catch (error) {
      setResponseMessage("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Send Notification
        </h2>

        {/* Toggle for Individual or Bulk Notification */}
        <div className="flex items-center mb-4">
          <label className="mr-2 font-medium">Notification Type:</label>
          <select
            value={isBulk ? "bulk" : "individual"}
            onChange={(e) => setIsBulk(e.target.value === "bulk")}
            className="p-2 border rounded-lg"
          >
            <option value="individual">Individual Notification</option>
            <option value="bulk">Bulk Notification</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isBulk && (
            <input
              type="email"
              placeholder="Recipient Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required={!isBulk}
            />
          )}

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
        {responseMessage && (
          <p className="text-center mt-4 text-gray-700">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
