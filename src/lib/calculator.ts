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

    // ✅ **Yeni eklenen idari maliyetler**
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
        this.electricity_kwh = parseFloat(electricity_kwh) || 0;
        this.electricity_price = parseFloat(electricity_price) || 0;
        this.randiman = parseFloat(randiman) || 75;
        this.wheat_price = parseFloat(wheat_price) || 0;
        this.labor_cost = parseFloat(labor_cost) || 0;
        this.bag_cost = parseFloat(bag_cost) || 0;
        this.bran_price = parseFloat(bran_price) || 0;
        this.bonkalit_price = parseFloat(bonkalit_price) || 0;
        this.target_profit = parseFloat(target_profit) || 0;

        // ✅ **Idari maliyetleri atama**
        this.kitchen_expense = parseFloat(kitchen_expense) || 0;
        this.maintenance_expense = parseFloat(maintenance_expense) || 0;
        this.sack_thread_kg = parseFloat(sack_thread_kg) || 0;
        this.sack_thread_price = parseFloat(sack_thread_price) || 0;
        this.diesel_liters = parseFloat(diesel_liters) || 0;
        this.diesel_price = parseFloat(diesel_price) || 0;
        this.gasoline_liters = parseFloat(gasoline_liters) || 0;
        this.gasoline_price = parseFloat(gasoline_price) || 0;
        this.vehicle_maintenance = parseFloat(vehicle_maintenance) || 0;
        this.monthly_wheat = parseFloat(monthly_wheat) || 0;
    }

    public async calculateCosts(): Promise<CalculationResult> {
        const response = await fetch("/randiman_oranlari.json");
        const randimanData = await response.json();

        // ✅ **Randıman interpolasyonu**
        const lowerRandiman = Math.floor(this.randiman);
        const upperRandiman = Math.ceil(this.randiman);
        let randimanValue;
        if (lowerRandiman === upperRandiman || !randimanData[lowerRandiman] || !randimanData[upperRandiman]) {
            randimanValue = randimanData[String(lowerRandiman)] || randimanData["75"];
        } else {
            const lowerData = randimanData[String(lowerRandiman)];
            const upperData = randimanData[String(upperRandiman)];
            const weight = this.randiman - lowerRandiman;
            randimanValue = {
                un_miktari: lowerData.un_miktari + weight * (upperData.un_miktari - lowerData.un_miktari),
                kepek: lowerData.kepek + weight * (upperData.kepek - lowerData.kepek),
                bonkalit: lowerData.bonkalit + weight * (upperData.bonkalit - lowerData.bonkalit),
            };
        }

        // ✅ **50 kg un için gerekli buğday miktarı**
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

        // ✅ **İdari maliyet hesaplaması**
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

        // ✅ **Toplam Maliyet**
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost + adminCostPer50Kg) - (branRevenue + bonkalitRevenue);

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
            administrativeCost: adminCostPer50Kg,
        };
    }
}
