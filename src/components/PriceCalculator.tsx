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
        setFinalPrice(result.finalPrice);
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
                        <div>
                            <Label>50 kg un için gerekli elektrik (kW)</Label>
                            <Input {...register("electricity_kwh")} />
                        </div>
                        <div>
                            <Label>1 kW elektrik (₺)</Label>
                            <Input {...register("electricity_price")} />
                        </div>
                        <div>
                            <Label>Randıman (%)</Label>
                            <Input {...register("randiman")} />
                        </div>
                        <div>
                            <Label>Buğday kg Fiyatı (₺)</Label>
                            <Input {...register("wheat_price")} />
                        </div>
                        <div>
                            <Label>Kepek kg Fiyatı (₺)</Label>
                            <Input {...register("bran_price")} />
                        </div>
                        <div>
                            <Label>Bonkalit kg Fiyatı (₺)</Label>
                            <Input {...register("bonkalit_price")} />
                        </div>
                        <div>
                            <Label>İşçilik Maliyeti (₺)</Label>
                            <Input {...register("labor_cost")} />
                        </div>
                        <div>
                            <Label>1 Adet 50 kg PP Çuval (₺)</Label>
                            <Input {...register("bag_cost")} />
                        </div>
                        <div>
                            <Label>Hedeflenen Kâr (₺)</Label>
                            <Input {...register("target_profit")} />
                        </div>

                        <button type="submit" className="w-full h-12 text-base rounded-xl bg-blue-500 text-white">
                            Hesapla
                        </button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Orta Kısım: Otomatik Hesaplanan Değerler (ALT ALTA) */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">🔹 Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Gerekli Buğday (kg)</Label>
                            <input type="text" value={wheatRequired.toFixed(5)} disabled className="input-lg" />
                        </div>
                        <div>
                            <Label>Çıkan Kepek (kg)</Label>
                            <input type="text" value={branKg.toFixed(5)} disabled className="input-lg" />
                        </div>
                        <div>
                            <Label>Çıkan Bonkalit (kg)</Label>
                            <input type="text" value={bonkalitKg.toFixed(5)} disabled className="input-lg" />
                        </div>
                    </div>
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
                    <div className="mt-4 text-center text-lg">
                        <p><strong>Kepek Geliri:</strong> {branRevenue.toFixed(5)} ₺</p>
                        <p><strong>Bonkalit Geliri:</strong> {bonkalitRevenue.toFixed(5)} ₺</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
