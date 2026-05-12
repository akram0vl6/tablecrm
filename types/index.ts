export interface CartItem {
    nomenclature_id: number;
    name: string;
    price: number;
    quantity: number;
  }
  
  export interface Organization {
    id: number;
    short_name?: string;
    full_name?: string;
    work_name?: string;
    name?: string;
  }
  
  export interface Paybox {
    id: number;
    name: string;
    paybox_number?: string;
  }
  
  export interface Warehouse {
    id: number;
    name: string;
  }
  
  export interface PriceType {
    id: number;
    name: string;
  }
  
  export interface Client {
    id: number;
    name?: string;
    phone?: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    price?: number;
  }