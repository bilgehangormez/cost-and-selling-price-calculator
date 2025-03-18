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
    private bonkalit_percentage: number; // ✅ Bonkalit yüzdesi
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
        bonkalit_percentage: number, // ✅ Bonkalit yüzdesi
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
        this.bonkalit_percentage = bonkalit_percentage;
        this.wheat_price = wheat_price;
        this.labor_cost = labor_cost;
        this.bag_cost = bag_cost;
        this.bran_price = bran_price;
        this.bonkalit_price = bonkalit_price;
        this.target_profit = target_profit;
    }

    public calculateCosts(): CalculationResult {
        // ✅ 100 kg buğday üzerinden hesaplama yapılıyor
        const wheatRequired = 100 / (this.randiman / 100); // 100 KG BUĞDAYDAN ELDE EDİLEN UN
        const wheatNeededFor50kgFlour = (wheatRequired / 2); // 50 KG UN İÇİN GEREKEN BUĞDAY

        // ✅ Toplam yan ürün miktarı (kepek + bonkalit)
        const totalByproduct = wheatRequired - 100;

        // ✅ Bonkalit ve kepek miktarları otomatik hesaplanıyor
        const bonkalitKg = (totalByproduct * (this.bonkalit_percentage / 100)) / 2; // 50 kg için ölçeklendirildi
        const branKg = (totalByproduct - bonkalitKg) / 2; // 50 kg için ölçeklendirildi

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
            wheatRequired: wheatNeededFor50kgFlour, // ✅ Hesaplanan gerekli buğday miktarı (50 kg un için)
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
