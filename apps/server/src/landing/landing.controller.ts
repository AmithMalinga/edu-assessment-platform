import { Body, Controller, Get, Post } from '@nestjs/common';
import { LandingService } from './landing.service';
import { ContactEmailDto } from '../email/email.service';

@Controller('landing')
export class LandingController {
    constructor(private readonly landingService: LandingService) {}

    @Get('stats')
    getStats() {
        return this.landingService.getStats();
    }

    @Post('contact')
    async sendContactEmail(@Body() dto: ContactEmailDto) {
        return this.landingService.sendContactEmail(dto);
    }
}
