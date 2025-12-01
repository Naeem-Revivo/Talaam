require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/user');
const { prisma } = require('../config/db/prisma');

const seedSuperadmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connected');

    // Superadmin credentials (you can change these)
    const superadminData = {
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@talaam.com',
      password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123',
      role: 'superadmin',
      isEmailVerified: true,
      fullName: 'Super Admin',
    };

    // Check if superadmin already exists
    const existingSuperadmin = await prisma.user.findFirst({ 
      where: { role: 'superadmin' } 
    });
    if (existingSuperadmin) {
      console.log('Superadmin already exists:', existingSuperadmin.email);
      process.exit(0);
    }

    // Create superadmin
    const superadmin = await User.create(superadminData);
    console.log('Superadmin created successfully:', {
      id: superadmin.id,
      email: superadmin.email,
      role: superadmin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding superadmin:', error);
    process.exit(1);
  }
};

seedSuperadmin();

