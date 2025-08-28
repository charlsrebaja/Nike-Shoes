# Google OAuth Setup Guide

## Problem: "Access blocked: This app's request is invalid"

This error occurs when your Google OAuth app is not properly configured. Here's how to fix it:

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID (it should match the one in your `.env` file)

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name**: Nike Shop
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add your domain to "Authorized domains" (for production)
5. Save and continue

## Step 3: Add Test Users (Important!)

1. In the OAuth consent screen, go to "Test users"
2. Click "Add users"
3. Add the email address you're trying to login with
4. Save the changes

## Step 4: Configure Redirect URIs

1. Go back to "Credentials"
2. Click on your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - Your production domain + `/api/auth/callback/google` (for production)
4. Save the changes

## Step 5: Publish Your App (Optional)

If you want to allow any Google user to login (not just test users):

1. Go to "OAuth consent screen"
2. Click "Publish app"
3. This will make your app available to all Google users

## Current Configuration Check

Your current `.env` file has:

- ✅ `GOOGLE_CLIENT_ID` configured
- ✅ `GOOGLE_CLIENT_SECRET` configured
- ✅ `NEXTAUTH_URL` set to `http://localhost:3000`

## Quick Fix

The most likely issue is that your email is not added to the test users list. Add your Google account email to the test users in Google Cloud Console, and the login should work immediately.

## Alternative: Create New OAuth Credentials

If the current credentials are problematic:

1. In Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Update your `.env` file with the new client ID and secret

## Test the Fix

After making these changes:

1. Restart your development server
2. Try logging in with Google again
3. The error should be resolved

## Need Help?

If you're still having issues, check:

1. That your Google Cloud project is active
2. That the OAuth consent screen is not in draft mode
3. That the redirect URI exactly matches what's configured
4. That you're using the correct Google account for testing
