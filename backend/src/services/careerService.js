
class CareerService {
  constructor(db) {
    this.db = db;
  }

  // ----------Signup---------------
  async createCareer(careerData) {
    try {
      const {
        title,
        vacancies,
        description,
        send_to,
        status,
        deadline,
        posted_date
      } = careerData;


      console.log("into the service");

      // Insert user
      const result = await this.db.query(
        `INSERT INTO careers 
        (title, vacancies, description, send_to, status, deadline, posted_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING career_id, title, vacancies, description, send_to, status, deadline, posted_date`,
        [
            title,
            vacancies,
            description,
            send_to,
            status,
            deadline,
            posted_date
        ]
      );

      const career = result.rows[0];

      

      return { success: true, message: "career creation successful." };
    } catch (err) {
      console.error("Error in making this career:", err.message);
      throw new Error("Failed to make this career");
    }
  }

  async getCareers( page , limit , status ) {
    try {
      const offset = (page - 1) * limit;


      console.log("into the service");
      // Fetch paginated results
      const result = await this.db.query(
        `SELECT * FROM careers WHERE status=$1 ORDER BY posted_date DESC LIMIT $2 OFFSET $3`,
        [status, limit, offset]
      );
  
      // Get total count for pagination
      const countResult = await this.db.query(
        `SELECT COUNT(*) FROM careers WHERE status=$1`,
        [status]
      );
      const total = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(total / limit);
  
      return {
        success: true,
        careers: result.rows,
        pagination: {
          page: page,
          limit,
          total,
          totalPages
        }
      };
    } catch (err) {
      console.error("Error in fetching careers:", err.message);
      throw new Error("Failed to fetch careers");
    }
  }
  

}

module.exports = CareerService;
