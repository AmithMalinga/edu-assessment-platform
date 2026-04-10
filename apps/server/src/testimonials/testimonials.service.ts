import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestimonialsService implements OnModuleInit {
    private readonly logger = new Logger(TestimonialsService.name);

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        try {
            await this.seedTestimonials();
        } catch (error) {
            this.logger.warn('Skipping testimonial seed during startup due to database readiness issue.');
            this.logger.debug((error as Error).message);
        }
    }

    async seedTestimonials() {
        const count = await this.prisma.testimonial.count();
        if (count === 0) {
            const testimonials = [
                {
                    name: "Kavindi Perera",
                    role: "A/L Student, Colombo",
                    avatar: "KP",
                    rating: 5,
                    content: "ExamMaster helped me score straight A's in my A/L Combined Maths. The real-time exam simulations prepared me perfectly for the actual exam pressure."
                },
                {
                    name: "Arun Kumar",
                    role: "O/L Student, Jaffna",
                    avatar: "AK",
                    rating: 5,
                    content: "Finally a platform with proper Tamil support! The questions are exactly like the real O/L papers. My confidence has improved so much."
                },
                {
                    name: "Nadeesha Silva",
                    role: "Teacher, Royal College",
                    avatar: "NS",
                    rating: 5,
                    content: "I recommend ExamMaster to all my students. The progress tracking helps me identify which topics need more attention in class."
                }
            ];

            for (const testimonial of testimonials) {
                await this.prisma.testimonial.create({
                    data: testimonial,
                });
            }
            console.log('Testimonials seeded via Service!');
        }
    }

    async findAll() {
        return this.prisma.testimonial.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
