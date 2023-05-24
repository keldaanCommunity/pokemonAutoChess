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
) => ReturnType<T>

// fn will be executed if there has not been any previous call during a delay
export function throttle<T extends (...args: any) => any>(
  fn: T,
  delayInMs: number
): ThrottledFunction<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function (this: any): ReturnType<T> {
    const args = arguments
    const context = this

    if (!inThrottle) {
      inThrottle = true
      setTimeout(() => (inThrottle = false), delayInMs)
      lastResult = fn.apply(context, args)
    }

    return lastResult
  }
}
