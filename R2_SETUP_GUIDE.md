# Cloudflare R2 Setup Guide

## Step 1: Create Cloudflare Account
1. Go to https://cloudflare.com
2. Sign up for a free account (if you don't have one)
3. Verify your email

## Step 2: Create R2 Bucket
1. Log in to your Cloudflare dashboard
2. Navigate to **R2** in the sidebar
3. Click **Create bucket**
4. Name your bucket: `ownchef-uploads`
5. Click **Create bucket**

## Step 3: Enable Public Access (for recipe images)
1. Go to your bucket settings
2. Click on **Settings** tab
3. Under **Public access**, click **Allow Access**
4. Copy the **Public R2.dev subdomain** (e.g., `https://pub-xxxxxxxxxxxxx.r2.dev`)
5. Save this URL - you'll need it for `R2_PUBLIC_URL`

**Alternative: Custom Domain (Optional, Recommended for Production)**
- Go to **Settings** → **Custom Domains**
- Add your custom domain (e.g., `cdn.ownchef.com`)
- Follow the DNS setup instructions
- Use your custom domain as `R2_PUBLIC_URL`

## Step 4: Generate API Credentials
1. In Cloudflare dashboard, go to **R2**
2. Click **Manage R2 API Tokens**
3. Click **Create API Token**
4. Configure:
   - **Token Name**: `ownchef-api`
   - **Permissions**: Object Read & Write
   - **TTL**: Start after creation, never expires
   - **Bucket**: Select your `ownchef-uploads` bucket
5. Click **Create API Token**
6. Copy the credentials:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (from the R2 overview page)

⚠️ **IMPORTANT**: Save these credentials immediately! The Secret Access Key won't be shown again.

## Step 5: Update Environment Variables
1. Copy your credentials to `.env`:

```bash
# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-account-id-here"
R2_ACCESS_KEY_ID="your-access-key-id-here"
R2_SECRET_ACCESS_KEY="your-secret-access-key-here"
R2_BUCKET_NAME="ownchef-uploads"
R2_PUBLIC_URL="https://pub-xxxxxxxxxxxxx.r2.dev"
```

2. Replace the placeholder values with your actual credentials

## Step 6: Test the Integration
1. Start your development server:
```bash
npm run dev
```

2. Try uploading a profile image or recipe image
3. Check your R2 bucket to verify the file was uploaded
4. Verify the image displays correctly in your app

## Step 7: Configure CORS (if needed)
If you're uploading from a different domain, configure CORS:

1. Go to your bucket **Settings**
2. Scroll to **CORS Policy**
3. Add a rule:
```json
[
  {
    "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## Pricing (Free Tier)
- ✅ 10 GB storage
- ✅ Unlimited egress (no bandwidth fees!)
- ✅ 1 million Class A operations/month
- ✅ 10 million Class B operations/month


## Security Best Practices
1. ✅ Never commit `.env` to Git (already in .gitignore)
2. ✅ Use different buckets for dev/staging/production
3. ✅ Rotate API keys periodically
4. ✅ Use custom domains in production (not R2.dev)
5. ✅ Implement file ownership validation before deletion

## Troubleshooting

### Images not loading?
- Check that public access is enabled
- Verify R2_PUBLIC_URL is correct
- Check browser console for CORS errors

### Upload failing?
- Verify API credentials are correct
- Check R2_ACCOUNT_ID matches your account
- Ensure bucket name is correct

### Need help?
- Cloudflare R2 Docs: https://developers.cloudflare.com/r2/
- Check server logs for detailed error messages
