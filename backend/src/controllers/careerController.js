class CareerController {
    constructor(careerService) {
      this.careerService = careerService;
  
      // Bind methods so 'this' works in routes
      this.getCareers = this.getCareers.bind(this);
      this.createCareer = this.createCareer.bind(this);
      this.updateCareer = this.updateCareer.bind(this);
      // this.deleteCareer = this.deleteCareer.bind(this);
    }
  
    async createCareer(req, res) {
      try {
        const {
          title,
          vacancies,
          description,
          send_to,
          status,
          deadline,
          posted_date
        } = req.body;
  
        // REQUIRED FIELDS
        if (!title || !vacancies || !description || !send_to || !deadline) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // console.log("into the controller");
        // then Service ke pass korbo
        const career = await this.careerService.createCareer({
          title,
          vacancies,
          description,
          send_to,
          status,
          deadline,
          posted_date
        });


  
        res.status(201).json({career});
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }


    async getCareers(req, res) {
      try {
        const { page = 1, limit = 10, status = 'Open' } = req.query;
        
        console.log("into the controller");
        const careers = await this.careerService.getCareers(
          parseInt(page, 10),
          parseInt(limit, 10),
          status
        );
    
        res.status(200).json(careers);
      } catch (err) {
        console.error("Error fetching careers:", err);
        res.status(400).json({ error: err.message });
      }
    }


    async updateCareer(req, res) {
      try {
        const {
          title,
          vacancies,
          description,
          send_to,
          status,
          deadline,
          posted_date
        } = req.body;

        const { career_id } = req.params;
  
        // REQUIRED FIELDS
        if (!vacancies) {
          return res.status(400).json({ error: "Missing vacancies field" });
        }
        if (!title) {
          return res.status(400).json({ error: "Missing title field" });
        }
        
        if (!description) {
          return res.status(400).json({ error: "Missing description field" });
        }
        if (!send_to) {
          return res.status(400).json({ error: "Missing send_to field" });
        }
        if (!deadline) {
          return res.status(400).json({ error: "Missing deadline field" });
        }


        // console.log("into the controller");
        // then Service ke pass korbo
        const career = await this.careerService.updateCareer({
          career_id,
          title,
          vacancies,
          description,
          send_to,
          status,
          deadline,
          posted_date
        });


  
        res.status(201).json(career);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
    
  
  }
  
  module.exports = CareerController;
  