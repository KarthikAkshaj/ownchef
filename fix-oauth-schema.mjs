// fix-oauth-schema.mjs - Make passwordHash nullable for OAuth users
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://root:mysecretpassword@127.0.0.1:5432/local';

async function fixSchema() {
	const sql = postgres(DATABASE_URL);

	try {
		console.log('Making password_hash column nullable for OAuth users...');

		await sql`
			ALTER TABLE "user"
			ALTER COLUMN password_hash DROP NOT NULL
		`;

		console.log('✅ Success! password_hash is now nullable');
		console.log('OAuth users can now be created without passwords');

	} catch (error) {
		console.error('❌ Error:', error.message);
		process.exit(1);
	} finally {
		await sql.end();
	}
}

fixSchema();
