import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Post()
    create(@Body() createTestimonialDto: CreateTestimonialDto) {
        return this.testimonialsService.create(createTestimonialDto);
    }

    @Get()
    findAll() {
        return this.testimonialsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testimonialsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
        return this.testimonialsService.update(id, updateTestimonialDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.testimonialsService.remove(id);
    }
}
