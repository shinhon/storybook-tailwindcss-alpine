import { readFileSync } from "node:fs";

import { transformGroups } from "style-dictionary/enums";

const portableHtmlTemplate = readFileSync(
  new URL("./src/docs/templates/portable-html.template.html", import.meta.url),
  "utf8",
);

const portableThemeMarker = "/* __TAILWIND_THEME__ */";

const isColor = (token) => (token.$type ?? token.type) === "color";

function isTypography(token) {
  const [category, kind] = token.path;

  return (
    category === "font" && ["family", "size", "leading"].includes(kind)
  );
}

function isRadius(token) {
  return token.path[0] === "radius";
}

const isThemeToken = (token) =>
  isColor(token) || isTypography(token) || isRadius(token);

const figmaAliasKey = "com.figma.aliasData";

function getPrimitiveVariable(token) {
  const targetVariableName =
    token.original?.$extensions?.[figmaAliasKey]?.targetVariableName;

  if (!targetVariableName) {
    return null;
  }

  const cssVariableName = targetVariableName
    .split("/")
    .map((part) =>
      part
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase(),
    )
    .join("-");

  return `var(--${cssVariableName})`;
}

function getColorTokenCategory(token) {
  if (getPrimitiveVariable(token)) {
    return "semantic";
  }

  if (token.path.length > 2) {
    return "primitive";
  }

  return "standalone";
}

function getTailwindVariableName(token) {
  if (isColor(token)) {
    return `--${token.name}`;
  }

  if (isRadius(token)) {
    return `--radius-${token.path.slice(1).join("-")}`;
  }

  const [category, kind, ...name] = token.path;

  if (category !== "font") {
    return null;
  }

  const namespaceByKind = {
    family: "font",
    size: "text",
    leading: "leading",
  };
  const namespace = namespaceByKind[kind];

  return namespace ? `--${namespace}-${name.join("-")}` : null;
}

function toRem(value) {
  return `${Number((value / 16).toFixed(6))}rem`;
}

