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

  const formatNumber = (value: string) =>
    parseFloat(value.replace(",", ".") || "0");

  // Randıman değiştiğinde otomatik hesaplama
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
    setFinalPrice(result.finalPrice);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto p-6">
        
        {/* Sol Kısım: Maliyet Girdileri */}
        <Card className="shadow-lg rounded-xl border p-4">
          <CardHeader>
            <CardTitle className="text-lg text-center font-extrabold">
              Maliyet Girdileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Label>Aylık Kırılan Buğday (kg)</Label>
            <Input {...register("monthly_wheat")} className="input-lg" />

            <Label>Randıman (%)</Label>
            <Input {...register("randiman")} className="input-lg" />

            <Label>50 kg Un İçin Gerekli Elektrik (kW)</Label>
            <Input {...register("electricity_kwh")} className="input-lg" />

            <Label>1 kW Elektrik (₺)</Label>
            <Input {...register("electricity_price")} className="input-lg" />

            <Label>Buğday kg Fiyatı (₺)</Label>
            <Input {...register("wheat_price")} className="input-lg" />

            <Label>Kepek kg Fiyatı (₺)</Label>
            <Input {...register("bran_price")} className="input-lg" />

            <Label>Bonkalit kg Fiyatı (₺)</Label>
            <Input {...register("bonkalit_price")} className="input-lg" />

            <Label>1 adet 50 kg PP Çuval Fiyatı (₺)</Label>
            <Input {...register("bag_cost")} className="input-lg" />

            <Label>1 Çuval 50 kg İçin İşçilik Maliyeti (₺)</Label>
            <Input {...register("labor_cost_per_bag")} className="input-lg" />

            <Label>1 Çuval 50 kg Unda Hedeflenen Kar (₺)</Label>
            <Input {...register("target_profit_per_bag")} className="input-lg" />
          </CardContent>
        </Card>

        {/* Orta Kısım: İdari Giderler */}
        <Card className="shadow-lg rounded-xl border p-4 mx-auto">
          <CardHeader>
            <CardTitle className="text-lg text-center font-extrabold">
              İdari Giderler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Label>Mutfak Gideri (₺)</Label>
            <Input {...register("kitchen_expense")} className="input-lg" />

            <Label>Bakım Gideri (₺)</Label>
            <Input {...register("maintenance_expense")} className="input-lg" />

            <Label>Çuval İpi (kg)</Label>
            <Input {...register("sack_thread_kg")} className="input-lg" />

            <Label>Çuval İpi kg Fiyatı (₺)</Label>
            <Input {...register("sack_thread_price")} className="input-lg" />

            <Label>Dizel Yakıt (Litre)</Label>
            <Input {...register("diesel_liters")} className="input-lg" />

            <Label>Dizel Litre Fiyatı (₺)</Label>
            <Input {...register("diesel_price")} className="input-lg" />

            <Label>Benzin (Litre)</Label>
            <Input {...register("gasoline_liters")} className="input-lg" />

            <Label>Benzin Litre Fiyatı (₺)</Label>
            <Input {...register("gasoline_price")} className="input-lg" />

            <Label>Araç Bakım Gideri (₺)</Label>
            <Input {...register("vehicle_maintenance")} className="input-lg" />
          </CardContent>
        </Card>

        {/* Sağ Kısım: Otomatik Hesaplanan Değerler ve Satış Fiyatı */}
        <Card className="shadow-lg rounded-xl border p-4">
          <CardHeader>
            <CardTitle className="text-lg text-center font-extrabold">
              Otomatik Hesaplanan Değerler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="table-auto w-full">
              <tbody>
                <tr>
                  <td>Gerekli Buğday (kg)</td>
                  <td>{wheatRequired.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>Çıkan Kepek (kg)</td>
                  <td>{branKg.toFixed(3)}</td>
                </tr>
                <tr>
                  <td>Çıkan Bonkalit (kg)</td>
                  <td>{bonkalitKg.toFixed(3)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>

          <CardHeader>
            <CardTitle className="text-lg text-center font-extrabold">
              Satış Fiyatı
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center text-2xl font-bold bg-gray-50 rounded-lg">
            {finalPrice !== null ? `${finalPrice.toFixed(2)} ₺` : "Henüz hesaplanmadı"}
          </CardContent>
        </Card>
      </div>

      {/* Hesapla Butonunu, tüm formun en altında ortalanmış olarak yerleştiriyoruz */}
      <div className="mt-6 flex justify-center">
        <Button type="submit" className="w-64 bg-gray-800 text-white hover:bg-gray-900">
          Hesapla
        </Button>
      </div>
    </form>
  );
}
