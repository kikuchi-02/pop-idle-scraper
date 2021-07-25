import { MigrationInterface, QueryRunner } from 'typeorm';

export class message1627173247357 implements MigrationInterface {
  name = 'message1627173247357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "uuid" uuid`);
    await queryRunner.query(`ALTER TABLE "message" ADD "parentId" integer`);
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "created" SET DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_b1c0c3e14d1a8be95531f29eb70" FOREIGN KEY ("parentId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_b1c0c3e14d1a8be95531f29eb70"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "created" DROP DEFAULT`
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "parentId"`);
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "uuid"`);
  }
}
