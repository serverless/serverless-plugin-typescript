import * as path from 'path'
import * as fs from 'fs-p'

export class DeployBuilder {
  build(buildFolder: string) {
    const buildPath = path.resolve(buildFolder)

    if (this.isNodeModulesAbsent(buildPath)) {
      this.createNodeModulesFolder(buildPath)
    }
  }

  private isNodeModulesAbsent(buildPath: string): boolean {
    return !fs.existsSync(path.join(buildPath, 'node_modules'))
  }

  private createNodeModulesFolder(buildPath: string) {
    try {
      fs.symlinkSync(path.resolve('node_modules'), path.join(buildPath, 'node_modules'))
    } catch (error) {
      this.copyIfMissingSymlinkPermission(buildPath, error)
    }
  }

  private copyIfMissingSymlinkPermission(buildPath: string, error: SymlinkException) {
    if (this.isMissingSymlinkPermission(error)) {
      fs.copySync(path.resolve('node_modules'), path.join(buildPath, 'node_modules'))
    } else {
      throw error
    }
  }

  private isMissingSymlinkPermission(error: SymlinkException): boolean {
    // Generally happens when no admin rights with UAC enabled on Windows.
    return error.code === 'EPERM' && error.errno === -4048
  }
}

export interface SymlinkException {
  code: string
  errno: number
}
