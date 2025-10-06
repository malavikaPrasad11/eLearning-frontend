// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import Header from "./Header";
// import Rating from "@mui/material/Rating";
// import Typography from "@mui/material/Typography";

// export default function FeedbackAll() {
//   const [value, setValue] = useState(2);
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     comment: "",
//     image: "",
//   });

//   // Using proxy (localhost:5000 or /api in production)
//   const baseURL = "/api/feedback";

//   // Fetch all feedbacks
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(baseURL);
//         const data = await res.json();
//         setFeedbackData(data);
//       } catch (err) {
//         console.error("Error fetching feedbacks:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // prevent reload
//     try {
//       const response = await fetch(`${baseURL}/new`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...formData, rating: value }),
//       });

//       if (!response.ok) throw new Error("Failed to submit feedback");

//       const newFeedback = await response.json();

//       // update UI immediately
//       setFeedbackData([newFeedback, ...feedbackData]);
//       setFormData({ name: "", comment: "", image: "" });
//       setValue(2);
//       alert("Feedback submitted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Submission failed. Please try again.");
//     }
//   };

//   // Format date
//   const formatDate = (date) =>
//     new Date(date).toLocaleString("en-US", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   return (
//     <>
//       <Navbar />
//       <Header name="Feedbacks" />

//       {/* feedback form */}
//       <div className="container mt-4">
//         <div className="row mt-4 wow fadeInUp" data-wow-delay="0.3s">
//           <h1 className="text-center">Give your Feedback</h1>
//           <form
//             onSubmit={handleSubmit}
//             className="col-md-6 offset-md-3 mb-4 wow fadeInUp"
//           >
//             <div className="form-floating mb-3">
//               <input
//                 type="text"
//                 name="name"
//                 className="form-control"
//                 placeholder="John Deo"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               <label htmlFor="floatingInput">Name</label>
//             </div>

//             <div className="form-floating mb-3">
//               <textarea
//                 name="comment"
//                 className="form-control"
//                 placeholder="Enter Your Feedback"
//                 style={{ height: "100px" }}
//                 required
//                 value={formData.comment}
//                 onChange={handleChange}
//               ></textarea>
//               <label htmlFor="floatingInput">Comment</label>
//             </div>

//             <div className="form-floating mb-3">
//               <input
//                 type="text"
//                 name="image"
//                 className="form-control"
//                 placeholder="Enter Your Image URL"
//                 value={formData.image}
//                 onChange={handleChange}
//               />
//               <label htmlFor="floatingInput">Image URL</label>
//             </div>

//             <Typography component="legend">Rating</Typography>
//             <Rating
//               name="simple-controlled"
//               value={value}
//               onChange={(event, newValue) => {
//                 setValue(newValue);
//               }}
//             />

//             <br />
//             <button className="btn btn-primary mt-3">Submit</button>
//             <hr />
//           </form>
//         </div>

//         {/* All feedbacks */}
//         <div className="text-center wow fadeInUp" data-wow-delay="0.3s">
//           <h6 className="section-title bg-white text-center text-primary px-3">
//             All Feedbacks of Users
//           </h6>
//           <h1 className="mb-5">All Feedbacks</h1>
//         </div>
//       </div>

//       <div className="row offset-md-2">
//         {feedbackData.map((feedback) => (
//           <div
//             key={feedback._id}
//             className="col-md-5 ms-2 mt-3 card mb-3 pl-2 wow fadeInUp"
//             style={{ maxWidth: "540px" }}
//             data-wow-delay="0.3s"
//           >
//             <div className="row g-0">
//               <div className="col-md-3 mt-3">
//                 <img
//                   style={{ width: "6rem", height: "6rem" }}
//                   src={feedback.image}
//                   className="d-block border rounded-circle p-2 mx-auto mb-3"
//                   alt=""
//                 />
//               </div>
//               <div className="col-md-8">
//                 <p className="card-text mb-0 ps-3">
//                   <small className="text-body-secondary">
//                     {formatDate(feedback.date)}
//                   </small>
//                 </p>
//                 <div className="card-body pt-0 mt-0">
//                   <p className="card-text p-0 fw-bold">{feedback.name}</p>
//                   <p className="card-text">{feedback.comment}</p>
//                   <Rating name="read-only" value={feedback.rating} readOnly />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </>
//   );
// }
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Header from "./Header";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function FeedbackAll() {
  const [value, setValue] = useState(2); // rating
  const [feedbackData, setFeedbackData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    image: "",
  });

  // Replace with your MongoDB backend endpoint
  const baseURL = "https://elearning-backend-oa0u.onrender.com/feedback";

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(baseURL);
      const data = await res.json();
      // MongoDB backend returns data as an array directly
      setFeedbackData(data.data || data || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseURL}/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rating: value }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      const newFeedback = await res.json();

      // Add to UI immediately
      setFeedbackData([newFeedback, ...feedbackData]);
      setFormData({ name: "", comment: "", image: "" });
      setValue(2);
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  // Format date
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <Navbar />
      <Header name="Feedbacks" />

      <div className="container mt-4">
        <div className="row mt-4 wow fadeInUp" data-wow-delay="0.3s">
          <h1 className="text-center">Give your Feedback</h1>
          <form
            onSubmit={handleSubmit}
            className="col-md-6 offset-md-3 mb-4 wow fadeInUp"
          >
            <div className="form-floating mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <label>Name</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                name="comment"
                className="form-control"
                placeholder="Enter Your Feedback"
                style={{ height: "100px" }}
                required
                value={formData.comment}
                onChange={handleChange}
              />
              <label>Comment</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                name="image"
                className="form-control"
                placeholder="Enter Your Image URL"
                value={formData.image}
                onChange={handleChange}
              />
              <label>Image URL</label>
            </div>

            <Typography component="legend">Rating</Typography>
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(e, newValue) => setValue(newValue)}
            />

            <br />
            <button className="btn btn-primary mt-3" type="submit">
              Submit
            </button>
            <hr />
          </form>
        </div>

        {/* All feedbacks */}
        <div className="text-center wow fadeInUp" data-wow-delay="0.3s">
          <h6 className="section-title bg-white text-center text-primary px-3">
            All Feedbacks of Users
          </h6>
          <h1 className="mb-5">All Feedbacks</h1>
        </div>
      </div>

      <div className="row offset-md-2">
        {feedbackData.map((feedback) => (
          <div
            key={feedback._id || feedback.id}
            className="col-md-5 ms-2 mt-3 card mb-3 pl-2 wow fadeInUp"
            style={{ maxWidth: "540px" }}
            data-wow-delay="0.3s"
          >
            <div className="row g-0">
              <div className="col-md-3 mt-3">
                <img
                  style={{ width: "6rem", height: "6rem" }}
                  src={
                    feedback.image ||
                    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  }
                  className="d-block border rounded-circle p-2 mx-auto mb-3"
                  alt=""
                />
              </div>
              <div className="col-md-8">
                <p className="card-text mb-0 ps-3">
                  <small className="text-body-secondary">
                    {formatDate(feedback.date)}
                  </small>
                </p>
                <div className="card-body pt-0 mt-0">
                  <p className="card-text p-0 fw-bold">{feedback.name}</p>
                  <p className="card-text">{feedback.comment}</p>
                  <Rating
                    name="read-only"
                    value={feedback.rating}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}