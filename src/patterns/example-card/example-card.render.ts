import { renderSelect } from "../../components/select/select.render";
import { renderSwitch } from "../../components/switch/switch.render";

export function renderExampleCard() {
  return `
    <section class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-gray-900">Project Setting</h2>
      <p class="mt-2 text-sm text-gray-600">
        Setup project category and notification settings.
      </p>

      <div class="mt-6 space-y-6">
        ${renderSelect({ size: "sm" })}
        ${renderSwitch()}
      </div>
    </section>
  `;
}
