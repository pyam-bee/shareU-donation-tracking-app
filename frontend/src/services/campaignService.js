export const campaignService = {
    async saveCampaign(campaignData) {
      try {
        const response = await fetch('/api/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignData),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to save campaign:', error);
        throw error;
      }
    },
    
    async getAllCampaigns() {
      try {
        const response = await fetch('/api/campaigns');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        // Fallback to localStorage if network request fails
        const localCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        return localCampaigns;
      }
    },
    
    async getCampaignById(id) {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Failed to fetch campaign with ID ${id}:`, error);
        // Fallback to localStorage if network request fails
        const localCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        return localCampaigns.find(campaign => campaign.id === id) || null;
      }
    },

    async updateCampaignStatus(campaignId, status) {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Failed to update campaign status for ${campaignId}:`, error);
        throw error;
      }
    },

    async updateCampaignMilestone(campaignId, milestone) {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/milestone`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lastMilestoneNotified: milestone }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Failed to update campaign milestone for ${campaignId}:`, error);
        throw error;
      }
    },

    async calculateTotalRaised(campaignId) {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}/total`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.totalRaised || 0;
      } catch (error) {
        console.error(`Failed to calculate total raised for campaign ${campaignId}:`, error);
        throw error;
      }
    }
  };