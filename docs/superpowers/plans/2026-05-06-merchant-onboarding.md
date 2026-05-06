# Merchant Onboarding Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual contract-send process with a website-driven flow where merchant form submissions automatically generate a pre-filled Business Collaboration Agreement `.docx` emailed to sakdarith.st@gmail.com.

**Architecture:** `sellers.html` form POSTs JSON to a Google Apps Script web app. The script appends to a Google Sheet tracker, copies a Google Docs contract template, fills merchant placeholders, saves the copy to Google Drive, and emails a `.docx` attachment to the operations contact.

**Tech Stack:** Vanilla HTML/JS (sellers.html), Google Apps Script (doPost), Google Docs (template), Google Sheets (tracker), Google Drive (file storage), GmailApp (notification)

---

## Phase 1 — One-time Google Workspace Setup (Manual Steps)

### Task 1: Prepare the Google Docs Contract Template

**Files:**
- Source: `Business Collaboration Form/TENH100 Business Collaboratation agreement.docx`
- Output: Google Doc in your Google Drive (ID noted below)

- [ ] **Step 1: Upload and convert to Google Docs**

  Go to [drive.google.com](https://drive.google.com) → click **New → File upload** → select `Business Collaboration Form/TENH100 Business Collaboratation agreement.docx`. After upload, right-click the file → **Open with → Google Docs**. This creates a Google Docs version. Rename it to `TENH100 Contract Template (Master)`.

- [ ] **Step 2: Replace merchant-filled placeholders with tokens**

  In the Google Doc, use **Edit → Find and replace** (Ctrl+H) to make these exact replacements one at a time. Use **Match case** to be precise.

  | Find (exact text) | Replace with |
  |---|---|
  | `[To be filled]` (first occurrence — Name of Business row) | `{{BUSINESS_NAME}}` |
  | `[To be filled  with Google map link]` (double space) | `{{ADDRESS}}` |
  | `[To be filled]` (Shop Type row) | `{{SHOP_TYPE}}` |
  | `[To be filled]` (Expected Product Count row) | `{{PRODUCT_COUNT}}` |
  | `[To be filled]` (Store Opening Days row) | `{{OPENING_DAYS}}` |
  | `[To be filled]` (Store Operating Hours row) | `{{OPERATING_HOURS}}` |
  | `[To be filled]` (Representative Name row) | `{{REP_NAME}}` |
  | `[To be filled]` (Phone Number row) | `{{PHONE}}` |
  | `[To be filled] [Optional]` (Back-up Phone row) | `{{BACKUP_PHONE}}` |
  | `[To be filled]` (Email row) | `{{EMAIL}}` |
  | `[To be filled]` (Section 2 body — "By signing this agreement, [To be filled]") | `{{BUSINESS_NAME}}` |
  | `For [To be filled]` (signature block) | `For {{BUSINESS_NAME}}` |

  **Leave these unchanged (TENH100 fills manually):**
  - `[To be filled by Tenh100]` — Longitude, Latitude
  - `[To be filled]` — ID Number, Bank fields
  - `[To be filled by Tenh100]` — Commission Rate
  - All `Date:` signature fields

- [ ] **Step 3: Note the template Doc ID**

  Look at the Google Doc URL: `https://docs.google.com/document/d/XXXXXXXXXXXXXXXX/edit`
  
  Copy the `XXXXXXXXXXXXXXXX` part. This is your `TEMPLATE_DOC_ID`. Save it — you will need it in Task 4.

---

### Task 2: Create Google Drive Folder Structure

- [ ] **Step 1: Create the parent folder**

  In Google Drive → **New → Folder** → name it `Merchant Contracts`.

- [ ] **Step 2: Create the subfolder**

  Inside `Merchant Contracts` → **New → Folder** → name it `Pending Applications`.

- [ ] **Step 3: Note the Pending Applications folder ID**

  Open the `Pending Applications` folder. Look at the URL: `https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXX`

  Copy the `XXXXXXXXXXXXXXXX` part. This is your `PENDING_FOLDER_ID`. Save it.

---

### Task 3: Create the Google Sheets Tracker

- [ ] **Step 1: Create the spreadsheet**

  In Google Drive → **New → Google Sheets**. Rename it `TENH100 Merchant Applications`.

- [ ] **Step 2: Add the header row**

  Click cell A1 and enter these headers across row 1 (one per cell, left to right):

  ```
  Submission Date | Business Name | Representative Name | Phone Number | Back-up Phone | Email | Address | Shop Type | Expected Product Count | Opening Days | Operating Hours | Contract Link | Status
  ```

- [ ] **Step 3: Rename the sheet tab**

  Right-click the tab at the bottom (defaults to `Sheet1`) → **Rename** → type `Merchant Applications`.

- [ ] **Step 4: Note the Spreadsheet ID**

  Look at the URL: `https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXX/edit`

  Copy the `XXXXXXXXXXXXXXXX` part. This is your `SPREADSHEET_ID`. Save it.

---

## Phase 2 — Google Apps Script Web App

### Task 4: Create and Deploy the Apps Script

**Files:**
- Create: `apps-script/Code.gs` (reference copy — you paste this into the Apps Script editor)

- [ ] **Step 1: Save the reference copy to the project repo**

  Create `apps-script/Code.gs` with this exact content:

  ```javascript
  var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
  var TEMPLATE_DOC_ID = 'YOUR_TEMPLATE_DOC_ID';
  var PENDING_FOLDER_ID = 'YOUR_PENDING_FOLDER_ID';
  var NOTIFY_EMAIL = 'sakdarith.st@gmail.com';

  function doPost(e) {
    try {
      var data = JSON.parse(e.postData.contents);

      var businessName   = data.businessName   || '';
      var address        = data.address        || '';
      var shopType       = data.shopType       || '';
      var productCount   = data.productCount   || '';
      var openingDays    = data.openingDays    || '';
      var operatingHours = data.operatingHours || '';
      var repName        = data.repName        || '';
      var phone          = data.phone          || '';
      var backupPhone    = data.backupPhone    || 'N/A';
      var email          = data.email          || '';
      var submissionDate = Utilities.formatDate(
        new Date(), 'Asia/Phnom_Penh', 'dd/MM/yyyy'
      );

      // 1. Copy template Doc into Pending Applications folder
      var template = DriveApp.getFileById(TEMPLATE_DOC_ID);
      var folder   = DriveApp.getFolderById(PENDING_FOLDER_ID);
      var docName  = submissionDate + ' ' + businessName + ' — Draft Contract';
      var docCopy  = template.makeCopy(docName, folder);

      // 2. Fill merchant placeholders
      var doc  = DocumentApp.openById(docCopy.getId());
      var body = doc.getBody();
      body.replaceText('\\{\\{BUSINESS_NAME\\}\\}',   businessName);
      body.replaceText('\\{\\{ADDRESS\\}\\}',          address);
      body.replaceText('\\{\\{SHOP_TYPE\\}\\}',        shopType);
      body.replaceText('\\{\\{PRODUCT_COUNT\\}\\}',    productCount);
      body.replaceText('\\{\\{OPENING_DAYS\\}\\}',     openingDays);
      body.replaceText('\\{\\{OPERATING_HOURS\\}\\}',  operatingHours);
      body.replaceText('\\{\\{REP_NAME\\}\\}',         repName);
      body.replaceText('\\{\\{PHONE\\}\\}',            phone);
      body.replaceText('\\{\\{BACKUP_PHONE\\}\\}',     backupPhone);
      body.replaceText('\\{\\{EMAIL\\}\\}',            email);
      doc.saveAndClose();

      // 3. Log to Google Sheet
      var sheet  = SpreadsheetApp.openById(SPREADSHEET_ID)
                                 .getSheetByName('Merchant Applications');
      var docUrl = 'https://docs.google.com/document/d/' + docCopy.getId();
      sheet.appendRow([
        submissionDate, businessName, repName, phone, backupPhone,
        email, address, shopType, productCount, openingDays,
        operatingHours, docUrl, 'Pending'
      ]);

      // 4. Export as .docx and email
      var docxBlob = docCopy.getAs(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      docxBlob.setName(docName + '.docx');

      var emailBody =
        'New merchant application received.\n\n' +
        'Business Name: '          + businessName   + '\n' +
        'Representative: '         + repName        + '\n' +
        'Phone: '                  + phone          + '\n' +
        'Back-up Phone: '          + backupPhone    + '\n' +
        'Email: '                  + email          + '\n' +
        'Address: '                + address        + '\n' +
        'Shop Type: '              + shopType       + '\n' +
        'Expected Product Count: ' + productCount   + '\n' +
        'Opening Days: '           + openingDays    + '\n' +
        'Operating Hours: '        + operatingHours + '\n' +
        'Submitted: '              + submissionDate + '\n\n' +
        'Google Doc: ' + docUrl + '\n\n' +
        'Action required: Open the attached .docx and fill in:\n' +
        '  - Commission Rate\n' +
        '  - Google Maps link\n' +
        '  - ID Number\n' +
        '  - Bank Account Owner Name, Bank Name, Bank Account Number\n' +
        '  - Signature Date\n' +
        'Then export as PDF and send to the merchant for signature.\n' +
        'Update the Merchant Applications sheet Status to Active once signed.';

      GmailApp.sendEmail(
        NOTIFY_EMAIL,
        'New Merchant Application — ' + businessName,
        emailBody,
        { attachments: [docxBlob] }
      );

      return ContentService
        .createTextOutput(JSON.stringify({ result: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  ```

- [ ] **Step 2: Open Google Apps Script**

  Go to [script.google.com](https://script.google.com) → click **New project**. Rename the project to `TENH100 Merchant Onboarding`.

- [ ] **Step 3: Paste the code**

  Delete all existing content in the editor. Paste the full contents of `apps-script/Code.gs`.

- [ ] **Step 4: Fill in your IDs**

  Replace the three placeholder strings at the top:
  - `'YOUR_SPREADSHEET_ID'` → your Spreadsheet ID from Task 3
  - `'YOUR_TEMPLATE_DOC_ID'` → your Template Doc ID from Task 1
  - `'YOUR_PENDING_FOLDER_ID'` → your folder ID from Task 2

  Click **Save** (Ctrl+S).

- [ ] **Step 5: Deploy as web app**

  Click **Deploy → New deployment**. Configure:
  - Type: **Web app**
  - Execute as: **Me**
  - Who has access: **Anyone**

  Click **Deploy**. Google will ask you to authorise — click through the permissions (allow access to Drive, Docs, Sheets, Gmail).

- [ ] **Step 6: Note the web app URL**

  After deployment, copy the **Web app URL**. It looks like:
  ```
  https://script.google.com/macros/s/XXXXXXXXXX/exec
  ```
  Save this — you will paste it into `sellers.html` in Task 5.

---

## Phase 3 — Website Updates

### Task 5: Update sellers.html — Form Fields

**Files:**
- Modify: `T100 website/T100 website/sellers.html`

- [ ] **Step 1: Replace the entire `<form>` element**

  Find the existing `<form class="Seller-form" ...>` block (lines 102–166) and replace it with:

  ```html
  <form class="Seller-form" id="SellerForm">
    <h3>Seller Registration</h3>

    <div class="form-group">
      <label for="businessName">Business Name *</label>
      <input type="text" id="businessName" name="businessName" required placeholder="e.g. MASS KH Fitness" />
    </div>

    <div class="form-group">
      <label for="address">Address of Shop *</label>
      <input type="text" id="address" name="address" required placeholder="e.g. Street 271, Toul Kork, Phnom Penh" />
    </div>

    <div class="form-group">
      <label for="shopType">Shop Type *</label>
      <input type="text" id="shopType" name="shopType" required placeholder="e.g. Fitness Supplement Shop" />
    </div>

    <div class="form-group">
      <label for="productCount">Expected Product Count *</label>
      <select id="productCount" name="productCount" required>
        <option value="" disabled selected>Select range</option>
        <option value="1–20 SKUs">1 – 20 products</option>
        <option value="21–100 SKUs">21 – 100 products</option>
        <option value="101–500 SKUs">101 – 500 products</option>
        <option value="500+ SKUs">500+ products</option>
      </select>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="openingDays">Store Opening Days *</label>
        <input type="text" id="openingDays" name="openingDays" required placeholder="e.g. Monday – Sunday" />
      </div>
      <div class="form-group">
        <label for="operatingHours">Store Operating Hours *</label>
        <input type="text" id="operatingHours" name="operatingHours" required placeholder="e.g. 8am – 6pm" />
      </div>
    </div>

    <div class="form-group">
      <label for="repName">Representative Name *</label>
      <input type="text" id="repName" name="repName" required placeholder="e.g. Sokha Vann" />
    </div>

    <div class="form-group">
      <label for="phone">Phone Number *</label>
      <input type="tel" id="phone" name="phone" required placeholder="+855 12 345 678" />
    </div>

    <div class="form-group">
      <label for="backupPhone">Back-up Phone Number <span style="color:#999;font-weight:400;">(Optional)</span></label>
      <input type="tel" id="backupPhone" name="backupPhone" placeholder="+855 12 345 678" />
    </div>

    <div class="form-group">
      <label for="email">Email Address *</label>
      <input type="email" id="email" name="email" required placeholder="sokha@example.com" />
    </div>

    <div class="form-group checkbox-group">
      <input type="checkbox" id="terms" name="terms" required />
      <label for="terms">I agree to the <a href="/terms" data-terms-tab="terms-of-service">Terms of Service</a> and <a href="/terms" data-terms-tab="seller-agreement">Seller Agreement</a></label>
    </div>

    <button type="submit" class="btn btn-primary btn-full btn-large">
      Submit Application &rarr;
    </button>

    <p class="form-disclaimer">By submitting, you agree to receive communications from TENH100. We respect your privacy.</p>
  </form>
  ```

---

### Task 6: Update sellers.html — JavaScript Submission Handler

**Files:**
- Modify: `T100 website/T100 website/sellers.html`

- [ ] **Step 1: Replace the entire inline `<script>` submission block**

  Find the `<script>` block that starts with `if (!window.UI) throw new Error(...)` and ends with the closing `</script>` before the Vercel analytics script. Replace the full content of that script tag with:

  ```javascript
  if (!window.UI) throw new Error('UI not loaded (window.UI missing).');

  var APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

  document.getElementById('SellerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    var data = {
      businessName:   document.getElementById('businessName').value.trim(),
      address:        document.getElementById('address').value.trim(),
      shopType:       document.getElementById('shopType').value.trim(),
      productCount:   document.getElementById('productCount').value,
      openingDays:    document.getElementById('openingDays').value.trim(),
      operatingHours: document.getElementById('operatingHours').value.trim(),
      repName:        document.getElementById('repName').value.trim(),
      phone:          document.getElementById('phone').value.trim(),
      backupPhone:    document.getElementById('backupPhone').value.trim(),
      email:          document.getElementById('email').value.trim()
    };

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (json.result === 'success') {
        showSuccessPopup(data.phone);
        form.reset();
      } else {
        showErrorPopup();
      }
    })
    .catch(function () { showErrorPopup(); })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
    });
  });

  function showSuccessPopup(phone) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.innerHTML =
      '<div style="background:#fff;padding:40px;border-radius:20px;max-width:420px;text-align:center;margin:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="width:80px;height:80px;background:#E2012D;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">' +
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
        '</div>' +
        '<h2 style="margin:0 0 12px;color:#111;font-size:24px;font-weight:800;font-family:\'DM Sans\',sans-serif;">Application Submitted!</h2>' +
        '<p style="color:#666;margin:0 0 24px;line-height:1.6;font-size:15px;font-family:\'DM Sans\',sans-serif;">The TENH100 Team will contact you shortly through your phone number:</p>' +
        '<p style="color:#E2012D;font-size:20px;font-weight:700;margin:0 0 28px;font-family:\'DM Sans\',sans-serif;">' + phone + '</p>' +
        '<button onclick="this.closest(\'div\').parentElement.remove()" class="btn btn-primary btn-large" style="width:100%;justify-content:center;">Got it!</button>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function showErrorPopup() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.innerHTML =
      '<div style="background:#fff;padding:40px;border-radius:20px;max-width:420px;text-align:center;margin:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<h2 style="margin:0 0 12px;color:#111;font-size:24px;font-weight:800;font-family:\'DM Sans\',sans-serif;">Something went wrong.</h2>' +
        '<p style="color:#666;margin:0 0 16px;line-height:1.6;font-size:15px;font-family:\'DM Sans\',sans-serif;">Please contact us directly on Telegram:</p>' +
        '<a href="https://t.me/KimSun_TENH100" target="_blank" rel="noopener noreferrer" style="color:#E2012D;font-size:18px;font-weight:700;text-decoration:none;">@KimSun_TENH100</a>' +
        '<br/>' +
        '<button onclick="this.closest(\'div\').parentElement.remove()" class="btn btn-primary btn-large" style="width:100%;justify-content:center;margin-top:24px;">Close</button>' +
      '</div>';
    document.body.appendChild(overlay);
  }
  ```

- [ ] **Step 2: Insert your Apps Script URL**

  Find the line:
  ```javascript
  var APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
  ```
  Replace `YOUR_APPS_SCRIPT_WEB_APP_URL` with the URL you copied at the end of Task 4.

---

## Phase 4 — Test & Commit

### Task 7: End-to-End Smoke Test

- [ ] **Step 1: Open the sellers page in a browser**

  Open `T100 website/T100 website/sellers.html` directly in Chrome (or the live site if deployed).

- [ ] **Step 2: Fill in the form with test data**

  Use these exact values so you can verify them end-to-end:
  - Business Name: `Test Business`
  - Address: `Street 1, Phnom Penh`
  - Shop Type: `Test Shop`
  - Expected Product Count: `1 – 20 products`
  - Opening Days: `Monday – Friday`
  - Operating Hours: `9am – 5pm`
  - Representative Name: `Test Rep`
  - Phone: `+855 10 000 000`
  - Back-up Phone: *(leave blank)*
  - Email: `test@test.com`
  - Check the Terms checkbox

- [ ] **Step 3: Submit and verify success popup**

  Click **Submit Application**. Expected: button shows "Submitting…" briefly, then the green checkmark success popup appears showing the phone number `+855 10 000 000`.

- [ ] **Step 4: Check the Google Sheet**

  Open the `TENH100 Merchant Applications` spreadsheet. Expected: a new row at the bottom with all 13 columns filled. Status column should read `Pending`. Contract Link column should contain a Google Docs URL.

- [ ] **Step 5: Check the email**

  Open `sakdarith.st@gmail.com`. Expected: an email with subject `New Merchant Application — Test Business` containing the data summary and a `.docx` attachment named `[date] Test Business — Draft Contract.docx`.

- [ ] **Step 6: Verify the .docx attachment**

  Download and open the attachment. Expected:
  - `{{BUSINESS_NAME}}` → `Test Business`
  - `{{ADDRESS}}` → `Street 1, Phnom Penh`
  - `{{SHOP_TYPE}}` → `Test Shop`
  - `{{PRODUCT_COUNT}}` → `1–20 SKUs`
  - `{{OPENING_DAYS}}` → `Monday – Friday`
  - `{{OPERATING_HOURS}}` → `9am – 5pm`
  - `{{REP_NAME}}` → `Test Rep`
  - `{{PHONE}}` → `+855 10 000 000`
  - `{{BACKUP_PHONE}}` → `N/A`
  - `{{EMAIL}}` → `test@test.com`
  - All TENH100 fields (Commission Rate, Bank, ID, Maps) remain blank

- [ ] **Step 7: Check the Google Drive folder**

  Open `Merchant Contracts/Pending Applications` in Google Drive. Expected: a Google Doc named `[date] Test Business — Draft Contract`.

- [ ] **Step 8: Test the error path (optional but recommended)**

  Temporarily set `APPS_SCRIPT_URL` to a broken URL (e.g. `https://script.google.com/broken`), submit the form, verify the error popup appears with the Telegram link `@KimSun_TENH100`. Restore the correct URL after.

---

### Task 8: Commit

- [ ] **Step 1: Stage changed files**

  ```bash
  git add "T100 website/T100 website/sellers.html"
  git add apps-script/Code.gs
  git add docs/superpowers/specs/2026-05-06-merchant-onboarding-design.md
  git add docs/superpowers/plans/2026-05-06-merchant-onboarding.md
  ```

- [ ] **Step 2: Commit**

  ```bash
  git commit -m "feat: merchant onboarding form with Apps Script contract generation"
  ```

---

## Post-Launch SOP for TENH100 Team

Once live, the standard operating procedure for each new merchant application is:

1. **Email received** — open the `.docx` attachment from `sakdarith.st@gmail.com`
2. **Fill remaining fields** — Commission Rate, Google Maps link, ID Number, Bank Account Owner Name, Bank Name, Bank Account Number, and Signature Date
3. **Export as PDF** — File → Download → PDF in Google Docs (or Save As PDF in Word)
4. **Send to merchant** — email or Telegram the PDF to the merchant for wet signature
5. **Update Sheet** — once signed, change the merchant's row Status from `Pending` to `Active`
