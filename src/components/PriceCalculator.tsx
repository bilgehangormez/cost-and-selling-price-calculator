"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
            bag_cost: "",
            labor_cost_per_bag: "",
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

    // ✅ **Randıman değiştiğinde otomatik hesaplama**
    const randimanValue = watch("randiman");

    useEffect(() => {
        if (randimanValue) {
            const newWheatRequired = 5000 / formatNumber(randimanValue);
            setWheatRequired(newWheatRequired);
            setBranKg(newWheatRequired * 0.18);
            setBonkalitKg(newWheatRequired * 0.05);
        }
    }, [randimanValue]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto p-6">
            
            {/* 📌 Sol Kısım: Maliyet Girdileri */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg text-center font-semibold">Maliyet Girdileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        {[
                            ["Aylık Kırılan Buğday (kg)", "monthly_wheat"],
                            ["Randıman (%)", "randiman"],
                            ["50 kg Un İçin Gerekli Elektrik (kW)", "electricity_kwh"],
                            ["1 kW Elektrik (₺)", "electricity_price"],
                            ["Buğday kg Fiyatı (₺)", "wheat_price"],
                            ["Kepek kg Fiyatı (₺)", "bran_price"],
                            ["Bonkalit kg Fiyatı (₺)", "bonkalit_price"],
                            ["1 adet 50 kg PP Çuval Fiyatı (₺)", "bag_cost"],
                            ["1 Çuval 50 kg İçin İşçilik Maliyeti (₺)", "labor_cost_per_bag"],
                            ["1 Çuval 50 kg Unda Hedeflenen Kar (₺)", "target_profit_per_bag"],
                        ].map(([label, name]) => (
                            <div key={name} className="space-y-1">
                                <Label>{label}</Label>
                                <Input {...register(name)} className="input-lg" />
                            </div>
                        ))}
                        <Button type="submit" className="button-primary mt-4">
                            Hesapla
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Orta Kısım: İdari Giderler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg text-center font-semibold">İdari Giderler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    {[
                        ["Mutfak Gideri (₺)", "kitchen_expense"],
                        ["Bakım Gideri (₺)", "maintenance_expense"],
                        ["Çuval İpi (kg)", "sack_thread_kg"],
                        ["Çuval İpi kg Fiyatı (₺)", "sack_thread_price"],
                        ["Dizel Yakıt (Litre)", "diesel_liters"],
                        ["Dizel Litre Fiyatı (₺)", "diesel_price"],
                        ["Benzin (Litre)", "gasoline_liters"],
                        ["Benzin Litre Fiyatı (₺)", "gasoline_price"],
                        ["Araç Bakım Gideri (₺)", "vehicle_maintenance"],
                    ].map(([label, name]) => (
                        <div key={name} className="space-y-1">
                            <Label>{label}</Label>
                            <Input {...register(name)} className="input-lg" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* 📌 Sağ Kısım: Otomatik Hesaplanan Değerler + Satış Fiyatı */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg text-center font-semibold">Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="table-auto w-full">
                        <tbody>
                            <tr><td>Gerekli Buğday (kg)</td><td>{wheatRequired.toFixed(3)}</td></tr>
                            <tr><td>Çıkan Kepek (kg)</td><td>{branKg.toFixed(3)}</td></tr>
                            <tr><td>Çıkan Bonkalit (kg)</td><td>{bonkalitKg.toFixed(3)}</td></tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl border p-4 mt-4">
                <CardHeader>
                    <CardTitle className="text-lg text-center font-semibold">Satış Fiyatı</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-center text-2xl font-bold bg-gray-50 rounded-lg">
                    {finalPrice !== null ? `${finalPrice.toFixed(2)} ₺` : "Henüz hesaplanmadı"}
                </CardContent>
            </Card>
        </div>
    );
}
