import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto'

const algorithm = 'aes-256-cbc'

export function encrypt(text: string, secretKey: string): string {
  const key = scryptSync(secretKey, 'salt', 32)

  const iv = randomBytes(16)
  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(text: string, secretKey: string): string {
  const key = scryptSync(secretKey, 'salt', 32)

  const [ivHex, encryptedHex] = text.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(algorithm, key, iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}
