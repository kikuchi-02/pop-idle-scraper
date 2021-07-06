import { MigrationInterface, QueryRunner } from 'typeorm';

export class Script1625573291979 implements MigrationInterface {
  name = 'Script1625573291979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "script" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "innerHtml" character varying NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "PK_90683f80965555e177a0e7346af" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "script" ADD CONSTRAINT "FK_2632c16179d3ec47688d979825b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "script" DROP CONSTRAINT "FK_2632c16179d3ec47688d979825b"`
    );
    await queryRunner.query(`DROP TABLE "script"`);
  }
}
