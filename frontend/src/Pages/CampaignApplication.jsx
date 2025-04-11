import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { uploadPdfToCloudinary } from '../cloudinaryUpload.js';
import { campaignService } from '../services/campaignService.js';

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
    campaignImage: null,
    
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
  const [campaignImagePreview, setCampaignImagePreview] = useState(null);
  const [campaignImageFile, setCampaignImageFile] = useState(null);
  
  // PDF state
  const [pdfData, setPdfData] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
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
        } else if (name === 'campaignImage') {
          setCampaignImagePreview(event.target.result);
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

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Campaign Application', 105, 15, { align: 'center' });
    
    // Add application details
    doc.setFontSize(12);
    doc.text(`Applicant: ${formData.firstName} ${formData.lastName}`, 20, 30);
    doc.text(`Email: ${formData.email}`, 20, 40);
    doc.text(`Phone: ${formData.phone}`, 20, 50);
    
    // Campaign details
    doc.text(`Campaign Title: ${formData.campaignTitle}`, 20, 70);
    doc.text(`Category: ${formData.campaignCategory}`, 20, 80);
    doc.text(`Fundraising Goal: $${formData.fundraisingGoal}`, 20, 90);
    doc.text(`Duration: ${formData.campaignDuration} days`, 20, 100);
    
    // Description (with word wrap)
    const splitDescription = doc.splitTextToSize(formData.campaignDescription || 'No description provided', 170);
    doc.text('Description:', 20, 120);
    doc.text(splitDescription, 20, 130);
    
    // Add document information
    let currentY = 130 + splitDescription.length * 5;
    doc.text('Uploaded Documents:', 20, currentY);
    currentY += 10;
    
    // Add ID document information
    if (idPreview) {
      doc.text('✓ ID Document: Uploaded', 20, currentY);
      
      // If you want to add the actual image (assuming idPreview contains the file data)
      try {
        if (typeof idPreview === 'string' && idPreview.startsWith('data:')) {
          // Add image if it's a data URL
          doc.addImage(idPreview, 'JPEG', 20, currentY + 5, 50, 30);
          currentY += 40;
        } else {
          currentY += 10;
        }
      } catch (error) {
        console.error('Error adding ID image to PDF:', error);
        currentY += 10;
      }
    } else {
      doc.text('✗ ID Document: Not uploaded', 20, currentY);
      currentY += 10;
    }
    
    // Add address proof information
    if (addressPreview) {
      doc.text('✓ Proof of Address: Uploaded', 20, currentY);
      
      try {
        if (typeof addressPreview === 'string' && addressPreview.startsWith('data:')) {
          // Add image if it's a data URL
          doc.addImage(addressPreview, 'JPEG', 20, currentY + 5, 50, 30);
          currentY += 40;
        } else {
          currentY += 10;
        }
      } catch (error) {
        console.error('Error adding address proof image to PDF:', error);
        currentY += 10;
      }
    } else {
      doc.text('✗ Proof of Address: Not uploaded', 20, currentY);
      currentY += 10;
    }
    
    // Add campaign proposal information
    if (proposalPreview) {
      doc.text('✓ Campaign Proposal: Uploaded', 20, currentY);
      currentY += 10;
    } else {
      doc.text('Campaign Proposal: Not uploaded (Optional)', 20, currentY);
      currentY += 10;
    }
    
    // Add certification information
    currentY += 10;
    doc.text('Certifications:', 20, currentY);
    currentY += 10;
    
    if (formData.agreeTerms) {
      doc.text('✓ Agreed to Terms and Conditions', 20, currentY);
      currentY += 10;
    }
    
    if (formData.agreePrivacyPolicy) {
      doc.text('✓ Agreed to Privacy Policy', 20, currentY);
      currentY += 10;
    }
    
    if (formData.certifyInformation) {
      doc.text('✓ Certified information is accurate', 20, currentY);
    }
    
    // Add submission date
    doc.text(`Submission Date: ${new Date().toLocaleDateString()}`, 20, 280);
    
    // Generate unique filename
    const fileName = `campaign_application_${Date.now()}.pdf`;
    
    // Return the PDF as base64
    const pdfBase64 = doc.output('datauristring');
    return {
      fileName,
      pdfBase64,
      doc
    };
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const pdfResult = generatePDF();
  
      // Better base64 to blob conversion
      let pdfBlob;
      let imageReference = '/api/placeholder/400/300';
      if (campaignImagePreview) {
        // If it's a base64 image (usually starts with "data:image")
        if (campaignImagePreview.startsWith('data:image')) {
          // Upload image to Cloudinary and get URL
          try {
            const imageUrl = await uploadImageToCloudinary(campaignImagePreview);
            imageReference = imageUrl;
          } catch (error) {
            console.error("Failed to upload campaign image:", error);
            // Fall back to placeholder
          }
        } else {
          // It's already a URL, use it
          imageReference = campaignImagePreview;
        }
      }
      try {
        // Extract the base64 data part - remove the header
        const base64Data = pdfResult.pdfBase64.split(',')[1] || pdfResult.pdfBase64;
        
        // Convert base64 to binary
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create blob from binary data
        pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      } catch (error) {
        console.error("Error converting PDF to blob:", error);
        
        // Alternative method as fallback
        pdfBlob = pdfResult.doc.output('blob');
      }
      
      // Create a File object from the blob
      const pdfFile = new File([pdfBlob], pdfResult.fileName, { type: 'application/pdf' });
    
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadPdfToCloudinary(pdfFile);
      console.log("Cloudinary upload successful:", cloudinaryUrl);
      
      // Create a campaign object with only essential data
      const campaign = {
        id: Date.now().toString(),
        title: formData.campaignTitle,
        category: formData.campaignCategory,
        description: formData.campaignDescription,
        goalAmount: parseFloat(formData.fundraisingGoal),
        currentAmount: 0,
        duration: formData.campaignDuration,
        endDate: new Date(Date.now() + parseInt(formData.campaignDuration) * 24 * 60 * 60 * 1000).toISOString(),
        creatorName: `${formData.firstName} ${formData.lastName}`,
        creatorEmail: formData.email,
        pdfApplication: cloudinaryUrl, // Just store the URL
        verified: false,
        donors: 0,
        imageUrl: imageReference
      };
  
      try {
        // Save to backend through the API service
        await campaignService.saveCampaign(campaign);
        
        // Also save to localStorage as a fallback/cache
        try {
          // Get existing campaigns
          const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
                
          // Keep only the 5 most recent campaigns
          if (existingCampaigns.length >= 5) {
            existingCampaigns.sort((a, b) => new Date(b.id) - new Date(a.id));
            existingCampaigns.splice(5); // Keep only 5 campaigns
          }
                
          // Add the new campaign
          existingCampaigns.push(campaign);
                
          // Try to save to localStorage
          localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));
        } catch (storageError) {
          console.error("localStorage save failed", storageError);
          // It's ok if localStorage fails since we have the backend now
        }
  
        // Update state for success
        setPdfData({ ...pdfResult, cloudinaryUrl });
        setSubmitSuccess(true);
        setShowPdfPreview(true);
        
      } catch (apiError) {
        console.error("API save failed, falling back to localStorage only:", apiError);
        setSubmitError("Warning: Could not save to server. Your campaign may not be visible to administrators.");
        
        // Fallback to localStorage only
        try {
          const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
          
          if (existingCampaigns.length >= 5) {
            existingCampaigns.sort((a, b) => new Date(b.id) - new Date(a.id));
            existingCampaigns.splice(5);
          }
          
          existingCampaigns.push(campaign);
          localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));
          
          // Still show success but with a warning
          setPdfData({ ...pdfResult, cloudinaryUrl });
          setSubmitSuccess(true);
          setShowPdfPreview(true);
        } catch (storageError) {
          throw new Error("Both API and localStorage failed");
        }
      }
  
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitError(`Upload failed: ${error.message}`);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle PDF download
  const handlePdfDownload = () => {
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData.pdfBase64;
      link.download = pdfData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Navigate to admin page
  const goToAdminPage = () => {
    // In a real app, you would use React Router here
    window.location.href = '/admin/campaigns';
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
      return formData.campaignTitle && formData.campaignCategory && formData.fundraisingGoal && formData.campaignDescription && formData.campaignImage;
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
  
  // Render PDF Preview UI
  const renderPdfPreview = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600">Your campaign application has been received and is being reviewed.</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Applicant</p>
              <p className="text-gray-800">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-800">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Campaign Title</p>
              <p className="text-gray-800">{formData.campaignTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fundraising Goal</p>
              <p className="text-gray-800">${formData.fundraisingGoal}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Application PDF</h3>
          <div className="border border-gray-300 rounded-lg p-2 h-64 flex items-center justify-center bg-gray-50">
            <iframe 
              src={pdfData?.pdfBase64}
              className="w-full h-full"
              title="Campaign Application PDF"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePdfDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={goToAdminPage}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  };
  
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

            <div>
              <label htmlFor="campaignImage" className="block text-sm font-medium text-gray-700 mb-1">Campaign Main Image *</label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="campaignImage"
                  name="campaignImage"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  required
                />
                <label 
                  htmlFor="campaignImage" 
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {campaignImagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                {campaignImagePreview && (
                  <span className="ml-2 text-sm text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Image uploaded
                  </span>
                )}
              </div>
              {campaignImagePreview && (
                <div className="mt-2">
                  <img 
                    src={campaignImagePreview} 
                    alt="Campaign preview" 
                    className="h-32 object-cover rounded-md border border-gray-300" 
                  />
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">Upload a high-quality image that represents your campaign (recommended size: 1200×630 pixels)</p>
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
                <p className="mt-1 text-xs text-gray-500">Upload a utility bill, bank statement, or other document showing your address (issued within 3 months)</p>
              </div>
              
              <div>
                <label htmlFor="campaignProposal" className="block text-sm font-medium text-gray-700 mb-1">Campaign Proposal (Optional)</label>
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
                <p className="mt-1 text-xs text-gray-500">Optionally upload a detailed proposal document for your campaign</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">I agree to the Terms and Conditions *</label>
                  <p className="text-gray-500">I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> of using this platform.</p>
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
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreePrivacyPolicy" className="font-medium text-gray-700">I agree to the Privacy Policy *</label>
                  <p className="text-gray-500">I understand how my information will be used as described in the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
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
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="certifyInformation" className="font-medium text-gray-700">I certify that all information provided is accurate *</label>
                  <p className="text-gray-500">I certify that all information provided is true, accurate and complete to the best of my knowledge.</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200 mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Campaign Application</h1>
        <p className="mt-2 text-gray-600">Complete this form to start your fundraising campaign</p>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium text-blue-700">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        
        {/* Step labels */}
        <div className="flex justify-between">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blue-700' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 transition-all duration-300 ${currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              1
            </div>
            <span className="text-xs truncate">Personal</span>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blue-700' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 transition-all duration-300 ${currentStep >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              2
            </div>
            <span className="text-xs truncate">Identity</span>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blue-700' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 transition-all duration-300 ${currentStep >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              3
            </div>
            <span className="text-xs truncate">Campaign</span>
          </div>
          
          <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-blue-700' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mb-1 transition-all duration-300 ${currentStep >= 4 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              4
            </div>
            <span className="text-xs truncate">Documents</span>
          </div>
        </div>
      </div>
      
      {/* Success state */}
      {submitSuccess ? (
        renderPdfPreview()
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Show submission error if any */}
          {submitError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Form steps */}
          {renderFormStep()}
          
          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateCurrentStep()}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !validateCurrentStep() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !validateCurrentStep()}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  (isSubmitting || !validateCurrentStep()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
};

export default CampaignApplication;