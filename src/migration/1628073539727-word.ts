import {MigrationInterface, QueryRunner} from "typeorm";

export class word1628073539727 implements MigrationInterface {
    name = 'word1628073539727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "word_information" ("id" SERIAL NOT NULL, "word" character varying NOT NULL, "pronunciation" character varying NOT NULL, CONSTRAINT "UQ_6564b259c091da73329947dbf23" UNIQUE ("word"), CONSTRAINT "PK_57cec8e6ac855753f247e835950" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "word_information"`);
    }

}
