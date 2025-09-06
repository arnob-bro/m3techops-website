class NewsLetterService {
    constructor(db) {
      this.db = db;
  
    }
  
    // ----------Create Role---------------
  async subscribe({email}) {
      try {
  
        // Insert role
        const result = await this.db.query(
          `INSERT INTO subscribers (email) VALUES ($1) RETURNING email`,
          [email]
        );
  
        const subscriber = result.rows[0];
  
        return subscriber;
      } catch (err) {
        console.error("Error in subscribing:", err.message);
        throw new Error("Failed to subscribe");
      }
    }
  
    async getSubscriptionByEmail(email) {
      try {
          const query = `
              SELECT * FROM subscribers 
              WHERE LOWER(email) = LOWER($1)
          `;
          const result = await this.db.query(query, [email]);
          return result.rows[0] || null;
      } catch (error) {
          console.error('Error in getSubscriptionByEmail service:', error);
          throw new Error('Failed to fetch subscriber by email');
      }
    }


    async getSubscribers( page , limit , email, status ) {
        try {
          const offset = (page - 1) * limit;
      
          // Build dynamic WHERE clause
          const conditions = [];
          const values = [];
      
          if (email) {
            values.push(`%${email}%`);
            conditions.push(`email ILIKE $${values.length}`);
          }
          if (status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
          }
          
      
          const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
      
          // Fetch paginated results
          const result = await this.db.query(
            `SELECT * FROM subscribers ${whereClause} ORDER BY subscribed_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
            [...values, limit, offset]
          );
      
          // Get total count for pagination
          const countResult = await this.db.query(
            `SELECT COUNT(*) FROM subscribers ${whereClause}`,
            values
          );
          const total = parseInt(countResult.rows[0].count, 10);
          const totalPages = Math.ceil(total / limit);
      
          return {
            success: true,
            subscribers: result.rows,
            pagination: {
              page: page,
              limit,
              total,
              totalPages
            }
          };
        } catch (err) {
          console.error("Error in fetching subscribers:", err.message);
          throw new Error("Failed to fetch subscribers");
        }
      }
    

      async updateSubscriberStatus (subscriber_id, status) {
        try {
          const result = await this.db.query(
            `UPDATE subscribers 
             SET status = $1
             WHERE subscriber_id = $2
             RETURNING *`,
            [status, subscriber_id]
          );
      
          return result.rows[0]; 
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
  
  }
  
  module.exports = NewsLetterService;
  