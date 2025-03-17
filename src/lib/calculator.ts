export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    waterCost: number;
    wheatCost: number;
    laborCost: number;
    bagCost: number;
    branRevenue: number; // Kepek Geliri
    totalCost: number;
    profit: number;
    finalPrice: number;
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private water_liters: number;
    private water_price: number;
    private wheat_kg: number;
    private wheat_price: number;
    private labor_cost: number;
    private bag_cost: number;
    private bran_kg: number;
    private bran_price: number;
    private profit_margin: number;

    constructor(
        electricity_kwh: number,
        electricity_price: number,
        water_liters: number,
        water_price: number,
        wheat_kg: number,
        wheat_price: number,
        labor_cost: number,
        bag_cost: number,
        bran_kg: number,
        bran_price: number,
        profit_margin: number
    ) {
        this.electricity_kwh = electricity_kwh;
        this.electricity_price = electricity_price;
        this.water_liters = water_liters;
        this.water_price = water_price;
        this.wheat_kg = wheat_kg;
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.bag_cost = bag_cost;
        this.bran_kg = bran_kg;
        this.bran_price = bran_price;
        this.profit_margin = profit_margin;
    }

    public calculateCosts(): CalculationResult {
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const waterCost = this.water_liters * this.water_price;
        const wheatCost = this.wheat_kg * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        // **Kepek Geliri Hesaplama**
        const branRevenue = this.bran_kg * this.bran_price;

        // **Toplam Maliyet = Giderler - Kepek Geliri**
        const totalCost = (electricityCost + waterCost + wheatCost + laborCost + bagCost) - branRevenue;

        // **Kâr ve Satış Fiyatı Hesaplama**
        const profit = totalCost * (this.profit_margin / 100);
        const finalPrice = totalCost + profit;

        return {
            productCost: totalCost,
            electricityCost,
            waterCost,
            wheatCost,
            laborCost,
            bagCost,
            branRevenue, // Kepekten gelen gelir
            totalCost,
            profit,
            finalPrice
        };
    }
}

// Fiyat ve yüzdelik formatlayıcılar
export const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
};

export const formatPercentage = (value: number): string => {
    return `%${Math.round(value)}`;
};
