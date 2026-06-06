/**
 * Department Entity - Domain Model
 */
export class Department {
    constructor({ id, name, percent }) {
        this.id = id;
        this.name = name;
        this.percent = percent;
    }
}