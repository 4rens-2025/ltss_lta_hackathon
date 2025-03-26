alter table "public"."generated_summary" alter column "status" drop default;

alter type "public"."status" rename to "status__old_version_to_be_dropped";

create type "public"."status" as enum ('PENDING', 'COMPLETED', 'FAILED');

alter table "public"."generated_summary" alter column status type "public"."status" using status::text::"public"."status";

alter table "public"."generated_summary" alter column "status" set default 'PENDING'::status;

drop type "public"."status__old_version_to_be_dropped";


