// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title DonationCampaign
 * @dev Contract for managing donation campaigns and contributions
 */
contract DonationCampaign {
    struct Campaign {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 fundingGoal;
        uint256 amountRaised;
        uint256 deadline;
        bool isApproved;
        bool isClosed;
    }
    
    struct Donation {
        address donor;
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
    }
    
    address public admin;
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    mapping(address => Donation[]) public userDonations;
    
    event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title, uint256 fundingGoal);
    event CampaignApproved(uint256 indexed campaignId, bool isApproved);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount, uint256 timestamp);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed recipient, uint256 amount);
    event CampaignClosed(uint256 indexed campaignId, bool success);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyCampaignOwner(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].owner, "Only campaign owner can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        campaignCount = 0;
    }
    
    /**
     * @dev Creates a new campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _fundingGoal Target amount to raise
     * @param _durationInDays Campaign duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _durationInDays
    ) public {
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        
        campaignCount++;
        
        Campaign memory newCampaign = Campaign({
            id: campaignCount,
            owner: msg.sender,
            title: _title,
            description: _description,
            fundingGoal: _fundingGoal,
            amountRaised: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            isApproved: false,
            isClosed: false
        });
        
        campaigns[campaignCount] = newCampaign;
        
        emit CampaignCreated(campaignCount, msg.sender, _title, _fundingGoal);
    }
    
    /**
     * @dev Admin approves or rejects a campaign
     * @param _campaignId ID of the campaign
     * @param _isApproved Approval status
     */
    function approveCampaign(uint256 _campaignId, bool _isApproved) public onlyAdmin {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        
        Campaign storage campaign = campaigns[_campaignId];
        campaign.isApproved = _isApproved;
        
        emit CampaignApproved(_campaignId, _isApproved);
    }
    
    /**
     * @dev Allows user to donate to a campaign
     * @param _campaignId ID of the campaign to donate to
     */
    function donate(uint256 _campaignId) public payable {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
    
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.isApproved, "Campaign is not approved yet");
        require(!campaign.isClosed, "Campaign is closed");
        require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        campaign.amountRaised += msg.value;
        
        Donation memory newDonation = Donation({
            donor: msg.sender,
            campaignId: _campaignId,
            amount: msg.value,
            timestamp: block.timestamp
        });
        
        campaignDonations[_campaignId].push(newDonation);
        userDonations[msg.sender].push(newDonation);
        
        emit DonationReceived(_campaignId, msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Allows campaign owner to withdraw funds
     * @param _campaignId ID of the campaign
     */
    function withdrawFunds(uint256 _campaignId) public onlyCampaignOwner(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.isApproved, "Campaign is not approved");
        require(!campaign.isClosed, "Campaign is already closed");
        require(campaign.amountRaised > 0, "No funds to withdraw");
        
        uint256 amountToWithdraw = campaign.amountRaised;
        campaign.amountRaised = 0;
        
        (bool success, ) = payable(campaign.owner).call{value: amountToWithdraw}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(_campaignId, campaign.owner, amountToWithdraw);
    }
    
    /**
     * @dev Closes a campaign
     * @param _campaignId ID of the campaign
     */
    function closeCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(msg.sender == campaign.owner || msg.sender == admin, "Not authorized");
        require(!campaign.isClosed, "Campaign is already closed");
        
        campaign.isClosed = true;
        bool isSuccess = campaign.amountRaised >= campaign.fundingGoal;
        
        emit CampaignClosed(_campaignId, isSuccess);
    }
    
    /**
     * @dev Returns all campaigns
     */
    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](campaignCount);
        
        for (uint256 i = 1; i <= campaignCount; i++) {
            allCampaigns[i - 1] = campaigns[i];
        }
        
        return allCampaigns;
    }
    
    /**
     * @dev Returns campaign details
     * @param _campaignId ID of the campaign
     */
    function getCampaignById(uint256 _campaignId) public view returns (Campaign memory) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        return campaigns[_campaignId];
    }
    
    /**
     * @dev Returns donations for a campaign
     * @param _campaignId ID of the campaign
     */
    function getCampaignDonations(uint256 _campaignId) public view returns (Donation[] memory) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        return campaignDonations[_campaignId];
    }
    
    /**
     * @dev Returns donations made by a user
     * @param _donor Address of the donor
     */
    function getUserDonations(address _donor) public view returns (Donation[] memory) {
        return userDonations[_donor];
    }
    
    /**
     * @dev Changes admin address
     * @param _newAdmin Address of the new admin
     */
    function changeAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}