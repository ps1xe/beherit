import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnLoadedForSound1679986937985 implements MigrationInterface {
    name = 'addColumnLoadedForSound1679986937985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" ADD "loaded" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" DROP COLUMN "loaded"`);
    }

}
