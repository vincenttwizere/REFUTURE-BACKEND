// Script to update 'score' field for existing student profiles
import mongoose from 'mongoose';
import readline from 'readline';
import Profile from '../models/ProfileModel.js';
import dbConfig from '../config/db.js';

// Connect to MongoDB
await dbConfig();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function updateStudentScores() {
  const students = await Profile.find({ option: 'student', $or: [ { score: { $exists: false } }, { score: null } ] });
  console.log(`Found ${students.length} student profiles missing a score.`);
  for (const student of students) {
    console.log(`\nName: ${student.fullName}, Email: ${student.email}, Age: ${student.age}`);
    const answer = await prompt('Enter score (or leave blank to skip): ');
    if (answer.trim() !== '') {
      student.score = Number(answer);
      await student.save();
      console.log('Score updated.');
    } else {
      console.log('Skipped.');
    }
  }
  rl.close();
  mongoose.connection.close();
  console.log('Done.');
}

updateStudentScores(); 