import React, { useEffect, useState } from 'react';
import Navibar from '../../components/Navibar';

interface AboutData {
  team_number: number;
  sprint_number: number;
  release_date: string;
  product_name: string;
  product_description: string;
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the "About" page data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/about');
        const data = await response.json();
        console.log('API Response:', data); // Log the response to inspect it
        setAboutData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navibar />
      
      {/* Hero Section */}
      <div className="bg-light p-5 text-center">
        <h1 className="display-4">About Our {aboutData?.product_name}</h1>
        <p className="lead">
          A system designed to reward and incentivize truck drivers for safe and efficient driving.
        </p>
      </div>

      {/* Project Information Section */}
      <div className="about-page mt-5">
        <h2 className="text-center">Project Information</h2>
        <div className="card shadow-sm p-4 mb-5 bg-white rounded">
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Team Number:</strong> {aboutData?.team_number}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Version (Sprint #):</strong> Sprint {aboutData?.sprint_number}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Release Date:</strong> {aboutData?.release_date}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Product Name:</strong> {aboutData?.product_name}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p><strong>Product Description:</strong> 
                {aboutData?.product_description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;