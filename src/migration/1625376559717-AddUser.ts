import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUser1625376559717 implements MigrationInterface {
    name = 'AddUser1625376559717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "idle_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "start" date, "end" date, CONSTRAINT "PK_ab05e59b43ed5f8449e4fb240d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idle_group_activity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "joinDate" date, "leaveDate" date, CONSTRAINT "PK_dcf2a161bb5262abb91cc031ed0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "created" date NOT NULL, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "idle_bloodtype_enum" AS ENUM('A', 'B', 'O', 'AB')`);
        await queryRunner.query(`CREATE TABLE "idle" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthday" date, "tall" integer, "bloodType" "idle_bloodtype_enum", "originPrefecture" character varying, "otherNames" character varying array, CONSTRAINT "PK_6e413be37a26ada7ec6a31b6bb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "magazine_note" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "magazineId" integer, CONSTRAINT "PK_3a5f3937ef73e7bff2ac90bbc17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "magazine" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "publish_date" integer NOT NULL, "publish_month" integer NOT NULL, "publish_week" integer NOT NULL, CONSTRAINT "PK_cc5e06a8dfb114bc452138aef3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "twitter_account" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "profileName" character varying NOT NULL, CONSTRAINT "PK_c6df4b1fb4dad7c9e601216b5e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tweet" ("id" SERIAL NOT NULL, "body" text NOT NULL, "date" date NOT NULL, "accountId" integer, CONSTRAINT "PK_6dbf0db81305f2c096871a585f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idle_group_activity_idle_groups_idle_group" ("idleGroupActivityId" integer NOT NULL, "idleGroupId" integer NOT NULL, CONSTRAINT "PK_5be1f5a340811ccc0816880d936" PRIMARY KEY ("idleGroupActivityId", "idleGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0b59c3762c7b51c1fcdbecc156" ON "idle_group_activity_idle_groups_idle_group" ("idleGroupActivityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_23c36d3b4e3f8567306ecb76c8" ON "idle_group_activity_idle_groups_idle_group" ("idleGroupId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "idle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "magazine_note" ADD CONSTRAINT "FK_a66daa3067916c408db3b810cc7" FOREIGN KEY ("magazineId") REFERENCES "magazine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tweet" ADD CONSTRAINT "FK_1051e7f8295d2623d8eb7a45da3" FOREIGN KEY ("accountId") REFERENCES "twitter_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "idle_group_activity_idle_groups_idle_group" ADD CONSTRAINT "FK_0b59c3762c7b51c1fcdbecc156f" FOREIGN KEY ("idleGroupActivityId") REFERENCES "idle_group_activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "idle_group_activity_idle_groups_idle_group" ADD CONSTRAINT "FK_23c36d3b4e3f8567306ecb76c86" FOREIGN KEY ("idleGroupId") REFERENCES "idle_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "idle_group_activity_idle_groups_idle_group" DROP CONSTRAINT "FK_23c36d3b4e3f8567306ecb76c86"`);
        await queryRunner.query(`ALTER TABLE "idle_group_activity_idle_groups_idle_group" DROP CONSTRAINT "FK_0b59c3762c7b51c1fcdbecc156f"`);
        await queryRunner.query(`ALTER TABLE "tweet" DROP CONSTRAINT "FK_1051e7f8295d2623d8eb7a45da3"`);
        await queryRunner.query(`ALTER TABLE "magazine_note" DROP CONSTRAINT "FK_a66daa3067916c408db3b810cc7"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP INDEX "IDX_23c36d3b4e3f8567306ecb76c8"`);
        await queryRunner.query(`DROP INDEX "IDX_0b59c3762c7b51c1fcdbecc156"`);
        await queryRunner.query(`DROP TABLE "idle_group_activity_idle_groups_idle_group"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tweet"`);
        await queryRunner.query(`DROP TABLE "twitter_account"`);
        await queryRunner.query(`DROP TABLE "magazine"`);
        await queryRunner.query(`DROP TABLE "magazine_note"`);
        await queryRunner.query(`DROP TABLE "idle"`);
        await queryRunner.query(`DROP TYPE "idle_bloodtype_enum"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "idle_group_activity"`);
        await queryRunner.query(`DROP TABLE "idle_group"`);
    }

}
