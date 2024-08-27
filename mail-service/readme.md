# Node.js Mail Service Setup

## Prerequisites

* Node.js version 14 or higher
* npm version 6 or higher

## Dependencies

* `nodemailer` package
* `dotenv` package (optional, but recommended for loading environment variables)
* `aws-sdk` package (required for Amazon SES)

```bash
npm install nodemailer dotenv @aws-sdk/client-ses
```


## Environment Variables

* `MAIL_SERVICE`: Set to one of the following: `gmail`, `amazon-ses`, `mailgun`, `sendgrid`, or `smtp`
* `FROM_EMAIL`: Your email address

### Gmail
* `GMAIL_USERNAME`: Your Gmail username (required for Gmail)
* `GMAIL_PASSWORD`: Your Gmail password (required for Gmail)

### Amazon SES
* `AWS_REGION`: Your AWS region (required for Amazon SES)
* `AWS_ACCESS_KEY_ID`: Your AWS access key ID (required for Amazon SES)
* `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key (required for Amazon SES)

### Mailgun
* `MAILGUN_USERNAME`: Your Mailgun username (required for Mailgun) # your-mailgun-domain.com
* `MAILGUN_PASSWORD`: Your Mailgun password (required for Mailgun) # your-mailgun-api-key

### Sendgrid
* `SENDGRID_USERNAME`: Your Sendgrid username (required for Sendgrid)
* `SENDGRID_PASSWORD`: Your Sendgrid password (required for Sendgrid)

### SMTP
* `SMTP_HOST`: Your SMTP host (required for custom SMTP)
* `SMTP_PORT`: Your SMTP port (required for custom SMTP)
* `SMTP_SECURE`: Set to `false` or `STARTTLS` (required for custom SMTP)
* `SMTP_USERNAME`: Your SMTP username (required for custom SMTP)
* `SMTP_PASSWORD`: Your SMTP password (required for custom SMTP)

```env
     # mailgun, sendgrid, amazon-ses, smtp
    MAIL_SERVICE=gmail
    FROM_EMAIL=your-sendgrid-email@example.com
    
    # Gmail
    GMAIL_USERNAME=your-gmail-username
    GMAIL_PASSWORD=your-gmail-password
    
    # Amazon SES
    AWS_REGION=your-aws-region
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    
    # Mailgun
    MAILGUN_USERNAME=postmaster@your-mailgun-domain.com
    MAILGUN_PASSWORD=your-mailgun-password
    
    # Sendgrid
    SENDGRID_USERNAME=your-sendgrid-username
    SENDGRID_PASSWORD=your-sendgrid-password
    
    # SMTP
    SMTP_HOST=your-smtp-host
    SMTP_PORT=587
    SMTP_SECURE=false
    SMTP_USERNAME=your-smtp-username
    SMTP_PASSWORD=your-smtp-password
```

## Usage

### Using EmailService

To use the EmailService, create an instance of the service and call the `sendMail` method:
```javascript
const EmailService = require('./email-service');
const mailOptions = { 
    from: 'your-email@example.com',
    to: 'recipient-email@example.com',
    subject: 'Hello from Node.js!',
    text: 'This is a text email sent from Node.js!'
};
emailService.sendMail(mailOptions, (err, info) => { 
    if (err) { console.log(err); } else {
        console.log(`Email sent: ${info.response}`);
    }
});
```

### Sending Text Emails

To send a text email, use the following code:
```javascript
const EmailService = require('./EmailService');

const emailService = new EmailService();

const mailOptions = {
    from: 'your-email@example.com',
    to: 'recipient-email@example.com',
    subject: 'Hello from Node.js!',
    text: 'This is a text email sent from Node.js!'
};

emailService.sendMail(mailOptions, (err, info) => { if (err) { console.log(err); } else { console.log(`Email sent: ${info.response}`); } });
```

### Sending HTML Emails

To send an HTML email, use the following code:
```javascript
const emailService = new EmailService();

const mailOptions = {
    from: 'your-email@example.com',
    to: 'recipient-email@example.com',
    subject: 'Hello from Node.js!',
    html: '<h1>This is an HTML email sent from Node.js!</h1>'
};

emailService.sendMail(mailOptions, (err, info) => { if (err) { console.log(err); } else { console.log(`Email sent: ${info.response}`); } });
```

### Sending Emails with Attachments

To send an email with attachments, use the following code:
```javascript
const emailService = new EmailService();

const mailOptions = { from: 'your-email@example.com', to: 'recipient-email@example.com', subject: 'Hello from Node.js!', text: 'This is an email with attachments sent from Node.js!', attachments: [ { filename: 'example.txt', content: 'Hello from Node.js!' }, { filename: 'example.pdf', path: './example.pdf' } ] };

emailService.sendMail(mailOptions, (err, info) => { if (err) { console.log(err); } else { console.log(`Email sent: ${info.response}`); } });

```
## Are you having trouble sending emails?
* Are you having trouble sending emails with Gmail? Make sure to allow less secure apps in your Google Account settings. [Learn more](https://support.google.com/a/answer/6260879?hl=en)
* Are you having trouble sending emails with Amazon SES? Make sure to verify your email address and domain with Amazon SES. [Learn more](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html)
* Are you having trouble sending emails with Mailgun? Make sure to verify your email address and domain with Mailgun. [Learn more](https://documentation.mailgun.com/en/latest/user_manual.html#verifying-your-domain)
* Are you having trouble sending emails with Sendgrid? Make sure to verify your email address and domain with Sendgrid. [Learn more](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/)

## License
MIT

Reference:
- Nodemailer Documentation (https://nodemailer.com/about/)
- Mailgun API Documentation (https://documentation.mailgun.com/en/latest/api_reference.html)
- Sendgrid API Documentation (https://sendgrid.com/docs/API_Reference/index.html)
- Amazon SES API Documentation (https://docs.aws.amazon.com/ses/latest/DeveloperGuide/Welcome.html)
- SMTP.js Documentation (https://nodemailer.com/smtp/)

