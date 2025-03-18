"use client";

import { Button } from "@/components/ui/button";
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

    const randimanValue = watch("randiman");

    // 📌 Kullanıcının girdiği randıman değerine göre un, kepek ve bonkalit hesaplaması
    useEffect(() => {
        if (randimanValue) {
            fetch("/randiman_oranlari.json")
                .then((res) => res.json())
                .then((data) => {
                    const randimanKey = String(randimanValue);
                    if (data[randimanKey]) {
                        const wheatRequired = 50 / (data[randimanKey].un_miktari / 100);
                        setWheatRequired(wheatRequired);
                        setBranKg((data[randimanKey].kepek * wheatRequired) / 100);
                        setBonkalitKg((data[randimanKey].bonkalit * wheatRequired) / 100);
                    }
                })
                .catch((err) => console.error("Randıman verisi yüklenemedi!", err));
        }
    }, [randimanValue]);

    const onSubmit = async (data: Record<string, string>) => {
        const calculator = new CostCalculator(
            data.electricity_kwh,
            data.electricity_price,
            data.randiman,
            data.wheat_price,
            data.labor_cost,
            data.bag_cost,
            data.bran_price,
            data.bonkalit_price,
            data.target_profit
        );

        const result = await calculator.calculateCosts();
        setFinalPrice(result.finalPrice);
    };

    return (
        <div className="grid grid-cols-3 gap-4 mx-auto p-4">
            
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

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>

            {/* 📌 Orta Kısım: Otomatik Hesaplanan Değerler */}
            <Card className="shadow-lg rounded-xl border p-4">
                <CardHeader>
                    <CardTitle className="text-lg">🔹 Otomatik Hesaplanan Değerler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label>Gerekli Buğday (kg)</Label>
                            <Input type="number" value={wheatRequired.toFixed(2)} disabled className="bg-gray-200 px-4" />
                        </div>
                        <div>
                            <Label>Çıkan Kepek (kg)</Label>
                            <Input type="number" value={branKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
                        </div>
                        <div>
                            <Label>Çıkan Bonkalit (kg)</Label>
                            <Input type="number" value={bonkalitKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
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
                    {finalPrice !== null ? (
                        <div className="p-4 text-center text-2xl font-bold bg-gray-50 rounded-lg">
                            {finalPrice.toFixed(2)} ₺
                        </div>
                    ) : (
                        <div className="p-4 text-center text-lg text-gray-500">
                            Henüz hesaplanmadı
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
