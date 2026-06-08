import { MonthlyExpenditure } from './monthly-expenditure.vo.js';
import { DepartmentCapacity } from './department-capacity.vo.js';
import { SummaryKpi } from './summary-kpi.vo.js';
import { PortfolioRoi } from './portfolio-roi.entity.js';
import { TopMover } from './top-mover.entity.js';

/**
 * Aggregate Root — Analytics Dashboard.
 * Composes financial, portfolio, resource, and project performance data.
 */
export class Analytics {
    constructor({
                    id,
                    monthlyExpenditures = [],
                    portfolioRoi,
                    resourceSaturation = [],
                    topMovers = [],
                    summaryKpis,
                }) {
        this.id = id;
        this.monthlyExpenditures = monthlyExpenditures.map(e =>
            e instanceof MonthlyExpenditure ? e : new MonthlyExpenditure(e)
        );
        this.portfolioRoi = portfolioRoi instanceof PortfolioRoi
            ? portfolioRoi
            : new PortfolioRoi(portfolioRoi);
        this.resourceSaturation = resourceSaturation.map(d =>
            d instanceof DepartmentCapacity ? d : new DepartmentCapacity(d)
        );
        this.topMovers = topMovers.map(p =>
            p instanceof TopMover ? p : new TopMover(p)
        );
        this.summaryKpis = summaryKpis instanceof SummaryKpi
            ? summaryKpis
            : new SummaryKpi(summaryKpis);
    }
}
