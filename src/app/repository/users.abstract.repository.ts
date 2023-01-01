import { HttpException, HttpStatus } from "@nestjs/common";
import { DataSource, EntityManager, EntityTarget, ObjectLiteral, QueryRunner } from "typeorm";

interface CreateDto {
  email: string,
  name: string,
  password: string,
}

interface ProfileDto {
  id: number,
  email: string,
  name: string
}

export abstract class UsersAbstractRepository {
  protected readonly entity: any;
  protected readonly manager: EntityManager;
  protected readonly queryRunner: QueryRunner;
  protected readonly repository: any;

  public constructor(
    private entityClass: EntityTarget<ObjectLiteral>,
    protected dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(this.entityClass);
    this.entity = this.repository.target;
    this.manager = this.repository.manager;
    this.queryRunner = this.repository.queryRunner;
  }

  async profileByEmail(email: string): Promise<ProfileDto> {
    return await this.repository.findOneBy({ email });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.repository.countBy({ email }) > 0;
  }

  async passwordByEmail(email: string): Promise<string> {
    const { password } = await this.repository.findOneBy({ email });
    if (!password) {
      throw new Error("bad request");
    }
    return password;
  }

  async create({ email, name, password }: CreateDto): Promise<boolean> {
    try {
      const createdAt = new Date(), updatedAt = new Date();
      await this.manager.save(
        this.manager.create(this.entityClass, { email, name, password, createdAt, updatedAt }),
        { reload: false }
      );
    } catch (error) {
      throw new HttpException(
        `[${error.errno}:${error.code}] ${error.name} - ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
    return true;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.repository.update({ email }, this.manager.create(this.entityClass, { refreshToken }));
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.repository.update(userId, {
      refreshToken: null
    });
  }

  async deleteById(userId: number): Promise<void> {
    await this.repository.delete(userId);
  }
}