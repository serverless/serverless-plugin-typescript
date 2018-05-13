import * as fs from 'fs-extra'

export interface SymlinkException {
  code: string
  errno: number
}

const isMissingSymlinkPermission = (error: SymlinkException): boolean => {
  // Generally happens when no admin rights with UAC enabled on Windows.
  return error.code === 'EPERM' && error.errno === -4048
}

const copyIfMissingSymlinkPermission =
  (srcpath: string, dstpath: string, error: SymlinkException) => {
    if (isMissingSymlinkPermission(error)) {
      fs.copySync(srcpath, dstpath)
    } else {
      throw error
    }
  }

export const symlink = (srcpath: string, dstpath: string, type?: string) => {
  try {
    fs.symlinkSync(srcpath, dstpath, type)
  } catch (error) {
    copyIfMissingSymlinkPermission(srcpath, dstpath, error)
  }
}
