export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    wheatCost: number;
    laborCost: number;
    ppBagCost: number;
    branRevenue: number;
    totalCost: number;
    targetProfit: number;
    finalPrice: number;
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private wheat_kg: number;
    private wheat_price: number;
    private labor_cost: number;
    private pp_bag_price: number;
    private bran_kg: number;
    private bran_price: number;
    private target_profit: number;

    constructor(
        electricity_kwh: number,
        electricity_price: number,
        wheat_kg: number,
        wheat_price: number,
        labor_cost: number,
        pp_bag_price: number,
        bran_kg: number,
        bran_price: number,
        target_profit: number
    ) {
        this.electricity_kwh = electricity_kwh;
        this.electricity_price = electricity_price;
        this.wheat_kg = wheat_kg;
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.pp_bag_price = pp_bag_price;
        this.bran_kg = bran_kg;
        this.bran_price = bran_price;
        this.target_profit = target_profit;
    }

    public calculateCosts(): CalculationResult {
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = this.wheat_kg * this.wheat_price;
        const laborCost = this.labor_cost;
        const ppBagCost = this.pp_bag_price;
        const branRevenue = this.bran_kg * this.bran_price;
        const totalCost = (electricityCost + wheatCost + laborCost + ppBagCost) - branRevenue;
        const finalPrice = totalCost + this.target_profit;

        return { productCost: totalCost, electricityCost, wheatCost, laborCost, ppBagCost, branRevenue, totalCost, targetProfit: this.target_profit, finalPrice };
    }
}
