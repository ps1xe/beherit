import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnLengthForSound1678639252399 implements MigrationInterface {
    name = 'addColumnLengthForSound1678639252399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" ADD " length" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sound" DROP COLUMN " length"`);
    }

}
