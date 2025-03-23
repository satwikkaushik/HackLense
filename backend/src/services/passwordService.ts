import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt: string = bcrypt.genSaltSync(10);
    const hashedPass: string = await bcrypt.hash(password, 10);
    return Promise.resolve(hashedPass);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(password, hashedPassword);
    return Promise.resolve(match);
  } catch (err) {
    return Promise.reject(err);
  }
}
