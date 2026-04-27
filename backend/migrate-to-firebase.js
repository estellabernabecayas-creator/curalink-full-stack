import admin from 'firebase-admin';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userModel from './models/userModel.js';
import fs from 'fs';

// Initialize Firebase Admin with service account
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync('./firebase-service-account.json', 'utf8'));
} catch (error) {
  console.error('Error reading firebase-service-account.json:', error.message);
  console.log('Please download your Firebase service account key from Firebase Console and save it as firebase-service-account.json in the backend folder');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

// Migration function
const migrateUsersToFirebase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all users from MongoDB
    const users = await userModel.find({});
    console.log(`Found ${users.length} users in MongoDB`);

    let successCount = 0;
    let alreadyExistsCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        console.log(`Processing user: ${user.email}`);
        
        // Check if user already exists in Firebase
        try {
          await auth.getUserByEmail(user.email);
          console.log(`  - User already exists in Firebase: ${user.email}`);
          alreadyExistsCount++;
          continue;
        } catch (error) {
          if (error.code !== 'auth/user-not-found') {
            throw error;
          }
          // User doesn't exist, proceed with creation
        }

        // Create user in Firebase Auth
        // Note: We can't migrate the password hash, so we'll need to set a temporary password
        // The user will need to use "Forgot Password" to set their actual password
        const tempPassword = 'TempPassword123!'; // User will need to reset this
        
        const userRecord = await auth.createUser({
          email: user.email,
          password: tempPassword,
          emailVerified: false,
          disabled: false
        });

        console.log(`  - Firebase user created: ${userRecord.uid}`);
        successCount++;

      } catch (error) {
        console.error(`  - Error migrating ${user.email}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total users: ${users.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Already existed: ${alreadyExistsCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('\nNote: Migrated users have a temporary password. They should use "Forgot Password" to set their actual password.');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    process.exit(0);
  }
};

// Run migration
migrateUsersToFirebase();
