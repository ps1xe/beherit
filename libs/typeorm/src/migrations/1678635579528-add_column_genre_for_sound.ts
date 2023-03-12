import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnGenreForSound1678635579528 implements MigrationInterface {
    name = 'addColumnGenreForSound1678635579528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sound" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "genre" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_042a7f5e448107b2fd0eb4dfe8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sound" ADD CONSTRAINT "FK_0d7f8a5e28fbdae85b1f554d99a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" DROP CONSTRAINT "FK_0d7f8a5e28fbdae85b1f554d99a"`);
        await queryRunner.query(`DROP TABLE "sound"`);
    }

}
