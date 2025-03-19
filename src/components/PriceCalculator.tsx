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
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            monthly_wheat: "",
            randiman: "75",
            electricity_kwh: "",
            electricity_price: "",
            wheat_price: "",
            bran_price: "",
            bonkalit_price: "",
            labor_cost_per_bag: "",
            bag_cost: "",
            target_profit_per_bag: "",
            kitchen_expense: "",
            maintenance_expense: "",
            sack_thread_kg: "",
            sack_thread_price: "",
            diesel_liters: "",
            diesel_price: "",
            gasoline_liters: "",
            gasoline_price: "",
            vehicle_maintenance: ""
        }
    });

    const formatNumber = (value: string) => parseFloat(value.replace(",", ".") || "0");

    // **Randıman değiştiğinde otomatik hesaplama**
    const randimanValue = watch("randiman");
    const wheatRequiredCalc = randimanValue ? 5000 / formatNumber(randimanValue) : 0;
    const branKgCalc = wheatRequiredCalc * 0.18;
    const bonkalitKgCalc = wheatRequiredCalc * 0.05;

    setWheatRequired(wheatRequiredCalc);
    setBranKg(branKgCalc);
    setBonkalitKg(bonkalitKgCalc);

    const onSubmit = async (data: Record<string, string>) => {
        const bagCostValue = formatNumber(data.bag_cost);
        const laborCostPerBag = formatNumber(data.labor_cost_per_bag);
        const targetProfitPerBag = formatNumber(data.target_profit_per_bag);

        const calculator = new CostCalculator(
            data.electricity_kwh,
            data.electricity_price,
            data.randiman,
            data.wheat_price,
            laborCostPerBag.toString(),
            bagCostValue.toString(),
            data.bran_price,
            data.bonkalit_price,
            targetProfitPerBag.toString(),
            data.kitchen_expense,
            data.maintenance_expense,
            data.sack_thread_kg,
            data.sack_thread_price,
            data.diesel_liters,
            data.diesel_price,
            data.gasoline_liters,
            data.gasoline_price,
            data.vehicle_maintenance,
            data.monthly_wheat
        );

        const result = await calculator.calculateCosts();
        setFinalPrice(result.finalPrice + bagCostValue + laborCostPerBag);
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
                        <Label>📅 Aylık Kırılan Buğday (kg)</Label>
                        <Input {...register("monthly_wheat")} />

                        <Label>🎯 Randıman (%)</Label>
                        <Input {...register("randiman")} />

                        <Label>⚡ 50 kg Un İçin Gerekli Elektrik (kW)</Label>
                        <Input {...register("electricity_kwh")} />

                        <Label>⚡ 1 kW Elektrik (₺)</Label>
                        <Input {...register("electricity_price")} />

                        <Label>🌾 Buğday kg Fiyatı (₺)</Label>
                        <Input {...register("wheat_price")} />

                        <Label>📦 1 adet 50 kg PP Çuval Fiyatı (₺)</Label>
                        <Input {...register("bag_cost")} />

                        <Label>👷‍♂️ 1 Çuval 50 kg İçin İşçilik Maliyeti (₺)</Label>
                        <Input {...register("labor_cost_per_bag")} />

                        <Label>💰 1 Çuval 50 kg Unda Hedeflenen Kar (₺)</Label>
                        <Input {...register("target_profit_per_bag")} />

                        <Button type="submit" className="mt-4 w-full bg-blue-500 text-white">
                            Hesapla
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Orta Kısım: İdarî Maliyetler */}
            <Card className="shadow-lg rounded-xl border p-4 mx-auto">
                <CardHeader>
                    <CardTitle className="text-lg">💰 İdarî Maliyetler</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-3">
                        <Label>🍽️ Mutfak Gideri (₺)</Label>
                        <Input {...register("kitchen_expense")} />
                        <Label>🔧 Bakım Gideri (₺)</Label>
                        <Input {...register("maintenance_expense")} />
                        <Label>🧵 Çuval İpi Maliyeti (₺)</Label>
                        <Input {...register("sack_thread_price")} />
                        <Label>🚛 Araç Bakım Gideri (₺)</Label>
                        <Input {...register("vehicle_maintenance")} />
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Sağ Kısım: Satış Fiyatı ve Hesaplanan Değerler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">📊 Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>📌 Gerekli Buğday (kg): {wheatRequired.toFixed(3)}</p>
                    <p>📌 Çıkan Kepek (kg): {branKg.toFixed(3)}</p>
                    <p>📌 Çıkan Bonkalit (kg): {bonkalitKg.toFixed(3)}</p>
                </CardContent>
            </Card>

            {/* 📌 Satış Fiyatı */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">💰 Satış Fiyatı</CardTitle>
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
