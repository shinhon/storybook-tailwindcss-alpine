export function renderAlpine<TArgs extends Record<string, unknown>>(
  html: string,
  args: TArgs,
) {
  const template = document.createElement("template");

  template.innerHTML = html.trim();

  const root = template.content.firstElementChild;

  if (!(root instanceof HTMLElement)) {
    throw new Error("Alpine component root element not found");
  }

  if (!root.hasAttribute("x-data")) {
    throw new Error("Alpine component root must have x-data");
  }

  root.setAttribute("x-data", JSON.stringify(args));

  return root;
}
