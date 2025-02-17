// src/utils/fetchCertifications.js
// import axios from "axios";

// export const fetchCertifications = async () => {
//   const response = await axios.get("https://api.credly.com/v1/me/badges", {
//     headers: {
//       Authorization: `Bearer YOUR_CREDLY_API_KEY`,
//     },
//   });
//   return response.data.data;
// };
export const fetchCertifications = async () => {
    // Mocked data array
    const mockData = [
      {
        id: "1",
        name: "Certified JavaScript Developer",
        description: "Awarded for demonstrating advanced skills in JavaScript.",
        image_url: "https://example.com/badges/javascript.png",
        issued_at: "2023-01-15T00:00:00Z",
      },
      {
        id: "2",
        name: "AWS Certified Solutions Architect",
        description: "Awarded for expertise in designing distributed systems on AWS.",
        image_url: "https://example.com/badges/aws.png",
        issued_at: "2023-03-10T00:00:00Z",
      },
      {
        id: "3",
        name: "Google Cloud Professional Data Engineer",
        description: "Awarded for proficiency in data engineering on Google Cloud.",
        image_url: "https://example.com/badges/google-cloud.png",
        issued_at: "2023-05-20T00:00:00Z",
      },
    ];
  
    // Simulate a delay to mimic network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    // Return the mocked data
    return mockData;
  };