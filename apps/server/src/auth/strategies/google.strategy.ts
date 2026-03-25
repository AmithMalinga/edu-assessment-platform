import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'GOOGLE_CLIENT_ID_MISSING';
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'GOOGLE_CLIENT_SECRET_MISSING';
        const callbackURL =
            configService.get<string>('GOOGLE_CALLBACK_URL') ||
            'http://localhost:3001/auth/google/callback';

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<any> {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new UnauthorizedException('Google account has no email.'), false);
        }

        const user = {
            email,
            name: profile.displayName || email.split('@')[0],
            googleId: profile.id,
        };

        done(null, user);
    }
}
