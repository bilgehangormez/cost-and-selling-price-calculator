"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";

// Form Şeması
const costSchema = z.object({
    electricity_kwh: z.string().min(1, "Gerekli kW miktarı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0),
    electricity_price: z.string().min(1, "Güncel kW fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0),
    randiman: z.string().min(1, "Randıman yüzdesi zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100),
    bonkalit_percentage: z.string().min(1, "Bonkalit yüzdesi zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
    wheat_price: z.string().min(1, "Buğday kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0),
    bran_price: z.string().min(1, "Kepek kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    bonkalit_price: z.string().min(1, "Bonkalit kg fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    labor_cost: z.string().min(1, "İşçilik maliyeti zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    bag_cost: z.string().min(1, "1 Adet 50 kg PP Çuval Fiyatı zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    target_profit: z.string().min(1, "50 kg çuvalda hedeflenen kâr zorunludur").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0),
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
    const [bonkalitRevenue, setBonkalitRevenue] = useState<number | null>(null);
    const [calculatedWheat, setCalculatedWheat] = useState<number>(0);
    const [calculatedBran, setCalculatedBran] = useState<number>(0);
    const [calculatedBonkalit, setCalculatedBonkalit] = useState<number>(0);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(costSchema),
    });

    const randimanValue = parseFloat(watch("randiman") || "0");
    const bonkalitValue = parseFloat(watch("bonkalit_percentage") || "0");

    useEffect(() => {
        if (randimanValue > 0) {
            const wheatRequired = 50 / (randimanValue / 100);
            const totalByproduct = wheatRequired - 50;
            const bonkalitAmount = totalByproduct * (bonkalitValue / 100);
            const branAmount = totalByproduct - bonkalitAmount;

            setCalculatedWheat(wheatRequired);
            setCalculatedBran(branAmount);
            setCalculatedBonkalit(bonkalitAmount);
        }
    }, [randimanValue, bonkalitValue]);

    const onSubmit = (data: FormData) => {
        const electricityCost = parseFloat(data.electricity_kwh) * parseFloat(data.electricity_price);
        const wheatCost = calculatedWheat * parseFloat(data.wheat_price);
        const laborCost = parseFloat(data.labor_cost);
        const bagCost = parseFloat(data.bag_cost);
        const branRevenueValue = calculatedBran * parseFloat(data.bran_price);
        const bonkalitRevenueValue = calculatedBonkalit * parseFloat(data.bonkalit_price);
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
                        <FormField label="50 kg çuval başına gereken kW" id="electricity_kwh" type="number" register={register("electricity_kwh")} error={errors.electricity_kwh} />
                        <FormField label="Güncel kW fiyatı (₺)" id="electricity_price" type="number" register={register("electricity_price")} error={errors.electricity_price} />
                        <FormField label="Randıman (%)" id="randiman" type="number" step="0.1" register={register("randiman")} error={errors.randiman} />
                        <FormField label="Bonkalit (%)" id="bonkalit_percentage" type="number" step="0.1" register={register("bonkalit_percentage")} error={errors.bonkalit_percentage} />
                        <FormField label="Buğdayın kg fiyatı (₺)" id="wheat_price" type="number" register={register("wheat_price")} error={errors.wheat_price} />

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
