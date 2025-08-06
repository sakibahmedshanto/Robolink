export interface BaseWidget {
  id: string;
  type: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  width: number; // Absolute pixels
  height: number; // Absolute pixels
}
