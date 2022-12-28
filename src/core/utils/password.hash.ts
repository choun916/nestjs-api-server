import * as crypto from "crypto";

export class PasswordHash {
  static async encode(plainText: string, salt?: string): Promise<string> {
    salt = salt || crypto.randomBytes(32).toString("hex");
    const hashed = crypto.pbkdf2Sync(plainText, salt, 1, 32, "sha512").toString("hex");
    return hashed + "." + salt;
  }

  static async verify(plainText: string, hashedText: string): Promise<boolean> {
    const [, salt] = hashedText.split(".");
    return (await this.encode(plainText, salt)) === hashedText;
  }
}
