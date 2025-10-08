interface ErrorConstructor {
  captureStackTrace: (error: Error, constructorOption: unknown) => void
}
