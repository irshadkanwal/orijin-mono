import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Tag } from './models/tags.model';
import { TagsService } from './tags.service';

@Controller()
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post('tags')
  postTag(@Body() body): Promise<Tag> {
    return this.tagService.create(body);
  }

  @Get('tags')
  getVarieties(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get('tags/:id')
  getTag(@Param('id') id: string): Promise<Tag> {
    return this.tagService.getOne(id);
  }
}
