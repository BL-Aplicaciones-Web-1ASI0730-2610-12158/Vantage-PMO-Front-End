/**
 * Summary Entity - Domain Model
 */
export class Summary {
    constructor({ id, title, description, amount }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
    }
}