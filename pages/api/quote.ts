import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import fetch from 'cross-fetch'
import { google } from 'googleapis'
import twilio from 'twilio'

// Enhanced schema to match your existing structure + new fields
const schema = z.object({
  clinicName: z.string().min(1),
  contactName: z.string().min(1),
  role: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  service: z.string().min(1),
  notes: z.string().optional().nullable(),
  // New optional fields for enhanced features
  isEmergency: z.boolean().optional().default(false),
  allowTexting: z.boolean().optional().default(false),
})

type FormData = z.infer<typeof schema> & {
  timestamp: string
}

// Enhanced HTML email template
const createEmailTemplate = (data: FormData, sheetUrl?: string) => {
  const emergencyBadge = data.isEmergency 
    ? '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">🚨 EMERGENCY</span>'
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #146C60 0%, #18958b 100%); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Quote Request</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Received on ${new Date(data.timestamp).toLocaleString()}</p>
      <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
        ${emergencyBadge}
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">
      
      <!-- Clinic Information -->
      <div style="margin-bottom: 24px;">
        <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          🏥 Clinic Information
        </h2>
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; border-left: 4px solid #146C60;">
          <p style="margin: 0 0 8px 0;"><strong>Clinic:</strong> ${data.clinicName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Contact Person:</strong> ${data.contactName}</p>
          <p style="margin: 0;"><strong>Role:</strong> ${data.role}</p>
        </div>
      </div>

      <!-- Contact Details -->
      <div style="margin-bottom: 24px;">
        <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          📞 Contact Details
        </h2>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; flex: 1; min-width: 200px;">
            <p style="margin: 0; color: #0c4a42;"><strong>📧 Email:</strong></p>
            <p style="margin: 4px 0 0 0;"><a href="mailto:${data.email}" style="color: #146C60; text-decoration: none;">${data.email}</a></p>
          </div>
          ${data.phone ? `
          <div style="background: #f0fdf4; padding: 12px; border-radius: 6px; flex: 1; min-width: 200px;">
            <p style="margin: 0; color: #059669;"><strong>📱 Phone:</strong></p>
            <p style="margin: 4px 0 0 0;"><a href="tel:${data.phone}" style="color: #065f46; text-decoration: none;">${data.phone}</a></p>
            ${data.allowTexting ? '<p style="margin: 4px 0 0 0; font-size: 12px; color: #059669;">✅ Texting OK</p>' : ''}
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Service Information -->
      <div style="margin-bottom: 24px;">
        <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
          🔬 Service Details
        </h2>
        <div style="background: #fefce8; padding: 16px; border-radius: 6px; border-left: 4px solid #eab308;">
          <p style="margin: 0 0 8px 0;"><strong>Service Type:</strong> ${data.service}</p>
          ${data.notes ? `<p style="margin: 8px 0 0 0;"><strong>Additional Notes:</strong><br>${data.notes}</p>` : ''}
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">Quick Actions</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="mailto:${data.email}?subject=Re: Ultrasound Services Quote Request" 
             style="background: #146C60; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; display: inline-block;">
            📧 Reply via Email
          </a>
          ${data.phone ? `
          <a href="tel:${data.phone}" 
             style="background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; display: inline-block;">
            📞 Call Now
          </a>
          ` : ''}
          ${sheetUrl ? `
          <a href="${sheetUrl}" 
             style="background: #8b5cf6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; display: inline-block;">
            📊 View All Inquiries
          </a>
          ` : ''}
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 16px 24px; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
        VetScan NYC - Mobile Veterinary Ultrasound Services<br>
        ${sheetUrl ? `This inquiry was automatically logged to your <a href="${sheetUrl}" style="color: #146C60;">tracking sheet</a>.` : 'Quote request processed successfully.'}
      </p>
    </div>

  </div>
</body>
</html>`
}

// SMS message template
const createSMSMessage = (data: FormData, sheetUrl?: string) => {
  const emergencyFlag = data.isEmergency ? '🚨 EMERGENCY - ' : ''
  const phone = data.phone ? ` (${data.phone})` : ''
  const sheetText = sheetUrl ? ` Details: ${sheetUrl}` : ''
  
  return `${emergencyFlag}New quote request from ${data.clinicName}. Contact: ${data.contactName}${phone}. Service: ${data.service}.${sheetText}`
}

// SendGrid email sending
async function sendEmailViaSendGrid(data: FormData, sheetUrl?: string): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email...')
    return
  }

  try {
    const emailSubject = data.isEmergency 
      ? `🚨 EMERGENCY Quote Request — ${data.clinicName}`
      : `New Quote Request — ${data.clinicName}`

    const toEmail = process.env.CONTACT_TO || 'vetscannyc@gmail.com'

    const emailData = {
      personalizations: [{
        to: [{ email: toEmail }],
        subject: emailSubject,
      }],
      from: {
        email: 'vetscannyc@gmail.com',
        name: 'Vet Scan NYC'
      },
      content: [
        {
          type: 'text/html',
          value: createEmailTemplate(data, sheetUrl)
        },
        {
          type: 'text/plain',
          value: JSON.stringify(data, null, 2) // Fallback plain text
        }
      ]
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`)
    }

    console.log('Email sent successfully via SendGrid')
  } catch (error) {
    console.error('SendGrid error:', error)
    throw error // Don't silently fail email sending
  }
}

// Google Sheets integration
async function addToGoogleSheet(data: FormData): Promise<string | null> {
  // Only attempt if we have the required environment variables
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
      !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || 
      !process.env.GOOGLE_SHEET_ID) {
    console.log('Google Sheets not configured, skipping...')
    return null
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    // Prepare row data
    const rowData = [
      data.timestamp,
      data.clinicName,
      data.contactName,
      data.role,
      data.email,
      data.phone || '',
      data.service,
      data.notes || '',
      data.isEmergency ? 'YES' : 'NO',
      data.allowTexting ? 'YES' : 'NO',
    ]

    // Add row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:J',
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    })

    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
  } catch (error) {
    console.error('Google Sheets error:', error)
    return null // Don't fail the whole request if sheets fails
  }
}

// SMS notification
async function sendSMSNotification(data: FormData, sheetUrl?: string): Promise<void> {
  // Only attempt if we have the required environment variables
  if (!process.env.TWILIO_ACCOUNT_SID || 
      !process.env.TWILIO_AUTH_TOKEN || 
      !process.env.TWILIO_FROM_NUMBER || 
      !process.env.DR_KHAN_PHONE) {
    console.log('SMS not configured, skipping...')
    return
  }

  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    await twilioClient.messages.create({
      body: createSMSMessage(data, sheetUrl),
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.DR_KHAN_PHONE,
    })

    console.log('SMS sent successfully')
  } catch (error) {
    console.error('SMS error:', error)
    // Don't fail the whole request if SMS fails
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse and validate form data using your existing schema
    const data = schema.parse(req.body)
    const formDataWithTimestamp: FormData = {
      ...data,
      timestamp: new Date().toISOString(),
    }

    // 1. Add to Google Sheet first (we need the URL for notifications)
    console.log('Adding to Google Sheet...')
    const sheetUrl = await addToGoogleSheet(formDataWithTimestamp)

    // 2. Send enhanced email via SendGrid
    console.log('Sending enhanced email via SendGrid...')
    await sendEmailViaSendGrid(formDataWithTimestamp, sheetUrl || undefined)

    // 3. Send SMS notification
    console.log('Sending SMS notification...')
    await sendSMSNotification(formDataWithTimestamp, sheetUrl || undefined)

    // 4. Keep your existing HubSpot integration for future use
    if (process.env.HUBSPOT_TOKEN) {
      console.log('Adding to HubSpot CRM for future reference...')
      const hs = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`,
      }

      // Create/update contact
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts?hapikey=', {
        method: 'POST',
        headers: hs,
        body: JSON.stringify({
          properties: {
            email: data.email,
            firstname: data.contactName,
            phone: data.phone || '',
            company: data.clinicName,
            jobtitle: data.role,
            emergency_request: data.isEmergency ? 'true' : 'false',
            allows_texting: data.allowTexting ? 'true' : 'false',
          },
        }),
      })

      // Create note with enhanced information
      const noteBody = [
        `Service: ${data.service}`,
        `Clinic: ${data.clinicName}`,
        `Contact: ${data.contactName} (${data.role})`,
        `Phone: ${data.phone || 'Not provided'}`,
        `Emergency: ${data.isEmergency ? 'YES' : 'No'}`,
        `Texting OK: ${data.allowTexting ? 'YES' : 'No'}`,
        data.notes ? `Notes: ${data.notes}` : '',
        sheetUrl ? `Google Sheet: ${sheetUrl}` : '',
      ].filter(Boolean).join('\n')

      await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: hs,
        body: JSON.stringify({
          properties: {
            hs_note_body: noteBody,
          },
        }),
      })
    }

    console.log('All processing completed successfully')
    return res.status(200).json({ 
      ok: true,
      features: {
        email: process.env.SENDGRID_API_KEY ? 'sent' : 'not_configured',
        sms: process.env.TWILIO_ACCOUNT_SID ? 'sent' : 'not_configured',
        sheets: sheetUrl ? 'logged' : 'not_configured',
        hubspot: process.env.HUBSPOT_TOKEN ? 'logged' : 'not_configured',
      }
    })

  } catch (err: any) {
    console.error('API Error:', err)
    return res.status(400).json({ 
      error: err.message || 'Invalid request',
    })
  }
}
