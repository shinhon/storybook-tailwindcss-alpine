import { Unstyled } from "@storybook/addon-docs/blocks";

import { CopyButton } from "../_components/CopyButton";
import { formatTokenLabel } from "../_lib/token-format";

interface ColorToken {
  tokenName: string;
  path: string[];
  value: string;
  primitiveVariable: string | null;
}

interface ColorsViewProps {
  tokens: ColorToken[];
}

function formatGroupName(groupPath: string) {
  return groupPath
    .split("/")
    .filter(Boolean)
    .map(formatTokenLabel)
    .join(" / ");
}

function ColorCard({
  tokenName,
  value,
  primitiveVariable,
  className = "w-full min-w-0",
}: ColorToken & { className?: string }) {
  const cssVariable = `--${tokenName}`;

  return (
    <article className={`${className} overflow-hidden rounded-xl border border-gray-200 bg-white`}>
      <div className="h-32" style={{ backgroundColor: `var(${cssVariable})` }} />

      <div className="p-4">
        <div className="font-mono text-sm font-semibold tracking-tight text-black">{cssVariable}</div>

        <div className="mt-4 divide-y divide-gray-100">
          <CopyButton variant="row" label="HEX" value={value} />

          {primitiveVariable && (
            <CopyButton variant="row" label="Primitive" value={primitiveVariable} />
          )}
        </div>
      </div>
    </article>
  );
}

function PrimitiveGroup({ family, tokens }: { family: string; tokens: ColorToken[] }) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-baseline gap-3">
        <h3>{formatGroupName(family)}</h3>

        <span className="text-gray-400">{tokens.length} colors</span>
      </div>

      <Unstyled>
        <div className="flex gap-x-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
          {tokens.map((token) => (
            <ColorCard key={token.tokenName} {...token} className="w-60 shrink-0" />
          ))}
        </div>
      </Unstyled>
    </section>
  );
}

function SemanticGroup({ groupPath, tokens }: { groupPath: string; tokens: ColorToken[] }) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-baseline gap-3">
        <h3>{groupPath ? formatGroupName(groupPath) : "General"}</h3>

        <span className="text-gray-400">
          {tokens.length} {tokens.length === 1 ? "color" : "colors"}
        </span>
      </div>

      <Unstyled>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <ColorCard key={token.tokenName} {...token} />
          ))}
        </div>
      </Unstyled>
    </section>
  );
}

function getSemanticGroupRank(groupPath: string) {
  const depth = groupPath ? groupPath.split("/").length : 0;

  if (depth === 1) return 0;
  if (depth > 1) return 1;

  return 2;
}

export function ColorsView({ tokens }: ColorsViewProps) {
  const primitiveGroups = new Map<string, ColorToken[]>();
  const semanticGroups = new Map<string, ColorToken[]>();
  const standalone: ColorToken[] = [];

  tokens.forEach((token) => {
    const { path, primitiveVariable } = token;

    if (primitiveVariable) {
      const semanticPath = path.slice(1);
      const groupPath = semanticPath.slice(0, -1);
      const groupKey = groupPath.join("/");
      const groupTokens = semanticGroups.get(groupKey) ?? [];

      groupTokens.push(token);
      semanticGroups.set(groupKey, groupTokens);
      return;
    }

    if (path.length > 2) {
      const familyPath = path.slice(1, -1);
      const familyKey = familyPath.join("/");
      const groupTokens = primitiveGroups.get(familyKey) ?? [];

      groupTokens.push(token);
      primitiveGroups.set(familyKey, groupTokens);
      return;
    }

    standalone.push(token);
  });

  const colorGroups = [...primitiveGroups.entries()].map(([family, groupTokens]) => ({
    family,
    tokens: [...groupTokens].sort((a, b) => {
      const aLeaf = a.path.at(-1) ?? "";
      const bLeaf = b.path.at(-1) ?? "";

      return Number(aLeaf) - Number(bLeaf) || aLeaf.localeCompare(bLeaf);
    }),
  }));
  const orderedSemanticGroups = [...semanticGroups.entries()].sort(
    ([a], [b]) => getSemanticGroupRank(a) - getSemanticGroupRank(b),
  );

  return (
    <div className="mt-10">
      <section id="primitive">
        <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">Primitive</h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Hierarchical color values used as the foundation for semantic tokens.
        </p>

        <div className="mt-8">
          {colorGroups.map(({ family, tokens: groupTokens }) => (
            <PrimitiveGroup key={family} family={family} tokens={groupTokens} />
          ))}
        </div>
      </section>

      {standalone.length > 0 && (
        <section id="standalone" className="mt-16">
          <div className="mb-4">
            <div className="flex items-baseline gap-3">
              <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">
                Standalone
              </h2>

              <span className="text-xs text-gray-400">{standalone.length} colors</span>
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Colors without hierarchy or a primitive token reference.
            </p>
          </div>

          <Unstyled>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {standalone.map((token) => (
                <ColorCard key={token.tokenName} {...token} />
              ))}
            </div>
          </Unstyled>
        </section>
      )}

      {orderedSemanticGroups.length > 0 && (
        <section id="semantic" className="mt-16">
          <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">Semantic</h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Purpose-based colors that reference primitive tokens.
          </p>

          <div className="mt-8">
            {orderedSemanticGroups.map(([groupPath, groupTokens]) => (
              <SemanticGroup
                key={groupPath || "general"}
                groupPath={groupPath}
                tokens={groupTokens}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
