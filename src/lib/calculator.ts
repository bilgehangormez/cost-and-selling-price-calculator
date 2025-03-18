export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    wheatCost: number;
    laborCost: number;
    bagCost: number;
    branRevenue: number;
    bonkalitRevenue: number;
    totalCost: number;
    targetProfit: number;
    finalPrice: number;
    wheatRequired: number;
    branKg: number;
    bonkalitKg: number;
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private randiman: number;
    private wheat_price: number;
    private labor_cost: number;
    private bag_cost: number;
    private bran_price: number;
    private bonkalit_price: number;
    private target_profit: number;

    constructor(
        electricity_kwh: string,
        electricity_price: string,
        randiman: string,
        wheat_price: string,
        labor_cost: string,
        bag_cost: string,
        bran_price: string,
        bonkalit_price: string,
        target_profit: string
    ) {
        this.electricity_kwh = parseFloat(electricity_kwh) || 0;
        this.electricity_price = parseFloat(electricity_price) || 0;
        this.randiman = parseFloat(randiman) || 75;
        this.wheat_price = parseFloat(wheat_price) || 0;
        this.labor_cost = parseFloat(labor_cost) || 0;
        this.bag_cost = parseFloat(bag_cost) || 0;
        this.bran_price = parseFloat(bran_price) || 0;
        this.bonkalit_price = parseFloat(bonkalit_price) || 0;
        this.target_profit = parseFloat(target_profit) || 0;
    }

    public async calculateCosts(): Promise<CalculationResult> {
        const response = await fetch("/randiman_oranlari.json");
        const randimanData = await response.json();
        const randimanValue = randimanData[String(this.randiman)] || randimanData["75"]; 

        // ✅ **Yeni Formül: 50 kg un için gerekli buğday miktarı**
        const wheatRequired = 5000 / this.randiman;

        // ✅ **Yan ürün hesaplamaları**
        const branKg = (randimanValue.kepek * wheatRequired) / 100;
        const bonkalitKg = (randimanValue.bonkalit * wheatRequired) / 100;

        // ✅ **Maliyet hesaplamaları**
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = wheatRequired * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        // ✅ **Yan ürünlerden elde edilen gelir**
        const branRevenue = branKg * this.bran_price;
        const bonkalitRevenue = bonkalitKg * this.bonkalit_price;

        // ✅ **Toplam Maliyet**
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - (branRevenue + bonkalitRevenue);

        // ✅ **Son Satış Fiyatı**
        const finalPrice = totalCost + this.target_profit;

        return {
            productCost: totalCost || 0,
            electricityCost,
            wheatCost,
            laborCost,
            bagCost,
            branRevenue,
            bonkalitRevenue,
            totalCost,
            targetProfit: this.target_profit || 0,
            finalPrice: isNaN(finalPrice) ? 0 : finalPrice,
            wheatRequired,
            branKg,
            bonkalitKg,
        };
    }
}
