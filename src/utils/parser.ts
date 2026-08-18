export interface Node {
  id: string;
  children?: Node[];
}

export enum FormatType {
  AsParsed = 0,
  Alphabetical = 1,
}

function tokenize(str: string): string[] {
  const tokens: string[] = [];
  let level = 0;
  let part = "";

  for (const char of str) {
    if (char === "(") {
      level++;
    } else if (char === ")") {
      if (level === 0) {
        throw new Error("Mismatched parentheses in input");
      }
      level--;
    }

    if (char === "," && level === 0) {
      const trimmed = part.trim();
      tokens.push(trimmed);
      part = "";
    } else {
      part += char;
    }
  }

  if (level !== 0) {
    throw new Error("Mismatched parentheses in input");
  }

  if (part.trim()) {
    tokens.push(part.trim());
  }

  return tokens;
}

function parseField(field: string): Node {
  field = field.trim();

  const openIndex = field.indexOf("(");

  if (openIndex === -1) {
    return {
      id: field,
    };
  }

  const id = field.slice(0, openIndex).trim();

  const inner = field.slice(openIndex + 1, field.lastIndexOf(")"));

  return {
    id,
    children: parseInput(inner),
  };
}

function parseInput(input: string): Node[] {
  const trimmed = input.trim();

  const nodes: Node[] = [];

  const tokens = tokenize(trimmed);

  for (const token of tokens) {
    nodes.push(parseField(token));
  }

  return nodes;
}

function toOutput(nodes: Node[], indent = ""): string {
  const lines: string[] = [];

  for (const node of nodes) {
    if(!node.id){
      continue;
    }
    lines.push(`${indent}- ${node.id}`);
    if (node.children) {
      lines.push(toOutput(node.children, indent + "  "));
    }
  }

  return lines.join("\n");
}

function sortAlphabetically(nodes: Node[]): Node[] {
  nodes = nodes.sort((a, b) => a.id.localeCompare(b.id));

  return nodes.map((node) => {
    if (!node.children) {
      return node;
    }

    return {
      ...node,
      children: sortAlphabetically(node.children),
    };
  });
}

export function formatInput(input: string, format: FormatType): string {
  const trimmed = input.trim();
  if (!trimmed.startsWith("(") || !trimmed.endsWith(")")) {
    throw new Error("Input must start and end with parentheses");
  }

  const inner = trimmed.slice(1, -1);

  const parsed = parseInput(inner);
  if (format === FormatType.Alphabetical) {
    return toOutput(sortAlphabetically(parsed));
  }

  return toOutput(parsed);
}
