import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallIndicator } from "../ToolCallIndicator";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create shows 'Creating App.jsx' with spinner (in-progress)", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/components/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("str_replace_editor create shows 'Creating App.jsx' with green dot (done)", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/components/App.jsx" },
        result: "ok",
      }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  const greenDot = document.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeNull();
});

test("str_replace_editor str_replace shows 'Editing Card.jsx'", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "str_replace", path: "/components/Card.jsx" },
      }}
    />
  );
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("str_replace_editor insert shows 'Editing utils.js'", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "insert", path: "/lib/utils.js" },
      }}
    />
  );
  expect(screen.getByText("Editing utils.js")).toBeDefined();
});

test("str_replace_editor view shows 'Viewing index.tsx'", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "view", path: "/pages/index.tsx" },
      }}
    />
  );
  expect(screen.getByText("Viewing index.tsx")).toBeDefined();
});

test("file_manager rename shows 'Renaming old.jsx'", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "file_manager",
        state: "call",
        args: { command: "rename", path: "/components/old.jsx" },
      }}
    />
  );
  expect(screen.getByText("Renaming old.jsx")).toBeDefined();
});

test("file_manager delete shows 'Deleting helpers.ts'", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "file_manager",
        state: "call",
        args: { command: "delete", path: "/lib/helpers.ts" },
      }}
    />
  );
  expect(screen.getByText("Deleting helpers.ts")).toBeDefined();
});

test("unknown tool falls back to raw tool name", () => {
  render(
    <ToolCallIndicator
      toolInvocation={{
        toolName: "some_unknown_tool",
        state: "call",
        args: { command: "something", path: "/foo/bar.ts" },
      }}
    />
  );
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
