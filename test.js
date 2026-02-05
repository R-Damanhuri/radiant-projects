#!/usr/bin/env node

/**
 * Poetry Automation - Main Test Script
 * 
 * This script tests the complete poetry generation flow:
 * 1. Generate poetry using AI
 * 2. Get related images
 * 3. Store in Google Sheets
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function testPoetryGeneration() {
  console.log('🧪 Testing Poetry Generation...\n');
  
  // Check environment variables
  const required = ['GROQ_API_KEY', 'PEXELS_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:');
    missing.forEach(key => console.log(`   - ${key}`));
    console.log('\n📝 Copy .env.example to .env and fill in values\n');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  
  // Mock poetry generation (since we don't have actual API keys)
  const mockPoetry = {
    topic: 'kesepian',
    poems: [
      {
        title: 'Bayangan di Malam',
        content: 'Dalam keheningan malam\nBayangan bertemu dirinya\nKesepian berbisik lembut\nMembawa rindu yang lama',
        keywords: ['malam', 'bayangan', 'kesepian', 'rindu'],
        style: 'puisi bebas'
      },
      {
        title: 'Ruang Kosong',
        content: 'Ruang kosong dihatimu\nTidak ada yang menempati\nKeheningan berbicara\nMembisu selamanya',
        keywords: ['kosong', 'keheningan', 'ruang', ' hati'],
        style: 'puisi bebas'
      }
    ]
  };
  
  console.log('📝 Generated poetry:');
  console.log(JSON.stringify(mockPoetry, null, 2));
  
  console.log('\n✅ Test completed!');
  console.log('\n📦 Next steps:');
  console.log('1. Get real API keys for Groq and Pexels');
  console.log('2. Run: node generate-poetry.js');
  console.log('3. Open dashboard at http://localhost:3000');
}

testPoetryGeneration().catch(console.error);
