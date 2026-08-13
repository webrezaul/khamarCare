// KhamarCare — Toast notification store
import { create } from 'zustand';

const useToastStore = create((set) => ({
  toast: null,
  show: (message, type = 'success', duration = 3000) => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), duration);
  },
  hide: () => set({ toast: null }),
}));

export default useToastStore;
