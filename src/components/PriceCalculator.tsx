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
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    randiman: z.string().min(1, "Randıman yüzdesi zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    bran_kg: z.string().min(1, "Çıkan kepek miktarı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    bag_cost: z.string().min(1, "Çuval maliyeti zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    target_profit: z.string().min(1, "50 kg çuvalda hedeflenen kâr zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
});

type FormData = z.infer<typeof costSchema>;

// Form Field Component
interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    step?: string;
    register: UseFormRegisterReturn;
    error?: { message?: string };
}

const FormField = ({ label, id, type = "text", step, register, error }: FormFieldProps) => (
    <div>
        <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
            {label}
        </Label>
        <Input
            id={id}
            type={type}
            step={step}
            {...register}
            className={cn("mt-1.5 h-12 rounded-xl bg-muted/50 px-4", error && "border-red-500 focus-visible:ring-red-500")}
        />
        {error?.message && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
);

export function PriceCalculator() {
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [branRevenue, setBranRevenue] = useState<number | null>(null);
    const [calculatedWheat, setCalculatedWheat] = useState<number | null>(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
    });

    // Randıman üzerinden gerekli buğday miktarını hesapla
    const randimanValue = watch("randiman");
    const wheatRequired = randimanValue ? (50 / (Number(randimanValue) / 100)) : 0;
    setCalculatedWheat(wheatRequired);

    const onSubmit = (data: FormData) => {
        console.log("🟢 Hesaplama başladı...");

        const electricityCost = Number(data.electricity_kwh) * Number(data.electricity_price);
        const wheatCost = wheatRequired * Number(data.wheat_price);
        const laborCost = Number(data.labor_cost);
        const bagCost = Number(data.bag_cost);
        const branRevenue = Number(data.bran_kg) * Number(data.bran_price);
        const totalCost = (electricityCost + wheatCost + laborCost + bagCost) - branRevenue;
        const finalPrice = totalCost + Number(data.target_profit);

        console.log("✅ Hesaplanan toplam maliyet:", totalCost);
        console.log("✅ Hedeflenen kâr eklendikten sonraki fiyat:", finalPrice);

        setBranRevenue(() => branRevenue);
        setFinalPrice(() => finalPrice);

        console.log("🟢 Hesaplama tamamlandı!");
    };

    return (
        <div className="w-full max-w-lg mx-auto p-4">
            <Card className="shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-lg">Un Üretimi Maliyet Hesaplayıcı</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField label="50 kg çuval başına gereken kW" id="electricity_kwh" type="number" register={register("electricity_kwh")} error={errors.electricity_kwh} />
                        <FormField label="Güncel kW fiyatı (₺)" id="electricity_price" type="number" register={register("electricity_price")} error={errors.electricity_price} />
                        <FormField label="Randıman (%)" id="randiman" type="number" step="0.1" register={register("randiman")} error={errors.randiman} />
                        
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">Otomatik Hesaplanan Buğday Miktarı (kg)</Label>
                            <Input type="number" value={calculatedWheat?.toFixed(2)} disabled className="mt-1.5 h-12 rounded-xl bg-gray-200 px-4" />
                        </div>

                        <FormField label="Buğdayın kg fiyatı (₺)" id="wheat_price" type="number" register={register("wheat_price")} error={errors.wheat_price} />
                        <FormField label="Çıkan Kepek Miktarı (kg)" id="bran_kg" type="number" register={register("bran_kg")} error={errors.bran_kg} />
                        <FormField label="Kepek Kg Fiyatı (₺)" id="bran_price" type="number" register={register("bran_price")} error={errors.bran_price} />
                        <FormField label="İşçilik Maliyeti (₺)" id="labor_cost" type="number" register={register("labor_cost")} error={errors.labor_cost} />
                        <FormField label="Çuval Maliyeti (₺)" id="bag_cost" type="number" register={register("bag_cost")} error={errors.bag_cost} />
                        <FormField label="50 kg çuvalda hedeflenen kâr (₺)" id="target_profit" type="number" register={register("target_profit")} error={errors.target_profit} />
                        
                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>

                    {finalPrice !== null && (
                        <div className="mt-4 p-2 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-bold">Satış Fiyatı: {finalPrice.toFixed(2)} ₺</h3>
                            <p className="text-sm text-muted-foreground">Kepek Geliri: {branRevenue?.toFixed(2)} ₺</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
