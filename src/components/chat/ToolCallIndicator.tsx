"use client";

import { Loader2 } from "lucide-react";

interface ToolCallIndicatorProps {
  toolInvocation: {
    toolName: string;
    state: string;
    args: Record<string, unknown>;
    result?: unknown;
  };
}

export function getFileName(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = typeof args.path === "string" ? args.path : "";
  const command = typeof args.command === "string" ? args.command : "";
  const filename = path ? getFileName(path) : "";

  if (toolName === "str_replace_editor") {
    if (command === "create") return `Creating ${filename}`;
    if (command === "str_replace") return `Editing ${filename}`;
    if (command === "insert") return `Editing ${filename}`;
    if (command === "view") return `Viewing ${filename}`;
  }

  if (toolName === "file_manager") {
    if (command === "rename") return `Renaming ${filename}`;
    if (command === "delete") return `Deleting ${filename}`;
  }

  return toolName;
}

export function ToolCallIndicator({ toolInvocation }: ToolCallIndicatorProps) {
  const { toolName, state, args } = toolInvocation;
  const label = getLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
