declare module 'expo-router' {
  export function useRouter(): {
    push: (path: string) => void;
    replace: (path: string) => void;
    back: () => void;
    [key: string]: any;
  };

  export function useSegments(): string[];

  export const Slot: any;
  export const Tabs: any;
}
