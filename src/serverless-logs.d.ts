declare module '@serverless/utils/log' {
    export const log: ((message: string) => void) & {
        verbose(message: string): void
        warning(message: string): void
    }
}
