import { act, renderHook } from "@testing-library/react";
import useFlowControls from "../useFlowControls";

describe("useFlowControls hook", () => {
  test("renders default controls", () => {
    const { result } = renderHook(() => useFlowControls());

    expect(result.current.panOnDrag).toBe(true);
    expect(result.current.panOnScroll).toBe(false);
    expect(result.current.selectionOnDrag).toBe(false);
    expect(result.current.selectionMode).toBe("full");
  });

  test("setDefaultControls method returns the correct settings", () => {
    const { result } = renderHook(() => useFlowControls());

    act(() => {
      result.current.setFigmaLikeControls();
    });

    act(() => {
      result.current.setDefaultControls();
    });

    expect(result.current.panOnDrag).toBe(true);
    expect(result.current.panOnScroll).toBe(false);
    expect(result.current.selectionOnDrag).toBe(false);
    expect(result.current.selectionMode).toBe("full");
  });

  test("setFigmaLikeControls method returns the correct settings", () => {
    const { result } = renderHook(() => useFlowControls());

    act(() => {
      result.current.setDefaultControls();
    });

    act(() => {
      result.current.setFigmaLikeControls();
    });

    expect(result.current.panOnDrag).toEqual([1, 2]);
    expect(result.current.panOnScroll).toBe(true);
    expect(result.current.selectionOnDrag).toBe(true);
    expect(result.current.selectionMode).toBe("partial");
  });
});
