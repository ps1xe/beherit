import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnNameForSound1678712632316 implements MigrationInterface {
    name = 'addColumnNameForSound1678712632316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" RENAME COLUMN " length" TO "length"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" RENAME COLUMN "length" TO " length"`);
    }

}
