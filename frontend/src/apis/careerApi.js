// careerApi.js - Mock API for Career Management
class CareerApi {
  constructor() {
    // Initialize with some sample data
    this.jobs = [
      {
        job_id: 1,
        title: "Frontend Developer",
        deadline: "2024-12-31",
        vacancies: 3,
        description: "We are looking for a skilled Frontend Developer to join our team.",
        requirements: ["React experience", "JavaScript proficiency", "CSS knowledge"],
        active: true,
        created_at: "2024-01-15",
        updated_at: "2024-01-15"
      },
      {
        job_id: 2,
        title: "Backend Developer",
        deadline: "2024-11-30",
        vacancies: 2,
        description: "Join our backend team to build scalable APIs and services.",
        requirements: ["Node.js", "Database design", "API development"],
        active: true,
        created_at: "2024-01-10",
        updated_at: "2024-01-10"
      },
      {
        job_id: 3,
        title: "UX Designer",
        deadline: "2024-10-15",
        vacancies: 1,
        description: "Create amazing user experiences for our products.",
        requirements: ["Figma", "User research", "Prototyping"],
        active: false,
        created_at: "2024-01-05",
        updated_at: "2024-01-05"
      }
    ];
    this.nextId = 4;
  }

  // Simulate API delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all jobs with pagination and filtering
  async getJobs({ page = 1, limit = 10, title = '', active = '' } = {}) {
    await this.delay(300);

    let filteredJobs = [...this.jobs];

    // Filter by title
    if (title) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Filter by active status
    if (active !== '') {
      const isActive = active === 'true';
      filteredJobs = filteredJobs.filter(job => job.active === isActive);
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      data: {
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredJobs.length / limit),
          totalJobs: filteredJobs.length,
          hasNext: endIndex < filteredJobs.length,
          hasPrev: page > 1
        }
      }
    };
  }

  // Get single job by ID
  async getJobById(job_id) {
    await this.delay(200);
    
    const job = this.jobs.find(j => j.job_id === parseInt(job_id));
    if (!job) {
      throw new Error('Job not found');
    }
    
    return { job };
  }

  // Create new job
  async createJob(jobData) {
    await this.delay(400);

    const newJob = {
      job_id: this.nextId++,
      ...jobData,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    this.jobs.unshift(newJob); // Add to beginning of array

    return {
      message: 'Job created successfully',
      job: newJob
    };
  }

  // Update existing job
  async updateJob(job_id, jobData) {
    await this.delay(400);

    const index = this.jobs.findIndex(j => j.job_id === parseInt(job_id));
    if (index === -1) {
      throw new Error('Job not found');
    }

    const updatedJob = {
      ...this.jobs[index],
      ...jobData,
      updated_at: new Date().toISOString().split('T')[0]
    };

    this.jobs[index] = updatedJob;

    return {
      message: 'Job updated successfully',
      job: updatedJob
    };
  }

  // Toggle job active status
  async toggleActive(job_id) {
    await this.delay(300);

    const job = this.jobs.find(j => j.job_id === parseInt(job_id));
    if (!job) {
      throw new Error('Job not found');
    }

    job.active = !job.active;
    job.updated_at = new Date().toISOString().split('T')[0];

    return {
      message: 'Job status updated successfully',
      job: job
    };
  }

  // Delete job (optional - you can add this functionality later)
  async deleteJob(job_id) {
    await this.delay(300);

    const index = this.jobs.findIndex(j => j.job_id === parseInt(job_id));
    if (index === -1) {
      throw new Error('Job not found');
    }

    this.jobs.splice(index, 1);

    return {
      message: 'Job deleted successfully'
    };
  }
}

export default CareerApi;