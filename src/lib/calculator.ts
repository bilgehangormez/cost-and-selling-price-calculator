export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    wheatCost: number;
    laborCost: number;
    bagCost: number;
    ppBagCost: number; // ✅ PP çuval maliyeti eklendi
    branRevenue: number; // Kepek Geliri
    totalCost: number;
    targetProfit: number; // 50 kg çuval başına manuel girilen hedef kâr
    finalPrice: number;
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private wheat_kg: number;
    private wheat_price: number;
    private labor_cost: number;
    private bag_cost: number;
    private pp_bag_price: number; // ✅ PP çuval fiyatı eklendi
    private bran_kg: number;
    private bran_price: number;
    private target_profit: number;

    constructor(
        electricity_kwh: number,
        electricity_price: number,
        wheat_kg: number,
        wheat_price: number,
        labor_cost: number,
        bag_cost: number,
        pp_bag_price: number, // ✅ PP çuval fiyatı parametre olarak alınıyor
        bran_kg: number,
        bran_price: number,
        target_profit: number
    ) {
        this.electricity_kwh = electricity_kwh;
        this.electricity_price = electricity_price;
        this.wheat_kg = wheat_kg;
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.bag_cost = bag_cost;
        this.pp_bag_price = pp_bag_price; // ✅ Atama yapıldı
        this.bran_kg = bran_kg;
        this.bran_price = bran_price;
        this.target_profit = target_profit;
    }

    public calculateCosts(): CalculationResult {
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = this.wheat_kg * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;
        const ppBagCost = this.pp_bag_price; // ✅ PP çuval maliyeti hesaplamaya dahil edildi

        // **Kepek Geliri Hesaplama**
        const branRevenue = this.bran_kg * this.bran_price;

        // **Toplam Maliyet = Giderler - Kepek Geliri**
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost + ppBagCost) - branRevenue;

        // **Final Satış Fiyatı (Hedef Kâr manuel giriliyor)**
        const finalPrice = totalCost + this.target_profit;

        return {
            productCost: totalCost,
            electricityCost,
            wheatCost,
            laborCost,
            bagCost,
            ppBagCost, // ✅ PP çuval maliyeti ekrana döndürülecek
            branRevenue,
            totalCost,
            targetProfit: this.target_profit,
            finalPrice
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
