import { MigrationInterface, QueryRunner } from 'typeorm';

export class scriptRevision1630712592223 implements MigrationInterface {
  name = 'scriptRevision1630712592223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "script_revision" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "created" TIMESTAMP, "deltaOps" json NOT NULL DEFAULT '[]', "scriptId" integer NOT NULL, CONSTRAINT "PK_f545fc711d1bc04434796ac63c6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "script" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."script_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "script_revision" ADD CONSTRAINT "FK_84e7d5f84745090e8dd509d1726" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    const scripts = await queryRunner.query('select * from "script"');
    await Promise.all(
      scripts.map((script) => {
        return queryRunner.query(
          'insert into "script_revision" ("scriptId", "title", "created", "deltaOps") values ($1, $2, $3, $4::jsonb)',
          [
            script.id,
            script.title,
            script.created,
            JSON.stringify(script.deltaOps),
          ]
        );
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "script_revision" DROP CONSTRAINT "FK_84e7d5f84745090e8dd509d1726"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."script_status_enum" AS ENUM('done', 'waitForReview', 'reviewed', 'wip')`
    );
    await queryRunner.query(
      `ALTER TABLE "script" ADD "status" "script_status_enum" NOT NULL DEFAULT 'wip'`
    );
    await queryRunner.query(`DROP TABLE "script_revision"`);
  }
}
