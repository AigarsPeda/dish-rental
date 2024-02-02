# Dish Rent

## To clear DB uncomment the following line in `schema.ts`:

Comment out schema and un comment // CLEAR DB TABLES

```ts
export const DROP_DB = sql`
  DROP TABLE IF EXISTS "dish-rental_verificationToken";
  DROP TABLE IF EXISTS "dish-rental_session";
  DROP TABLE IF EXISTS "dish-rental_account";
  DROP TABLE IF EXISTS "dish-rental_user";
  DROP TABLE IF EXISTS "dish-rental_post";
`;
```
