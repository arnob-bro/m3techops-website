class PolicyController {
    constructor(policyService) {
      this.policyService = policyService;
  
      // Bind methods so 'this' works in routes
      this.getAllPolicies = this.getAllPolicies.bind(this);
      this.getpolicyByType = this.getpolicyByType.bind(this);
      this.updatePolicy = this.updatePolicy.bind(this);

    }
  
    getAllPolicies = async (req, res) => {
        try {
          const policies = await this.policyService.getAllPolicies();
          res.json({success:true, policies});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error fetching policies" });
        }
    }


    getpolicyByType = async (req, res) => {
        try {
            const {type} = req.params;
          const policy = await this.policyService.getpolicyByType(type);
          res.json({success:true, policy});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error fetching policy by type" });
        }
    }

    updatePolicy = async (req, res) => {
        try {
            const {type} = req.params;
            const {title, content} = req.body;
          const updatedPolicy = await this.policyService.updatePolicy(type, title, content);

          if (!updatedPolicy) {
            return res.status(404).json({ success: false, message: "Policy not found" });
          }
          
          res.json({success:true, updatedPolicy});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error updating policy" });
        }
    }
      
}
  
  module.exports = PolicyController;
  