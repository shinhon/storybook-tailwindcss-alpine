import "./styles/global.css";

import { initAlpine } from "./alpine";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="min-h-screen bg-slate-50 p-8">
    <h1 class="text-3xl font-semibold">
      Design System
    </h1>

    <p class="mt-2 text-slate-600">
      Run Storybook to browse documentation and components.
    </p>
  </main>
`;

initAlpine();
