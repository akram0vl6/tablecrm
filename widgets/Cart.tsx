"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/types";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onUpdatePrice: (id: number, price: number) => void;
  onRemoveItem: (id: number) => void;
  totalSum: number;
}

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function Cart({
  items,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveItem,
  totalSum,
}: CartProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <ShoppingCart className="h-5 w-5" />
          <h3 className="text-base font-semibold">Корзина</h3>
        </div>
        <p className="text-sm text-gray-500">
          Количество, цена и сумма по позициям
        </p>

        {items.length === 0 ? (
          <div className="py-6 text-center rounded-lg border border-dashed border-gray-200">
            <ShoppingCart className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400 italic">
              Добавьте хотя бы один товар
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.nomenclature_id}
                className="flex items-start gap-2 border-b pb-2"
              >

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 break-words">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          onUpdateQuantity(item.nomenclature_id, -1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          onUpdateQuantity(item.nomenclature_id, 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>


                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          onUpdatePrice(
                            item.nomenclature_id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-7 w-24 sm:w-28 text-sm"
                        min="0"
                      />
                      <span className="text-xs text-gray-500">₽</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-semibold whitespace-nowrap tabular-nums">
                    {formatPrice(item.price * item.quantity)} ₽
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={() => onRemoveItem(item.nomenclature_id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}


            <div className="flex justify-between items-center font-bold text-base pt-2">
              <span>Итого:</span>
              <span className="whitespace-nowrap tabular-nums">
                {formatPrice(totalSum)} ₽
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}