import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: process.env.SMTP_REQ_TLS === 'true',
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 30_000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

transporter.verify().then(
  () => console.log('SMTP transporter ready'),
  (err) => console.error('-\n-\n-\nSMTP transporter configuration is invalid:', err)
)

export const sendVerificationEmail = async (to: string, verificationLink: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Verify your email address',
      text: `Welcome! Please verify your email by visiting: ${verificationLink}`,
      html: `<p>Welcome! Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`
    })
  } catch (err) {
    throw new Error(`Failed to send verification email to ${to}`, { cause: err })
  }
}
