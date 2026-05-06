# Merchant Onboarding SOP — Design Spec
**Date:** 2026-05-06  
**Project:** TENH100 Merchant Onboarding Automation  
**Status:** Approved

---

## Overview

Replace the manual contract-send process with a website-driven flow. Merchants fill a registration form on `sellers.html`. On submission, a Google Apps Script web app generates a pre-filled Business Collaboration Agreement (`.docx`) and emails it directly to the TENH100 operations contact for review.

---

## 1. Architecture

```
Merchant fills sellers.html
         │
         ▼ (AJAX POST)
Google Apps Script Web App
         │
         ├──► Appends row to Google Sheet (merchant tracker)
         │
         ├──► Copies Google Docs contract template
         │         └── Fills all merchant-provided placeholders
         │         └── Saves copy to "Pending Applications" Drive folder
         │
         └──► Emails sakdarith.st@gmail.com
                   ├── Subject: "New Merchant Application — [Business Name]"
                   ├── Body: structured summary of all submitted fields
                   └── Attachment: pre-filled contract as .docx
```

**Manual steps by TENH100 after receiving email:**
1. Open `.docx` attachment
2. Fill remaining fields: Commission Rate, Google Maps link, Longitude/Latitude, ID Number, Bank Account Owner Name, Bank Name, Bank Account Number, Signature Date
3. Export as PDF
4. Send to merchant for signature
5. Update Google Sheet row Status to `Active`

---

## 2. Form Fields (sellers.html)

Replaces the existing Formspree-based form. All fields post to the Apps Script web app URL.

| Field | Type | Required | Maps to Contract |
|---|---|---|---|
| Business Name | Text input | Yes | Name of Business |
| Address of Shop | Text input | Yes | Address of Shop |
| Shop Type | Text input | Yes | Shop Type |
| Expected Product Count | Dropdown (1–20, 21–100, 101–500, 500+) | Yes | Expected Product Count |
| Store Opening Days | Text input (e.g. Mon–Sun) | Yes | Store Opening Days |
| Store Operating Hours | Text input (e.g. 8am–6pm) | Yes | Store Operating Hours |
| Representative Name | Text input | Yes | Representative Name |
| Phone Number | Tel input | Yes | Phone Number (main POC) |
| Back-up Phone Number | Tel input | No | Back-up Phone Number |
| Email | Email input | Yes | Email |

**Fields intentionally excluded from the web form (filled manually by TENH100):**
- Google Maps link / Longitude / Latitude
- ID Number
- Bank Account Owner Name, Bank Name, Bank Account Number
- Commission Rate Agreed
- Representative name in Section 2 contract body
- Signature dates

---

## 3. Google Apps Script Web App

A single `doPost(e)` function deployed as a web app.

**On each submission it:**
1. Parses the JSON POST body
2. Appends one row to the Google Sheet tracker
3. Makes a copy of the master Google Docs template in the "Pending Applications" Drive folder, named: `[YYYY-MM-DD] [Business Name] — Draft Contract`
4. Replaces all merchant-side template placeholders in the Doc copy using `body.replaceText()`
5. Exports the Doc copy as a `.docx` blob
6. Sends email to `sakdarith.st@gmail.com` with subject, body summary, and `.docx` attachment
7. Returns HTTP 200 JSON `{ "result": "success" }`
8. On any uncaught error, returns HTTP 200 JSON `{ "result": "error" }` (Apps Script web apps always return 200; error is signalled in the payload)

**Template placeholders used (in the Google Docs master template):**

| Placeholder | Replaced with |
|---|---|
| `{{BUSINESS_NAME}}` | Business Name |
| `{{ADDRESS}}` | Address of Shop |
| `{{SHOP_TYPE}}` | Shop Type |
| `{{PRODUCT_COUNT}}` | Expected Product Count |
| `{{OPENING_DAYS}}` | Store Opening Days |
| `{{OPERATING_HOURS}}` | Store Operating Hours |
| `{{REP_NAME}}` | Representative Name |
| `{{PHONE}}` | Phone Number |
| `{{BACKUP_PHONE}}` | Back-up Phone Number (or "N/A" if blank) |
| `{{EMAIL}}` | Email |
| `{{SUBMISSION_DATE}}` | Auto-generated date of submission |

---

## 4. Google Sheet Tracker

**Sheet name:** `Merchant Applications`  
**Spreadsheet:** Stored in TENH100's Google Drive

| Column | Source |
|---|---|
| Submission Date | Auto (script) |
| Business Name | Form |
| Representative Name | Form |
| Phone Number | Form |
| Back-up Phone | Form (blank if not provided) |
| Email | Form |
| Address | Form |
| Shop Type | Form |
| Expected Product Count | Form |
| Opening Days | Form |
| Operating Hours | Form |
| Contract Link | Link to Google Doc copy in Drive |
| Status | Defaults to `Pending` — updated manually by TENH100 to `Active` or `Rejected` |

---

## 5. Google Drive Structure

```
TENH100 Google Drive/
└── Merchant Contracts/
    └── Pending Applications/
        └── [YYYY-MM-DD] [Business Name] — Draft Contract.docx
```

The master template lives separately and is never modified directly.

---

## 6. Error Handling

| Scenario | Behaviour |
|---|---|
| Required field missing | Client-side validation blocks submission before reaching Apps Script |
| Apps Script returns `{ "result": "error" }` | Merchant sees error message: *"Something went wrong. Please contact us directly on Telegram: @KimSun_TENH100"* with a clickable link to `https://t.me/KimSun_TENH100` |
| Network failure (fetch never resolves) | Same error message shown |
| Success | Existing success popup shown, form cleared |

---

## 7. Out of Scope

- Merchant login or account system
- Commission negotiation via the website
- Digital signature collection (remains offline / physical)
- Bank detail or ID number collection via the web form (security risk — filled manually)
- PDF generation (TENH100 exports manually from the filled Doc)