function getTypographyCssValue(token) {
  const [, kind] = token.path;
  const value = token.$value;

  if (kind === "family") {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {
    return toRem(value);
  }

  return String(value);
}

function getRadiusCssValue(token) {
  return `${token.$value}px`;
}

function replaceIndentedMarker(template, marker, content) {
  const markerLine = template
    .split(/\r?\n/)
    .find((line) => line.trim() === marker);

  if (!markerLine) {
    throw new Error(`Portable HTML template is missing ${marker}`);
  }

  const indentation = markerLine.slice(0, markerLine.indexOf(marker));
  const indentedContent = content
    .split("\n")
    .map((line) => (line ? `${indentation}${line}` : line))
    .join("\n");

  return template.replace(markerLine, indentedContent);
}

function formatTailwindTheme({ dictionary }) {
  const categoryOrder = ["primitive", "standalone", "semantic"];
  const tokensByCategory = {
    primitive: [],
    standalone: [],
    semantic: [],
  };
  const typographyKindOrder = ["family", "size", "leading"];
  const typographyByKind = {
    family: [],
    size: [],
    leading: [],
  };
  const radiusTokens = [];

  dictionary.allTokens.forEach((token) => {
    if (isColor(token)) {
      tokensByCategory[getColorTokenCategory(token)].push(token);
      return;
    }

    if (isTypography(token)) {
      typographyByKind[token.path[1]].push(token);
      return;
    }

    if (isRadius(token)) {
      radiusTokens.push(token);
    }
  });

  const variables = categoryOrder
    .map((category) => {
      const tokens = tokensByCategory[category] ?? [];
      const heading = category.charAt(0).toUpperCase() + category.slice(1);
      const declarations = tokens
        .map((token) => {
          const value = getPrimitiveVariable(token) ?? token.$value;

          return `  ${getTailwindVariableName(token)}: ${value};`;
        })
        .join("\n");

      return `  /* ${heading} */\n${declarations}`;
    })
    .join("\n\n");

  const typographyHeadings = {
    family: "Font Family",
    size: "Font Size",
    leading: "Line Height",
  };
  const typographyVariables = typographyKindOrder
    .map((kind) => {
      const declarations = typographyByKind[kind]
        .map(
          (token) =>
            `  ${getTailwindVariableName(token)}: ${getTypographyCssValue(token)};`,
        )
        .join("\n");

      return `  /* ${typographyHeadings[kind]} */\n${declarations}`;
    })
    .join("\n\n");
  const radiusVariables = radiusTokens
    .map(
      (token) =>
        `  ${getTailwindVariableName(token)}: ${getRadiusCssValue(token)};`,
    )
    .join("\n");

  return `@theme static {
  /* --color-*: initial; */

${variables}

${typographyVariables}

  /* Radius */
${radiusVariables}
}`;
}

function formatDocsColors({ dictionary }) {
  const colors = dictionary.allTokens.map((token) => ({
    tokenName: token.name,
    path: token.path,
    value: token.$value,
    primitiveVariable: getPrimitiveVariable(token),
  }));

  return `${JSON.stringify(colors, null, 2)}\n`;
}

function formatDocsTypography({ dictionary }) {
  const typography = dictionary.allTokens.map((token) => {
    const cssVariable = getTailwindVariableName(token);

    return {
      tokenName: cssVariable.slice(2),
      path: token.path,
      category: token.path[1],
      label: token.path[2],
      value: token.original?.$value ?? token.$value,
      cssValue: getTypographyCssValue(token),
      cssVariable,
    };
  });

  return `${JSON.stringify(typography, null, 2)}\n`;
}

function formatDocsRadius({ dictionary }) {
  const radii = dictionary.allTokens.map((token) => {
    const cssVariable = getTailwindVariableName(token);

    return {
      tokenName: cssVariable.slice(2),
      path: token.path,
      label: token.path[1],
      value: token.original?.$value ?? token.$value,
      cssValue: getRadiusCssValue(token),
      cssVariable,
    };
  });

  return `${JSON.stringify(radii, null, 2)}\n`;
}

export default {
  source: ["src/tokens/source/**/*.json"],

  parsers: ["figma/json"],

  usesDtcg: true,

  hooks: {
    parsers: {
      "figma/json": {
        pattern: /\.json$/,

        parser: ({ contents }) => {
          const tokens = JSON.parse(contents);

          // Each Figma export has file-level mode metadata at the root. It is
          // not a design token and otherwise collides when sources are merged.
          delete tokens.$extensions;

          return tokens;
        },
      },
    },

    formats: {
      "tailwind/theme": ({ dictionary }) => {
        const theme = formatTailwindTheme({ dictionary });

        return `/*
 * GENERATED BY STYLE DICTIONARY.
 * DO NOT EDIT MANUALLY.
 */

${theme}
`;
      },

      "docs/portable-html": ({ dictionary }) => {
        const theme = formatTailwindTheme({ dictionary });

        return replaceIndentedMarker(
          portableHtmlTemplate,
          portableThemeMarker,
          theme,
        );
      },

      "docs/colors": formatDocsColors,
      "docs/typography": formatDocsTypography,
      "docs/radius": formatDocsRadius,
    },
  },

  platforms: {
    tailwind: {
      transformGroup: transformGroups.css,

      buildPath: "src/styles/generated/",

      files: [
        {
          destination: "theme.css",

          format: "tailwind/theme",

          filter: isThemeToken,

          options: {
            outputReferences: true,
          },
        },
      ],
    },

    docs: {
      transformGroup: transformGroups.css,

      buildPath: "src/tokens/generated/",

      files: [
        {
          destination: "colors.json",

          format: "docs/colors",

          filter: isColor,
        },
        {
          destination: "typography.json",

          format: "docs/typography",

          filter: isTypography,
        },
        {
          destination: "radius.json",

          format: "docs/radius",

          filter: isRadius,
        },
      ],
    },

    portable: {
      transformGroup: transformGroups.css,

      buildPath: "src/docs/generated/",

      files: [
        {
          destination: "portable-html.html",

          format: "docs/portable-html",

          filter: isThemeToken,

          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};
