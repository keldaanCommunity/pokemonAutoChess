type DebouncedFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => void

// fn will be executed if there has been no more calls since delay
export function debounce<T extends (...args: any) => any>(
  fn: T,
  delayInMs = 300
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delayInMs)
  }
}

type ThrottledFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<ReturnType<T>>

// fn will be executed if there has not been any previous call during a delay or if a previous call is not still executing
export function throttle<T extends (...args: any) => any>(
  fn: T,
  delayInMs: number
): ThrottledFunction<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return async function (this: any, ...args: any[]): Promise<ReturnType<T>> {
    const context = this

    if (!inThrottle) {
      inThrottle = true
      // the function could be async and could take longer than the delay to execute
      const mightBePromise: ReturnType<T> = fn.apply(context, args)
      setTimeout(async function () {
        await mightBePromise
        inThrottle = false
      }, delayInMs)
      lastResult = await mightBePromise
    }

    return lastResult
  }
}

// prevent concurrent execution of async fn
export function block<T extends (...args: any) => Promise<any>>(fn: T) {
  let existingPromise: Promise<any> | null = null
  return async function (this: any, ...args: any[]) {
    if (existingPromise) {
      return existingPromise
    }
    existingPromise = fn.apply(this, args)
    const result = await existingPromise
    existingPromise = null
    return result
  }
}

// repeat fn several times
export const repeat = (n: number) => (cb: (i: number) => void) => {
  for (let i = 0; i < n; i++) {
    cb(i)
  }
}
