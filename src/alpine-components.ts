import { registerSelect } from "./components/select/select";

/**
 * Central registration boundary for Alpine.data providers.
 *
 * Complex components should be imported and registered here so every runtime
 * registers providers before Alpine starts.
 */
export function registerAlpineComponents() {
  registerSelect();
}
