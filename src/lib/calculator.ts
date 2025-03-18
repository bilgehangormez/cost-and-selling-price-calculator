export interface CalculationResult {
    productCost: number;
    electricityCost: number;
    wheatCost: number;
    laborCost: number;
    bagCost: number;
    branRevenue: number; // Kepek Geliri
    bonkalitRevenue: number; // Bonkalit Geliri
    totalCost: number;
    targetProfit: number;
    finalPrice: number;
    wheatRequired: number; // Hesaplanan gerekli buğday miktarı
    branKg: number; // Otomatik hesaplanan kepek miktarı
    bonkalitKg: number; // Otomatik hesaplanan bonkalit miktarı
}

export class CostCalculator {
    private electricity_kwh: number;
    private electricity_price: number;
    private randiman: number; // ✅ Randıman yüzdesi (100 kg üzerinden)
    private wheat_price: number;
    private labor_cost: number;
    private bag_cost: number;
    private bran_price: number;
    private bonkalit_price: number; // ✅ Bonkalit için ayrı fiyat
    private target_profit: number;

    constructor(
        electricity_kwh: number,
        electricity_price: number,
        randiman: number, // ✅ Randıman yüzdesi (100 kg üzerinden)
        wheat_price: number,
        labor_cost: number,
        bag_cost: number,
        bran_price: number,
        bonkalit_price: number, // ✅ Bonkalit için fiyat parametresi
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

    public calculateCosts(): CalculationResult {
        // ✅ 100 kg buğdaydan elde edilecek un miktarı
        const flourOutput = 100 * (this.randiman / 100);

        // ✅ 50 kg un için gereken buğday miktarı
        const wheatNeededFor50kgFlour = (100 / flourOutput) * 50;

        // ✅ Toplam yan ürün miktarı (kepek + bonkalit)
        const totalByproduct = wheatNeededFor50kgFlour - 50;

        // ✅ Bonkalit ve kepek hesaplamaları (Tüm yan ürünlerin %10'u bonkalit, kalan %90'ı kepek)
        const bonkalitKg = totalByproduct * 0.1;
        const branKg = totalByproduct * 0.9;

        // ✅ Maliyet hesaplamaları
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = wheatNeededFor50kgFlour * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        // ✅ Gelir hesaplamaları (kepek ve bonkalit)
        const branRevenue = branKg * this.bran_price;
        const bonkalitRevenue = bonkalitKg * this.bonkalit_price;

        // **Toplam Maliyet = Giderler - (Kepek Geliri + Bonkalit Geliri)**
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - (branRevenue + bonkalitRevenue);

        // **Son Satış Fiyatı**
        const finalPrice = totalCost + this.target_profit;

        return {
            productCost: totalCost,
            electricityCost,
            wheatCost,
            laborCost,
            bagCost,
            branRevenue, // ✅ Kepekten gelen gelir
            bonkalitRevenue, // ✅ Bonkalitten gelen gelir
            totalCost,
            targetProfit: this.target_profit,
            finalPrice,
            wheatRequired: wheatNeededFor50kgFlour, // ✅ 50 kg un için gereken buğday
            branKg, // ✅ Hesaplanan kepek miktarı
            bonkalitKg, // ✅ Hesaplanan bonkalit miktarı
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
