export type SwitchArgs = {
  enabled: boolean;
  disabled: boolean;
};

export function renderSwitch(args: Partial<SwitchArgs> = {}) {
  const config = {
    enabled: args.enabled ?? false,
    disabled: args.disabled ?? false,
  };

  return `
    <div x-data='${JSON.stringify(config)}'>
      <button
        type="button"
        role="switch"
        :aria-checked="enabled"
        :disabled="disabled"
        @click="enabled = !enabled"
        :class="{
          'bg-blue-600': enabled,
          'bg-slate-200': !enabled,
          'cursor-not-allowed opacity-50': disabled
        }"
        class="relative h-6 w-11 rounded-full transition-colors cursor-pointer"
      >
        <span
          :class="enabled ? 'translate-x-5' : 'translate-x-0'"
          class="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform"
        ></span>
      </button>
    </div>
  `;
}
