var SPREADSHEET_ID = '1lbDTRVLf-vlpiypPvBbADisSwLv6BVxP1f5tqPYkASc';
var TEMPLATE_DOC_ID = '1JefdZcyBqWNoD7ZezplyWqkNkwqRIRor';
var PENDING_FOLDER_ID = '1J8tr9mzLcMG1K6UBsPDIL9z33-_fYsZ6?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto
';
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
