export class DepartmentUtilization {
    constructor({ department = '', utilization = 0, status = 'normal' } = {}) {
        this.department  = department;
        this.utilization = utilization;
        this.status      = status;
    }
}
