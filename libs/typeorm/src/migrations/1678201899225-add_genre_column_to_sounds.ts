import { MigrationInterface, QueryRunner } from "typeorm";

export class addGenreColumnToSounds1678201899225 implements MigrationInterface {
    name = 'addGenreColumnToSounds1678201899225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" ADD "genre" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" DROP COLUMN "genre"`);
    }

}
