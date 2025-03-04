import { create } from 'zustand';

type LayoutState = {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
};

type InventoryState = {
  items: any[];
  setItems: (items: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

type OrdersState = {
  orders: any[];
  setOrders: (orders: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

type ProductionState = {
  plans: any[];
  setPlans: (plans: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

type StoreState = LayoutState & InventoryState & OrdersState & ProductionState;

export const useStore = create<StoreState>((set) => ({
  // Layout state
  sidebarOpen: false,
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Inventory state
  items: [],
  setItems: (items) => set({ items }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // Orders state
  orders: [],
  setOrders: (orders) => set({ orders }),
  
  // Production state
  plans: [],
  setPlans: (plans) => set({ plans }),
}));
