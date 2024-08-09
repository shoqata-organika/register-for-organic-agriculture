import {
  Connection,
  MigrationInterface,
  QueryRunner,
  getConnection,
} from 'typeorm';

export class Init1706960602058 implements MigrationInterface {
  name = 'Init1706960602058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "code_categories" ("id" SERIAL NOT NULL, "api_name" character varying NOT NULL, "name" character varying(500) NOT NULL, "name_sq" character varying(500), "name_sr" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe4516bccfaabe9cd0a4065bb4c" UNIQUE ("api_name"), CONSTRAINT "PK_acb0a6bd0e7dbd1c9692b770a32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "codes" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "name_sq" character varying(500), "name_sr" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "codeCategoryId" integer, CONSTRAINT "PK_9b85c624e2d705f4e8a9b64dbf4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "zones" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "total_area" numeric, "address" character varying(500), "num_of_harvesters" integer, "latitude" numeric(7,5), "longitude" numeric(7,5), "member_id" integer NOT NULL, CONSTRAINT "UQ_9a45d4c8bd7d59ab584ead64eaf" UNIQUE ("code", "member_id"), CONSTRAINT "PK_880484a43ca311707b05895bd4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."harvesters_legal_status_enum" AS ENUM('physical', 'legal')`,
    );
    await queryRunner.query(
      `CREATE TABLE "harvesters" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "address" character varying, "external_id" character varying, "code" character varying NOT NULL, "family_members" integer, "legal_status" "public"."harvesters_legal_status_enum" NOT NULL DEFAULT 'legal', "zone_id" integer, "image" bytea, "member_id" integer NOT NULL, CONSTRAINT "UQ_16946422d62045ab7b6bb726024" UNIQUE ("code", "member_id"), CONSTRAINT "PK_46555934eae5e4d1520922f0b21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracted_farmers" ("id" SERIAL NOT NULL, "name" text NOT NULL, "personal_num" integer, "address" character varying, "external_id" character varying, "member_id" integer NOT NULL, "code" text NOT NULL, "land_parcels" jsonb NOT NULL, "image" bytea, CONSTRAINT "UQ_a05362d3f8dc50a969567bb6228" UNIQUE ("code"), CONSTRAINT "PK_a9598eafd92cba6a7a8da635739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."processing_units_ownership_status_enum" AS ENUM('owned', 'rented')`,
    );
    await queryRunner.query(
      `CREATE TABLE "processing_units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "member_id" integer NOT NULL, "address" character varying NOT NULL, "ownership_status" "public"."processing_units_ownership_status_enum" NOT NULL DEFAULT 'owned', "type_of_processing" character varying NOT NULL, "total_area" numeric NOT NULL, "latitude" numeric(7,5), "longitude" numeric(7,5), CONSTRAINT "PK_b863910b1eefe9fa8222f23f525" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."member_resources_resource_type_enum" AS ENUM('producer', 'supplier', 'customer', 'ploughing_machine', 'fertilization_machine', 'seed_planting_machine', 'grazing_machine', 'storage_unit', 'fertilization_product', 'crop_protection_product', 'harvesting_machine', 'person')`,
    );
    await queryRunner.query(
      `CREATE TABLE "member_resources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "member_id" integer NOT NULL, "resource_type" "public"."member_resources_resource_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eaedc6d5906cea7a21fc0e33e24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_locations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b9591ced2c9d787495d19639575" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admissions_type_enum" AS ENUM('harvesting', 'collection', 'purchase')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admissions" ("id" SERIAL NOT NULL, "admission_no" character varying NOT NULL, "date" date NOT NULL, "notes" character varying, "type" "public"."admissions_type_enum" NOT NULL DEFAULT 'collection', "harvester_id" integer, "contracted_farmer_id" integer, "zone_id" integer, "land_parcel_id" integer, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6d47682a899dfa0a78ce11fe98a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admission_entries_crop_state_enum" AS ENUM('dry', 'fresh')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admission_entries_crop_status_enum" AS ENUM('organic', 'conventional', 'k1', 'k2', 'k3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admission_entries" ("id" SERIAL NOT NULL, "crop_id" integer NOT NULL, "part_of_crop_id" integer NOT NULL, "crop_state" "public"."admission_entries_crop_state_enum" NOT NULL DEFAULT 'dry', "crop_status" "public"."admission_entries_crop_status_enum" NOT NULL DEFAULT 'organic', "gross_quantity" numeric(5,2), "net_quantity" numeric(5,2), "admission_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_59eaa6e301a9a8701390f849e61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."processing_activities_crop_state_enum" AS ENUM('dry', 'fresh')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."processing_activities_crop_status_enum" AS ENUM('organic', 'conventional', 'k1', 'k2', 'k3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "processing_activities" ("id" SERIAL NOT NULL, "admission_entry_id" integer NOT NULL, "date" date NOT NULL, "crop_id" integer NOT NULL, "part_of_crop_id" integer NOT NULL, "processing_method_id" integer NOT NULL, "processing_type_id" integer NOT NULL, "processing_unit_id" integer NOT NULL, "crop_state" "public"."processing_activities_crop_state_enum" NOT NULL DEFAULT 'dry', "crop_status" "public"."processing_activities_crop_status_enum" NOT NULL DEFAULT 'organic', "gross_quantity" numeric(5,2), "net_quantity" numeric(5,2), "firo" numeric(5,2), "notes" character varying, "lot_code" character varying NOT NULL, "fraction" character varying, "member_id" integer NOT NULL, "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_98cba87bf36a4d3fa9130b2a74e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_operations" ("id" SERIAL NOT NULL, "inventory_item_id" integer NOT NULL, "quantity" numeric(5,2), "notes" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e3d09da79ea4750103c31b36500" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_items_type_enum" AS ENUM('harvested_product', 'collected_product', 'purchased_product', 'processed_product', 'input', 'planting_material')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_items_package_type_enum" AS ENUM('bag', 'bottle', 'box', 'can', 'carton', 'crate', 'drum', 'jar', 'jug', 'pail', 'sack', 'tank', 'tote', 'tube', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_items" ("id" SERIAL NOT NULL, "date" date NOT NULL, "purchase_date" date, "expiry_date" date, "member_id" integer NOT NULL, "crop_id" integer, "part_of_crop_id" integer, "inventory_location_id" integer, "type" "public"."inventory_items_type_enum" NOT NULL, "package_type" "public"."inventory_items_package_type_enum", "quantity" numeric(5,2), "person_id" uuid, "producer_id" uuid, "supplier_id" uuid, "admission_entry_id" integer, "processing_activity_id" integer, "name" character varying, "description" character varying, "sku" character varying, "notes" character varying, "cost" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."members_legal_status_enum" AS ENUM('physical_person', 'legal_person')`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "business_name" character varying, "website_url" character varying, "owner" jsonb, "latitude" numeric(7,5), "longitude" numeric(7,5), "business_no" character varying, "farmer_no" character varying, "legal_status" "public"."members_legal_status_enum", "email" character varying, "phone_number" character varying, "activities" jsonb, "code" character varying, CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "land_parcel_crops" ("id" SERIAL NOT NULL, "area" integer NOT NULL, "land_parcel_id" integer NOT NULL, "crop_id" integer NOT NULL, "from_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2023-12-31T23:00:00.000Z"', "to_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '"2024-12-30T23:00:00.000Z"', CONSTRAINT "PK_9a043be286e9ffa608e23a31af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."land_parcels_ownership_status_enum" AS ENUM('owned', 'rented')`,
    );
    await queryRunner.query(
      `CREATE TABLE "land_parcels" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "member_id" integer NOT NULL, "cadastral_no" character varying, "total_area" numeric NOT NULL, "organic_transition_date" date, "applied_standards" text, "utilised_area" numeric NOT NULL, "ownership_status" "public"."land_parcels_ownership_status_enum" NOT NULL DEFAULT 'owned', "contract_start_date" date, "contract_end_date" date, "latitude" numeric(7,5), "longitude" numeric(7,5), CONSTRAINT "code_member_index" UNIQUE ("code", "member_id"), CONSTRAINT "PK_41b6078ef33c8474f53c0fa64d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."farm_activities_activity_type_enum" AS ENUM('soil_analysis', 'land_ploughing', 'milling', 'bed_preparation', 'fertilization', 'seed_planting', 'crop_protection', 'grazing_management', 'irrigation', 'harvesting')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."farm_activities_unit_enum" AS ENUM('kg', 'tonne', 'litre', 'acre')`,
    );
    await queryRunner.query(
      `CREATE TABLE "farm_activities" ("id" SERIAL NOT NULL, "date" date, "land_parcel_id" integer NOT NULL, "crop_id" integer, "part_of_crop_id" integer, "activity_type" "public"."farm_activities_activity_type_enum" NOT NULL, "quantity" numeric(5,2), "unit" "public"."farm_activities_unit_enum", "cost" numeric(5,2), "time_spent" numeric(5,2), "details" jsonb, "comments" character varying, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "admission_id" integer, CONSTRAINT "PK_89a685b0ac6b2d130cd43e98270" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sales_type_enum" AS ENUM('product', 'service')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sales" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "type" "public"."sales_type_enum" NOT NULL, "inventory_item_id" integer, "customer_id" uuid NOT NULL, "quantity" numeric(8,2) NOT NULL, "price_per_unit" numeric(8,2) NOT NULL, "date" date NOT NULL, "notes" character varying, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" ("id" SERIAL NOT NULL, "supplier" character varying NOT NULL, "product" character varying NOT NULL, "quantity" numeric(8,2) NOT NULL, "price_per_unit" numeric(8,2) NOT NULL, "date" date NOT NULL, "notes" character varying, "member_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cleaning_activities" ("id" SERIAL NOT NULL, "date" date NOT NULL, "processing_unit_id" integer, "area" character varying, "cleaning_tool" character varying, "person_id" uuid, "member_id" integer NOT NULL, "notes" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a4b6e805f8de0b05a3b48eda7c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member_crops" ("id" SERIAL NOT NULL, "year" integer NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "crop_id" integer, "member_id" integer, CONSTRAINT "UQ_e295f29997bf070ff2873c6b04b" UNIQUE ("code", "member_id"), CONSTRAINT "PK_f10758da4abd5b16d00867c0c2c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "codes_sub_codes_codes" ("codesId_1" integer NOT NULL, "codesId_2" integer NOT NULL, CONSTRAINT "PK_7cc3bf5ddaecc275b1b6863976f" PRIMARY KEY ("codesId_1", "codesId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d27ae524c63d9135d08e8f5c8f" ON "codes_sub_codes_codes" ("codesId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f11eb57606328f920340a90deb" ON "codes_sub_codes_codes" ("codesId_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "codes" ADD CONSTRAINT "FK_82ef6e4c5896385a3f329972c82" FOREIGN KEY ("codeCategoryId") REFERENCES "code_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "zones" ADD CONSTRAINT "FK_74d60f25813d9d4724039726d8d" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvesters" ADD CONSTRAINT "FK_326236e82825a60d6b5428255f5" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvesters" ADD CONSTRAINT "FK_46bbfebc6108486e8230ff258e5" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracted_farmers" ADD CONSTRAINT "FK_17dcc6d6e97c15b7ef66b4f04fc" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_units" ADD CONSTRAINT "FK_144f730733c2f1dbac3fa471db9" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_resources" ADD CONSTRAINT "FK_2d5f8df282ecd5d320da2ac30ff" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_locations" ADD CONSTRAINT "FK_f0376dae84ddb0e43c4f80686f6" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" ADD CONSTRAINT "FK_27da543657ce342ce16da409b28" FOREIGN KEY ("harvester_id") REFERENCES "harvesters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" ADD CONSTRAINT "FK_d46fe9fa85d9d9981cfc8103832" FOREIGN KEY ("contracted_farmer_id") REFERENCES "contracted_farmers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" ADD CONSTRAINT "FK_1c2553499100a16a382baf91faf" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" ADD CONSTRAINT "FK_ca0e67b780e2cd389377e8b78c2" FOREIGN KEY ("land_parcel_id") REFERENCES "land_parcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" ADD CONSTRAINT "FK_a756809e7e99973686626023890" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" ADD CONSTRAINT "FK_a8f25760e09e6376e2e0364bd37" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" ADD CONSTRAINT "FK_2675c54a69e2466c1df2e7b8edf" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" ADD CONSTRAINT "FK_f37467b9cb209eb6a31b2083605" FOREIGN KEY ("admission_id") REFERENCES "admissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_acc62ac8ea344867d6cde79b57c" FOREIGN KEY ("admission_entry_id") REFERENCES "admission_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_d1b578e50d16afe770ba450acf3" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_1af589d9a5f680ee7689f4a6c9e" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7" FOREIGN KEY ("processing_method_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_b1445e1527fb2f3d3cd8a0de16d" FOREIGN KEY ("processing_type_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_99b79766d0a6281bda6f298f591" FOREIGN KEY ("processing_unit_id") REFERENCES "processing_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" ADD CONSTRAINT "FK_9946b515266f8fea1b0e219f19e" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_operations" ADD CONSTRAINT "FK_222e796bff8b9b48364530c7506" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_f904b0fdef69b50bc50cf413023" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_a99fa1731a79b009ada16f64adf" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_188154a1fbaa7998152c1069809" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_ca1530ee2c4efbaeb44943d31cc" FOREIGN KEY ("inventory_location_id") REFERENCES "inventory_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_c01a2c19411c9731951226a5fd0" FOREIGN KEY ("person_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_5627111098c5ff7476e9f2c4762" FOREIGN KEY ("producer_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_3947129479d57b4c48833500e2b" FOREIGN KEY ("supplier_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_ea2300c024f791504a0d854c58a" FOREIGN KEY ("admission_entry_id") REFERENCES "admission_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_795a5103768782e0d1ef8f6e0d5" FOREIGN KEY ("processing_activity_id") REFERENCES "processing_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcel_crops" ADD CONSTRAINT "FK_4dcb590302c23f348c94cf3df8a" FOREIGN KEY ("land_parcel_id") REFERENCES "land_parcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcel_crops" ADD CONSTRAINT "FK_6338ddb90763eaf7fcb93ef53c7" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcels" ADD CONSTRAINT "FK_f0ee7ed0d4297c19045ab641e57" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" ADD CONSTRAINT "FK_cfc5ffea54259db97198f0b5a71" FOREIGN KEY ("land_parcel_id") REFERENCES "land_parcels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" ADD CONSTRAINT "FK_322c81cc034e9746100a4d79048" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" ADD CONSTRAINT "FK_810386e755ff4df0032e56822a6" FOREIGN KEY ("part_of_crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" ADD CONSTRAINT "FK_67c34ab23d85c35fa3bb4311bad" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" ADD CONSTRAINT "FK_59c34a8ea39b17d6cccfb8462c9" FOREIGN KEY ("admission_id") REFERENCES "admissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_2eb8f262d735ae4a1532190bd7d" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_c51005b2b06cec7aa17462c54f5" FOREIGN KEY ("customer_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" ADD CONSTRAINT "FK_51fc589bb18f10e516041d01d97" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD CONSTRAINT "FK_8f56d6bdff7a58724e2ed4c9a8b" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" ADD CONSTRAINT "FK_55758ad30b0e6cc3a72c16b02b3" FOREIGN KEY ("processing_unit_id") REFERENCES "processing_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" ADD CONSTRAINT "FK_6c07f12ad0ed22e2b5ad720e4b0" FOREIGN KEY ("person_id") REFERENCES "member_resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" ADD CONSTRAINT "FK_066979b15ccd6625a41354f19b3" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_crops" ADD CONSTRAINT "FK_b7874ad057af41301a1bfd664be" FOREIGN KEY ("crop_id") REFERENCES "codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_crops" ADD CONSTRAINT "FK_0368e5abe613b60a4db245105ce" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "codes_sub_codes_codes" ADD CONSTRAINT "FK_d27ae524c63d9135d08e8f5c8f1" FOREIGN KEY ("codesId_1") REFERENCES "codes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "codes_sub_codes_codes" ADD CONSTRAINT "FK_f11eb57606328f920340a90deba" FOREIGN KEY ("codesId_2") REFERENCES "codes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "codes_sub_codes_codes" DROP CONSTRAINT "FK_f11eb57606328f920340a90deba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "codes_sub_codes_codes" DROP CONSTRAINT "FK_d27ae524c63d9135d08e8f5c8f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_crops" DROP CONSTRAINT "FK_0368e5abe613b60a4db245105ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_crops" DROP CONSTRAINT "FK_b7874ad057af41301a1bfd664be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" DROP CONSTRAINT "FK_066979b15ccd6625a41354f19b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" DROP CONSTRAINT "FK_6c07f12ad0ed22e2b5ad720e4b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cleaning_activities" DROP CONSTRAINT "FK_55758ad30b0e6cc3a72c16b02b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expenses" DROP CONSTRAINT "FK_8f56d6bdff7a58724e2ed4c9a8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_51fc589bb18f10e516041d01d97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_c51005b2b06cec7aa17462c54f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sales" DROP CONSTRAINT "FK_2eb8f262d735ae4a1532190bd7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" DROP CONSTRAINT "FK_59c34a8ea39b17d6cccfb8462c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" DROP CONSTRAINT "FK_67c34ab23d85c35fa3bb4311bad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" DROP CONSTRAINT "FK_810386e755ff4df0032e56822a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" DROP CONSTRAINT "FK_322c81cc034e9746100a4d79048"`,
    );
    await queryRunner.query(
      `ALTER TABLE "farm_activities" DROP CONSTRAINT "FK_cfc5ffea54259db97198f0b5a71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcels" DROP CONSTRAINT "FK_f0ee7ed0d4297c19045ab641e57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcel_crops" DROP CONSTRAINT "FK_6338ddb90763eaf7fcb93ef53c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "land_parcel_crops" DROP CONSTRAINT "FK_4dcb590302c23f348c94cf3df8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_795a5103768782e0d1ef8f6e0d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_ea2300c024f791504a0d854c58a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_3947129479d57b4c48833500e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_5627111098c5ff7476e9f2c4762"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_c01a2c19411c9731951226a5fd0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_ca1530ee2c4efbaeb44943d31cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_188154a1fbaa7998152c1069809"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_a99fa1731a79b009ada16f64adf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_f904b0fdef69b50bc50cf413023"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_operations" DROP CONSTRAINT "FK_222e796bff8b9b48364530c7506"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_9946b515266f8fea1b0e219f19e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_99b79766d0a6281bda6f298f591"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_b1445e1527fb2f3d3cd8a0de16d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_27d0d5aa514a53f16fe978afae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_1af589d9a5f680ee7689f4a6c9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_d1b578e50d16afe770ba450acf3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_activities" DROP CONSTRAINT "FK_acc62ac8ea344867d6cde79b57c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" DROP CONSTRAINT "FK_f37467b9cb209eb6a31b2083605"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" DROP CONSTRAINT "FK_2675c54a69e2466c1df2e7b8edf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_entries" DROP CONSTRAINT "FK_a8f25760e09e6376e2e0364bd37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" DROP CONSTRAINT "FK_a756809e7e99973686626023890"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" DROP CONSTRAINT "FK_ca0e67b780e2cd389377e8b78c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" DROP CONSTRAINT "FK_1c2553499100a16a382baf91faf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" DROP CONSTRAINT "FK_d46fe9fa85d9d9981cfc8103832"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admissions" DROP CONSTRAINT "FK_27da543657ce342ce16da409b28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_locations" DROP CONSTRAINT "FK_f0376dae84ddb0e43c4f80686f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_resources" DROP CONSTRAINT "FK_2d5f8df282ecd5d320da2ac30ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "processing_units" DROP CONSTRAINT "FK_144f730733c2f1dbac3fa471db9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracted_farmers" DROP CONSTRAINT "FK_17dcc6d6e97c15b7ef66b4f04fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_930e69d96a9cf9bdc32b7a49db1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvesters" DROP CONSTRAINT "FK_46bbfebc6108486e8230ff258e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "harvesters" DROP CONSTRAINT "FK_326236e82825a60d6b5428255f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "zones" DROP CONSTRAINT "FK_74d60f25813d9d4724039726d8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "codes" DROP CONSTRAINT "FK_82ef6e4c5896385a3f329972c82"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f11eb57606328f920340a90deb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d27ae524c63d9135d08e8f5c8f"`,
    );
    await queryRunner.query(`DROP TABLE "codes_sub_codes_codes"`);
    await queryRunner.query(`DROP TABLE "member_crops"`);
    await queryRunner.query(`DROP TABLE "cleaning_activities"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "sales"`);
    await queryRunner.query(`DROP TYPE "public"."sales_type_enum"`);
    await queryRunner.query(`DROP TABLE "farm_activities"`);
    await queryRunner.query(`DROP TYPE "public"."farm_activities_unit_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."farm_activities_activity_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "land_parcels"`);
    await queryRunner.query(
      `DROP TYPE "public"."land_parcels_ownership_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "land_parcel_crops"`);
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(`DROP TYPE "public"."members_legal_status_enum"`);
    await queryRunner.query(`DROP TABLE "inventory_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."inventory_items_package_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."inventory_items_type_enum"`);
    await queryRunner.query(`DROP TABLE "inventory_operations"`);
    await queryRunner.query(`DROP TABLE "processing_activities"`);
    await queryRunner.query(
      `DROP TYPE "public"."processing_activities_crop_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."processing_activities_crop_state_enum"`,
    );
    await queryRunner.query(`DROP TABLE "admission_entries"`);
    await queryRunner.query(
      `DROP TYPE "public"."admission_entries_crop_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."admission_entries_crop_state_enum"`,
    );
    await queryRunner.query(`DROP TABLE "admissions"`);
    await queryRunner.query(`DROP TYPE "public"."admissions_type_enum"`);
    await queryRunner.query(`DROP TABLE "inventory_locations"`);
    await queryRunner.query(`DROP TABLE "member_resources"`);
    await queryRunner.query(
      `DROP TYPE "public"."member_resources_resource_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "processing_units"`);
    await queryRunner.query(
      `DROP TYPE "public"."processing_units_ownership_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "contracted_farmers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "harvesters"`);
    await queryRunner.query(
      `DROP TYPE "public"."harvesters_legal_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "zones"`);
    await queryRunner.query(`DROP TABLE "codes"`);
    await queryRunner.query(`DROP TABLE "code_categories"`);
  }
}
