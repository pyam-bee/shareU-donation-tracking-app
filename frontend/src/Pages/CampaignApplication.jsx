import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CampaignApplication = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // ID Verification
    idType: 'passport',
    idNumber: '',
    idExpiry: '',
    
    // Campaign Information
    campaignTitle: '',
    campaignCategory: 'education',
    fundraisingGoal: '',
    campaignDuration: '30',
    campaignDescription: '',
    
    // Supporting Documents
    idDocument: null,
    addressProof: null,
    campaignProposal: null,
    
    // Terms and compliance
    agreeTerms: false,
    agreePrivacyPolicy: false,
    certifyInformation: false,
  });
  
  // Multi-step form control
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // File upload preview states
  const [idPreview, setIdPreview] = useState(null);
  const [addressPreview, setAddressPreview] = useState(null);
  const [proposalPreview, setProposalPreview] = useState(null);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Set file preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (name === 'idDocument') {
          setIdPreview(event.target.result);
        } else if (name === 'addressProof') {
          setAddressPreview(event.target.result);
        } else if (name === 'campaignProposal') {
          setProposalPreview(event.target.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };
  
  // Navigate between form steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, we're just simulating a successful submission
      // In a real application, you would send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setSubmitError(null);
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      setSubmitError("There was an error submitting your application. Please try again.");
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Progress bar calculation
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  // Handle form validation for each step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2: // ID Verification
        return formData.idType && formData.idNumber && formData.idExpiry;
      case 3: // Campaign Information
        return formData.campaignTitle && formData.campaignCategory && formData.fundraisingGoal && formData.campaignDescription;
      case 4: // Supporting Documents & Terms
        return formData.idDocument && formData.addressProof && formData.agreeTerms && formData.agreePrivacyPolicy && formData.certifyInformation;
      default:
        return false;
    }
  };
  
  // Categories for dropdown
  const campaignCategories = [
    { value: 'education', label: 'Education' },
    { value: 'food', label: 'Food & Hunger' },
    { value: 'medical', label: 'Medical & Health' },
    { value: 'infrastructure', label: 'Infrastructure & Community' },
    { value: 'disaster', label: 'Disaster Relief' },
    { value: 'environment', label: 'Environment' },
    { value: 'animals', label: 'Animal Welfare' },
    { value: 'other', label: 'Other' }
  ];
  
  // Campaign durations for dropdown
  const campaignDurations = [
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '180 days' },
    { value: '365', label: 'Full year' }
  ];
  
  // ID types for dropdown
  const idTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'driverLicense', label: "Driver's License" },
    { value: 'nationalId', label: 'National ID Card' },
    { value: 'other', label: 'Other Government-issued ID' }
  ];
  
  // Render form based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Personal Information</h3>
            <p className="text-gray-600 text-sm">Please provide your personal details for verification.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Identity Verification</h3>
            <p className="text-gray-600 text-sm">We need to verify your identity for compliance and security purposes.</p>
            
            <div>
              <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">ID Type *</label>
              <select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {idTypes.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="idExpiry" className="block text-sm font-medium text-gray-700 mb-1">ID Expiry Date *</label>
              <input
                type="date"
                id="idExpiry"
                name="idExpiry"
                value={formData.idExpiry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-800 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Why we need this information</span>
              </div>
              <p className="text-sm text-gray-600">
                We collect this information to comply with financial regulations and to ensure the security of our platform. 
                Your information is encrypted and securely stored. We never share your personal information with third parties without your consent.
              </p>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Campaign Details</h3>
            <p className="text-gray-600 text-sm">Tell us about the campaign you'd like to create.</p>
            
            <div>
              <label htmlFor="campaignTitle" className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
              <input
                type="text"
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="e.g., Clean Water for Rural Schools"
              />
            </div>
            
            <div>
              <label htmlFor="campaignCategory" className="block text-sm font-medium text-gray-700 mb-1">Campaign Category *</label>
              <select
                id="campaignCategory"
                name="campaignCategory"
                value={formData.campaignCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {campaignCategories.map((category) => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="fundraisingGoal" className="block text-sm font-medium text-gray-700 mb-1">Fundraising Goal (USD) *</label>
              <input
                type="number"
                id="fundraisingGoal"
                name="fundraisingGoal"
                value={formData.fundraisingGoal}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                min="100"
                placeholder="5000"
              />
            </div>
            
            <div>
              <label htmlFor="campaignDuration" className="block text-sm font-medium text-gray-700 mb-1">Campaign Duration *</label>
              <select
                id="campaignDuration"
                name="campaignDuration"
                value={formData.campaignDuration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {campaignDurations.map((duration) => (
                  <option key={duration.value} value={duration.value}>{duration.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 mb-1">Campaign Description *</label>
              <textarea
                id="campaignDescription"
                name="campaignDescription"
                value={formData.campaignDescription}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Describe your campaign, its goals, and how the funds will be used..."
              ></textarea>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center text-yellow-800 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Campaign Guidelines</span>
              </div>
              <p className="text-sm text-gray-600">
                All campaigns are reviewed by our team before approval. Campaigns must comply with our terms of service and 
                fundraising policies. We recommend being specific about how funds will be used and providing regular updates 
                to donors once your campaign is active.
              </p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Supporting Documents & Agreement</h3>
            <p className="text-gray-600 text-sm">Please upload the required verification documents and accept our terms.</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="idDocument" className="block text-sm font-medium text-gray-700 mb-1">ID Document Copy *</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="idDocument"
                    name="idDocument"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                  />
                  <label 
                    htmlFor="idDocument" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {idPreview ? 'Change File' : 'Upload File'}
                  </label>
                  {idPreview && (
                    <span className="ml-2 text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      File uploaded
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload a clear photo or scan of your ID (passport, driver's license, etc.)</p>
              </div>
              
              <div>
                <label htmlFor="addressProof" className="block text-sm font-medium text-gray-700 mb-1">Proof of Address *</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="addressProof"
                    name="addressProof"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                  />
                  <label 
                    htmlFor="addressProof" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {addressPreview ? 'Change File' : 'Upload File'}
                  </label>
                  {addressPreview && (
                    <span className="ml-2 text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      File uploaded
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Recent utility bill, bank statement, or official mail (less than 3 months old)</p>
              </div>
              
              <div>
                <label htmlFor="campaignProposal" className="block text-sm font-medium text-gray-700 mb-1">Campaign Proposal (optional)</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="campaignProposal"
                    name="campaignProposal"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label 
                    htmlFor="campaignProposal" 
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {proposalPreview ? 'Change File' : 'Upload File'}
                  </label>
                  {proposalPreview && (
                    <span className="ml-2 text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      File uploaded
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">You may upload a detailed proposal document for your campaign</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> *</label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreePrivacyPolicy"
                    name="agreePrivacyPolicy"
                    type="checkbox"
                    checked={formData.agreePrivacyPolicy}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreePrivacyPolicy" className="text-gray-700">I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *</label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="certifyInformation"
                    name="certifyInformation"
                    type="checkbox"
                    checked={formData.certifyInformation}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="certifyInformation" className="text-gray-700">I certify that all information provided is true and accurate *</label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // In case of successful submission
  if (submitSuccess) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted Successfully!</h2>
            <p className="text-green-700 mb-6">
              Thank you for applying to create a campaign with Great Care Charity. 
              Our team will review your application and get back to you within 3-5 business days.
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">
                Your reference number is: <span className="font-semibold">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </p>
              <p className="text-gray-600">
                You will receive a confirmation email shortly at <span className="font-semibold">{formData.email}</span>
              </p>
            </div>
            <div className="mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center px-5 py-2 text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="px-4 py-5 sm:p-6 lg:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Application</h2>
            <p className="mt-1 text-gray-600">
              Complete this form to apply for creating a fundraising campaign
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${progressPercentage}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
          </div>
          
          {/* Error message */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Form steps */}
            {renderFormStep()}
            
            {/* Navigation buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateCurrentStep()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!validateCurrentStep() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!validateCurrentStep() || isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(!validateCurrentStep() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
          
          {/* Help section */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">Need Help?</h4>
            <div className="mt-2 flex space-x-6">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQs
              </a>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignApplication;