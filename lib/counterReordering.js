import { GRID_LAYOUT_MODE } from "./layoutMode.js";

export const LIST_ITEM_HEIGHT = 106;
export const LIST_ITEM_GAP = 12;
export const GRID_ITEM_HEIGHT = 168;
export const GRID_ROW_GAP = 12;
export const GRID_COLUMN_GAP = 12;
export const GRID_COLUMNS = 2;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a new array with one item moved to another index.
 * @param {Array<any>} items
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {Array<any>}
 */
export function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return [...items];
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

/**
 * Computes the available cell width for grid mode.
 * @param {number} containerWidth
 * @returns {number}
 */
export function getGridItemWidth(containerWidth) {
  if (!containerWidth || containerWidth <= 0) {
    return 0;
  }

  return (containerWidth - GRID_COLUMN_GAP) / GRID_COLUMNS;
}

function getIndexPosition(index, layoutMode, containerWidth) {
  if (layoutMode === GRID_LAYOUT_MODE) {
    const cellWidth = getGridItemWidth(containerWidth);
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);

    return {
      x: column * (cellWidth + GRID_COLUMN_GAP),
      y: row * (GRID_ITEM_HEIGHT + GRID_ROW_GAP),
    };
  }

  return {
    x: 0,
    y: index * (LIST_ITEM_HEIGHT + LIST_ITEM_GAP),
  };
}

/**
 * Computes a compensation offset so the dragged item remains under the finger
 * while the rest of the list animates toward the preview order.
 * @param {{
 *   fromIndex: number,
 *   toIndex: number,
 *   layoutMode: "list" | "grid",
 *   containerWidth?: number,
 * }} params
 * @returns {{x: number, y: number}}
 */
export function getDragCompensation({
  fromIndex,
  toIndex,
  layoutMode,
  containerWidth = 0,
}) {
  const startPosition = getIndexPosition(fromIndex, layoutMode, containerWidth);
  const previewPosition = getIndexPosition(toIndex, layoutMode, containerWidth);

  return {
    x: startPosition.x - previewPosition.x,
    y: startPosition.y - previewPosition.y,
  };
}

/**
 * Resolves the target index after a drag interaction.
 * @param {{
 *   fromIndex: number,
 *   itemCount: number,
 *   layoutMode: "list" | "grid",
 *   translationX?: number,
 *   translationY?: number,
 *   containerWidth?: number,
 * }} params
 * @returns {number}
 */
export function getDropIndex({
  fromIndex,
  itemCount,
  layoutMode,
  translationX = 0,
  translationY = 0,
  containerWidth = 0,
}) {
  if (itemCount <= 1) {
    return 0;
  }

  if (layoutMode === GRID_LAYOUT_MODE) {
    const cellWidth = getGridItemWidth(containerWidth);
    if (cellWidth <= 0) {
      return fromIndex;
    }

    const startColumn = fromIndex % GRID_COLUMNS;
    const startRow = Math.floor(fromIndex / GRID_COLUMNS);
    const targetColumn = clamp(
      startColumn + Math.round(translationX / (cellWidth + GRID_COLUMN_GAP)),
      0,
      GRID_COLUMNS - 1,
    );
    const targetRow = clamp(
      startRow + Math.round(translationY / (GRID_ITEM_HEIGHT + GRID_ROW_GAP)),
      0,
      Math.ceil(itemCount / GRID_COLUMNS) - 1,
    );

    return clamp((targetRow * GRID_COLUMNS) + targetColumn, 0, itemCount - 1);
  }

  return clamp(
    fromIndex + Math.round(translationY / (LIST_ITEM_HEIGHT + LIST_ITEM_GAP)),
    0,
    itemCount - 1,
  );
}
