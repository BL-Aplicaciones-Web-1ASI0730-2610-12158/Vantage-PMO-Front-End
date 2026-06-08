/**
 * Value Object — Monthly forecast vs actual expenditure data point.
 */
export class MonthlyExpenditure {
    constructor({ month, forecast, actual }) {
        this.month    = month;
        this.forecast = forecast;
        this.actual   = actual;
    }
}
