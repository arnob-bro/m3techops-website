import api from "./api";

export default class SchedulerApi {
    constructor(baseURL = import.meta.env.VITE_API_URL) {
        this.schedulerApi = api;
        this.baseURL = baseURL + "/scheduler";
    }

    // Get current user's schedule
    async getMySchedule() {
        try {
            const response = await this.schedulerApi.get(`${this.baseURL}/my-schedule`);
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to fetch schedule" };
        }
    }

    // Create new schedule slot
    async createSchedule(scheduleData) {
        try {
            const response = await this.schedulerApi.post(`${this.baseURL}/my-schedule`, scheduleData);
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to create schedule" };
        }
    }

    // Update schedule slot
    async updateSchedule(id, scheduleData) {
        try {
            const response = await this.schedulerApi.put(`${this.baseURL}/my-schedule/${id}`, scheduleData);
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to update schedule" };
        }
    }

    // Delete schedule slot
    async deleteSchedule(id) {
        try {
            const response = await this.schedulerApi.delete(`${this.baseURL}/my-schedule/${id}`);
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to delete schedule" };
        }
    }

    // Find common slots for selected employees
    async getCommonSlots(employeeIds, dateRange = {}) {
        try {
            const response = await this.schedulerApi.post(`${this.baseURL}/common-slots`, {
                employee_ids: employeeIds,
                date_range: dateRange
            });
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to find common slots" };
        }
    }

    // Get schedules for multiple employees
    async getEmployeeSchedules(employeeIds = [], startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            
            if (employeeIds.length > 0) {
                employeeIds.forEach(id => params.append('employee_ids', id));
            }
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);

            const response = await this.schedulerApi.get(
                `${this.baseURL}/employee-schedules?${params.toString()}`
            );
            return response.data;
        } catch (err) {
            throw err.response?.data || { error: "Failed to fetch employee schedules" };
        }
    }
}