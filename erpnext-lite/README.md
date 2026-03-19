# ERPNext Lite (Node + MySQL, No Login)

This is a lightweight, open-access app that mirrors only these four modules:
- HRM
- CRM
- Project Management
- Asset Management

It uses plain HTML/CSS/JS for the UI and Node.js + MySQL for data.

## 1) Setup MySQL
Create the database and tables:

```sql
-- in MySQL client
SOURCE db/schema.sql;
```

## 2) Configure environment
Copy the example file:

```
cp .env.example .env
```

Update DB values if needed.

## 3) Install and run

```
npm install
npm start
```

Open:

```
http://localhost:3000
```

## Notes
- No login/authentication (open access).
- CRUD is available for each sub-feature under the four modules.
- To deploy elsewhere, set the same DB environment variables and run `npm start`.
