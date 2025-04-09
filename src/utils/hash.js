import { sha256 } from 'js-sha256'

export const hashPassword = (password) => {
  return sha256(password.trim())
}
