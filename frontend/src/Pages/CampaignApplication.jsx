import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { uploadPdfToCloudinary } from '../cloudinaryUpload.js';
import { campaignService } from '../services/campaignService.js';
import { ethereumService } from '../services/ethereumService.js';
import { contractService } from '../services/contractService.js';

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
    
    // Crypto Donation Settings
    acceptCrypto: true,
    ethWalletAddress: '',
    
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
  
  // Crypto conversion state
  const [ethRate, setEthRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [ethEquivalent, setEthEquivalent] = useState('0');
  const [walletAddressValid, setWalletAddressValid] = useState(true);
  
  // Update ethereum service when wallet address changes
  useEffect(() => {
    if (formData.acceptCrypto && formData.ethWalletAddress && walletAddressValid) {
      ethereumService.setRecipientAddress(formData.ethWalletAddress);
    }
  }, [formData.ethWalletAddress, formData.acceptCrypto, walletAddressValid]);

  // Fetch ETH to USD exchange rate on component mount
  useEffect(() => {
    const fetchEthRate = async () => {
      setIsLoadingRate(true);
      try {
        // In a real app, you would use a real API like CoinGecko or similar
        // This is a mock response for demonstration
        const mockResponse = { ethereum: { usd: 2850.75 } };
        setEthRate(mockResponse.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH rate:', error);
        setEthRate(2850.75); // Fallback rate if API fails
      } finally {
        setIsLoadingRate(false);
      }
    };
    
    fetchEthRate();
  }, []);
  
  // Calculate ETH equivalent whenever fundraising goal changes
  useEffect(() => {
    if (ethRate && formData.fundraisingGoal) {
      const ethAmount = parseFloat(formData.fundraisingGoal) / ethRate;
      setEthEquivalent(ethAmount.toFixed(4));
    } else {
      setEthEquivalent('0');
    }
  }, [ethRate, formData.fundraisingGoal]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Validate wallet address
    if (name === 'ethWalletAddress') {
      validateWalletAddress(value);
    }
  };
  
  // Ethereum wallet address validation
  const validateWalletAddress = (address) => {
    // Basic ETH address validation - should start with 0x and be 42 chars total
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    setWalletAddressValid(isValid || address === '');
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
    doc.text(`Fundraising Goal: $${formData.fundraisingGoal} (≈${ethEquivalent} ETH)`, 20, 90);
    doc.text(`Duration: ${formData.campaignDuration} days`, 20, 100);
    
    // Initialize currentY variable first before using it
    let currentY = 110;
    
    // Crypto details if applicable
    if (formData.acceptCrypto) {
      doc.text(`Ethereum Wallet: ${formData.ethWalletAddress}`, 20, currentY);
      currentY += 10;
    }
    
    // Description (with word wrap)
    const splitDescription = doc.splitTextToSize(formData.campaignDescription || 'No description provided', 170);
    doc.text('Description:', 20, currentY);
    doc.text(splitDescription, 20, currentY + 10);
    
    // Add document information
    currentY = currentY + 10 + splitDescription.length * 5;
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
    
    // Add campaign proposal information - UPDATED CODE SECTION
    if (proposalPreview) {
      doc.text('✓ Campaign Proposal: Uploaded', 20, currentY);
      
      // For PDF/DOC files, we can't embed them directly, but we'll show file info
      const proposalFileName = formData.campaignProposal ? formData.campaignProposal.name : 'proposal_document';
      const fileSize = formData.campaignProposal ? 
        (formData.campaignProposal.size < 1024 * 1024 
          ? Math.round(formData.campaignProposal.size / 1024) + ' KB' 
          : Math.round(formData.campaignProposal.size / (1024 * 1024) * 10) / 10 + ' MB') 
        : 'Unknown size';
      
      // Add file details
      doc.text(`   File: ${proposalFileName} (${fileSize})`, 20, currentY + 10);
      doc.text(`   Type: Detailed campaign proposal document`, 20, currentY + 20);
      currentY += 30; // Leave space for the file information
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const pdfResult = generatePDF();
  
      // Image handling
      let imageReference = '/api/placeholder/400/300';
      if (campaignImagePreview) {
        if (campaignImagePreview.startsWith('data:image')) {
          try {
            const imageUrl = await uploadPdfToCloudinary(
              new File([dataURLtoBlob(campaignImagePreview)], `campaign_image_${Date.now()}.jpg`, { type: 'image/jpeg' })
            );
            imageReference = imageUrl;
          } catch (error) {
            console.error("Failed to upload campaign image:", error);
          }
        } else {
          imageReference = campaignImagePreview;
        }
      }
      
      // Helper function to convert data URL to Blob
      function dataURLtoBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
      }
      
      // PDF handling
      let pdfBlob;
      try {
        const base64Data = pdfResult.pdfBase64.split(',')[1] || pdfResult.pdfBase64;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      } catch (error) {
        console.error("Error converting PDF to blob:", error);
        pdfBlob = pdfResult.doc.output('blob');
      }
      
      // Create a File object from the blob
      const pdfFile = new File([pdfBlob], pdfResult.fileName, { type: 'application/pdf' });
    
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadPdfToCloudinary(pdfFile);
      console.log("Cloudinary upload successful:", cloudinaryUrl);
      
      // Calculate duration in days from the form input
      const durationInDays = parseInt(formData.campaignDuration);
      
      // First, create the campaign on the blockchain
      try {
        // Initialize contract service if not already initialized
        if (!contractService.contract) {
          await contractService.init();
        }
        
        // Convert fundraising goal to ETH string
        const goalAmountEth = formData.fundraisingGoal.toString();
        
        console.log("Creating campaign on blockchain with:", {
          title: formData.campaignTitle,
          description: formData.campaignDescription,
          goalAmount: goalAmountEth,
          duration: durationInDays
        });
        
        // Create campaign on blockchain
        const blockchainResult = await contractService.createCampaign(
          formData.campaignTitle,
          formData.campaignDescription,
          goalAmountEth,
          durationInDays
        );
        
        console.log("Campaign created on blockchain:", blockchainResult);
        
        // Get the campaign ID from the blockchain result
        const campaignId = blockchainResult.campaignId;
        
        // Create a campaign object with both blockchain and off-chain data
        const campaign = {
          id: campaignId.toString(), // Use blockchain campaign ID
          blockchainId: campaignId,
          transactionHash: blockchainResult.transactionHash,
          title: formData.campaignTitle,
          category: formData.campaignCategory,
          description: formData.campaignDescription,
          goalAmount: parseFloat(formData.fundraisingGoal),
          currentAmount: 0,
          duration: durationInDays,
          endDate: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000).toISOString(),
          creatorName: `${formData.firstName} ${formData.lastName}`,
          creatorEmail: formData.email,
          pdfApplication: cloudinaryUrl,
          verified: false,
          donors: 0,
          imageUrl: imageReference,
          // Add crypto related fields
          acceptCrypto: formData.acceptCrypto,
          ethWalletAddress: formData.ethWalletAddress || await contractService.signer.getAddress(), // Use connected wallet if not specified
          ethEquivalent: ethEquivalent,
          ethRate: ethRate
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
          }
      
          // Update state for success
          setPdfData({ ...pdfResult, cloudinaryUrl });
          setSubmitSuccess(true);
          setShowPdfPreview(true);
          
          // Optionally, fetch the campaign from blockchain to verify it was created correctly
          try {
            const blockchainCampaign = await contractService.getCampaignById(campaignId);
            console.log("Retrieved campaign from blockchain:", blockchainCampaign);
          } catch (verifyError) {
            console.warn("Could not verify campaign on blockchain, it may need approval:", verifyError);
          }
          
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
      } catch (blockchainError) {
        console.error("Blockchain campaign creation failed:", blockchainError);
        
        // Create a fallback campaign with a local ID instead
        const fallbackCampaign = {
          id: Date.now().toString(), // Fallback to timestamp ID
          title: formData.campaignTitle,
          category: formData.campaignCategory,
          description: formData.campaignDescription,
          goalAmount: parseFloat(formData.fundraisingGoal),
          currentAmount: 0,
          duration: durationInDays,
          endDate: new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000).toISOString(),
          creatorName: `${formData.firstName} ${formData.lastName}`,
          creatorEmail: formData.email,
          pdfApplication: cloudinaryUrl,
          verified: false,
          donors: 0,
          imageUrl: imageReference,
          acceptCrypto: formData.acceptCrypto,
          ethWalletAddress: formData.ethWalletAddress || "Failed to get wallet",
          ethEquivalent: ethEquivalent,
          ethRate: ethRate,
          blockchainError: blockchainError.message
        };
        
        // Save fallback campaign to backend and localStorage
        try {
          await campaignService.saveCampaign(fallbackCampaign);
          
          const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
          if (existingCampaigns.length >= 5) {
            existingCampaigns.sort((a, b) => new Date(b.id) - new Date(a.id));
            existingCampaigns.splice(5);
          }
          existingCampaigns.push(fallbackCampaign);
          localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));
          
          setPdfData({ ...pdfResult, cloudinaryUrl });
          setSubmitSuccess(true);
          setShowPdfPreview(true);
          setSubmitError("Warning: Campaign created in database only. Blockchain creation failed.");
        } catch (error) {
          throw new Error("Failed to create campaign: " + error.message);
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
        const baseValidation = formData.campaignTitle && formData.campaignCategory && formData.fundraisingGoal && formData.campaignDescription && formData.campaignImage;
        if (!formData.acceptCrypto) return baseValidation;
        return baseValidation && formData.ethWalletAddress && walletAddressValid;
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
              <p className="text-gray-800">
                ${formData.fundraisingGoal} (≈{ethEquivalent} ETH)
              </p>
            </div>
            {formData.acceptCrypto && (
              <div>
                <p className="text-sm font-medium text-gray-500">ETH Wallet Address</p>
                <p className="text-gray-800 break-all">{formData.ethWalletAddress}</p>
              </div>
            )}
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
                {idTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
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
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                  <div className="text-sm text-yellow-700 mt-2">
                    <p>Your ID details will be verified in the next step where you'll upload a copy of your ID document. Please ensure the information matches exactly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Campaign Information</h3>
            <p className="text-gray-600 text-sm">Tell us about your fundraising campaign.</p>
            
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
                {campaignCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="fundraisingGoal" className="block text-sm font-medium text-gray-700 mb-1">Fundraising Goal (USD) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="fundraisingGoal"
                  name="fundraisingGoal"
                  value={formData.fundraisingGoal}
                  onChange={handleChange}
                  min="100"
                  className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {formData.fundraisingGoal && ethRate && (
                <p className="mt-1 text-sm text-gray-500">≈ {ethEquivalent} ETH at current rates</p>
              )}
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
                {campaignDurations.map(duration => (
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
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {campaignImagePreview ? (
                    <div>
                      <img 
                        src={campaignImagePreview} 
                        alt="Campaign preview" 
                        className="mx-auto h-40 w-auto object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Click below to change image
                      </p>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="campaignImage" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload an image</span>
                      <input 
                        id="campaignImage" 
                        name="campaignImage" 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only" 
                        required={!campaignImagePreview}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <label htmlFor="acceptCrypto" className="font-medium text-gray-700">Accept Cryptocurrency Donations</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="acceptCrypto"
                    name="acceptCrypto"
                    checked={formData.acceptCrypto}
                    onChange={handleChange}
                    className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label 
                    htmlFor="acceptCrypto" 
                    className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${formData.acceptCrypto ? 'bg-blue-400' : ''}`}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Enable Ethereum donations alongside traditional payments</p>
              
              {formData.acceptCrypto && (
                <div className="mt-4">
                  <label htmlFor="ethWalletAddress" className="block text-sm font-medium text-gray-700 mb-1">Ethereum Wallet Address *</label>
                  <input
                    type="text"
                    id="ethWalletAddress"
                    name="ethWalletAddress"
                    value={formData.ethWalletAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${!walletAddressValid && formData.ethWalletAddress ? 'border-red-500' : 'border-gray-300'}`}
                    required={formData.acceptCrypto}
                  />
                  {!walletAddressValid && formData.ethWalletAddress && (
                    <p className="mt-1 text-sm text-red-600">Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">This is where you'll receive ETH donations. Double check your address!</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-800">Supporting Documents & Terms</h3>
            <p className="text-gray-600 text-sm">Please upload the required documents and agree to our terms.</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Document *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {idPreview ? (
                    <div>
                      <img 
                        src={idPreview} 
                        alt="ID preview" 
                        className="mx-auto h-40 w-auto object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Click below to change file
                      </p>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0.1 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="idDocument" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload ID document</span>
                      <input 
                        id="idDocument" 
                        name="idDocument" 
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="sr-only" 
                        required={!idPreview}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Address *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {addressPreview ? (
                    <div>
                      <img 
                        src={addressPreview} 
                        alt="Address proof preview" 
                        className="mx-auto h-40 w-auto object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Click below to change file
                      </p>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="addressProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload proof of address</span>
                      <input 
                        id="addressProof" 
                        name="addressProof" 
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="sr-only" 
                        required={!addressPreview}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Recent utility bill, bank statement, etc.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Proposal (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {proposalPreview ? (
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-gray-900 truncate mt-2">Document uploaded</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click below to change file
                      </p>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="campaignProposal" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload proposal document</span>
                      <input 
                        id="campaignProposal" 
                        name="campaignProposal" 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Detailed campaign proposal (PDF, DOC, DOCX)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms and Conditions</a> *
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <input
                    id="agreePrivacyPolicy"
                    name="agreePrivacyPolicy"
                    type="checkbox"
                    checked={formData.agreePrivacyPolicy}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="agreePrivacyPolicy" className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a> *
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <input
                    id="certifyInformation"
                    name="certifyInformation"
                    type="checkbox"
                    checked={formData.certifyInformation}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="certifyInformation" className="text-sm text-gray-700">
                    I certify that all information provided is accurate and complete *
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Main component render
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {submitSuccess ? (
        // Show PDF preview after successful submission
        showPdfPreview && pdfData && renderPdfPreview()
      ) : (
        // Show the application form
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800">Campaign Application</h2>
            <p className="text-blue-600">Complete this form to apply for a new fundraising campaign</p>
          </div>
          
          {/* Progress bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-500">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {renderFormStep()}
              
              {/* Error message */}
              {submitError && (
                <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {submitError}</span>
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateCurrentStep()}
                    className={`ml-auto px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      validateCurrentStep()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-300 text-white cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !validateCurrentStep()}
                    className={`ml-auto px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      !isSubmitting && validateCurrentStep()
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-300 text-white cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            <p>Need help? Contact our support team at <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">support@example.com</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignApplication;