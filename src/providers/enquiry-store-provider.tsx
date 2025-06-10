import { createEnquiryStore, EnquiryStore } from "@/stores/enquiry-store";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

export type EnquiryStoreApi = ReturnType<typeof createEnquiryStore>;

export const EnquiryStoreContext = createContext<EnquiryStoreApi | undefined>(
  undefined
);

export interface EnquiryStoreProviderProps {
  children: ReactNode;
}

export const EnquiryStoreProvider = ({
  children,
}: EnquiryStoreProviderProps) => {
  const storeRef = useRef<EnquiryStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createEnquiryStore();
  }

  return (
    <EnquiryStoreContext.Provider value={storeRef.current}>
      {children}
    </EnquiryStoreContext.Provider>
  );
};

export const useEnquiryStore = <T,>(
  selector: (store: EnquiryStore) => T
): T => {
  const enquiryStoreContext = useContext(EnquiryStoreContext);

  if (!enquiryStoreContext) {
    throw new Error(`useEnquiryStore must be used within EnquiryStoreProvider`);
  }

  return useStore(enquiryStoreContext, selector);
};
