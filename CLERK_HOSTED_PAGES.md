# 🔐 Clerk Configuration - Hosted Pages

## ✅ **Important: Clerk Uses Hosted Pages**

Clerk provides its own **hosted sign-in and sign-up pages**. You don't need to create custom `/sign-in` or `/sign-up` routes in your app.

---

## 🎯 **How It Works:**

### **1. Clerk Hosted Pages**
When users click "Sign In" or "Get Started", Clerk opens a **modal** with:
- Google sign-in option
- Email/password sign-in
- Sign-up option
- Professional UI
- Security handled by Clerk

### **2. Your Configuration**
You only need to configure:
- ✅ **API Keys** (publishable key + secret key)
- ✅ **Redirect URLs** (where to go after sign-in)
- ❌ **NOT custom sign-in/sign-up routes**

---

## ⚙️ **Environment Variables:**

### **Required in `.env.local`:**
```env
# Clerk API Keys (from dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Where to redirect after authentication
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard-home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard-home
```

### **NOT Needed:**
```env
# ❌ Don't add these - Clerk uses hosted pages
# NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
# NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## 🎨 **Customizing Clerk Appearance:**

### **1. In Clerk Dashboard:**
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Customization** → **Appearance**
4. Customize:
   - Application name (shows as "Sign in to [Your App Name]")
   - Logo
   - Colors
   - Theme (light/dark)

### **2. Application Name:**
The modal shows "Sign in to EduCohortOS" - you can change this in:
- Clerk Dashboard → **Settings** → **General**
- Update "Application name"
- It will show as "Sign in to [Your Name]"

### **3. In Your Code:**
You can customize the modal appearance:
```tsx
<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

// Or customize appearance
<SignInButton 
  mode="modal"
  appearance={{
    elements: {
      rootBox: "custom-class",
      card: "shadow-2xl"
    }
  }}
>
  <button>Sign In</button>
</SignInButton>
```

---

## 🔄 **User Flow:**

```
1. User visits / (landing page)
   ↓
2. Clicks "Get Started" or "Sign In"
   ↓
3. Clerk modal opens (hosted by Clerk)
   - Shows "Sign in to [Your App Name]"
   - Google sign-in option
   - Email/password fields
   ↓
4. User signs in/up
   ↓
5. Clerk handles authentication
   ↓
6. Redirects to /dashboard-home
```

---

## 📝 **Setup Steps:**

### **Step 1: Update Application Name**
1. Go to https://dashboard.clerk.com
2. Select your application
3. **Settings** → **General**
4. Change "Application name" from "EduCohortOS" to "DIET Training OS"
5. Save

### **Step 2: Add Environment Variables**
In `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard-home
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard-home
```

### **Step 3: Restart Dev Server**
```bash
npm run dev
```

### **Step 4: Test**
1. Visit http://localhost:3000
2. Click "Get Started"
3. Modal should open with your app name
4. Sign up/Sign in
5. Should redirect to /dashboard-home

---

## 🎨 **Customization Options:**

### **In Clerk Dashboard:**

#### **1. Branding**
- Application name: "DIET Training OS"
- Logo: Upload your logo
- Favicon: Upload favicon

#### **2. Theme**
- Light/Dark mode
- Primary color
- Background color
- Button styles

#### **3. Social Connections**
- Google (already enabled)
- Facebook
- GitHub
- Microsoft
- etc.

#### **4. Email/SMS**
- Customize email templates
- Add your branding
- Custom sender name

---

## ✅ **Current Setup:**

**Public Routes:**
- `/` - Landing page (public)
- All other routes require authentication

**Authentication:**
- Handled by Clerk's hosted modal
- No custom sign-in/sign-up pages needed
- Professional, secure UI

**After Sign-In:**
- Redirects to `/dashboard-home`
- Shows authenticated dashboard
- User profile button in header

**After Sign-Out:**
- Redirects to `/` (landing page)
- Shows public landing page

---

## 🚨 **Common Issues:**

### **Issue: Modal shows wrong app name**
**Solution:** Update in Clerk Dashboard → Settings → General → Application name

### **Issue: Modal doesn't open**
**Solution:** Check that Clerk keys are in `.env.local` and server is restarted

### **Issue: Redirects to wrong page**
**Solution:** Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` in `.env.local`

### **Issue: Authentication not working**
**Solution:** 
1. Verify keys are correct
2. Check Clerk Dashboard for errors
3. Restart dev server

---

## 🎯 **Summary:**

✅ **Clerk uses hosted pages** - No custom routes needed  
✅ **Modal-based authentication** - Professional UI  
✅ **Easy customization** - In Clerk Dashboard  
✅ **Secure** - Handled by Clerk  
✅ **Simple setup** - Just add API keys  

**Your authentication is fully managed by Clerk!** 🔐✨
