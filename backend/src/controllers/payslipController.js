class PayslipController {
    constructor(payslipService) {
      this.payslipService = payslipService;
  
      // Bind methods so 'this' works in routes
      this.createPayslip = this.createPayslip.bind(this);
      this.getPayslips = this.getPayslips.bind(this);
      this.getPayslipById = this.getPayslipById.bind(this);
      this.updatePayslipStatus = this.updatePayslipStatus.bind(this);
    }
  
    async createPayslip (req, res) {
        try {
            const {
                company_name,
                company_address,
                reference,
                payment_month,
                employee_name,
                designation,
                employee_id,
                pay_date,
                earnings,
                deductions,
                net_pay,
                payment_mode,
                account_holder,
                bank_name,
                bank_branch,
                account_number,
                bkash_transaction,
                authorized_by,
                payee,
                logo,
                logo_url,
                note,
                status
              } = req.body;

          const payslip = await payslipService.createPayslip({
                company_name,
                company_address,
                reference,
                payment_month,
                employee_name,
                designation,
                employee_id,
                pay_date,
                earnings,
                deductions,
                net_pay,
                payment_mode,
                account_holder,
                bank_name,
                bank_branch,
                account_number,
                bkash_transaction,
                authorized_by,
                payee,
                logo,
                logo_url,
                note,
                status
              });
          res.status(201).json(payslip);
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to create payslip" });
        }
      }

    async getPayslips(req, res) {
      try {
        const { page, limit, employee_name, designation, employee_id, reference, status } = req.query;
        
    
        const payslips = await this.inquiryService.getInquiries(
          page,
          limit,
          employee_name, 
          designation, 
          employee_id, 
          reference,
          status
        );
    
        res.status(200).json(payslips);
      } catch (err) {
        console.error("Error fetching payslips:", err);
        res.status(400).json({ error: err.message });
      }
    }
    

    async replyToInquiry (req, res) {
      try {
        const { inquiry_id } = req.params;
        const { replyMessage } = req.body;
  
        const reply = await this.inquiryService.replyToInquiry(inquiry_id, replyMessage);
  
        if(reply){
          await this.inquiryService.updateInquiryStatus(inquiry_id, "Replied");
        }
        if (!reply) {
          return res.status(404).json({ error: "Inquiry not found" });
        }
  
        res.json(reply);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
  }
  
  module.exports = InquiryController;
  