import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrateUrls() {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../data/urls.json')
    const jsonData = fs.readFileSync(jsonPath, 'utf-8')
    const urls = JSON.parse(jsonData)

    console.log(`Found ${urls.length} URLs to migrate`)

    // Insert each URL into Supabase
    for (const urlData of urls) {
      const { data, error } = await supabase
        .from('urls')
        .insert([{
          url: urlData.url,
          added_at: urlData.addedAt
        }])
        .select()

      if (error) {
        console.error(`Error migrating URL ${urlData.url}:`, error)
      } else {
        console.log(`✓ Migrated: ${urlData.url}`)
      }
    }

    console.log('\nMigration complete!')

    // Verify the migration
    const { data: allUrls, error: fetchError } = await supabase
      .from('urls')
      .select('*')

    if (fetchError) {
      console.error('Error fetching URLs:', fetchError)
    } else {
      console.log(`\nTotal URLs in database: ${allUrls?.length}`)
    }

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateUrls()
