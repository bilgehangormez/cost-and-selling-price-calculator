export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    wheatCost: number;
    laborCost: number;
    bagCost: number;
    branRevenue: number; // Kepek Geliri
    totalCost: number;
    targetProfit: number;
    finalPrice: number;
    wheatRequired: number; // Hesaplanan gerekli buğday miktarı
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private randiman: number; // ✅ Randıman yüzdesi eklendi
    private wheat_price: number;
    private labor_cost: number;
    private bag_cost: number;
    private bran_kg: number;
    private bran_price: number;
    private target_profit: number;

    constructor(
        electricity_kwh: number,
        electricity_price: number,
        randiman: number, // ✅ Randıman yüzdesi
        wheat_price: number,
        labor_cost: number,
        bag_cost: number,
        bran_kg: number,
        bran_price: number,
        target_profit: number
    ) {
        this.electricity_kwh = electricity_kwh;
        this.electricity_price = electricity_price;
        this.randiman = randiman; // ✅ Kullanıcıdan randıman yüzdesi alınıyor
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.bag_cost = bag_cost;
        this.bran_kg = bran_kg;
        this.bran_price = bran_price;
        this.target_profit = target_profit;
    }

    public calculateCosts(): CalculationResult {
        // ✅ 50 kg un için gerekli buğday miktarı hesaplanıyor
        const wheatRequired = 50 / (this.randiman / 100);

        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = wheatRequired * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        // **Kepek Geliri Hesaplama**
        const branRevenue = this.bran_kg * this.bran_price;

        // **Toplam Maliyet = Giderler - Kepek Geliri**
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - branRevenue;

        // **Son Satış Fiyatı**
        const finalPrice = totalCost + this.target_profit;

        return {
            productCost: totalCost,
            electricityCost,
            wheatCost,
            laborCost,
            bagCost,
            branRevenue, // Kepekten gelen gelir
            totalCost,
            targetProfit: this.target_profit,
            finalPrice,
            wheatRequired, // ✅ Randıman ile hesaplanan gerekli buğday miktarı
        };
    }
}

// **Fiyat ve yüzdelik formatlayıcılar**
export const formatPrice = (value: number): string => {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);
};

export const formatPercentage = (value: number): string => {
    return `%${Math.round(value)}`;
};
