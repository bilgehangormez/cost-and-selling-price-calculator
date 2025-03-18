"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";

// Form Şeması
const costSchema = z.object({
    electricity_kwh: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    electricity_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    randiman: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100, "Geçerli bir yüzde girin"),
    bonkalit_percentage: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, "Geçerli bir yüzde girin"),
    wheat_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Geçerli bir değer girin"),
    bran_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    bonkalit_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    labor_cost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    bag_cost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
    target_profit: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Geçerli bir değer girin"),
});

type FormData = z.infer<typeof costSchema>;

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [branRevenue, setBranRevenue] = useState<number | null>(null);
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number | null>(null);
    const [wheatRequired, setWheatRequired] = useState<number>(0);
    const [branKg, setBranKg] = useState<number>(0);
    const [bonkalitKg, setBonkalitKg] = useState<number>(0);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
        defaultValues: {
            electricity_kwh: "0",
            electricity_price: "0",
            randiman: "75",
            bonkalit_percentage: "10",
            wheat_price: "0",
            bran_price: "0",
            bonkalit_price: "0",
            labor_cost: "0",
            bag_cost: "0",
            target_profit: "0",
        }
    });

    const onSubmit = (data: FormData) => {
        const randimanValue = parseFloat(data.randiman);
        const bonkalitValue = parseFloat(data.bonkalit_percentage);

        // 50 kg un için gerekli buğday miktarı hesaplanıyor
        const wheatRequiredCalc = 50 / (randimanValue / 100);
        const totalByproduct = wheatRequiredCalc - 50;
        const bonkalitAmount = totalByproduct * (bonkalitValue / 100);
        const branAmount = totalByproduct - bonkalitAmount;

        setWheatRequired(wheatRequiredCalc);
        setBranKg(branAmount);
        setBonkalitKg(bonkalitAmount);

        // Maliyet hesaplamaları
        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const wheatCost = wheatRequiredCalc * parseFloat(data.wheat_price);
        const laborCost = parseFloat(data.labor_cost);
        const bagCost = parseFloat(data.bag_cost);

        // Gelir hesaplamaları
        const branRevenueValue = branAmount * parseFloat(data.bran_price);
        const bonkalitRevenueValue = bonkalitAmount * parseFloat(data.bonkalit_price);
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - (branRevenueValue + bonkalitRevenueValue);
        const finalPriceValue = totalCost + parseFloat(data.target_profit);

        setBranRevenue(branRevenueValue);
        setBonkalitRevenue(bonkalitRevenueValue);
        setFinalPrice(finalPriceValue);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Label>Otomatik Hesaplanan Değerler</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="number" value={wheatRequired.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            <Label>Gerekli Buğday (kg)</Label>

                            <Input type="number" value={branKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            <Label>Çıkan Kepek (kg)</Label>

                            <Input type="number" value={bonkalitKg.toFixed(2)} disabled className="bg-gray-200 px-4" />
                            <Label>Çıkan Bonkalit (kg)</Label>
                        </div>

                        <FormField label="50 kg çuval başına gereken kW" id="electricity_kwh" type="number" register={register("electricity_kwh")} error={errors.electricity_kwh} />
                        <FormField label="Güncel kW fiyatı (₺)" id="electricity_price" type="number" register={register("electricity_price")} error={errors.electricity_price} />
                        <FormField label="Randıman (%)" id="randiman" type="number" step="0.1" register={register("randiman")} error={errors.randiman} />
                        <FormField label="Bonkalit (%)" id="bonkalit_percentage" type="number" step="0.1" register={register("bonkalit_percentage")} error={errors.bonkalit_percentage} />

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>

                    {finalPrice !== null && (
                        <div className="mt-4 p-2 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                            <p className="text-sm text-muted-foreground">Kepek Geliri: {branRevenue?.toFixed(2)} ₺</p>
                            <p className="text-sm text-muted-foreground">Bonkalit Geliri: {bonkalitRevenue?.toFixed(2)} ₺</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// FormField bileşeni
const FormField = ({ label, id, type = "text", step, register, error }: any) => (
    <div>
        <Label>{label}</Label>
        <Input type={type} step={step} {...register} className={cn("mt-1.5 h-12 rounded-xl bg-muted/50 px-4")} />
        {error?.message && <p className="text-red-500">{error.message}</p>}
    </div>
);
