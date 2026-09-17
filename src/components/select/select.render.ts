export type SelectArgs = {
  size: "sm" | "md" | "lg";
  error: boolean;
  disabled: boolean;
};

export function renderSelect(args: Partial<SelectArgs> = {}) {
  const config = {
    size: args.size ?? "md",
    error: args.error ?? false,
    disabled: args.disabled ?? false,
  };

  return `
    <div
      x-data='select(${JSON.stringify(config)})'
      class="w-full min-w-80"
      @click.outside="closeMenu()"
      @keydown.escape.window="closeMenu(true)"
    >
      <span
        id="category-select-label"
        class="mb-2 block text-sm font-medium text-gray-700"
      >
        Category
      </span>

      <div class="relative">
        <input
          type="hidden"
          name="category"
          :value="selectedValue"
          :disabled="disabled"
        >

        <button
          id="category-select-trigger"
          x-ref="trigger"
          type="button"
          class="flex w-full items-center justify-between gap-4 rounded-lg border text-left outline-none transition"
          :class="{
            'min-h-10 px-3 py-2 text-sm': size === 'sm',
            'min-h-11 px-4 py-2.5 text-sm': size === 'md',
            'min-h-12 px-4 py-3 text-base': size === 'lg',
            'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100': !error && !disabled,
            'border-red-500 bg-white focus:border-red-600 focus:ring-3 focus:ring-red-100': error && !disabled,
            'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400': disabled && !error,
            'cursor-not-allowed border-red-300 bg-gray-100 text-gray-400': disabled && error,
          }"
          :disabled="disabled"
          :aria-expanded="open"
          :aria-describedby="error ? 'category-select-error' : null"
          aria-haspopup="listbox"
          aria-controls="category-select-listbox"
          aria-labelledby="category-select-label category-select-value"
          @click="open ? closeMenu() : openMenu()"
          @keydown.arrow-down.prevent="open ? move(1) : openMenu()"
          @keydown.arrow-up.prevent="open ? move(-1) : openMenu()"
        >
          <span
            id="category-select-value"
            x-text="selected?.label ?? 'Please select a category'"
            class="truncate"
            :class="{
              'text-gray-400': disabled,
              'text-gray-900': selected && !disabled,
              'text-gray-500': !selected && !disabled,
            }"
          ></span>

          <svg
            class="size-4 shrink-0 text-gray-500 transition-transform duration-200"
            :class="{
              'rotate-180': open,
              'text-gray-400': disabled,
            }"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5.5 7.5L10 12L14.5 7.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div
          x-cloak
          x-show="open"
          x-transition:enter="transition ease-out duration-100"
          x-transition:enter-start="opacity-0 translate-y-1"
          x-transition:enter-end="opacity-100 translate-y-0"
          x-transition:leave="transition ease-in duration-75"
          x-transition:leave-start="opacity-100 translate-y-0"
          x-transition:leave-end="opacity-0 translate-y-1"
          class="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg shadow-gray-950/8"
        >
          <div
            id="category-select-listbox"
            x-ref="listbox"
            role="listbox"
            tabindex="-1"
            class="outline-none"
            aria-labelledby="category-select-label"
            :aria-activedescendant="open ? activeOptionId() : null"
            @keydown.arrow-down.prevent="move(1)"
            @keydown.arrow-up.prevent="move(-1)"
            @keydown.enter.prevent="selectActive()"
            @keydown.space.prevent="selectActive()"
            @keydown.tab="closeMenu()"
          >
            <template x-for="(option, index) in options" :key="option.value">
              <div
                :id="\`category-select-option-\${index}\`"
                role="option"
                class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md text-left outline-none transition"
                :class="{
                  'px-3 py-2 text-sm': size === 'sm',
                  'px-3 py-2.5 text-sm': size === 'md',
                  'px-4 py-3 text-base': size === 'lg',
                  'bg-blue-50 text-gray-900': activeIndex === index,
                  'text-gray-700 hover:bg-gray-50': activeIndex !== index,
                }"
                :aria-selected="selected?.value === option.value"
                @mouseenter="activeIndex = index"
                @click="select(option)"
              >
                <span x-text="option.label"></span>

                <svg
                  x-show="selected?.value === option.value"
                  class="size-4 shrink-0 text-emerald-600"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4.5 10.5L8 14L15.5 6.5"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </template>
          </div>
        </div>
      </div>

      <p
        id="category-select-error"
        x-cloak
        x-show="error"
        class="mt-2 text-sm text-red-600"
      >
        Please select a category.
      </p>
    </div>
  `;
}
