import { Unstyled } from "@storybook/addon-docs/blocks";
import { useState } from "react";

import { CopyButton } from "../_components/CopyButton";
import { formatTokenLabel } from "../_lib/token-format";

interface TypographyToken {
  tokenName: string;
  category: string;
  label: string;
  value: string | number;
  cssValue: string;
  cssVariable: string;
}

interface TypographyViewProps {
  tokens: TypographyToken[];
}

function formatOriginalValue(value: TypographyToken["value"]) {
  return typeof value === "number" ? `${value}px` : value;
}

function Metadata({
  token,
  variableOnNewLineAtXl = false,
}: {
  token: TypographyToken;
  variableOnNewLineAtXl?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
      <div className="min-w-0">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
          Original
        </div>

        <code className="block truncate font-mono text-sm text-gray-700">
          {formatOriginalValue(token.value)}
        </code>
      </div>

      <div className="min-w-0">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">CSS</div>

        <code className="block truncate font-mono text-sm text-gray-700">{token.cssValue}</code>
      </div>

      <div
        className={
          variableOnNewLineAtXl
            ? "col-span-2 min-w-0 sm:col-span-1 xl:col-span-3"
            : "col-span-2 min-w-0 sm:col-span-1"
        }
      >
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-gray-400">
          Variable
        </div>

        <CopyButton value={token.cssVariable} />
      </div>
    </div>
  );
}

function SelectionCard({ label, token }: { label: string; token: TypographyToken }) {
  return (
    <div className="col-span-1 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="m-0 mb-4 text-base font-semibold tracking-tight text-black">{label}</h3>

      <Metadata token={token} variableOnNewLineAtXl />
    </div>
  );
}

function TypographyPlayground({
  families,
  sizes,
  leading,
}: {
  families: TypographyToken[];
  sizes: TypographyToken[];
  leading: TypographyToken[];
}) {
  const [familyTokenName, setFamilyTokenName] = useState(families[0]?.tokenName ?? "");
  const [sizeTokenName, setSizeTokenName] = useState(sizes[0]?.tokenName ?? "");
  const [leadingTokenName, setLeadingTokenName] = useState(leading[0]?.tokenName ?? "");
  const family =
    families.find((token) => token.tokenName === familyTokenName) ?? families[0];
  const size = sizes.find((token) => token.tokenName === sizeTokenName) ?? sizes[0];
  const lineHeight =
    leading.find((token) => token.tokenName === leadingTokenName) ?? leading[0];

  if (!family || !size || !lineHeight) {
    return null;
  }

  return (
    <section id="playground">
      <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">
        Typography Playground
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Combine generated tokens to explore how type choices work together.
      </p>

      <Unstyled>
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="grid gap-4 p-4 md:grid-cols-3 md:p-6">
            <label className="block min-w-0">
              <span className="text-sm font-medium text-gray-700">Font Family</span>

              <select
                className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                value={familyTokenName}
                onChange={(event) => setFamilyTokenName(event.target.value)}
              >
                {families.map((token) => (
                  <option key={token.tokenName} value={token.tokenName}>
                    {formatTokenLabel(token.label)} — {formatOriginalValue(token.value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0">
              <span className="text-sm font-medium text-gray-700">Font Size</span>

              <select
                className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                value={sizeTokenName}
                onChange={(event) => setSizeTokenName(event.target.value)}
              >
                {sizes.map((token) => (
                  <option key={token.tokenName} value={token.tokenName}>
                    {formatTokenLabel(token.label)} — {formatOriginalValue(token.value)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block min-w-0">
              <span className="text-sm font-medium text-gray-700">Line Height</span>

              <select
                className="mt-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                value={leadingTokenName}
                onChange={(event) => setLeadingTokenName(event.target.value)}
              >
                {leading.map((token) => (
                  <option key={token.tokenName} value={token.tokenName}>
                    {formatTokenLabel(token.label)} - {formatOriginalValue(token.value)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="border-y border-gray-200 bg-gray-50 p-6 md:p-8">
            <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Live Preview
            </div>

            <p
              className="m-0 wrap-break-word text-black"
              style={{
                fontFamily: `var(${family.cssVariable})`,
                fontSize: `var(${size.cssVariable})`,
                lineHeight: `var(${lineHeight.cssVariable})`,
              }}
            >
              Typography creates hierarchy and rhythm.
              <br />
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div className="p-4 md:p-6">
            <h3 className="m-0 text-lg font-semibold tracking-tight text-black">Current Selection</h3>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <SelectionCard label="Font Family" token={family} />
              <SelectionCard label="Font Size" token={size} />
              <SelectionCard label="Line Height" token={lineHeight} />
            </div>
          </div>
        </div>
      </Unstyled>
    </section>
  );
}

function FontFamilyCard({ token }: { token: TypographyToken }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h3 className="m-0 text-lg font-semibold tracking-tight text-black">
            {formatTokenLabel(token.label)}
          </h3>

          <p className="mt-1 truncate text-sm text-gray-500">{token.value}</p>
        </div>

        <CopyButton value={token.cssVariable} />
      </div>

      <div
        className="border-t border-gray-200 bg-gray-50 p-6"
        style={{ fontFamily: `var(${token.cssVariable})` }}
      >
        <div className="text-5xl leading-none text-black">Aa</div>

        <p className="mt-6 wrap-break-word text-xl leading-8 text-gray-800">
          The quick brown fox jumps over the lazy dog.
        </p>

        <p className="mt-2 wrap-break-word text-sm leading-6 text-gray-600">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789
        </p>
      </div>
    </article>
  );
}

function FontSizeRow({ token }: { token: TypographyToken }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <h3 className="m-0 mb-4 text-base font-semibold tracking-tight text-black">{token.label}</h3>

        <Metadata token={token} />
      </div>

      <div className="min-w-0 p-4 sm:p-6">
        <p
          className="m-0 wrap-break-word tracking-tight text-black"
          style={{ fontSize: `var(${token.cssVariable})`, lineHeight: 1.15 }}
        >
          Typography 0123456789
        </p>
      </div>
    </article>
  );
}

export function TypographyView({ tokens }: TypographyViewProps) {
  const families = tokens.filter((token) => token.category === "family");
  const sizes = tokens
    .filter((token) => token.category === "size")
    .sort((a, b) => Number(a.value) - Number(b.value));
  const leading = tokens
    .filter((token) => token.category === "leading")
    .sort((a, b) => {
      const aValue = typeof a.value === "number" ? a.value : Infinity;
      const bValue = typeof b.value === "number" ? b.value : Infinity;

      return aValue - bValue || a.label.localeCompare(b.label);
    });

  return (
    <div className="mt-10">
      <TypographyPlayground families={families} sizes={sizes} leading={leading} />

      {families.length > 0 && (
        <section id="font-family" className="mt-16">
          <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">
            Font Family
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Font stacks used to give products a consistent voice across languages and contexts.
          </p>

          <Unstyled>
            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {families.map((token) => (
                <FontFamilyCard key={token.tokenName} token={token} />
              ))}
            </div>
          </Unstyled>
        </section>
      )}

      {sizes.length > 0 && (
        <section id="font-size" className="mt-16">
          <h2 className="m-0 scroll-mt-6 text-xl font-semibold tracking-tight text-black">
            Font Size
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            A progressive scale for establishing clear hierarchy across interface content.
          </p>

          <Unstyled>
            <div className="mt-8 grid gap-4">
              {sizes.map((token) => (
                <FontSizeRow key={token.tokenName} token={token} />
              ))}
            </div>
          </Unstyled>
        </section>
      )}
    </div>
  );
}
