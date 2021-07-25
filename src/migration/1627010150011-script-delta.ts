import * as cheerio from 'cheerio';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class scriptDelta1627010150011 implements MigrationInterface {
  name = 'scriptDelta1627010150011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const scripts = await queryRunner.query('select * from "script"');
    await queryRunner.query(
      `ALTER TABLE "script" RENAME COLUMN "innerHtml" TO "deltaOps"`
    );
    await queryRunner.query(`ALTER TABLE "script" DROP COLUMN "deltaOps"`);
    await queryRunner.query(
      `ALTER TABLE "script" ADD "deltaOps" json NOT NULL DEFAULT '[]'`
    );

    await Promise.all(
      scripts.map((script) => {
        const innerHtml = script.innerHtml;
        const $ = cheerio.load(innerHtml);
        const deltaOps = [{ insert: $.text() }];
        return queryRunner.query(
          'update "script" set "deltaOps" = $1::jsonb where "id" = $2',
          [JSON.stringify(deltaOps), script.id]
        );
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let scripts = await queryRunner.query('select * from "script"');
    scripts = scripts.map((script) => {
      script.innerHtml = script.deltaOps
        .map((delta) => delta.insert)
        .filter((v) => typeof v === 'string')
        .join('');
      return script;
    });

    await queryRunner.query(`ALTER TABLE "script" DROP COLUMN "deltaOps"`);
    await queryRunner.query(
      `ALTER TABLE "script" ADD "deltaOps" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE "script" RENAME COLUMN "deltaOps" TO "innerHtml"`
    );
    await Promise.all(
      scripts.map((script) => {
        return queryRunner.query(
          'update "script" set "innerHtml"=$1 where "id"=$2',
          [script.innerHtml, script.id]
        );
      })
    );
  }
}
