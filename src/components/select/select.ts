import Alpine from "alpinejs";

type SelectSize = "sm" | "md" | "lg";

type SelectArgs = {
  size?: SelectSize;
  error?: boolean;
  disabled?: boolean;
};

type SelectOption = {
  value: string;
  label: string;
};

const options: SelectOption[] = [
  { value: "design", label: "Design" },
  { value: "frontend", label: "Frontend" },
  { value: "research", label: "UX Research" },
  { value: "other", label: "Other" },
];

export function registerSelect() {
  Alpine.data("select", (args: SelectArgs = {}) => ({
    size: args.size ?? "md",
    error: args.error ?? false,
    disabled: args.disabled ?? false,
    open: false,
    selected: null as SelectOption | null,
    selectedValue: "",
    activeIndex: 0,
    options,

    activeOptionId() {
      return `category-select-option-${this.activeIndex}`;
    },

    closeMenu(returnFocus = false) {
      if (!this.open) {
        return;
      }

      this.open = false;

      if (returnFocus) {
        this.$nextTick(() => this.$refs.trigger.focus());
      }
    },

    select(option: SelectOption) {
      if (this.disabled) {
        return;
      }

      this.selected = option;
      this.selectedValue = option.value;
      this.activeIndex = this.options.indexOf(option);
      this.open = false;
      this.$nextTick(() => this.$refs.trigger.focus());
    },

    openMenu() {
      if (this.disabled) {
        return;
      }

      this.open = true;

      if (this.selected) {
        this.activeIndex = this.options.findIndex(
          (option) => option.value === this.selected?.value,
        );
      }

      this.$nextTick(() => this.$refs.listbox.focus());
    },

    move(direction: number) {
      if (!this.open || this.options.length === 0) {
        return;
      }

      this.activeIndex =
        (this.activeIndex + direction + this.options.length) %
        this.options.length;
    },

    selectActive() {
      const option = this.options[this.activeIndex];

      if (option) {
        this.select(option);
      }
    },
  }));
}
