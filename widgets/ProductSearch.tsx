"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Plus } from "lucide-react";

interface ProductSearchProps {
  isConnected: boolean;
  searchProduct: string;
  onSearch: (query: string) => void;
  isSearching: boolean;
  foundProducts: any[];
  productSearchOpen: boolean;
  onToggleSearch: (open: boolean) => void;
  onAddToCart: (product: any) => void;
}

export function ProductSearch({
  isConnected,
  searchProduct,
  onSearch,
  isSearching,
  foundProducts,
  productSearchOpen,
  onToggleSearch,
  onAddToCart,
}: ProductSearchProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <Package className="h-5 w-5" />
          <h3 className="text-base font-semibold">4. Товары</h3>
        </div>
        <p className="text-sm text-gray-500">
          Поиск и добавление номенклатуры
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск товара по названию"
            className="pl-10"
            value={searchProduct}
            onChange={(e) => onSearch(e.target.value)}
            disabled={!isConnected}
            onFocus={() => {
              if (foundProducts.length > 0) onToggleSearch(true);
            }}
            onBlur={() => setTimeout(() => onToggleSearch(false), 200)}
          />
        </div>

        {isSearching && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {!isSearching && searchProduct && foundProducts.length === 0 && (
          <div className="py-4 text-center rounded-lg border border-dashed border-gray-200">
            <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400 italic">Товары не найдены</p>
          </div>
        )}

        {productSearchOpen && foundProducts.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
            {foundProducts.map((product: any) => (
              <div
                key={product.id}
                className="flex justify-between items-center px-3 py-2.5 hover:bg-indigo-50 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.price ? `${product.price} ₽` : "Цена не указана"}
                  </p>
                </div>
                <Plus className="h-4 w-4 text-indigo-600 ml-2 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}