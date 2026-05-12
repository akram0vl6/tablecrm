"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useTableCRM } from "@/hooks/useTableCRM";
import { TokenAuth } from "@/widgets/TokenAuth";
import { ClientSearch } from "@/widgets/ClientSearch";
import { SaleParams } from "@/widgets/SaleParams";
import { ProductSearch } from "@/widgets/ProductSearch";
import { Cart } from "@/widgets/Cart";
import { CommentSection } from "@/widgets/CommentSection";
import { SaleActions } from "@/widgets/SaleActions";

export default function Home() {
  const crm = useTableCRM();

  return (
    <div className="flex items-start justify-center p-4 bg-gray-50 min-h-screen">
      <main className="w-full max-w-md space-y-5">
        <Card className="border-0 shadow-lg shadow-indigo-100 overflow-hidden">
          <CardHeader className="text-center pb-4 relative">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <ShoppingCart className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            tablecrm.com
            </CardTitle>
            <p className="text-lg font-bold text-gray-800">Мобильный заказ</p>
            <p className="text-sm text-gray-500">Создание продажи и проведение в один клик</p>
            <Badge
              variant={crm.isConnected ? "default" : "destructive"}
              className={`mt-3 ${crm.isConnected ? "bg-green-100 text-green-700" : ""}`}
            >
              {crm.isConnected ? "● Касса подключена" : "○ Касса не подключена"}
            </Badge>
          </CardHeader>
        </Card>

        <TokenAuth
          token={crm.token} setToken={crm.setToken}
          isConnected={crm.isConnected} onConnect={crm.handleConnect}
          loadingDictionaries={crm.loadingDictionaries} dictionariesError={crm.dictionariesError}
        />

        <ClientSearch
          phone={crm.phone} setPhone={crm.setPhone}
          isConnected={crm.isConnected} onSearch={crm.handleSearchClient}
          isSearching={crm.isSearchingClient} client={crm.client} clientError={crm.clientError}
          onClearClient={() => crm.setClient(null)}
        />

        <SaleParams
          isConnected={crm.isConnected}
          organizations={crm.organizations} payboxes={crm.payboxes}
          warehouses={crm.warehouses} priceTypes={crm.priceTypes}
          selectedOrg={crm.selectedOrg} setSelectedOrg={crm.setSelectedOrg}
          selectedPaybox={crm.selectedPaybox} setSelectedPaybox={crm.setSelectedPaybox}
          selectedWarehouse={crm.selectedWarehouse} setSelectedWarehouse={crm.setSelectedWarehouse}
          selectedPriceType={crm.selectedPriceType} setSelectedPriceType={crm.setSelectedPriceType}
        />

        <ProductSearch
          isConnected={crm.isConnected}
          searchProduct={crm.searchProduct} onSearch={crm.handleSearchProducts}
          isSearching={crm.isSearchingProducts} foundProducts={crm.foundProducts}
          productSearchOpen={crm.productSearchOpen} onToggleSearch={crm.setProductSearchOpen}
          onAddToCart={crm.addToCart}
        />

        <Cart
          items={crm.cartItems}
          onUpdateQuantity={crm.updateCartItemQuantity}
          onUpdatePrice={crm.updateCartItemPrice}
          onRemoveItem={crm.removeCartItem}
          totalSum={crm.totalSum}
        />

        <CommentSection
          comment={crm.comment} setComment={crm.setComment} isConnected={crm.isConnected}
        />

        <SaleActions
          isConnected={crm.isConnected} cartEmpty={crm.cartItems.length === 0}
          isCreating={crm.isCreatingSale}
          onCreateSale={() => crm.handleCreateSale(false)}
          onCreateAndConduct={() => crm.handleCreateSale(true)}
        />

        {crm.saleError && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg -mt-3">{crm.saleError}</div>}
        {crm.saleSuccess && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg -mt-3">{crm.saleSuccess}</div>}
      </main>
    </div>
  );
}