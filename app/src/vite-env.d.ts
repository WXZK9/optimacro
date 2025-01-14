/// <reference types="vite/client" />
declare global {
    interface Window {
      electron: {
        saveJsonToFile: (data: any) => Promise<string | null>;
      };
    }
  }
  
  export {}; 