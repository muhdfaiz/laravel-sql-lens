import type { ElectronApi } from "../../../preload/types/electron-api";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function useElectron(): Readonly<ElectronApi> {
  return (window as any).electron;
}
