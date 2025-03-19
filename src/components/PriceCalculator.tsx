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
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);
    const [administrativeCost, setAdministrativeCost] = useState<number>(0);
    const [bagCost, setBagCost] = useState<number>(0); // 50 kg PP çuval fiyatı

    const { register, handleSubmit } = useForm({
        defaultValues: {
            monthly_wheat: "",
            randiman: "75",
            electricity_kwh: "",
            electricity_price: "",
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
            vehicle_maintenance: ""
        }
    });

    const formatNumber = (value: string) => parseFloat(value.replace(",", ".") || "0");

    const onSubmit = async (data: Record<string, string>) => {
        const branPrice = formatNumber(data.bran_price);
        const bonkalitPrice = formatNumber(data.bonkalit_price);

        // ✅ **Buğday gereksinimini hesapla**
        const randimanValue = formatNumber(data.randiman);
        const wheatRequiredCalc = 5000 / randimanValue;
        setWheatRequired(wheatRequiredCalc);

        // ✅ **Çuval maliyetini güncelle**
        const bagCostValue = formatNumber(data.bag_cost);
        setBagCost(bagCostValue);

        // ✅ **İdari maliyet hesaplaması**
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
        setAdministrativeCost(totalAdministrativeCost);

        const calculator = new CostCalculator(
            data.electricity_kwh,
            data.electricity_price,
            data.randiman,
            data.wheat_price,
            data.labor_cost,
            bagCostValue.toString(), // **Çuval maliyeti string olarak gönderildi**
            data.bran_price,
            data.bonkalit_price,
            data.target_profit,
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
        setFinalPrice(result.finalPrice + totalAdministrativeCost);
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
                        <Label>Aylık Kırılan Buğday (kg)</Label>
                        <Input {...register("monthly_wheat")} />

                        <Label>Randıman (%)</Label>
                        <Input {...register("randiman")} />

                        <Label>50 kg Un İçin Gerekli Elektrik (kW)</Label>
                        <Input {...register("electricity_kwh")} />

                        <Label>1 kW Elektrik (₺)</Label>
                        <Input {...register("electricity_price")} />

                        <Label>Buğday kg Fiyatı (₺)</Label>
                        <Input {...register("wheat_price")} />

                        <Label>Kepek kg Fiyatı (₺)</Label>
                        <Input {...register("bran_price")} />

                        <Label>Bonkalit kg Fiyatı (₺)</Label>
                        <Input {...register("bonkalit_price")} />

                        <Label>📦 1 adet 50 kg PP Çuval Fiyatı (₺)</Label>
                        <Input {...register("bag_cost")} />

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
                    <p className="text-center text-lg font-bold">{administrativeCost.toFixed(2)} ₺</p>
                    <p>🍽️ Mutfak Gideri: {formatNumber(administrativeCost.toFixed(2))} ₺</p>
                    <p>🔧 Bakım Gideri: {formatNumber(administrativeCost.toFixed(2))} ₺</p>
                    <p>🧵 Çuval İpi Maliyeti: {formatNumber(administrativeCost.toFixed(2))} ₺</p>
                    <p>🚛 Araç Bakım Gideri: {formatNumber(administrativeCost.toFixed(2))} ₺</p>
                </CardContent>
            </Card>

            {/* 📌 Sağ Kısım: Satış Fiyatı ve Hesaplanan Değerler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">📊 Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Gerekli Buğday (kg): {wheatRequired.toFixed(3)}</p>
                    <p>Çıkan Kepek (kg): {branKg.toFixed(3)}</p>
                    <p>Çıkan Bonkalit (kg): {bonkalitKg.toFixed(3)}</p>
                    <p>Kepek Geliri: {branRevenue.toFixed(2)} ₺</p>
                    <p>Bonkalit Geliri: {bonkalitRevenue.toFixed(2)} ₺</p>
                </CardContent>
            </Card>

            {/* 📌 Satış Fiyatı */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">📌 Satış Fiyatı</CardTitle>
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
