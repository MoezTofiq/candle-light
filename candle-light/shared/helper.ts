type LogFunction = (...args: any[]) => void

const isProduction = process.env.NODE_ENV === "production"

export const log: LogFunction = (...args) => {
  if (!isProduction) {
    console.log(...args)
  }
}
