import type { WebGLRenderer } from "three";
import type { Renderer } from "three/webgpu";
import type { ResourceItem } from "../types";

export interface IResolver {
  name: string;
  check: (loaded: unknown) => boolean;
  resolve: (resource: ResourceItem, loaded: unknown, renderer: Renderer | WebGLRenderer) => void;
}
