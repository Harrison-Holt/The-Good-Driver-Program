
import React from 'react';
import Navibar from '../../components/Navibar';

const About: React.FC = () => {
  return (
    <>
      <Navibar />
      
      {/* Hero Section */}
      <div className="bg-light p-5 text-center">
        <h1 className="display-4">About Our Trucking Incentive System</h1>
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
                <p><strong>Team Number:</strong> 08</p>
              </div>
              <div className="col-md-6">
                <p><strong>Version (Sprint #):</strong> Sprint 3</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Release Date:</strong> 2024-09-23</p>
              </div>
              <div className="col-md-6">
                <p><strong>Product Name:</strong> Trucking Incentive System</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <p><strong>Product Description:</strong> 
                  This system is designed to help sponsors (companies working with truck drivers) motivate and reward truck drivers 
                  for positive on-road behavior. Drivers accumulate points for good driving practices, which they can redeem for rewards 
                  such as products from a catalog. Points can also be deducted for negative driving behavior, giving companies a way 
                  to encourage safety and efficiency on the road. All products are sold and delivered through a third-party vendor.
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default About;

