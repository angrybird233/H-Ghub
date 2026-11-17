import { getCurrentWindow } from "@tauri-apps/api/window";

const MAP: [string, string][] = [
  ["n", "North"], ["s", "South"], ["e", "East"], ["w", "West"],
  ["ne", "NorthEast"], ["nw", "NorthWest"], ["se", "SouthEast"], ["sw", "SouthWest"],
];

/** 无边框窗口的边缘拖拽缩放（Windows）。 */
export default function ResizeHandles() {
  // 纯浏览器前端开发（pnpm dev）没有 Tauri 注入对象，getCurrentWindow()
  // 会同步抛错并中断整棵 React 树（表现为白屏）。此时没有原生窗口需要缩放，
  // 直接不渲染这些手柄即可。
  let win: ReturnType<typeof getCurrentWindow>;
  try {
    win = getCurrentWindow();
  } catch {
    return null;
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-[70]">
      {MAP.map(([edge, dir]) => (
        <div key={edge}
          className={`win-resize win-resize-${edge} pointer-events-auto`}
          onPointerDown={(e) => {
            e.preventDefault();
            // ResizeDirection 在类型包里未导出，按字符串传入
            (win.startResizeDragging as unknown as (d: string) => Promise<void>)(dir).catch(() => {});
          }}
        />
      ))}
    </div>
  );
}