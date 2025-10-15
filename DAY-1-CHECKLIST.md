# DAY 1 CHECKLIST
Meme Market - Reddit Only Version

## MORNING SESSION (2 hours)

### Get All Credentials

□ **Reddit API Setup (15 min)**
  - Go to reddit.com/prefs/apps
  - Create app (script type)
  - Save Client ID
  - Save Client Secret
  - Screenshot credentials

□ **Supabase Project (15 min)**
  - Go to supabase.com
  - Create project: "meme-market"
  - Save Project URL
  - Save API Keys (anon + service_role)
  - Screenshot dashboard

□ **Perplexity API (5 min)**
  - Login to perplexity.ai
  - Settings → API
  - Generate new key
  - Save key

□ **N8N Access (5 min)**
  - Login to app.n8n.cloud
  - Verify account active
  - Ready to import workflows

---

## DATABASE SETUP (30 minutes)

□ **Run Database Schema**
  - Open Supabase SQL Editor
  - Copy database-schema.sql
  - Paste and run
  - Verify 5 tables created

□ **Test Database**
  - Go to Table Editor
  - Click reddit_posts table
  - Should be empty (ready for data)
  - Repeat for other tables

---

## AFTERNOON SESSION (2 hours)

### N8N Reddit Scraper

□ **Add Reddit Credentials to N8N**
  - Settings → Credentials
  - Add "Reddit OAuth2 API"
  - Enter Client ID and Secret
  - Test connection
  - Save as "Reddit account"

□ **Import Reddit Scraper**
  - Download n8n-reddit-scraper.json
  - Import to N8N
  - Connect Reddit credentials to all 4 Reddit nodes
  - Save workflow

□ **Add Supabase Credentials**
  - Settings → Credentials
  - Add "Supabase"
  - Enter Project URL and Service Role Key
  - Save as "Supabase account"
  - Connect to "Save to Supabase" node

□ **Test Reddit Scraper (CRITICAL)**
  - Click "Execute Workflow"
  - Watch nodes turn green
  - Should complete in 30-60 seconds
  - Check Supabase for ~100 new posts
  - If errors, check credentials

□ **Activate Reddit Scraper**
  - Toggle "Active" switch ON
  - Workflow will run every 2 hours
  - Verify in N8N executions log
  - First automatic run in 2 hours

---

## EVENING CHECK (30 minutes)

### Verify Data Collection Started

□ **Check Supabase Data**
  ```sql
  SELECT COUNT(*) FROM reddit_posts;
  ```
  - Should show 100+ posts

□ **Verify Subreddits**
  ```sql
  SELECT subreddit, COUNT(*) 
  FROM reddit_posts 
  GROUP BY subreddit;
  ```
  - Should see: memes, dankmemes, me_irl, funny

□ **Check Workflow Status**
  - Go to N8N → Executions
  - Last run should be successful (green)
  - Next run scheduled in ~2 hours

□ **Set Reminders**
  - Check data in 12 hours
  - Check data in 24 hours
  - Start Day 2 tasks after 48 hours

---

## SUCCESS CRITERIA - END OF DAY 1

✓ All credentials saved securely
✓ Database created with 5 tables
✓ Reddit scraper workflow active
✓ 100+ posts collected in Supabase
✓ No errors in N8N logs
✓ Workflow set to run every 2 hours

---

## IF SOMETHING BREAKS

### Reddit API Issues:
- Verify OAuth2 credentials (not username/password)
- Check app type is "script"
- Redirect URI must be http://localhost:8000

### Supabase Issues:
- Use SERVICE_ROLE key not anon key
- Check table names match exactly
- Rerun database-schema.sql if needed

### N8N Issues:
- Test manually before activating
- Check all nodes have credentials
- Look at execution errors for details

---

## TONIGHT: LET IT RUN

Your system is now collecting Reddit data every 2 hours.

**DO NOT touch anything tonight.**

Let it accumulate 48 hours of data before starting predictions.

Check back tomorrow morning to verify data is flowing.

---

## TOMORROW MORNING (Quick Check)

□ Login to Supabase
□ Check reddit_posts count (should be 200-300+)
□ Review N8N execution logs
□ Verify no errors overnight
□ Continue letting it run

---

**Day 1 Complete! 🎉**

Your data collection system is live. Come back in 48 hours for Day 2.
