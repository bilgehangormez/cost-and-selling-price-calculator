"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CostCalculator } from "@/lib/calculator";
import { Button } from "@/components/ui/button";

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);
    const [branRevenue, setBranRevenue] = useState<number>(0);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number>(0);
    const [administrativeCost, setAdministrativeCost] = useState<number>(0);

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

    const formatNumber = (value: string) => parseFloat(value.replace(",", ".") || "0");

    const onSubmit = async (data: Record<string, string>) => {
        const randimanValue = formatNumber(data.randiman);
        const wheatNeeded = 5000 / randimanValue;
        setWheatRequired(wheatNeeded);

        const branPrice = formatNumber(data.bran_price);
        const bonkalitPrice = formatNumber(data.bonkalit_price);

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
        setBranRevenue(result.branKg * branPrice);
        setBonkalitRevenue(result.bonkalitKg * bonkalitPrice);
        setAdministrativeCost(result.administrativeCost);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto p-6">
            
            {/* 📌 Maliyet Girdileri */}
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

                        <Label>50 kg Un İçin İşçilik Maliyeti (₺)</Label>
                        <Input {...register("labor_cost")} />

                        <Label>1 Adet 50 kg PP Çuval (₺)</Label>
                        <Input {...register("bag_cost")} />

                        <Label>50 kg Unda Hedeflenen Kâr (₺)</Label>
                        <Input {...register("target_profit")} />

                        <Button type="submit" className="w-full bg-blue-600 text-white">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 İdari Maliyetler (ORTADA) */}
            <Card className="shadow-lg rounded-xl border p-4 col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg text-center">📌 İdari Maliyetler</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>Mutfağa Gideri (₺)</Label>
                    <Input {...register("kitchen_expense")} />

                    <Label>Bakım Gideri (₺)</Label>
                    <Input {...register("maintenance_expense")} />

                    <Label>Çuval İpliği (kg)</Label>
                    <Input {...register("sack_thread_kg")} />

                    <Label>Çuval İpliği Fiyatı (₺)</Label>
                    <Input {...register("sack_thread_price")} />

                    <Label>Motorin (Litre)</Label>
                    <Input {...register("diesel_liters")} />

                    <Label>Motorin Fiyatı (₺)</Label>
                    <Input {...register("diesel_price")} />

                    <Label>Benzin (Litre)</Label>
                    <Input {...register("gasoline_liters")} />

                    <Label>Benzin Fiyatı (₺)</Label>
                    <Input {...register("gasoline_price")} />

                    <Label>Araç Bakım (₺)</Label>
                    <Input {...register("vehicle_maintenance")} />
                </CardContent>
            </Card>

            {/* 📌 Satış Fiyatı ve Otomatik Hesaplanan Değerler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">📌 Satış Fiyatı</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-center">{finalPrice !== null ? `${finalPrice.toFixed(2)} ₺` : "Henüz hesaplanmadı"}</p>
                    <p className="text-sm text-gray-500 text-center">İdari Maliyet: {administrativeCost.toFixed(2)} ₺</p>
                    <p>Kepek Geliri: {branRevenue.toFixed(2)} ₺</p>
                    <p>Bonkalit Geliri: {bonkalitRevenue.toFixed(2)} ₺</p>
                </CardContent>
            </Card>
        </div>
    );
}
