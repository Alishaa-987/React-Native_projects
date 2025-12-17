// Temporary shim to avoid many JSX intrinsic element typing errors while types are aligned.
// Remove this after fixing @types/react / @types/react-native versions.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
