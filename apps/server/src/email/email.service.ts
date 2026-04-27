import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface ContactEmailDto {
    name: string;
    email: string;
    subject: string;
    message: string;
}

@Injectable()
export class EmailService {
    private mailTransporter: nodemailer.Transporter | null = null;

    constructor(private configService: ConfigService) {}

    private getTransporter() {
        if (this.mailTransporter) return this.mailTransporter;

        const host = this.configService.get<string>('SMTP_HOST');
        const portValue = this.configService.get<string>('SMTP_PORT');
        const user = this.configService.get<string>('SMTP_USER');
        const pass = this.configService.get<string>('SMTP_PASS');
        const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

        if (!host || !portValue || !user || !pass) {
            console.warn('SMTP configuration is incomplete. Email delivery is disabled.');
            return null;
        }

        console.log(`[EmailService] Creating SMTP transporter: host=${host}, port=${portValue}, secure=${secure}, user=${user}`);
        this.mailTransporter = nodemailer.createTransport({
            host,
            port: Number(portValue),
            secure,
            auth: {
                user,
                pass,
            },
            logger: true, // Enable built-in nodemailer logger
            debug: true,  // Include SMTP traffic in the logs
        });

        return this.mailTransporter;
    }

    async sendRegistrationOtpEmail(email: string, otp: string) {
        console.log(`[EmailService] Preparing to send OTP email to: ${email}`);
        const transporter = this.getTransporter();
        const from = this.configService.get<string>('SMTP_FROM') || 'ExamMaster <no-reply@exammaster.local>';

        if (!transporter) {
            console.log(`[EmailService] Transporter not found. Logging OTP to console for ${email}: ${otp}`);
            return;
        }

        console.log(`[EmailService] Sending email... FROM: ${from} TO: ${email}`);
        
        try {
            const info = await transporter.sendMail({
                from,
                to: email,
                subject: 'Your ExamMaster verification code',
                text: `Your verification code is ${otp}. It expires in 10 minutes.`,
                html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
            });
            console.log(`[EmailService] Email sent successfully. MessageId: ${info.messageId}`);
        } catch (error) {
            console.error(`[EmailService] Error occurred while sending email to ${email}:`, error);
            throw error;
        }
    }

    async sendContactEmail(dto: ContactEmailDto) {
        const transporter = this.getTransporter();
        const from = this.configService.get<string>('SMTP_FROM') || 'ExamMaster <malingaamith1@gmail.com>';
        const adminEmail = this.configService.get<string>('SMTP_USER') || 'malingaamith1@gmail.com';

        if (!transporter) {
            throw new InternalServerErrorException('Email service is not configured.');
        }

        await transporter.sendMail({
            from,
            to: adminEmail,
            replyTo: dto.email,
            subject: `Contact Form Submission: ${dto.subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${dto.name}</p>
                <p><strong>Email:</strong> ${dto.email}</p>
                <p><strong>Subject:</strong> ${dto.subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    ${dto.message.replace(/\n/g, '<br/>')}
                </div>
            `,
        });
    }
}
