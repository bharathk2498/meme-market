# Security Guidelines

## Critical Security Checklist

### Environment Variables
- [ ] No credentials in code
- [ ] All secrets in .env files
- [ ] .env files in .gitignore
- [ ] Different keys for dev/prod
- [ ] Keys rotated every 90 days

### API Security
- [ ] Rate limiting enabled (60/min)
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] Error messages don't leak info

### Authentication
- [ ] Strong SECRET_KEY (32+ characters)
- [ ] JWT tokens expire (30 minutes)
- [ ] Passwords hashed (bcrypt)
- [ ] No plain text passwords
- [ ] Session management secure

### Database Security
- [ ] Supabase RLS policies enabled
- [ ] Service role key only in backend
- [ ] Anon key only in frontend
- [ ] Regular backups configured
- [ ] Connection pooling enabled

### Reddit API
- [ ] Using OAuth 2.0
- [ ] Rate limit: 60 requests/minute respected
- [ ] User agent properly set
- [ ] Terms of Service compliant
- [ ] No scraping, only API usage

### Frontend Security
- [ ] No API keys in client code
- [ ] XSS prevention (React escaping)
- [ ] HTTPS enforced in production
- [ ] Secure cookies (httpOnly, secure)
- [ ] Content Security Policy headers

### Infrastructure
- [ ] Railway/Vercel with HTTPS
- [ ] Regular dependency updates
- [ ] Security headers configured
- [ ] DDoS protection enabled
- [ ] Monitoring and alerting active

## Common Vulnerabilities to Avoid

### 1. Exposed Secrets

❌ Bad:
```python
REDDIT_CLIENT_ID = "abc123"
```

✅ Good:
```python
import os
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
```

### 2. SQL Injection

❌ Bad:
```python
query = f"SELECT * FROM posts WHERE id = {post_id}"
```

✅ Good:
```python
supabase.table("posts").select("*").eq("id", post_id).execute()
```

### 3. No Rate Limiting

❌ Bad:
```python
@app.get("/api/predictions")
def get_predictions():
    return predictions
```

✅ Good:
```python
@app.get("/api/predictions")
@limiter.limit("60/minute")
def get_predictions(request: Request):
    return predictions
```

### 4. Exposed Error Details

❌ Bad:
```python
except Exception as e:
    return {"error": str(e)}  # May expose database structure
```

✅ Good:
```python
except Exception as e:
    logger.error(f"Error: {e}")
    return {"error": "Failed to fetch predictions"}
```

## Security Monitoring

### What to Monitor
1. Failed authentication attempts
2. Rate limit violations
3. Database query errors
4. Unusual traffic patterns
5. Error rates spiking

### Tools
- Railway logs
- Supabase monitoring
- Sentry for error tracking
- Uptime monitoring (UptimeRobot)

## Incident Response Plan

### If API Keys Compromised:
1. Immediately rotate all keys
2. Review access logs
3. Update all deployments
4. Notify affected users if needed

### If Database Breached:
1. Take system offline
2. Contact Supabase support
3. Review access logs
4. Restore from backup
5. Implement additional security

### If DDoS Attack:
1. Enable Cloudflare (free tier)
2. Increase rate limits temporarily
3. Block malicious IPs
4. Scale infrastructure if needed

## Security Best Practices

### Code Review Checklist
- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] Error handling doesn't leak info
- [ ] SQL queries parameterized
- [ ] Authentication checked
- [ ] Rate limiting applied

### Deployment Checklist
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Rate limits tested

### Regular Maintenance
- Weekly: Review logs for anomalies
- Monthly: Update dependencies
- Quarterly: Rotate API keys
- Annually: Security audit

## Compliance

### GDPR Considerations
- User data stored in Supabase (EU region available)
- Data deletion on request
- Privacy policy required
- Cookie consent if tracking

### Terms of Service
- Reddit API: Follow their ToS
- No data reselling
- No excessive requests
- Proper attribution

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Reddit API Rules](https://www.reddit.com/wiki/api/)

## Contact

Security issues? Email: security@yourdomain.com

Responsible disclosure appreciated.
