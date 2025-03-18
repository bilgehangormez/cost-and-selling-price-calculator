import randimanOranlari from "@/randiman_oranlari.json"; // 📌 Randıman verisini JSON'dan al

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
        electricity_kwh: number,
        electricity_price: number,
        randiman: number,
        wheat_price: number,
        labor_cost: number,
        bag_cost: number,
        bran_price: number,
        bonkalit_price: number,
        target_profit: number
    ) {
        this.electricity_kwh = electricity_kwh;
        this.electricity_price = electricity_price;
        this.randiman = randiman;
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.bag_cost = bag_cost;
        this.bran_price = bran_price;
        this.bonkalit_price = bonkalit_price;
        this.target_profit = target_profit;
    }

    private getClosestRandimanData(): { un_miktari: number; kepek: number; bonkalit: number } {
        const randimanKeys = Object.keys(randimanOranlari).map(Number);
        const closestRandiman = randimanKeys.reduce((prev, curr) =>
            Math.abs(curr - this.randiman) < Math.abs(prev - this.randiman) ? curr : prev
        );

        console.warn(
            `⚠️ Uyarı: Girilen randıman (${this.randiman}%) JSON'da bulunamadı! En yakın değer olarak ${closestRandiman}% kullanıldı.`
        );

        return randimanOranlari[String(closestRandiman)]; // 📌 **Hata düzeltildi**
    }

    public calculateCosts(): CalculationResult {
        const randimanData = randimanOranlari[String(this.randiman)] || this.getClosestRandimanData();

        const wheatRequired = randimanData.un_miktari * (50 / 100);
        const branKg = randimanData.kepek * (50 / 100);
        const bonkalitKg = randimanData.bonkalit * (50 / 100);

        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = wheatRequired * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        const branRevenue = branKg * this.bran_price;
        const bonkalitRevenue = bonkalitKg * this.bonkalit_price;

        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - (branRevenue + bonkalitRevenue);
        const finalPrice = totalCost + this.target_profit;

        return {
            productCost: totalCost,
            electricityCost,
            wheatCost,
            laborCost,
            bagCost,
            branRevenue,
            bonkalitRevenue,
            totalCost,
            targetProfit: this.target_profit,
            finalPrice,
            wheatRequired,
            branKg,
            bonkalitKg,
        };
    }
}
