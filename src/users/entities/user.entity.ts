import { hash } from "bcrypt";
import { Transform } from "class-transformer";
import { PasswordHash } from "src/utils/password.hash";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
@Unique(["email"])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Transform((param) => param.value?.trim())
  @Column({ type: "varchar", length: 100, comment: "이메일" })
  email: string;

  @Transform((param) => param.value?.trim())
  @Column({ type: "varchar", length: 100, comment: "이름" })
  name: string;

  @Transform((param) => param.value?.trim())
  @Column({ type: "varchar", length: 255, comment: "비밀번호" })
  password: string;

  // @Exclude()
  @Transform((param) => param.value?.trim())
  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "인증 재발급 토근",
  })
  refreshToken?: string;

  @CreateDateColumn({ comment: "생성일" })
  createdAt: Date;

  @UpdateDateColumn({ comment: "수정일" })
  updatedAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    if (this.password) {
      this.password = await PasswordHash.encode(this.password);
    }
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (this.password) {
      this.password = await PasswordHash.encode(this.password);
    }
    if (this.refreshToken) {
      this.refreshToken = await hash(this.refreshToken?.trim(), 10);
    }
  }
}
