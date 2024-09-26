export interface Feature {
  feature: string;
  available: boolean;
  institutions: number[];
  availableAt?: string;
  disabledAt?: string;
}
