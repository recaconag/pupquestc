-- Seed essential campus categories (idempotent)
INSERT INTO "itemsCategories" ("id", "name", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Personal Accessories',  now(), now()),
  (gen_random_uuid(), 'Books & Stationery',    now(), now()),
  (gen_random_uuid(), 'Clothing & Apparel',    now(), now()),
  (gen_random_uuid(), 'Others',                now(), now())
ON CONFLICT DO NOTHING;
