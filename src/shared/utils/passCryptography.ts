import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class PassCryptography {
  public async bcryptVerify(password: string, passwordDB: string) {
    const verify = await compare(password, passwordDB);

    return verify;
  }

  public async bcryptEncrypt(password: string) {
    const salt = await genSalt(10);

    const hashed = await hash(password, salt);

    return hashed;
  }
}
