export interface ExportImageOptions {
  /** CSS selector for the element to capture */
  selector: string
  /** CSS selector for elements to remove from the clone before capture */
  excludeSelector?: string
  /** Foreground color for the captured image */
  foregroundColor?: string
  /** Background color for the captured image */
  backgroundColor?: string
  /** Scale factor for image quality (default: 2) */
  scale?: number
  /** Image quality for PNG (0-1, default: 0.95) */
  quality?: number
  /** Filename for fallback download (without extension) */
  filename?: string
  /** Whether to try clipboard first or go straight to download */
  preferClipboard?: boolean
}

/**
 * Converts SVG images to canvas elements to fix html2canvas SVG rendering issues
 * @param element The element containing SVG images
 */
async function convertSvgsToPng(element: HTMLElement): Promise<void> {
  const svgImages = element.querySelectorAll(
    'img[src$=".svg"]'
  ) as NodeListOf<HTMLImageElement>

  const conversionPromises = Array.from(svgImages).map(async (img) => {
    try {
      // Get computed styles to preserve sizing
      const computedStyle = window.getComputedStyle(img)
      const width = parseInt(computedStyle.width) || img.offsetWidth || 48
      const height = parseInt(computedStyle.height) || img.offsetHeight || 48

      // Fetch SVG content
      const response = await fetch(img.src)
      if (!response.ok) throw new Error("Failed to fetch SVG")

      const svgText = await response.text()
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Create a temporary canvas to convert SVG to PNG
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size with higher resolution for quality
      const scale = 2
      canvas.width = width * scale
      canvas.height = height * scale

      // Load and draw the SVG
      const svgImg = new Image()
      await new Promise<void>((resolve, reject) => {
        svgImg.onload = () => {
          ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height)
          resolve()
        }
        svgImg.onerror = () => reject(new Error("Failed to load SVG"))
        svgImg.src = svgUrl
      })

      // Create replacement image element
      const newImg = document.createElement("img")
      newImg.src = canvas.toDataURL("image/png")
      newImg.style.width = `${width}px`
      newImg.style.height = `${height}px`
      newImg.className = img.className
      newImg.alt = img.alt

      // Copy other relevant attributes
      Array.from(img.attributes).forEach((attr) => {
        if (!["src", "width", "height"].includes(attr.name)) {
          newImg.setAttribute(attr.name, attr.value)
        }
      })

      // Replace the SVG image with PNG version
      img.parentNode?.replaceChild(newImg, img)

      // Clean up
      URL.revokeObjectURL(svgUrl)
    } catch (error) {
      console.warn("Failed to convert SVG to PNG:", img.src, error)
      // If conversion fails, try setting explicit dimensions as fallback
      if (!img.width && !img.height) {
        img.style.width = "48px"
        img.style.height = "48px"
      }
    }
  })

  await Promise.allSettled(conversionPromises)
}

/**
 * Exports a DOM element as an image and copies to clipboard or downloads as file
 * @param options Configuration options for the export
 * @returns Promise that resolves when the export is complete
 */
export async function exportElementAsImage(
  options: ExportImageOptions
): Promise<void> {
  const {
    selector,
    excludeSelector,
    foregroundColor = "#ffffff",
    backgroundColor = "#1a1a1a",
    scale = 2,
    quality = 0.95,
    filename = "export",
    preferClipboard = true
  } = options

  // Find the target element
  const targetElement = document.querySelector(selector) as HTMLElement
  if (!targetElement) {
    throw new Error(`Element with selector "${selector}" not found`)
  }

  try {
    // Create a clone to modify without affecting original
    const clonedElement = targetElement.cloneNode(true) as HTMLElement

    // Remove excluded elements from the clone
    if (excludeSelector) {
      const excludedElements = clonedElement.querySelectorAll(excludeSelector)
      excludedElements.forEach((el) => el.remove())
    }

    // Convert SVGs to PNGs to fix rendering issues
    await convertSvgsToPng(clonedElement)

    // Create temporary container
    const tempContainer = document.createElement("div")
    tempContainer.style.position = "absolute"
    tempContainer.style.left = "-9999px"
    tempContainer.style.top = "-9999px"
    tempContainer.style.background = backgroundColor
    tempContainer.style.padding = "20px"
    tempContainer.style.color = foregroundColor
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    // Capture with html2canvas
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(clonedElement, {
      backgroundColor,
      scale,
      useCORS: true,
      allowTaint: true
    })

    // Convert canvas to blob and handle export
    await new Promise<void>((resolve) => {
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            if (preferClipboard) {
              try {
                // Try to copy to clipboard first
                await navigator.clipboard.write([
                  new ClipboardItem({ "image/png": blob })
                ])
                alert("Image copied to clipboard!")
              } catch (err) {
                console.error("Clipboard write failed:", err)
                // Fallback to download
                downloadBlob(blob, filename)
              }
              resolve()
            } else {
              // Direct download
              downloadBlob(blob, filename)
            }
          }
        },
        "image/png",
        quality
      )
    })

    // Clean up temporary container
    document.body.removeChild(tempContainer)
  } catch (error) {
    console.error("Error capturing element:", error)
    throw new Error("Failed to capture element as image")
  }
}

/**
 * Downloads a blob as a file
 * @param blob The blob to download
 * @param filename The filename without extension
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename.replace(/[^a-z0-9]/gi, "_")}.png`
  a.click()
  URL.revokeObjectURL(url)
}
