"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [costDetails, setCostDetails] = useState<Record<string, number | null>>({});

    const { register, handleSubmit } = useForm({
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

        setCostDetails({
            "Gerekli Buğday (kg)": result.wheatRequired,
            "Çıkan Kepek (kg)": result.branKg,
            "Çıkan Bonkalit (kg)": result.bonkalitKg,
            "Elektrik Maliyeti": result.electricityCost,
            "Buğday Maliyeti": result.wheatCost,
            "İşçilik Maliyeti": result.laborCost,
            "Çuval Maliyeti": result.bagCost,
            "İdari Giderler": result.administrativeCost,
            "Kepek Geliri": result.branRevenue,
            "Bonkalit Geliri": result.bonkalitRevenue,
            "Toplam Maliyet": result.totalCost,
            "Hedeflenen Kar": result.targetProfit,
            "Satış Fiyatı": result.finalPrice
        });
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
                        <div><Label>50 kg Un İçin İşçilik Maliyeti (₺)</Label><Input {...register("labor_cost")} /></div>
                        <div><Label>1 Adet 50 kg PP Çuval (₺)</Label><Input {...register("bag_cost")} /></div>
                        <div><Label>50 kg Unda Hedeflenen Kâr (₺)</Label><Input {...register("target_profit")} /></div>
                        <Button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Orta Kısım: Hesaplanan Değerler Tablosu */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">🔹 Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm text-left border">
                        <tbody>
                            {Object.entries(costDetails).map(([key, value]) => (
                                <tr key={key} className="border-b">
                                    <td className="p-2 font-semibold">{key}</td>
                                    <td className="p-2">{value !== null ? `${value.toFixed(2)} ₺` : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                </CardContent>
            </Card>
        </div>
    );
}
