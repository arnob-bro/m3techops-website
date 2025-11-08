
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


      // console.log("into the service");

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

      

      return { success: true, message: "career creation successful.", data :career };
    } catch (err) {
      console.error("Error in making this career:", err.message);
      throw new Error("Failed to make this career");
    }
  }

  async getCareers(page, limit, status) {
    try {
      const offset = (page - 1) * limit;
      let query = `SELECT * FROM careers`;
      let countQuery = `SELECT COUNT(*) FROM careers`;
      let params = [];
      let countParams = [];
  
      if (status) {
        query += ` WHERE status = $1`;
        countQuery += ` WHERE status = $1`;
        params.push(status);
        countParams.push(status);
      }
  
      query += ` ORDER BY posted_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
  
      const result = await this.db.query(query, params);
      const countResult = await this.db.query(countQuery, countParams);
  
      const total = parseInt(countResult.rows[0].count, 10);
      const totalPages = Math.ceil(total / limit);
  
      return {
        success: true,
        careers: result.rows,
        pagination: {
          page,
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
  

  async updateCareer(careerData) {
    try {
      const {
        career_id,
        title,
        vacancies,
        description,
        send_to,
        status,
        deadline,
        posted_date
      } = careerData;
  
      // console.log("into the service");
  
      const result = await this.db.query(
        `UPDATE careers
         SET title = $1,
             vacancies = $2,
             description = $3,
             send_to = $4,
             status = $5,
             deadline = $6,
             posted_date = $7
         WHERE career_id = $8
         RETURNING career_id, title, vacancies, description, send_to, status, deadline, posted_date`,
        [
          title,
          vacancies,
          description,
          send_to,
          status,
          deadline,
          posted_date,
          career_id // <--- must be last
        ]
      );
  
      const career = result.rows[0];
      // console.log(career);
  
      return { success: true, message: "Career updated successfully", data: career };
    } catch (err) {
      console.error("Error updating career:", err.message);
      throw new Error("Failed to update career");
    }
  }
  
  

}

module.exports = CareerService;
