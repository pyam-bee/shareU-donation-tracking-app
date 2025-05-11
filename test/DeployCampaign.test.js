const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers;

describe("DonationCampaign", function () {
  let donationCampaign;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const DonationCampaign = await ethers.getContractFactory("DonationCampaign");
    donationCampaign = await DonationCampaign.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await donationCampaign.admin()).to.equal(owner.address);
    });

    it("Should initialize with zero campaigns", async function () {
      expect(await donationCampaign.campaignCount()).to.equal(0);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a new campaign correctly", async function () {
      const title = "Test Campaign";
      const description = "Test Description";
      const fundingGoal = parseEther("1.0");
      const duration = 30 * 24 * 60 * 60;

      await donationCampaign.connect(addr1).createCampaign(
        title,
        description,
        fundingGoal,
        duration
      );

      const campaign = await donationCampaign.campaigns(1);
      expect(campaign.id).to.equal(1);
      expect(campaign.owner).to.equal(addr1.address);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.fundingGoal).to.equal(fundingGoal);
      expect(campaign.isApproved).to.equal(false);
      expect(campaign.isClosed).to.equal(false);
    });

    // ... keep existing campaign creation tests ...
  });

  describe("Campaign Approval", function () {
    beforeEach(async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Test Campaign",
        "Test Description",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );
    });

    // ... keep existing approval tests ...
  });

  describe("Donations", function () {
    beforeEach(async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Test Campaign",
        "Test Description",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );
      await donationCampaign.connect(owner).approveCampaign(1, true);
    });

    it("Should allow donations to approved campaigns", async function () {
      const donationAmount = parseEther("0.1");
      await donationCampaign.connect(addr2).donate(1, { value: donationAmount });
      
      const campaign = await donationCampaign.campaigns(1);
      expect(campaign.amountRaised).to.equal(donationAmount);
    });

    it("Should not allow donations to unapproved campaigns", async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Another Campaign",
        "Another Description",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );

      await expect(
        donationCampaign.connect(addr2).donate(2, { value: parseEther("0.1") })
      ).to.be.revertedWith("Campaign is not approved yet");
    });

    it("Should not allow donations to closed campaigns", async function () {
      await donationCampaign.connect(addr1).closeCampaign(1);
      await expect(
        donationCampaign.connect(addr2).donate(1, { value: parseEther("0.1") })
      ).to.be.revertedWith("Campaign is closed");
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Test Campaign",
        "Test Description",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );
      await donationCampaign.connect(owner).approveCampaign(1, true);
      await donationCampaign.connect(addr2).donate(1, { value: parseEther("0.5") });
    });

    it("Should allow campaign owner to withdraw funds", async function () {
      await donationCampaign.connect(addr1).withdrawFunds(1);
      const campaign = await donationCampaign.campaigns(1);
      expect(campaign.amountRaised).to.equal(0);
    });

    it("Should not allow non-owner to withdraw funds", async function () {
      await expect(
        donationCampaign.connect(addr2).withdrawFunds(1)
      ).to.be.revertedWith("Only campaign owner can perform this action");
    });
  });

  describe("Campaign Closing", function () {
    beforeEach(async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Test Campaign",
        "Test Description",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );
      await donationCampaign.connect(owner).approveCampaign(1, true);
    });

    it("Should allow owner to close a campaign", async function () {
      await donationCampaign.connect(addr1).closeCampaign(1);
      const campaign = await donationCampaign.campaigns(1);
      expect(campaign.isClosed).to.equal(true);
    });

    it("Should not allow non-owner to close a campaign", async function () {
      await expect(
        donationCampaign.connect(addr2).closeCampaign(1)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await donationCampaign.connect(addr1).createCampaign(
        "Campaign 1",
        "Description 1",
        parseEther("1.0"),
        30 * 24 * 60 * 60
      );
      await donationCampaign.connect(addr2).createCampaign(
        "Campaign 2",
        "Description 2",
        parseEther("2.0"),
        60 * 24 * 60 * 60
      );
      await donationCampaign.connect(owner).approveCampaign(1, true);
    });

    it("Should correctly return all campaigns", async function () {
      const campaigns = await donationCampaign.getAllCampaigns();
      expect(campaigns.length).to.equal(2);
      expect(campaigns[0].title).to.equal("Campaign 1");
      expect(campaigns[1].title).to.equal("Campaign 2");
    });

    it("Should correctly show approved campaigns", async function () {
      const allCampaigns = await donationCampaign.getAllCampaigns();
      const approvedCampaigns = allCampaigns.filter(c => c.isApproved);
      expect(approvedCampaigns.length).to.equal(1);
      expect(approvedCampaigns[0].title).to.equal("Campaign 1");
    });
  });
});