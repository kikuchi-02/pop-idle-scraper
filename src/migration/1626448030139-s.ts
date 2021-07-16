import {MigrationInterface, QueryRunner} from "typeorm";

export class s1626448030139 implements MigrationInterface {
    name = 's1626448030139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "scriptId" integer NOT NULL, "authorId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_51e47562765a942f0be89a68cf1" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_51e47562765a942f0be89a68cf1"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
