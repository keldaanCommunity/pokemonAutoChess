import * as os from "os"
import * as pathlib from "path"

export function expandHomeDir(filePath: string): string {
  if (filePath.startsWith("~")) {
    return pathlib.join(os.homedir(), filePath.slice(1))
  }
  return filePath
}
