"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);
    const [administrativeCost, setAdministrativeCost] = useState<number>(0);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            electricity_kwh: "",
            electricity_price: "",
            randiman: "75",
            wheat_price: "",
            bran_price: "",
            bonkalit_price: "",
            labor_cost: "",
            bag_cost: "",
            target_profit: "",
            kitchen_expense: "",
            maintenance_expense: "",
            sack_thread_kg: "",
            sack_thread_price: "",
            diesel_liters: "",
            diesel_price: "",
            gasoline_liters: "",
            gasoline_price: "",
            vehicle_maintenance: "",
            monthly_wheat: ""
        }
    });

    const formatNumber = (value: string) => parseFloat(value.replace(",", ".") || "0");
    const randimanValue = formatNumber(watch("randiman"));

    useEffect(() => {
        if (randimanValue > 0) {
            setWheatRequired(5000 / randimanValue);
        }
    }, [randimanValue]);

    const onSubmit = async (data: Record<string, string>) => {
        const branPrice = formatNumber(data.bran_price);
        const bonkalitPrice = formatNumber(data.bonkalit_price);

        // **İdari maliyet hesaplaması**
        const sackThreadCost = formatNumber(data.sack_thread_kg) * formatNumber(data.sack_thread_price);
        const dieselCost = formatNumber(data.diesel_liters) * formatNumber(data.diesel_price);
        const gasolineCost = formatNumber(data.gasoline_liters) * formatNumber(data.gasoline_price);
        const totalAdministrativeCost =
            formatNumber(data.kitchen_expense) +
            formatNumber(data.maintenance_expense) +
            sackThreadCost +
            dieselCost +
            gasolineCost +
            formatNumber(data.vehicle_maintenance);

        const monthlyWheat = formatNumber(data.monthly_wheat);
        const adminCostPer50Kg = monthlyWheat > 0 ? (totalAdministrativeCost / monthlyWheat) * wheatRequired : 0;
        setAdministrativeCost(adminCostPer50Kg);

        const calculator = new CostCalculator(
            data.electricity_kwh.replace(",", "."),
            data.electricity_price.replace(",", "."),
            data.randiman.replace(",", "."),
            data.wheat_price.replace(",", "."),
            data.labor_cost.replace(",", "."),
            data.bag_cost.replace(",", "."),
            data.bran_price.replace(",", "."),
            data.bonkalit_price.replace(",", "."),
            data.target_profit.replace(",", ".")
        );

        const result = await calculator.calculateCosts();
        setFinalPrice(result.finalPrice + adminCostPer50Kg);
        setBranKg(result.branKg);
        setBonkalitKg(result.bonkalitKg);
        setBranRevenue(result.branKg * branPrice);
        setBonkalitRevenue(result.bonkalitKg * bonkalitPrice);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-4">
            
            {/* 📌 Sol Kısım: Maliyet Girdileri */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">📌 Maliyet Girdileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div><Label>Aylık Kırılan Buğday (kg)</Label><Input {...register("monthly_wheat")} /></div>
                        <div><Label>50 kg Un İçin Gerekli Elektrik (kW)</Label><Input {...register("electricity_kwh")} /></div>
                        <div><Label>1 kW Elektrik (₺)</Label><Input {...register("electricity_price")} /></div>
                        <div><Label>Randıman (%)</Label><Input {...register("randiman")} /></div>
                        <div><Label>Buğday kg Fiyatı (₺)</Label><Input {...register("wheat_price")} /></div>
                        <div><Label>Kepek kg Fiyatı (₺)</Label><Input {...register("bran_price")} /></div>
                        <div><Label>Bonkalit kg Fiyatı (₺)</Label><Input {...register("bonkalit_price")} /></div>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Sağ Kısım: Hesaplanan Satış Fiyatı */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">Satış Fiyatı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 text-center text-2xl font-bold bg-gray-50 rounded-lg">
                        {finalPrice !== null ? `${finalPrice.toFixed(2)} ₺` : "Henüz hesaplanmadı"}
                    </div>
                    <p className="mt-2 text-center text-sm text-gray-500">İdari Maliyet Eklenmiş: {administrativeCost.toFixed(2)} ₺</p>
                    <div className="mt-4 text-center text-lg">
                        <p><strong>Çıkan Kepek (kg):</strong> {branKg.toFixed(3)}</p>
                        <p><strong>Çıkan Bonkalit (kg):</strong> {bonkalitKg.toFixed(3)}</p>
                        <p><strong>Kepek Geliri:</strong> {branRevenue.toFixed(2)} ₺</p>
                        <p><strong>Bonkalit Geliri:</strong> {bonkalitRevenue.toFixed(2)} ₺</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
