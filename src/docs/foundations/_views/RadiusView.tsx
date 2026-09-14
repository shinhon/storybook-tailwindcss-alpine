import { Unstyled } from "@storybook/addon-docs/blocks";

import { CopyButton } from "../_components/CopyButton";
import { formatTokenLabel } from "../_lib/token-format";

interface RadiusToken {
  tokenName: string;
  label: string;
  value: number;
  cssValue: string;
  cssVariable: string;
}

interface RadiusViewProps {
  tokens: RadiusToken[];
}

function RadiusCard({ token }: { token: RadiusToken }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h3 className="m-0 text-lg font-semibold tracking-tight text-black">
            {formatTokenLabel(token.label)}
          </h3>

          <code className="mt-1 block font-mono text-sm text-gray-500">{token.cssValue}</code>
        </div>

        <CopyButton value={token.cssVariable} />
      </div>

      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div
          className="flex h-36 items-center justify-center border-2 border-gray-300 bg-white text-center"
          style={{ borderRadius: `var(${token.cssVariable})` }}
        >
          <div>
            <div className="font-mono text-sm font-semibold text-black">{token.cssValue}</div>

            <div className="mt-1 text-xs text-gray-500">Corner radius</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function RadiusView({ tokens }: RadiusViewProps) {
  const sortedRadii = [...tokens].sort((a, b) => a.value - b.value);

  return (
    <div className="mt-10">
      <section id="radius-scale">
        <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">
          Radius Scale
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Compare each corner treatment using the generated runtime variable.
        </p>

        {sortedRadii.length > 0 && (
          <Unstyled>
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {sortedRadii.map((token) => (
                <RadiusCard key={token.tokenName} token={token} />
              ))}
            </div>
          </Unstyled>
        )}
      </section>
    </div>
  );
}
