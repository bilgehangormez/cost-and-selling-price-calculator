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
    administrativeCost: number;
}

// ✅ normalizeNumber fonksiyonunu sınıfın DIŞINA al
const normalizeNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(",", ".").replace(/[^\d.-]/g, "")) || 0;
};

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
    private kitchen_expense: number;
    private maintenance_expense: number;
    private sack_thread_kg: number;
    private sack_thread_price: number;
    private diesel_liters: number;
    private diesel_price: number;
    private gasoline_liters: number;
    private gasoline_price: number;
    private vehicle_maintenance: number;
    private monthly_wheat: number;

    constructor(
        electricity_kwh: string,
        electricity_price: string,
        randiman: string,
        wheat_price: string,
        labor_cost: string,
        bag_cost: string,
        bran_price: string,
        bonkalit_price: string,
        target_profit: string,
        kitchen_expense: string,
        maintenance_expense: string,
        sack_thread_kg: string,
        sack_thread_price: string,
        diesel_liters: string,
        diesel_price: string,
        gasoline_liters: string,
        gasoline_price: string,
        vehicle_maintenance: string,
        monthly_wheat: string
    ) {
        this.electricity_kwh = normalizeNumber(electricity_kwh);
        this.electricity_price = normalizeNumber(electricity_price);
        this.randiman = normalizeNumber(randiman) || 75;
        this.wheat_price = normalizeNumber(wheat_price);
        this.labor_cost = normalizeNumber(labor_cost);
        this.bag_cost = normalizeNumber(bag_cost);
        this.bran_price = normalizeNumber(bran_price);
        this.bonkalit_price = normalizeNumber(bonkalit_price);
        this.target_profit = normalizeNumber(target_profit);
        this.kitchen_expense = normalizeNumber(kitchen_expense);
        this.maintenance_expense = normalizeNumber(maintenance_expense);
        this.sack_thread_kg = normalizeNumber(sack_thread_kg);
        this.sack_thread_price = normalizeNumber(sack_thread_price);
        this.diesel_liters = normalizeNumber(diesel_liters);
        this.diesel_price = normalizeNumber(diesel_price);
        this.gasoline_liters = normalizeNumber(gasoline_liters);
        this.gasoline_price = normalizeNumber(gasoline_price);
        this.vehicle_maintenance = normalizeNumber(vehicle_maintenance);
        this.monthly_wheat = normalizeNumber(monthly_wheat);
    }

    // ✅ calculateCosts fonksiyonunun SINIF İÇİNDE olduğundan emin ol
    public async calculateCosts(): Promise<CalculationResult> {
        const wheatRequired = 5000 / this.randiman;

        // Yan ürün hesaplamaları
        const branKg = (18.8 * wheatRequired) / 100;
        const bonkalitKg = (5.6 * wheatRequired) / 100;

        // Maliyet hesaplamaları
        const electricityCost = this.electricity_kwh * this.electricity_price;
        const wheatCost = wheatRequired * this.wheat_price;
        const laborCost = this.labor_cost;
        const bagCost = this.bag_cost;

        // Yan ürün gelirleri
        const branRevenue = branKg * this.bran_price;
        const bonkalitRevenue = bonkalitKg * this.bonkalit_price;

        // İdari maliyet hesaplamaları
        const sackThreadCost = this.sack_thread_kg * this.sack_thread_price;
        const dieselCost = this.diesel_liters * this.diesel_price;
        const gasolineCost = this.gasoline_liters * this.gasoline_price;
        const totalAdministrativeCost =
            this.kitchen_expense +
            this.maintenance_expense +
            sackThreadCost +
            dieselCost +
            gasolineCost +
            this.vehicle_maintenance;

        const adminCostPer50Kg = this.monthly_wheat > 0 ? (totalAdministrativeCost / this.monthly_wheat) * wheatRequired : 0;

        // Toplam Maliyet
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost + adminCostPer50Kg) - (branRevenue + bonkalitRevenue);

        // Son Satış Fiyatı
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
            administrativeCost: adminCostPer50Kg,
        };
    }
}
