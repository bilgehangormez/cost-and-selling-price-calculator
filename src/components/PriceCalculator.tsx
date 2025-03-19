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
        const calculator = new CostCalculator(
            data.electricity_kwh.replace(",", "."),
            data.electricity_price.replace(",", "."),
            data.randiman.replace(",", "."),
            data.wheat_price.replace(",", "."),
            data.labor_cost.replace(",", "."),
            data.bag_cost.replace(",", "."),
            data.bran_price.replace(",", "."),
            data.bonkalit_price.replace(",", "."),
            data.target_profit.replace(",", "."),
            data.kitchen_expense.replace(",", "."),
            data.maintenance_expense.replace(",", "."),
            data.sack_thread_kg.replace(",", "."),
            data.sack_thread_price.replace(",", "."),
            data.diesel_liters.replace(",", "."),
            data.diesel_price.replace(",", "."),
            data.gasoline_liters.replace(",", "."),
            data.gasoline_price.replace(",", "."),
            data.vehicle_maintenance.replace(",", "."),
            data.monthly_wheat.replace(",", ".")
        );

        const result = await calculator.calculateCosts();
        setFinalPrice(result.finalPrice);
        setBranKg(result.branKg);
        setBonkalitKg(result.bonkalitKg);
        setBranRevenue(result.branRevenue);
        setBonkalitRevenue(result.bonkalitRevenue);
        setAdministrativeCost(result.administrativeCost);
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

                        <CardHeader><CardTitle>📌 İdari Maliyetler</CardTitle></CardHeader>
                        <div><Label>Aylık Mutfak Gideri (₺)</Label><Input {...register("kitchen_expense")} /></div>
                        <div><Label>Tamir-Tadilat-Değirmen Gideri (₺)</Label><Input {...register("maintenance_expense")} /></div>
                        <div><Label>Çuval İpi Gider Miktarı (kg)</Label><Input {...register("sack_thread_kg")} /></div>
                        <div><Label>Çuval İpi Kg Fiyatı (₺)</Label><Input {...register("sack_thread_price")} /></div>
                        <div><Label>Aylık Mazot Gideri (Lt)</Label><Input {...register("diesel_liters")} /></div>
                        <div><Label>Mazot Lt Fiyatı (₺)</Label><Input {...register("diesel_price")} /></div>
                        <div><Label>Aylık Benzin Gideri (Lt)</Label><Input {...register("gasoline_liters")} /></div>
                        <div><Label>Benzin Lt Fiyatı (₺)</Label><Input {...register("gasoline_price")} /></div>
                        <div><Label>Araç Bakımı Gideri (₺)</Label><Input {...register("vehicle_maintenance")} /></div>

                        <button type="submit" className="w-full h-12 text-base rounded-xl bg-blue-500 text-white">Hesapla</button>
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
