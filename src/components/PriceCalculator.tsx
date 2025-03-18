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
    bonkalit_percentage: z.string().min(1, "Bonkalit yüzdesi zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) > 0),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
    bag_cost: z.string().min(1, "1 Adet 50 kg PP Çuval Fiyatı zorunludur").refine((val) => !isNaN(Number(val)) && Number(val) >= 0),
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
    const [calculatedBran, setCalculatedBran] = useState<number | null>(null);
    const [calculatedBonkalit, setCalculatedBonkalit] = useState<number | null>(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
    });

    // Randıman ve bonkalit üzerinden gerekli hesaplamalar
    const randimanValue = watch("randiman");
    const bonkalitValue = watch("bonkalit_percentage");

    const wheatRequired = randimanValue ? (50 / (Number(randimanValue) / 100)) : 0;
    const totalByproduct = wheatRequired - 50;
    const bonkalitAmount = totalByproduct * (Number(bonkalitValue) / 100);
    const branAmount = totalByproduct - bonkalitAmount;

    setCalculatedWheat(wheatRequired);
    setCalculatedBran(branAmount);
    setCalculatedBonkalit(bonkalitAmount);

    const onSubmit = (data: FormData) => {
        console.log("🟢 Hesaplama başladı...");

        const electricityCost = Number(data.electricity_kwh) * Number(data.electricity_price);
        const wheatCost = wheatRequired * Number(data.wheat_price);
        const laborCost = Number(data.labor_cost);
        const bagCost = Number(data.bag_cost);
        const branRevenue = branAmount * Number(data.bran_price);
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
                        <FormField label="Bonkalit (%)" id="bonkalit_percentage" type="number" step="0.1" register={register("bonkalit_percentage")} error={errors.bonkalit_percentage} />

                        <div>
                            <Label>Otomatik Hesaplanan Buğday Miktarı (kg)</Label>
                            <Input type="number" value={calculatedWheat?.toFixed(2)} disabled className="mt-1.5 h-12 rounded-xl bg-gray-200 px-4" />
                        </div>

                        <div>
                            <Label>Otomatik Hesaplanan Kepek (kg)</Label>
                            <Input type="number" value={calculatedBran?.toFixed(2)} disabled className="mt-1.5 h-12 rounded-xl bg-gray-200 px-4" />
                        </div>

                        <div>
                            <Label>Otomatik Hesaplanan Bonkalit (kg)</Label>
                            <Input type="number" value={calculatedBonkalit?.toFixed(2)} disabled className="mt-1.5 h-12 rounded-xl bg-gray-200 px-4" />
                        </div>

                        <Button type="submit" className="w-full h-12 text-base rounded-xl">Hesapla</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
